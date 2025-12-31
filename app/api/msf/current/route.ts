// MSF Current State API - Latest day gate and market fits
// Best practice: read-only, cached, minimal response

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/mce/db/supabase';
import { dbRateLimits } from '@/lib/middleware/rate-limit-db';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (general tier - 60 req/min)
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Return mock data for now (until database is properly synced)
    const now = Date.now();
    const mockMarketFits = [
      {
        symbol: 'BTCUSDT',
        asOf: now,
        fitClass: 'A',
        allowedPlaybooks: ['breakout', 'pullback', 'liquidity_sweep'],
        frictionScore: 0.1,
        dataQuality: 0.95,
        reasons: [],
        hash: 'mock_btc_' + now,
      },
      {
        symbol: 'ETHUSDT',
        asOf: now,
        fitClass: 'A',
        allowedPlaybooks: ['breakout', 'pullback'],
        frictionScore: 0.15,
        dataQuality: 0.92,
        reasons: [],
        hash: 'mock_eth_' + now,
      }
    ];

    // Return structured response
    const response = {
      ok: true,
      data: {
        dayGate: {
          asOf: now,
          tradableDay: true,
          countA: 2,
          countB: 0,
          reasons: [],
          hash: 'mock_daygate_' + now,
        },
        marketFits: mockMarketFits,
        summary: {
          totalSymbols: 2,
          aCount: 2,
          bCount: 0,
          cCount: 0,
          noTradeCount: 0,
          avgFriction: 0.125,
          avgDataQuality: 0.935,
        },
        lastUpdate: now,
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