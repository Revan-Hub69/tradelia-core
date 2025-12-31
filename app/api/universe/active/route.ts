// UCM API - Universe Active endpoint
// Returns the current active universe with caching and error handling

import { NextRequest, NextResponse } from "next/server";
import { UCMRepository } from "../../../../lib/ucm/db/repo";
import { UniverseActiveApiResponseSchema } from "../../../../lib/ucm/schemas";
import { dbRateLimits } from "../../../../lib/middleware/rate-limit-db";

export const runtime = 'nodejs';

// Cache the response for 1 minute to reduce database load
const CACHE_DURATION = 60; // seconds

export async function GET(request: NextRequest) {
  try {
    // Apply database-backed rate limiting for public endpoint
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }
    
    // Return mock data for now (until database is properly synced)
    const now = Date.now();
    const mockUniverse = {
      asOf: now,
      hash: 'mock_hash_' + now,
      symbols: ['BTCUSDT', 'ETHUSDT'],
      metadata: {
        totalSymbols: 2,
        activeSymbols: 2,
        source: 'mock_data',
        generatedAt: now
      }
    };
    
    // Validate response schema
    const response = { ok: true, data: mockUniverse };
    const validatedResponse = UniverseActiveApiResponseSchema.parse(response);
    
    return NextResponse.json(validatedResponse, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'Content-Type': 'application/json',
        'X-Universe-Hash': mockUniverse.hash,
        'X-Universe-AsOf': mockUniverse.asOf.toString(),
        'X-Universe-Count': mockUniverse.symbols.length.toString(),
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