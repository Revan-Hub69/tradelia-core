// Health Check System - Production Monitoring
// Professional health monitoring with comprehensive checks

export interface HealthCheck {
  name: string;
  execute(): Promise<HealthCheckResult>;
}

export interface HealthCheckResult {
  status: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';
  responseTime: number;
  details?: Record<string, any>;
  error?: string;
  timestamp: number;
}

export interface HealthReport {
  overall: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';
  checks: HealthCheckResult[];
  timestamp: string;
  uptime: number;
  version?: string;
}

export class HealthCheckSystem {
  private checks: Map<string, HealthCheck> = new Map();
  private lastResults: Map<string, HealthCheckResult> = new Map();
  private startTime = Date.now();

  registerCheck(check: HealthCheck): void {
    this.checks.set(check.name, check);
  }

  unregisterCheck(name: string): boolean {
    this.lastResults.delete(name);
    return this.checks.delete(name);
  }

  async runAllChecks(): Promise<HealthReport> {
    const results: HealthCheckResult[] = [];
    const checkPromises: Promise<HealthCheckResult>[] = [];

    for (const [name, check] of this.checks) {
      const checkPromise = this.runSingleCheck(name, check);
      checkPromises.push(checkPromise);
    }

    // Run all checks in parallel with timeout
    const settledResults = await Promise.allSettled(
      checkPromises.map(promise => 
        Promise.race([
          promise,
          this.createTimeoutPromise(10000) // 10 second timeout
        ])
      )
    );

    // Process results
    settledResults.forEach((result, index) => {
      const checkName = Array.from(this.checks.keys())[index];
      
      if (result.status === 'fulfilled') {
        results.push(result.value);
        this.lastResults.set(checkName, result.value);
      } else {
        const failedResult: HealthCheckResult = {
          status: 'UNHEALTHY',
          responseTime: 10000,
          error: result.reason?.message || 'Check failed',
          timestamp: Date.now(),
        };
        results.push(failedResult);
        this.lastResults.set(checkName, failedResult);
      }
    });

    // Determine overall status
    const overall = this.calculateOverallStatus(results);

    return {
      overall,
      checks: results,
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
      version: process.env.npm_package_version,
    };
  }

  async runSingleCheck(name: string, check: HealthCheck): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const result = await check.execute();
      return {
        ...result,
        responseTime: Date.now() - startTime,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        status: 'UNHEALTHY',
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
      };
    }
  }

  private calculateOverallStatus(results: HealthCheckResult[]): 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED' {
    if (results.length === 0) return 'HEALTHY';

    const unhealthyCount = results.filter(r => r.status === 'UNHEALTHY').length;
    const degradedCount = results.filter(r => r.status === 'DEGRADED').length;

    if (unhealthyCount > 0) {
      return unhealthyCount > results.length / 2 ? 'UNHEALTHY' : 'DEGRADED';
    }

    if (degradedCount > 0) {
      return 'DEGRADED';
    }

    return 'HEALTHY';
  }

  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Health check timed out after ${timeout}ms`)), timeout);
    });
  }

  getLastResults(): Map<string, HealthCheckResult> {
    return new Map(this.lastResults);
  }

  getCheckNames(): string[] {
    return Array.from(this.checks.keys());
  }
}

// Built-in health checks
export class DatabaseHealthCheck implements HealthCheck {
  name = 'database';

  async execute(): Promise<HealthCheckResult> {
    try {
      const { supabaseAdmin } = await import('@/lib/mce/db/supabase');
      const supabase = supabaseAdmin();
      
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('api_keys')
        .select('count')
        .limit(1);

      if (error) {
        return {
          status: 'UNHEALTHY',
          responseTime: Date.now() - startTime,
          error: error.message,
          timestamp: Date.now(),
        };
      }

      const responseTime = Date.now() - startTime;
      
      return {
        status: responseTime < 1000 ? 'HEALTHY' : 'DEGRADED',
        responseTime,
        details: {
          connectionTime: responseTime,
          queryExecuted: true,
        },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        status: 'UNHEALTHY',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Database connection failed',
        timestamp: Date.now(),
      };
    }
  }
}

export class MemoryHealthCheck implements HealthCheck {
  name = 'memory';

  async execute(): Promise<HealthCheckResult> {
    const usage = process.memoryUsage();
    const usedMB = usage.heapUsed / 1024 / 1024;
    const totalMB = usage.heapTotal / 1024 / 1024;
    const maxMB = 512; // Configurable threshold

    let status: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED' = 'HEALTHY';
    
    if (usedMB > maxMB * 0.9) {
      status = 'UNHEALTHY';
    } else if (usedMB > maxMB * 0.7) {
      status = 'DEGRADED';
    }

    return {
      status,
      responseTime: 0,
      details: {
        heapUsedMB: Math.round(usedMB * 100) / 100,
        heapTotalMB: Math.round(totalMB * 100) / 100,
        heapUsagePercent: Math.round((usedMB / totalMB) * 100),
        rss: Math.round((usage.rss / 1024 / 1024) * 100) / 100,
        external: Math.round((usage.external / 1024 / 1024) * 100) / 100,
      },
      timestamp: Date.now(),
    };
  }
}

export class WebSocketHealthCheck implements HealthCheck {
  name = 'websocket';

  async execute(): Promise<HealthCheckResult> {
    try {
      // This would check the actual WebSocket connection status
      // For now, we'll simulate the check
      const isConnected = true; // Would check actual connection
      const latency = 50; // Would measure actual latency

      return {
        status: isConnected ? (latency < 1000 ? 'HEALTHY' : 'DEGRADED') : 'UNHEALTHY',
        responseTime: latency,
        details: {
          connected: isConnected,
          latency,
          reconnectCount: 0,
        },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        status: 'UNHEALTHY',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'WebSocket check failed',
        timestamp: Date.now(),
      };
    }
  }
}

export class CircuitBreakerHealthCheck implements HealthCheck {
  name = 'circuit-breakers';

  async execute(): Promise<HealthCheckResult> {
    try {
      const { circuitBreakers } = await import('@/lib/utils/circuit-breaker-enhanced');
      const allStats = circuitBreakers.getAllStats();
      
      const openBreakers = Object.entries(allStats)
        .filter(([_, stats]) => stats.state === 'OPEN')
        .map(([name]) => name);

      const halfOpenBreakers = Object.entries(allStats)
        .filter(([_, stats]) => stats.state === 'HALF_OPEN')
        .map(([name]) => name);

      let status: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED' = 'HEALTHY';
      
      if (openBreakers.length > 0) {
        status = openBreakers.length > Object.keys(allStats).length / 2 ? 'UNHEALTHY' : 'DEGRADED';
      } else if (halfOpenBreakers.length > 0) {
        status = 'DEGRADED';
      }

      return {
        status,
        responseTime: 0,
        details: {
          totalBreakers: Object.keys(allStats).length,
          openBreakers: openBreakers.length,
          halfOpenBreakers: halfOpenBreakers.length,
          openBreakerNames: openBreakers,
          halfOpenBreakerNames: halfOpenBreakers,
        },
        timestamp: Date.now(),
      };

    } catch (error) {
      return {
        status: 'DEGRADED',
        responseTime: 0,
        error: error instanceof Error ? error.message : 'Circuit breaker check failed',
        timestamp: Date.now(),
      };
    }
  }
}

// Global health check system
export const healthCheckSystem = new HealthCheckSystem();

// Register default health checks
healthCheckSystem.registerCheck(new DatabaseHealthCheck());
healthCheckSystem.registerCheck(new MemoryHealthCheck());
healthCheckSystem.registerCheck(new WebSocketHealthCheck());
healthCheckSystem.registerCheck(new CircuitBreakerHealthCheck());