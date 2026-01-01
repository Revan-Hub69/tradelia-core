// UCM API - Universe Active endpoint
// Returns the current active universe with caching and error handling

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/mce/db/supabase";
import { dbRateLimits } from "@/lib/middleware/rate-limit-db";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Apply database-backed rate limiting for public endpoint
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }
    
    const sb = supabaseAdmin();
    
    // Get latest universe_active
    const { data, error } = await sb
      .from('universe_active')
      .select('as_of, version, symbols, hash')
      .order('as_of', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Database query error:', error);
      return NextResponse.json(
        { 
          ok: false, 
          error: "Database query failed" 
        },
        { 
          status: 500,
          headers: {
            'Cache-Control': 'no-cache',
          },
        }
      );
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "No active universe found. UCM pipeline may not have run yet." 
        },
        { 
          status: 404,
          headers: {
            'Cache-Control': `public, max-age=30, stale-while-revalidate=60`,
          },
        }
      );
    }
    
    const row = data[0];
    const response = {
      ok: true,
      data: {
        asOf: row.as_of,
        version: row.version,
        symbols: row.symbols,
        hash: row.hash,
        count: row.symbols.length
      }
    };
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=60, stale-while-revalidate=120`,
        'Content-Type': 'application/json',
        'X-Universe-Hash': row.hash,
        'X-Universe-AsOf': row.as_of.toString(),
        'X-Universe-Count': row.symbols.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('Universe Active API Error:', error);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
  }
}