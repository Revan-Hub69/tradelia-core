// Detailed Health Check API - Production Monitoring
// Comprehensive system health with detailed diagnostics

import { NextRequest, NextResponse } from 'next/server';
import { healthCheckSystem } from '@/lib/monitoring/health-check';
import { authenticate } from '@/lib/middleware/api-auth';

export async function GET(request: NextRequest) {
  try {
    // Optional authentication for detailed health info
    const authContext = await authenticate(request);
    const isAuthenticated = authContext !== null;
    
    // Run all health checks
    const healthReport = await healthCheckSystem.runAllChecks();
    
    // Determine response based on authentication
    const response = isAuthenticated ? {
      ok: healthReport.overall === 'HEALTHY',
      status: healthReport.overall,
      timestamp: healthReport.timestamp,
      uptime: healthReport.uptime,
      version: healthReport.version,
      checks: healthReport.checks,
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        memory: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    } : {
      // Limited info for unauthenticated requests
      ok: healthReport.overall === 'HEALTHY',
      status: healthReport.overall,
      timestamp: healthReport.timestamp,
      uptime: healthReport.uptime,
      checks: healthReport.checks.map(check => ({
        name: check.status === 'HEALTHY' ? '✓' : check.status === 'DEGRADED' ? '⚠' : '✗',
        status: check.status,
        responseTime: check.responseTime,
      })),
    };

    // Set appropriate HTTP status code
    const httpStatus = healthReport.overall === 'HEALTHY' ? 200 : 
                      healthReport.overall === 'DEGRADED' ? 200 : 503;

    return NextResponse.json(response, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Health check API error:', error);
    
    return NextResponse.json(
      {
        ok: false,
        status: 'UNHEALTHY',
        error: 'Health check system failure',
        timestamp: new Date().toISOString(),
      },
      { 
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Simple health check for load balancers
export async function HEAD(request: NextRequest) {
  try {
    const healthReport = await healthCheckSystem.runAllChecks();
    const httpStatus = healthReport.overall === 'HEALTHY' ? 200 : 503;
    
    return new NextResponse(null, {
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    return new NextResponse(null, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  }
}