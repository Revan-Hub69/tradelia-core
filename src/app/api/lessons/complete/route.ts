import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { withValidation } from '@/lib/validation/middleware';
import { lessonCompletionSchema } from '@/lib/validation/schemas';
import { ApiError, withErrorHandler } from '@/libs/api/errorHandler';
import { awardBadgeToUser, completeLessonForUser } from '@/libs/supabase/database';
import { createClient } from '@/libs/supabase/server';

// POST with validation middleware (2026 security)
export const POST = withValidation(
  { body: lessonCompletionSchema },
  withErrorHandler(async (_request: NextRequest, { body }) => {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
    }

    // Body is already validated and sanitized
    const {
      lessonId,
      pathId = 'base',
      xpEarned,
      approachesUsed,
      quizScore,
      timeSpent,
      badges = [],
    } = body!;

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
    const awardedBadges: any[] = [];
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
  }),
);
