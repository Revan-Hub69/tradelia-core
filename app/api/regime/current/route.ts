// GET /api/regime/current - Latest regime signature
// Returns the most recent regime classification for specified symbol/timeframe

import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/mce/db/supabase";
import { RegimeSignatureSchema } from "@/lib/mce/schemas";
import { type Symbol, type TF } from "@/lib/mce/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface CurrentRegimeQuery {
  symbol?: Symbol;
  tf?: TF;
}

interface CurrentRegimeResponse {
  ok: boolean;
  data?: {
    signature: any;
    metadata: {
      age: number;        // Age in seconds
      source: string;
      retrievedAt: number;
    };
  };
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const symbol = (searchParams.get("symbol") || "BTCUSDT") as Symbol;
    const tf = (searchParams.get("tf") || "1m") as TF;
    
    // Validate parameters
    if (!["BTCUSDT"].includes(symbol)) {
      return NextResponse.json({
        ok: false,
        error: `Invalid symbol: ${symbol}. Supported: BTCUSDT`,
      } as CurrentRegimeResponse, { status: 400 });
    }
    
    if (!["1m", "5m", "15m", "1h", "4h"].includes(tf)) {
      return NextResponse.json({
        ok: false,
        error: `Invalid timeframe: ${tf}. Supported: 1m, 5m, 15m, 1h, 4h`,
      } as CurrentRegimeResponse, { status: 400 });
    }
    
    // Return mock data for now (until database is properly synced)
    const now = Date.now();
    const mockSignature = {
      v: 'mce.v1' as const,
      symbol: symbol,
      tf: tf,
      asOf: now,
      trend: 'up' as const,
      volatility: 'normal' as const,
      confidence: 0.8,
      features: {
        atr14: 1000,
        atr50: 1200,
        atrPct7d: 60,
        atrPct30d: 55,
        emaFast: 50000,
        emaSlow: 49500,
        trendStrength: 0.7,
        volNorm: 0.6
      },
      quality: {
        completeness: 0.95,
        gaps: 0,
        freshnessSec: 30,
        source: 'binance' as const,
        valid: true
      },
      change: {
        changed: false
      },
      hash: 'mock_hash_' + now
    };
    
    // Return successful response
    const response: CurrentRegimeResponse = {
      ok: true,
      data: {
        signature: mockSignature,
        metadata: {
          age: 30,
          source: "mock_data",
          retrievedAt: now,
        },
      },
    };
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=30, s-maxage=30",
        "Content-Type": "application/json",
      },
    });
    
  } catch (error) {
    console.error("API error:", error);
    
    return NextResponse.json({
      ok: false,
      error: "Internal server error",
    } as CurrentRegimeResponse, { status: 500 });
  }
}

// OPTIONS handler for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}