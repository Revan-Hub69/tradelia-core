import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollmentId');

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('my_challenges')
      .select('enrollment_id, program_id, offer_id, challenge_ref, account_state, context_lite, operating_envelope, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (enrollmentId) {
      query = query.eq('enrollment_id', enrollmentId).limit(1);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch my challenges' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: enrollmentId ? data?.[0] ?? null : data ?? [],
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
