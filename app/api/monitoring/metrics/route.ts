import { NextRequest, NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';
import { logger } from '@/lib/logger';
import { withSecurity } from '@/lib/security';

async function handler(request: NextRequest) {
  const startTime = Date.now();
  
  logger.setContext({
    component: 'monitoring_api',
    action: 'get_metrics'
  });
  
  try {
    const { searchParams } = new URL(request.url);
    const metricName = searchParams.get('name');
    const since = searchParams.get('since');
    const sinceTimestamp = since ? parseInt(since) : undefined;
    
    // Get metrics
    const metrics = monitoring.getMetrics(metricName || undefined, sinceTimestamp);
    const errorBudgets = monitoring.getErrorBudgets();
    const slis = monitoring.getSLIs();
    const healthStatus = monitoring.getHealthStatus();
    
    const response = {
      timestamp: Date.now(),
      health: healthStatus,
      metrics: metrics.slice(-100), // Limit to last 100 metrics
      errorBudgets,
      slis,
      summary: {
        totalMetrics: metrics.length,
        timeRange: {
          from: metrics.length > 0 ? Math.min(...metrics.map(m => m.timestamp)) : null,
          to: metrics.length > 0 ? Math.max(...metrics.map(m => m.timestamp)) : null
        }
      }
    };
    
    logger.performance('Metrics API response', startTime, {
      metricsCount: metrics.length,
      errorBudgetsCount: errorBudgets.length,
      slisCount: slis.length
    });
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    logger.error('Error fetching metrics', error as Error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch metrics',
        timestamp: Date.now()
      },
      { status: 500 }
    );
  }
}

export const GET = withSecurity(handler);

// Only allow GET requests
export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}