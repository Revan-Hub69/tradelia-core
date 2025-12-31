// Setup Replay API - Professional Trading System
// Best practice: complete lifecycle replay, debugging capability

import { NextRequest, NextResponse } from 'next/server';
import { dbRateLimits } from '@/lib/middleware/rate-limit-db';
import { setupLogger } from '@/lib/setup/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ setupId: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = await dbRateLimits.general.check(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const { setupId } = await params;
    
    if (!setupId) {
      return NextResponse.json(
        { ok: false, error: 'Setup ID is required' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(setupId)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid setup ID format' },
        { status: 400 }
      );
    }

    // Replay the setup lifecycle
    const events = await setupLogger.replaySetup(setupId);
    
    if (events.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Setup not found' },
        { status: 404 }
      );
    }

    // Analyze the setup lifecycle
    const analysis = analyzeSetupLifecycle(events);

    const response = {
      ok: true,
      data: {
        setupId,
        events: events.map(event => ({
          eventId: event.eventId,
          eventType: event.eventType,
          timestamp: event.timestamp,
          timestampISO: new Date(event.timestamp).toISOString(),
          data: event.data,
          marketState: event.marketState,
          outcome: event.outcome,
        })),
        analysis,
        summary: {
          totalEvents: events.length,
          duration: events.length > 1 ? events[events.length - 1].timestamp - events[0].timestamp : 0,
          symbol: events[0]?.symbol,
          setupType: events.find(e => e.eventType === 'SETUP_DETECTED')?.data?.setupType,
          finalOutcome: events.find(e => e.outcome)?.outcome,
        }
      }
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour (historical data)
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('Setup replay API error:', error);
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

function analyzeSetupLifecycle(events: any[]): {
  lifecycle: string[];
  detectionQuality: any;
  executionQuality: any;
  issues: string[];
  insights: string[];
} {
  const lifecycle: string[] = [];
  const issues: string[] = [];
  const insights: string[] = [];
  
  // Track lifecycle progression
  const eventTypes = events.map(e => e.eventType);
  lifecycle.push(...eventTypes);
  
  // Find key events
  const detectionEvent = events.find(e => e.eventType === 'SETUP_DETECTED');
  const validationEvent = events.find(e => e.eventType === 'SETUP_VALIDATED');
  const rejectionEvent = events.find(e => e.eventType === 'SETUP_REJECTED');
  const entryEvent = events.find(e => e.eventType === 'ENTRY_TRIGGERED');
  const exitEvent = events.find(e => e.eventType === 'STOP_HIT' || e.eventType === 'TARGET_HIT' || e.eventType === 'MANUAL_EXIT');

  // Analyze detection quality
  let detectionQuality: any = null;
  if (detectionEvent) {
    detectionQuality = {
      confidenceScore: detectionEvent.data?.confidenceScore || 0,
      riskReward: detectionEvent.data?.riskReward || 0,
      evidenceCount: detectionEvent.data?.evidence?.length || 0,
      setupType: detectionEvent.data?.setupType,
      direction: detectionEvent.data?.direction,
    };
    
    if (detectionQuality.confidenceScore < 0.7) {
      issues.push('Low confidence score at detection');
    }
    
    if (detectionQuality.riskReward < 1.2) {
      issues.push('Poor risk-reward ratio');
    }
    
    if (detectionQuality.evidenceCount < 3) {
      issues.push('Insufficient evidence for setup');
    }
  }

  // Analyze execution quality
  let executionQuality: any = null;
  if (entryEvent && exitEvent) {
    const entryTime = entryEvent.timestamp;
    const exitTime = exitEvent.timestamp;
    const holdTime = exitTime - entryTime;
    
    executionQuality = {
      slippage: entryEvent.data?.slippage || 0,
      holdTime,
      holdTimeHours: holdTime / (1000 * 60 * 60),
      exitReason: exitEvent.outcome?.exitReason,
      pnl: exitEvent.outcome?.pnl || 0,
      pnlPct: exitEvent.outcome?.pnlPct || 0,
      maxDrawdown: exitEvent.outcome?.maxDrawdown || 0,
      maxRunup: exitEvent.outcome?.maxRunup || 0,
    };
    
    if (executionQuality.slippage > 0.001) {
      issues.push(`High slippage: ${(executionQuality.slippage * 100).toFixed(3)}%`);
    }
    
    if (executionQuality.holdTime < 60000) { // Less than 1 minute
      issues.push('Very short hold time - possible whipsaw');
    }
    
    if (executionQuality.pnl > 0) {
      insights.push(`Winning trade: +${executionQuality.pnlPct.toFixed(2)}%`);
    } else {
      insights.push(`Losing trade: ${executionQuality.pnlPct.toFixed(2)}%`);
    }
  }

  // Check for common issues
  if (detectionEvent && !entryEvent) {
    if (rejectionEvent) {
      insights.push('Setup detected but rejected during validation');
    } else {
      issues.push('Setup detected but never triggered');
    }
  }

  if (entryEvent && !exitEvent) {
    issues.push('Entry triggered but no exit recorded (possibly still open)');
  }

  // Check timing issues
  if (detectionEvent && validationEvent) {
    const validationDelay = validationEvent.timestamp - detectionEvent.timestamp;
    if (validationDelay > 30000) { // More than 30 seconds
      issues.push('Long delay between detection and validation');
    }
  }

  if (validationEvent && entryEvent) {
    const entryDelay = entryEvent.timestamp - validationEvent.timestamp;
    if (entryDelay > 300000) { // More than 5 minutes
      issues.push('Long delay between validation and entry');
    }
  }

  // Market context insights
  if (detectionEvent?.marketState?.regime) {
    const regime = detectionEvent.marketState.regime;
    insights.push(`Setup detected in ${regime.classification} regime`);
  }

  return {
    lifecycle,
    detectionQuality,
    executionQuality,
    issues,
    insights,
  };
}