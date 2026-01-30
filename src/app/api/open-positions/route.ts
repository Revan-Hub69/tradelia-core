import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const enrollmentId = searchParams.get('enrollmentId');
    const includeClosed = searchParams.get('includeClosed') === 'true';

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('open_positions')
      .select('*')
      .eq('user_id', user.id)
      .order('opened_at', { ascending: false })
      .order('created_at', { ascending: false });

    if (enrollmentId) {
      query = query.eq('enrollment_id', enrollmentId);
    }

    if (!includeClosed) {
      query = query.eq('is_open', true);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: 'Failed to fetch open positions' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data ?? [] });
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
      symbol,
      side,
      size,
      entryPrice,
      openedAt,
      stopLoss,
      takeProfit,
      unrealizedPnl,
      notionalValue,
      leverage,
      brokerPositionId,
      isOpen,
      metadata,
    } = body ?? {};

    if (!enrollmentId || !symbol || !side || size == null) {
      return NextResponse.json(
        { error: 'Missing required fields: enrollmentId, symbol, side, size' },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from('open_positions')
      .insert({
        user_id: user.id,
        enrollment_id: enrollmentId,
        program_id: programId ?? null,
        offer_id: offerId ?? null,
        symbol,
        side,
        size,
        entry_price: entryPrice ?? null,
        opened_at: openedAt ?? null,
        stop_loss: stopLoss ?? null,
        take_profit: takeProfit ?? null,
        unrealized_pnl: unrealizedPnl ?? null,
        notional_value: notionalValue ?? null,
        leverage: leverage ?? null,
        broker_position_id: brokerPositionId ?? null,
        is_open: isOpen ?? true,
        metadata: metadata ?? {},
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create open position' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
