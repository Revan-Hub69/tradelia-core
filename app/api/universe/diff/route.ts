// UCM API - Universe Diff endpoint
// Returns changes in universe over time for tracking and analysis

import { NextRequest, NextResponse } from "next/server";
import { UCMRepository } from "../../../../lib/ucm/db/repo";
import { UniverseDiffQuerySchema } from "../../../../lib/ucm/schemas";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters
    const queryParams = {
      from: searchParams.get('from') ? parseInt(searchParams.get('from')!) : undefined,
      to: searchParams.get('to') ? parseInt(searchParams.get('to')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };
    
    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== undefined)
    );
    
    const validatedParams = UniverseDiffQuerySchema.parse(cleanParams);
    
    const repo = new UCMRepository();
    const diff = await repo.getUniverseDiff(
      validatedParams.from,
      validatedParams.to,
      validatedParams.limit || 50
    );
    
    // Calculate summary statistics
    const totalChanges = diff.changes.reduce((sum, change) => 
      sum + change.added.length + change.removed.length + change.blacklisted.length, 0
    );
    
    const avgActiveCount = diff.changes.length > 0
      ? Math.round(diff.changes.reduce((sum, change) => sum + change.activeCount, 0) / diff.changes.length)
      : 0;
    
    const response = {
      ok: true,
      data: {
        ...diff,
        summary: {
          totalChanges,
          avgActiveCount,
          timespan: diff.to - diff.from,
          changesCount: diff.changes.length,
        },
      },
    };
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5 min cache
        'Content-Type': 'application/json',
        'X-Total-Changes': totalChanges.toString(),
        'X-Timespan': (diff.to - diff.from).toString(),
      },
    });
    
  } catch (error) {
    console.error('Universe Diff API Error:', error);
    
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { 
          ok: false, 
          error: "Invalid query parameters. Use 'from', 'to' (timestamps), and 'limit' (max 100)." 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        ok: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
}