// UCM API - Universe Pool endpoint
// GET: Returns current universe pool
// POST: Updates universe pool (admin only)

import { NextRequest, NextResponse } from "next/server";
import { UCMRepository } from "../../../../lib/ucm/db/repo";
import { 
  UniversePoolApiResponseSchema, 
  UniversePoolSchema,
  generatePoolHash 
} from "../../../../lib/ucm/schemas";
import { rateLimits, isWhitelistedIP, addSecurityHeaders } from "../../../../lib/middleware/rate-limit";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting (skip for whitelisted IPs)
    if (!isWhitelistedIP(request)) {
      const rateLimitResult = await rateLimits.universe(request);
      if (rateLimitResult) {
        return addSecurityHeaders(rateLimitResult);
      }
    }

    // Check authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return addSecurityHeaders(NextResponse.json(
        { 
          ok: false, 
          error: "Authentication required. Please provide a valid Bearer token." 
        },
        { status: 401 }
      ));
    }
    
    const repo = new UCMRepository();
    const pool = await repo.getUniversePool();
    
    if (!pool) {
      return addSecurityHeaders(NextResponse.json(
        { 
          ok: false, 
          error: "No universe pool found. Pool may not have been initialized." 
        },
        { status: 404 }
      ));
    }
    
    const response = { ok: true, data: pool };
    const validatedResponse = UniversePoolApiResponseSchema.parse(response);
    
    return addSecurityHeaders(NextResponse.json(validatedResponse, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5 min cache
        'Content-Type': 'application/json',
        'X-Pool-Hash': pool.hash,
        'X-Pool-AsOf': pool.asOf.toString(),
        'X-Pool-Size': pool.symbols.length.toString(),
        'X-Core-Size': pool.coreSymbols.length.toString(),
      },
    }));
    
  } catch (error) {
    console.error('Universe Pool GET API Error:', error);
    
    return addSecurityHeaders(NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    ));
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for admin operations
    if (!isWhitelistedIP(request)) {
      const rateLimitResult = await rateLimits.admin(request);
      if (rateLimitResult) {
        return addSecurityHeaders(rateLimitResult);
      }
    }

    // Check authentication for admin operations
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return addSecurityHeaders(NextResponse.json(
        { 
          ok: false, 
          error: "Admin authentication required for pool updates." 
        },
        { status: 401 }
      ));
    }
    
    // TODO: Validate admin role from JWT token
    // For now, require any valid Bearer token
    
    const body = await request.json();
    
    // Validate request body
    const poolData = {
      ...body,
      v: "ucm.pool.v1" as const,
      asOf: Date.now(),
    };
    
    // Generate hash if not provided
    if (!poolData.hash) {
      poolData.hash = generatePoolHash(poolData.symbols, poolData.coreSymbols);
    }
    
    const validatedPool = UniversePoolSchema.parse(poolData);
    
    // Save to database
    const repo = new UCMRepository();
    await repo.updateUniversePool(validatedPool);
    
    const response = { ok: true, data: validatedPool };
    
    return addSecurityHeaders(NextResponse.json(response, {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-Pool-Hash': validatedPool.hash,
        'X-Pool-Size': validatedPool.symbols.length.toString(),
      },
    }));
    
  } catch (error) {
    console.error('Universe Pool POST API Error:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return addSecurityHeaders(NextResponse.json(
        { 
          ok: false, 
          error: "Invalid pool data. Required: symbols (array), coreSymbols (array)." 
        },
        { status: 400 }
      ));
    }
    
    return addSecurityHeaders(NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    ));
  }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return addSecurityHeaders(NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  }));
}