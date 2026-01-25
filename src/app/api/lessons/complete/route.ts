import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ApiError, withErrorHandler } from '@/libs/api/errorHandler';
import { lessonCompletionSchema, validateRequest } from '@/libs/api/validation';
import { awardBadgeToUser, completeLessonForUser } from '@/libs/supabase/database';
import { createClient } from '@/libs/supabase/server';

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
  }

  const body = await request.json();
  const validatedData = validateRequest(lessonCompletionSchema, body);

  const {
    lessonId,
    pathId = 'base', // Default to 'base' path if not provided
    xpEarned,
    approachesUsed,
    quizScore,
    timeSpent,
    badges = [],
  } = validatedData;

  // Complete the lesson
  const completion = await completeLessonForUser({
    userId: user.id,
    lessonId,
    pathId,
    xpEarned,
    approachesUsed,
    quizScore,
    timeSpent,
  });

  // Award any badges
  const awardedBadges = [];
  for (const badge of badges) {
    try {
      const awardedBadge = await awardBadgeToUser({
        userId: user.id,
        badgeId: badge.id,
        badgeName: badge.name,
        badgeDescription: badge.description,
        badgeIcon: badge.icon,
        rarity: badge.rarity,
      });
      awardedBadges.push(awardedBadge);
    } catch {
      // Badge already awarded - not an error (unique constraint)
    }
  }

  return NextResponse.json({
    completion,
    badges: awardedBadges,
    success: true,
  }, { status: 201 });
});
