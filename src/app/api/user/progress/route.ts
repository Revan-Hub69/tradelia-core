import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { CompleteUserDataRawSchema } from '@/contracts/userProgress.contract';
import { ApiError, withErrorHandler } from '@/libs/api/errorHandler';
import { createUserProgress, getCompleteUserData } from '@/libs/supabase/database';
import { createClient } from '@/libs/supabase/server';
import { normalizeCompleteUserData } from '@/normalizers/userProgress.normalizer';

export const GET = withErrorHandler(async () => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
  }

  // 1️⃣ Fetch raw data
  const raw = await getCompleteUserData(user.id);

  // 2️⃣ Validate (tollerante: non rompe se shape è diversa)
  const parsed = CompleteUserDataRawSchema.parse(raw);

  // 3️⃣ Normalize (elimina null hell)
  const normalized = normalizeCompleteUserData(parsed);

  // 4️⃣ Return ONLY normalized data
  return NextResponse.json(normalized);
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
