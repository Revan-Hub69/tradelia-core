import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body?.symbol !== undefined) updateData.symbol = body.symbol;
    if (body?.side !== undefined) updateData.side = body.side;
    if (body?.size !== undefined) updateData.size = body.size;
    if (body?.entryPrice !== undefined) updateData.entry_price = body.entryPrice;
    if (body?.openedAt !== undefined) updateData.opened_at = body.openedAt;
    if (body?.stopLoss !== undefined) updateData.stop_loss = body.stopLoss;
    if (body?.takeProfit !== undefined) updateData.take_profit = body.takeProfit;
    if (body?.unrealizedPnl !== undefined) updateData.unrealized_pnl = body.unrealizedPnl;
    if (body?.notionalValue !== undefined) updateData.notional_value = body.notionalValue;
    if (body?.leverage !== undefined) updateData.leverage = body.leverage;
    if (body?.brokerPositionId !== undefined) updateData.broker_position_id = body.brokerPositionId;
    if (body?.isOpen !== undefined) updateData.is_open = body.isOpen;
    if (body?.metadata !== undefined) updateData.metadata = body.metadata;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('open_positions')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update open position' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { error } = await supabase
      .from('open_positions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete open position' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
