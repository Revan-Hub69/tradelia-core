// Comprehensive health check endpoint
// Monitors all critical system components

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/mce/db/supabase';
import { getCircuitBreakerHealth } from '../../../lib/utils/circuit-breaker';

export const runtime = 'nodejs';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency?: number;
  error?: string;
  details?: Record<string, any>;
}

interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  uptime: number;
  version: string;
  checks: HealthCheck[];
  summary: {
    total: number;
    healthy: number;
    degraded: number;
    unhealthy: number;
  };
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    // Test basic connectivity
    const { data, error } = await supabaseAdmin()
      .from('universe_pool')
      .select('count')
      .limit(1);
    
    if (error) {
      return {
        name: 'database',
        status: 'unhealthy',
        latency: Date.now() - start,
        error: error.message
      };
    }
    
    const latency = Date.now() - start;
    
    return {
      name: 'database',
      status: latency > 1000 ? 'degraded' : 'healthy',
      latency,
      details: {
        connectionPool: 'active',
        queryTime: `${latency}ms`
      }
    };
  } catch (error) {
    return {
      name: 'database',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkBinanceAPI(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    const response = await fetch('https://api.binance.com/api/v3/ping', {
      signal: AbortSignal.timeout(5000)
    });
    
    const latency = Date.now() - start;
    
    if (!response.ok) {
      return {
        name: 'binance_api',
        status: 'unhealthy',
        latency,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
    
    return {
      name: 'binance_api',
      status: latency > 2000 ? 'degraded' : 'healthy',
      latency,
      details: {
        endpoint: 'ping',
        responseTime: `${latency}ms`
      }
    };
  } catch (error) {
    return {
      name: 'binance_api',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Network error'
    };
  }
}

async function checkPipelineStatus(): Promise<HealthCheck> {
  const start = Date.now();
  
  try {
    // Check last successful pipeline run
    const { data, error } = await supabaseAdmin()
      .from('universe_active')
      .select('as_of, created_at')
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      return {
        name: 'pipeline_status',
        status: 'unhealthy',
        latency: Date.now() - start,
        error: error.message
      };
    }
    
    const latency = Date.now() - start;
    
    if (!data || data.length === 0) {
      return {
        name: 'pipeline_status',
        status: 'degraded',
        latency,
        error: 'No pipeline runs found'
      };
    }
    
    const lastRun = new Date(data[0].created_at);
    const timeSinceLastRun = Date.now() - lastRun.getTime();
    const maxAge = 10 * 60 * 1000; // 10 minutes
    
    return {
      name: 'pipeline_status',
      status: timeSinceLastRun > maxAge ? 'degraded' : 'healthy',
      latency,
      details: {
        lastRun: lastRun.toISOString(),
        timeSinceLastRun: `${Math.round(timeSinceLastRun / 1000)}s`,
        dataFreshness: timeSinceLastRun > maxAge ? 'stale' : 'fresh'
      }
    };
  } catch (error) {
    return {
      name: 'pipeline_status',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function checkMemoryUsage(): HealthCheck {
  const start = Date.now();
  
  try {
    const memUsage = process.memoryUsage();
    const totalMB = Math.round(memUsage.rss / 1024 / 1024);
    const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
    
    // Consider unhealthy if using more than 1GB
    const status = totalMB > 1024 ? 'degraded' : 'healthy';
    
    return {
      name: 'memory_usage',
      status,
      latency: Date.now() - start,
      details: {
        rss: `${totalMB}MB`,
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      }
    };
  } catch (error) {
    return {
      name: 'memory_usage',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function checkCircuitBreakers(): HealthCheck {
  const start = Date.now();
  
  try {
    const breakerStats = getCircuitBreakerHealth();
    const unhealthyBreakers = Object.entries(breakerStats)
      .filter(([_, stats]) => stats.state === 'OPEN')
      .map(([name, _]) => name);
    
    const status = unhealthyBreakers.length > 0 ? 'degraded' : 'healthy';
    
    return {
      name: 'circuit_breakers',
      status,
      latency: Date.now() - start,
      details: {
        breakers: breakerStats,
        openBreakers: unhealthyBreakers
      }
    };
  } catch (error) {
    return {
      name: 'circuit_breakers',
      status: 'unhealthy',
      latency: Date.now() - start,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Run all health checks in parallel
    const checks = await Promise.all([
      checkDatabase(),
      checkBinanceAPI(),
      checkPipelineStatus(),
      checkMemoryUsage(),
      checkCircuitBreakers()
    ]);
    
    // Calculate overall system status
    const summary = {
      total: checks.length,
      healthy: checks.filter(c => c.status === 'healthy').length,
      degraded: checks.filter(c => c.status === 'degraded').length,
      unhealthy: checks.filter(c => c.status === 'unhealthy').length
    };
    
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (summary.unhealthy > 0) {
      overallStatus = 'unhealthy';
    } else if (summary.degraded > 0) {
      overallStatus = 'degraded';
    }
    
    const health: SystemHealth = {
      status: overallStatus,
      timestamp: Date.now(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks,
      summary
    };
    
    // Return appropriate HTTP status
    const httpStatus = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;
    
    return NextResponse.json(health, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
        'X-Health-Status': overallStatus,
        'X-Response-Time': `${Date.now() - startTime}ms`
      }
    });
    
  } catch (error) {
    const health: SystemHealth = {
      status: 'unhealthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      checks: [{
        name: 'health_check_system',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Health check system failure'
      }],
      summary: { total: 1, healthy: 0, degraded: 0, unhealthy: 1 }
    };
    
    return NextResponse.json(health, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}