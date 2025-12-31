// GET /api/regime/history - Historical regime signatures
// Returns regime signatures for a time range with optional filtering

import { NextRequest, NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/mce/db/supabase";
import { RegimeSignatureSchema } from "@/lib/mce/schemas";
import { type Symbol, type TF } from "@/lib/mce/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface HistoryQuery {
  symbol?: Symbol;
  tf?: TF;
  from?: number;     // Start timestamp (ms)
  to?: number;       // End timestamp (ms)
  limit?: number;    // Max results (default 100, max 1000)
  changes?: boolean; // Only return regime changes
}

interface HistoryResponse {
  ok: boolean;
  data?: {
    signatures: any[];
    metadata: {
      count: number;
      timeRange: {
        from: number;
        to: number;
      };
      query: HistoryQuery;
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
    const from = searchParams.get("from") ? parseInt(searchParams.get("from")!) : undefined;
    const to = searchParams.get("to") ? parseInt(searchParams.get("to")!) : undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);
    const changesOnly = searchParams.get("changes") === "true";
    
    // Validate parameters
    if (!["BTCUSDT"].includes(symbol)) {
      return NextResponse.json({
        ok: false,
        error: `Invalid symbol: ${symbol}. Supported: BTCUSDT`,
      } as HistoryResponse, { status: 400 });
    }
    
    if (!["1m", "5m", "15m", "1h", "4h"].includes(tf)) {
      return NextResponse.json({
        ok: false,
        error: `Invalid timeframe: ${tf}. Supported: 1m, 5m, 15m, 1h, 4h`,
      } as HistoryResponse, { status: 400 });
    }
    
    if (from && to && from >= to) {
      return NextResponse.json({
        ok: false,
        error: "Invalid time range: 'from' must be less than 'to'",
      } as HistoryResponse, { status: 400 });
    }
    
    // Default time range (last 24 hours if not specified)
    const now = Date.now();
    const defaultFrom = now - (24 * 60 * 60 * 1000); // 24 hours ago
    const queryFrom = from || defaultFrom;
    const queryTo = to || now;
    
    // Build database query
    const sb = supabaseAnon();
    
    let query = sb
      .from("regime_signatures")
      .select("signature, as_of, inserted_at")
      .eq("symbol", symbol)
      .eq("tf", tf)
      .gte("as_of", queryFrom)
      .lte("as_of", queryTo)
      .order("as_of", { ascending: false })
      .limit(limit);
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json({
        ok: false,
        error: "Database query failed",
      } as HistoryResponse, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({
        ok: false,
        error: "No data returned from database",
      } as HistoryResponse, { status: 500 });
    }
    
    // Validate and process signatures
    const validatedSignatures: any[] = [];
    const validationErrors: string[] = [];
    
    for (let i = 0; i < data.length; i++) {
      try {
        const validated = RegimeSignatureSchema.parse(data[i].signature);
        validatedSignatures.push(validated);
      } catch (validationError) {
        validationErrors.push(`Row ${i}: Invalid signature format`);
      }
    }
    
    // Filter for regime changes only if requested
    let finalSignatures = validatedSignatures;
    
    if (changesOnly && validatedSignatures.length > 0) {
      finalSignatures = [];
      let prevRegime: { trend: string; volatility: string } | null = null;
      
      // Process in chronological order (reverse the array)
      const chronological = [...validatedSignatures].reverse();
      
      for (const signature of chronological) {
        const currentRegime = {
          trend: signature.trend,
          volatility: signature.volatility,
        };
        
        // Include if it's the first signature or regime changed
        if (!prevRegime || 
            currentRegime.trend !== prevRegime.trend || 
            currentRegime.volatility !== prevRegime.volatility) {
          finalSignatures.push(signature);
        }
        
        prevRegime = currentRegime;
      }
      
      // Reverse back to descending order
      finalSignatures.reverse();
    }
    
    const retrievedAt = Date.now();
    
    // Build response
    const response: HistoryResponse = {
      ok: true,
      data: {
        signatures: finalSignatures,
        metadata: {
          count: finalSignatures.length,
          timeRange: {
            from: queryFrom,
            to: queryTo,
          },
          query: {
            symbol,
            tf,
            from: queryFrom,
            to: queryTo,
            limit,
            changes: changesOnly,
          },
          retrievedAt,
        },
      },
    };
    
    // Add validation warnings if any
    if (validationErrors.length > 0) {
      console.warn("Signature validation errors:", validationErrors);
    }
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60", // Cache for 1 minute
        "Content-Type": "application/json",
      },
    });
    
  } catch (error) {
    console.error("API error:", error);
    
    return NextResponse.json({
      ok: false,
      error: "Internal server error",
    } as HistoryResponse, { status: 500 });
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