#!/usr/bin/env node

/**
 * UCM Production Pipeline Runner
 * 
 * CANONICAL ENTRYPOINT for UCM pipeline execution
 * Used by: GitHub Actions, cron jobs, manual production runs
 * 
 * This is the ONLY script that should be used for production UCM execution.
 * All other UCM scripts are for development/testing only.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Production configuration
const PRODUCTION_CONFIG = {
  universe: {
    target: 20,
    min: 12,
    max: 25,
    coreSymbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT']
  },
  eligibility: {
    minVolume24h: 50000000, // $50M
    maxSpreadBps: 25,
    minCompleteness: 0.99,
    maxGaps: 0,
    minATR: 0.0005
  },
  hysteresis: {
    historyMinutes: 30,
    enterThreshold: 0.8,
    exitThreshold: 0.6
  },
  processing: {
    maxRetries: 3,
    timeoutMs: 60000,
    enableLocking: true
  },
  monitoring: {
    enableHealthCheck: true,
    enableMetrics: true,
    enableAlerts: true,
  }
};

// Parse command line arguments
const args = process.argv.slice(2);
const isHealthCheck = args.includes('--health');
const isVerbose = args.includes('--verbose');
const isDryRun = args.includes('--dry-run');

if (isDryRun) {
  console.log('❌ DRY RUN not allowed in production pipeline');
  console.log('💡 Use scripts/dev/ucm-simulate.mjs for testing');
  process.exit(1);
}

// Production logging
function logProduction(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: 'ucm-pipeline',
    message,
    runId: process.env.GITHUB_RUN_ID || `local-${Date.now()}`,
    ...data
  };
  
  console.log(JSON.stringify(logEntry));
}

async function runProductionPipeline() {
  const startTime = Date.now();
  
  try {
    logProduction('INFO', 'Starting UCM production pipeline', {
      config: PRODUCTION_CONFIG,
      nodeVersion: process.version,
      platform: process.platform
    });

    // Health check mode
    if (isHealthCheck) {
      logProduction('INFO', 'Running UCM health checks');
      
      try {
        // Check if pipeline is healthy
        const healthResult = await checkUCMHealth();
        
        logProduction('INFO', 'UCM health check completed', { health: healthResult });
        
        if (!healthResult.healthy) {
          logProduction('ERROR', 'UCM health check failed', { 
            issues: healthResult.issues 
          });
          process.exit(1);
        }
        
        logProduction('INFO', 'All UCM health checks passed');
        process.exit(0);
        
      } catch (error) {
        logProduction('ERROR', 'UCM health check system failure', { 
          error: error.message,
          stack: error.stack 
        });
        process.exit(1);
      }
    }

    // Run the actual pipeline with distributed locking
    logProduction('INFO', 'Acquiring distributed lock for UCM pipeline');
    
    let runUCMPipeline, withLock;
    
    try {
      // Try JavaScript first
      const pipelineModule = await import('../../lib/ucm/pipeline/runOnce.js');
      const lockModule = await import('../../lib/utils/distributed-lock.js');
      
      runUCMPipeline = pipelineModule.runUCMPipeline;
      withLock = lockModule.withLock;
    } catch (jsError) {
      logProduction('ERROR', 'Cannot load UCM pipeline modules', {
        jsError: jsError.message,
        suggestion: 'Ensure TypeScript files are compiled to JavaScript'
      });
      throw new Error('UCM pipeline modules not available');
    }
    
    // Execute pipeline with distributed lock
    const result = await withLock('ucm_pipeline', async () => {
      logProduction('INFO', 'Lock acquired, executing UCM pipeline');
      return await runUCMPipeline(PRODUCTION_CONFIG);
    });
    
    const duration = Date.now() - startTime;
    
    // Log results with structured data
    logProduction('INFO', 'UCM pipeline completed', {
      success: result.success,
      duration,
      universeSize: result.universeActive?.symbols?.length || 0,
      turnoverCount: result.turnover?.added?.length + result.turnover?.removed?.length || 0,
      eligibilityCount: result.eligibilityCount || 0,
      errorCount: result.errors?.length || 0
    });
    
    if (result.errors && result.errors.length > 0) {
      logProduction('WARN', 'Pipeline completed with errors', {
        errors: result.errors
      });
    }
    
    // Update system health
    await updateSystemHealth(result, duration);
    
    // Validate KPIs
    await validateKPIs(result);
    
    // Exit with appropriate code
    if (result.success) {
      logProduction('INFO', 'UCM pipeline successful');
      process.exit(0);
    } else {
      logProduction('ERROR', 'UCM pipeline failed');
      process.exit(1);
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logProduction('ERROR', 'UCM pipeline fatal error', {
      error: error.message,
      stack: error.stack,
      duration
    });
    
    process.exit(1);
  }
}

// Check UCM system health
async function checkUCMHealth() {
  const issues = [];
  
  try {
    // Check environment variables
    if (!process.env.SUPABASE_URL) {
      issues.push('Missing SUPABASE_URL environment variable');
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      issues.push('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }
    
    // Check basic database connectivity (without importing modules)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        // Test universe_pool table
        const poolResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/universe_pool?select=id&limit=1`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        });
        
        if (!poolResponse.ok) {
          issues.push(`Database universe_pool error: HTTP ${poolResponse.status}`);
        }
        
        // Test universe_active table
        const activeResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/universe_active?select=id&limit=1`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        });
        
        if (!activeResponse.ok) {
          issues.push(`Database universe_active error: HTTP ${activeResponse.status}`);
        }
        
        // Check pipeline freshness (should be < 15 minutes)
        const freshnessResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/universe_active?select=as_of,created_at&order=created_at.desc&limit=1`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        });
        
        if (freshnessResponse.ok) {
          const lastRuns = await freshnessResponse.json();
          if (lastRuns && lastRuns.length > 0) {
            const lastRunTime = new Date(lastRuns[0].created_at);
            const timeSinceLastRun = Date.now() - lastRunTime.getTime();
            const maxAge = 15 * 60 * 1000; // 15 minutes
            
            if (timeSinceLastRun > maxAge) {
              issues.push(`Pipeline data is stale: ${Math.round(timeSinceLastRun / 1000 / 60)} minutes old`);
            }
          }
        }
        
      } catch (dbError) {
        issues.push(`Database connectivity error: ${dbError.message}`);
      }
    }
    
    // Check Binance API connectivity
    try {
      const response = await fetch('https://api.binance.com/api/v3/ping', {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        issues.push(`Binance API error: HTTP ${response.status}`);
      }
    } catch (apiError) {
      issues.push(`Binance API connectivity error: ${apiError.message}`);
    }
    
  } catch (error) {
    issues.push(`Health check system error: ${error.message}`);
  }
  
  return {
    healthy: issues.length === 0,
    issues
  };
}

// Update system health record
async function updateSystemHealth(result, duration) {
  try {
    // Simple fetch-based update without importing modules
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logProduction('WARN', 'Cannot update system health - missing Supabase credentials');
      return;
    }
    
    const healthData = {
      timestamp: Date.now(),
      duration,
      success: result.success,
      universeSize: result.universeActive?.symbols?.length || 0,
      turnoverRate: (result.turnover?.added?.length + result.turnover?.removed?.length) / (result.universeActive?.symbols?.length || 1),
      eligibilityCount: result.eligibilityCount || 0,
      lastRun: new Date().toISOString(),
      version: 'ucm-pipeline-v1.0.0'
    };
    
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/system_health`, {
      method: 'POST',
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        key: 'ucm_pipeline_status',
        value: healthData,
        updated_at: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      logProduction('INFO', 'System health updated');
    } else {
      logProduction('WARN', 'Failed to update system health', { 
        status: response.status,
        statusText: response.statusText
      });
    }
      
  } catch (error) {
    logProduction('WARN', 'Failed to update system health', { 
      error: error.message 
    });
  }
}

// Validate KPIs for operational readiness
async function validateKPIs(result) {
  const kpis = {
    universeSize: result.universeActive?.symbols?.length || 0,
    turnoverRate: (result.turnover?.added?.length + result.turnover?.removed?.length) / (result.universeActive?.symbols?.length || 1),
    eligibilitySuccess: result.eligibilityCount > 0,
    coreIncluded: result.universeActive?.coreIncluded || false
  };
  
  const violations = [];
  
  // KPI thresholds
  if (kpis.universeSize < PRODUCTION_CONFIG.universe.min) {
    violations.push(`Universe size too small: ${kpis.universeSize} < ${PRODUCTION_CONFIG.universe.min}`);
  }
  
  if (kpis.universeSize > PRODUCTION_CONFIG.universe.max) {
    violations.push(`Universe size too large: ${kpis.universeSize} > ${PRODUCTION_CONFIG.universe.max}`);
  }
  
  if (kpis.turnoverRate > 0.5) {
    violations.push(`Turnover rate too high: ${(kpis.turnoverRate * 100).toFixed(1)}% > 50%`);
  }
  
  if (!kpis.eligibilitySuccess) {
    violations.push('No eligible symbols found');
  }
  
  if (!kpis.coreIncluded) {
    violations.push('Core symbols not included in universe');
  }
  
  logProduction('INFO', 'KPI validation completed', {
    kpis,
    violations,
    passed: violations.length === 0
  });
  
  if (violations.length > 0) {
    logProduction('WARN', 'KPI violations detected', { violations });
  }
}

// Handle process signals gracefully
process.on('SIGINT', () => {
  logProduction('INFO', 'Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logProduction('INFO', 'Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logProduction('ERROR', 'Unhandled rejection', {
    reason: reason?.toString(),
    promise: promise?.toString()
  });
  process.exit(1);
});

// Run the main function
runProductionPipeline().catch(error => {
  logProduction('ERROR', 'Fatal error in main', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});