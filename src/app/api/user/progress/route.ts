import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ApiError, withErrorHandler } from '@/libs/api/errorHandler';
import { createUserProgress, getCompleteUserData } from '@/libs/supabase/database';
import { createClient } from '@/libs/supabase/server';

export const GET = withErrorHandler(async () => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
  }

  const userData = await getCompleteUserData(user.id);
  return NextResponse.json(userData);
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
  }

  const body = await request.json();
  const initialXP = body.initialXP || 0;

  const progress = await createUserProgress(user.id, initialXP);
  return NextResponse.json({ progress }, { status: 201 });
});
