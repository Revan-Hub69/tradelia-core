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
    
    // Query database for latest regime signature
    const sb = supabaseAnon();
    
    const { data, error } = await sb
      .from("eligibility_snapshots")
      .select("*")
      .eq("symbol", symbol)
      .order("as_of", { ascending: false })
      .limit(1);
    
    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json({
        ok: false,
        error: "Database query failed",
      } as CurrentRegimeResponse, { status: 500 });
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json({
        ok: false,
        error: `No regime data found for ${symbol} ${tf}`,
      } as CurrentRegimeResponse, { status: 404 });
    }
    
    const row = data[0];
    const retrievedAt = Date.now();
    
    // Validate signature structure
    let validatedSignature;
    try {
      validatedSignature = RegimeSignatureSchema.parse(row.signature);
    } catch (validationError) {
      console.error("Signature validation error:", validationError);
      return NextResponse.json({
        ok: false,
        error: "Invalid signature format in database",
      } as CurrentRegimeResponse, { status: 500 });
    }
    
    // Calculate age
    const age = Math.floor((retrievedAt - row.as_of) / 1000);
    
    // Return successful response
    const response: CurrentRegimeResponse = {
      ok: true,
      data: {
        signature: validatedSignature,
        metadata: {
          age,
          source: "mce_pipeline",
          retrievedAt,
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