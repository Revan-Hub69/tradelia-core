import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { withValidation } from '@/lib/validation/middleware';
import { userProfileSchema } from '@/lib/validation/schemas';
import { ApiError, withErrorHandler } from '@/libs/api/errorHandler';
import { createUserProfile, getUserProfile, updateUserProfile } from '@/libs/supabase/database';
import { createClient } from '@/libs/supabase/server';

export const GET = withErrorHandler(async () => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
  }

  const profile = await getUserProfile(user.id);
  return NextResponse.json({ profile });
});

// POST with validation middleware (2026 security)
export const POST = withValidation(
  { body: userProfileSchema },
  withErrorHandler(async (_request: NextRequest, { body }) => {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
    }

    // Body is already validated and sanitized
    const profileData = {
      id: user.id,
      email: user.email!,
      name: body?.name || user.user_metadata?.name || user.email?.split('@')[0],
    };

    const profile = await createUserProfile(profileData);
    return NextResponse.json({ profile }, { status: 201 });
  }),
);

// PUT with validation middleware (2026 security)
export const PUT = withValidation(
  { body: userProfileSchema },
  withErrorHandler(async (_request: NextRequest, { body }) => {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
    }

    // Body is already validated and sanitized
    const profile = await updateUserProfile(user.id, body);
    return NextResponse.json({ profile });
  }),
);
