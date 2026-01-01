// MSF Current State API - Latest day gate and market fits
// Best practice: read-only, cached, minimal response

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { dbRateLimits } from '@/lib/middleware/rate-limit-db';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (general tier - 60 req/min)
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const sb = supabaseAdmin();

    // Get latest day gate
    const { data: dayGateData, error: dayGateError } = await sb
      .from('msf_day_gates')
      .select('*')
      .order('as_of', { ascending: false })
      .limit(1)
      .single();

    if (dayGateError && dayGateError.code !== 'PGRST116') {
      console.error('Day gate query error:', dayGateError);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch day gate' },
        { status: 500 }
      );
    }

    // Get latest market fits
    const { data: marketFitsData, error: marketFitsError } = await sb
      .from('msf_market_fits')
      .select('*')
      .order('as_of', { ascending: false })
      .limit(100);

    if (marketFitsError && marketFitsError.code !== 'PGRST116') {
      console.error('Market fits query error:', marketFitsError);
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch market fits' },
        { status: 500 }
      );
    }

    // If no data, return 404
    if (!dayGateData && (!marketFitsData || marketFitsData.length === 0)) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'No MSF data available. Pipeline may not have run yet.' 
        },
        { status: 404 }
      );
    }

    const now = Date.now();
    const asOf = dayGateData?.as_of || now;

    // Transform market fits
    const marketFits = (marketFitsData || []).map((fit: any) => ({
      symbol: fit.symbol,
      asOf: fit.as_of,
      fitClass: fit.fit_class,
      allowedPlaybooks: fit.allowed_playbooks || [],
      frictionScore: parseFloat(fit.friction_score || '0'),
      dataQuality: parseFloat(fit.data_quality || '0.5'),
      reasons: fit.reasons || [],
      hash: fit.hash,
    }));

    // Calculate summary
    const summary = {
      totalSymbols: marketFits.length,
      aCount: marketFits.filter((f: any) => f.fitClass === 'A').length,
      bCount: marketFits.filter((f: any) => f.fitClass === 'B').length,
      cCount: marketFits.filter((f: any) => f.fitClass === 'C').length,
      noTradeCount: marketFits.filter((f: any) => f.fitClass === 'NO_TRADE').length,
      avgFriction: marketFits.length > 0 
        ? marketFits.reduce((sum: number, f: any) => sum + f.frictionScore, 0) / marketFits.length 
        : 0,
      avgDataQuality: marketFits.length > 0 
        ? marketFits.reduce((sum: number, f: any) => sum + f.dataQuality, 0) / marketFits.length 
        : 0,
    };

    // Return structured response
    const response = {
      ok: true,
      data: {
        dayGate: dayGateData ? {
          asOf: dayGateData.as_of,
          tradableDay: dayGateData.tradable_day,
          countA: dayGateData.count_a,
          countB: dayGateData.count_b,
          reasons: dayGateData.reasons || [],
          hash: dayGateData.hash,
        } : {
          asOf,
          tradableDay: true,
          countA: summary.aCount,
          countB: summary.bCount,
          reasons: [],
          hash: 'no_daygate',
        },
        marketFits,
        summary,
        lastUpdate: asOf,
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('MSF current API error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}