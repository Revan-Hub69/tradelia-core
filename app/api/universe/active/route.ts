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
    const repo = new UCMRepository();
    const universeActive = await repo.getLatestUniverseActive();
    
    if (!universeActive) {
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
    
    // Validate response schema
    const response = { ok: true, data: universeActive };
    const validatedResponse = UniverseActiveApiResponseSchema.parse(response);
    
    return NextResponse.json(validatedResponse, {
      status: 200,
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`,
        'Content-Type': 'application/json',
        'X-Universe-Hash': universeActive.hash,
        'X-Universe-AsOf': universeActive.asOf.toString(),
        'X-Universe-Count': universeActive.symbols.length.toString(),
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