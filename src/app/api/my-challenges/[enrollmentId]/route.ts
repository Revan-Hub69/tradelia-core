import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  try {
    const supabase = await createClient();
    const { enrollmentId } = await params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      challengeRef,
      accountState,
      contextLite,
      operatingEnvelope,
      programId,
      offerId,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (challengeRef !== undefined) updateData.challenge_ref = challengeRef;
    if (accountState !== undefined) updateData.account_state = accountState;
    if (contextLite !== undefined) updateData.context_lite = contextLite;
    if (operatingEnvelope !== undefined) updateData.operating_envelope = operatingEnvelope;
    if (programId !== undefined) updateData.program_id = programId;
    if (offerId !== undefined) updateData.offer_id = offerId;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('my_challenges')
      .update(updateData)
      .eq('user_id', user.id)
      .eq('enrollment_id', enrollmentId)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update my challenge' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ enrollmentId: string }> },
) {
  try {
    const supabase = await createClient();
    const { enrollmentId } = await params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('my_challenges')
      .delete()
      .eq('user_id', user.id)
      .eq('enrollment_id', enrollmentId);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete my challenge' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
