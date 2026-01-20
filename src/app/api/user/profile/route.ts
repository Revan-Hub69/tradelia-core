import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

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

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
  }

  const body = await request.json();
  const profileData = {
    id: user.id,
    email: user.email!,
    name: body.name || user.user_metadata?.name || user.email?.split('@')[0],
  };

  const profile = await createUserProfile(profileData);
  return NextResponse.json({ profile }, { status: 201 });
});

export const PUT = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
  }

  const body = await request.json();
  const profile = await updateUserProfile(user.id, body);
  return NextResponse.json({ profile });
});
