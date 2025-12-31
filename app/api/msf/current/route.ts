// MSF Current State API - Latest day gate and market fits
// Best practice: read-only, cached, minimal response

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { applyRateLimit } from '@/lib/middleware/rate-limit-db';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (general tier - 60 req/min)
    const rateLimitResult = await applyRateLimit(request, 'general');
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60'
          }
        }
      );
    }

    const sb = supabaseAdmin();
    
    // Get latest day gate and market fits in parallel
    const [dayGateResult, marketFitsResult] = await Promise.all([
      sb.rpc('get_latest_day_gate'),
      sb.rpc('get_latest_market_fits')
    ]);

    if (dayGateResult.error) {
      console.error('Failed to get day gate:', dayGateResult.error);
      return NextResponse.json(
        { ok: false, error: 'Failed to get day gate' },
        { status: 500 }
      );
    }

    if (marketFitsResult.error) {
      console.error('Failed to get market fits:', marketFitsResult.error);
      return NextResponse.json(
        { ok: false, error: 'Failed to get market fits' },
        { status: 500 }
      );
    }

    const dayGate = dayGateResult.data?.[0];
    const marketFits = marketFitsResult.data || [];

    // Return structured response
    const response = {
      ok: true,
      data: {
        dayGate: dayGate ? {
          asOf: dayGate.as_of,
          tradableDay: dayGate.tradable_day,
          countA: dayGate.count_a,
          countB: dayGate.count_b,
          reasons: dayGate.reasons,
          hash: dayGate.day_gate?.hash,
        } : null,
        marketFits: marketFits.map((fit: any) => ({
          symbol: fit.symbol,
          asOf: fit.as_of,
          fitClass: fit.fit_class,
          allowedPlaybooks: fit.allowed_playbooks,
          frictionScore: parseFloat(fit.friction_score),
          dataQuality: parseFloat(fit.data_quality),
          reasons: fit.reasons,
          hash: fit.market_fit?.hash,
        })),
        summary: {
          totalSymbols: marketFits.length,
          aCount: marketFits.filter((f: any) => f.fit_class === 'A').length,
          bCount: marketFits.filter((f: any) => f.fit_class === 'B').length,
          cCount: marketFits.filter((f: any) => f.fit_class === 'C').length,
          noTradeCount: marketFits.filter((f: any) => f.fit_class === 'NO_TRADE').length,
          avgFriction: marketFits.length > 0 
            ? marketFits.reduce((sum: number, f: any) => sum + parseFloat(f.friction_score), 0) / marketFits.length
            : 0,
          avgDataQuality: marketFits.length > 0
            ? marketFits.reduce((sum: number, f: any) => sum + parseFloat(f.data_quality), 0) / marketFits.length
            : 0,
        },
        lastUpdate: dayGate?.as_of || Date.now(),
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