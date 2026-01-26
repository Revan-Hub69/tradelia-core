import { NextResponse } from 'next/server';

import { createClient } from '@/libs/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Try to query each table
    const tables = [
      'prop_firms',
      'challenges',
      'tracked_challenges',
      'trades',
      'trading_signals',
      'signal_settings',
      'alerts',
    ];

    const results: Record<string, boolean> = {};

    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      results[table] = !error;
    }

    return NextResponse.json({
      success: true,
      tables: results,
      allExist: Object.values(results).every(v => v),
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
