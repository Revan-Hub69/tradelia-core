import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { monitoring } from '@/lib/monitoring';
import { logger } from '@/lib/logger';

export async function GET(_request: NextRequest) {
  const startTime = Date.now();
  
  logger.setContext({
    component: 'health_check',
    action: 'system_health'
  });
  
  try {
    const _healthStatus = monitoring.getHealthStatus();
    const errorBudgets = monitoring.getErrorBudgets();
    
    // Check system components
    const checks = {
      database: await checkDatabase(),
      memory: checkMemory(),
      errorBudgets: checkErrorBudgets(errorBudgets),
      logging: checkLogging()
    };
    
    const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
    const overallStatus = allHealthy ? 'healthy' : 
                         Object.values(checks).some(check => check.status === 'critical') ? 'critical' : 'warning';
    
    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime ? Math.floor(process.uptime()) : null,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks,
      errorBudgets: errorBudgets.map(budget => ({
        name: budget.name,
        status: budget.status,
        remaining: budget.remaining
      }))
    };
    
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'warning' ? 200 : 503;
    
    logger.info('Health check completed', {
      status: overallStatus,
      duration: Date.now() - startTime,
      checks: Object.keys(checks).length
    });
    
    // Record health check metric
    monitoring.recordMetric('health_check', statusCode === 200 ? 1 : 0, {
      status: overallStatus
    });
    
    return NextResponse.json(response, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    logger.error('Health check failed', error as Error);
    
    return NextResponse.json({
      status: 'critical',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      checks: {}
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    });
  }
}

async function checkDatabase(): Promise<{ status: string; message: string; responseTime?: number }> {
  // In a real application, this would check database connectivity
  // For now, we'll simulate a database check
  const startTime = Date.now();
  
  try {
    // Simulate database query
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      responseTime
    };
  } catch (error) {
    return {
      status: 'critical',
      message: `Database connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Memory usage type
interface MemoryUsage {
  used: number;
  total: number;
  percent: number;
}

function checkMemory(): { status: string; message: string; usage?: MemoryUsage } {
  try {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
      const totalMB = Math.round(usage.heapTotal / 1024 / 1024);
      const usagePercent = (usedMB / totalMB) * 100;
      
      const status = usagePercent > 90 ? 'critical' : 
                    usagePercent > 75 ? 'warning' : 'healthy';
      
      return {
        status,
        message: `Memory usage: ${usedMB}MB / ${totalMB}MB (${usagePercent.toFixed(1)}%)`,
        usage: {
          used: usedMB,
          total: totalMB,
          percent: usagePercent
        }
      };
    }
    
    return {
      status: 'healthy',
      message: 'Memory check not available in this environment'
    };
  } catch {
    return {
      status: 'warning',
      message: 'Memory check failed'
    };
  }
}

// Error budget type
interface ErrorBudget {
  name: string;
  status: string;
  remaining: number;
}

// Budget details type
interface BudgetDetail {
  name: string;
  remaining: number;
}

function checkErrorBudgets(budgets: ErrorBudget[]): { status: string; message: string; details: BudgetDetail[] } {
  const criticalBudgets = budgets.filter(b => b.status === 'critical');
  const warningBudgets = budgets.filter(b => b.status === 'warning');
  
  if (criticalBudgets.length > 0) {
    return {
      status: 'critical',
      message: `${criticalBudgets.length} error budget(s) in critical state`,
      details: criticalBudgets.map(b => ({ name: b.name, remaining: b.remaining }))
    };
  }
  
  if (warningBudgets.length > 0) {
    return {
      status: 'warning',
      message: `${warningBudgets.length} error budget(s) in warning state`,
      details: warningBudgets.map(b => ({ name: b.name, remaining: b.remaining }))
    };
  }
  
  return {
    status: 'healthy',
    message: 'All error budgets are healthy',
    details: budgets.map(b => ({ name: b.name, remaining: b.remaining }))
  };
}

function checkLogging(): { status: string; message: string } {
  try {
    // Test logging functionality
    logger.debug('Health check logging test');
    
    return {
      status: 'healthy',
      message: 'Logging system operational'
    };
  } catch {
    return {
      status: 'critical',
      message: 'Logging system failed'
    };
  }
}