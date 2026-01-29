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
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

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

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      enrollmentId,
      programId,
      offerId,
      challengeRef,
      accountState,
      contextLite,
      operatingEnvelope,
    } = body;

    if (!enrollmentId) {
      return NextResponse.json({ error: 'Missing enrollmentId' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('my_challenges')
      .insert({
        user_id: user.id,
        enrollment_id: enrollmentId,
        program_id: programId ?? null,
        offer_id: offerId ?? null,
        challenge_ref: challengeRef ?? {},
        account_state: accountState ?? {},
        context_lite: contextLite ?? {},
        operating_envelope: operatingEnvelope ?? {},
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create my challenge' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
