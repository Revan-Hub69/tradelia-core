#!/usr/bin/env node

/**
 * MCE Production Pipeline Runner
 * 
 * CANONICAL ENTRYPOINT for MCE pipeline execution
 * Used by: GitHub Actions, cron jobs, manual production runs
 * 
 * This is the ONLY script that should be used for production MCE execution.
 * All other MCE scripts are for development/testing only.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Production configuration
const PRODUCTION_CONFIG = {
  symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT'],
  timeframes: ['1m', '5m', '15m', '1h', '4h'],
  dataLookback: {
    hours: 48,
    minKlines: 100,
  },
  processing: {
    enableAntiFlip: true,
    maxRetries: 3,
    timeoutMs: 30000,
  },
  output: {
    saveToDatabase: true,
    logResults: true,
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
  console.log('💡 Use scripts/dev/mce-simulate.mjs for testing');
  process.exit(1);
}

// Production logging
function logProduction(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    service: 'mce-pipeline',
    message,
    ...data
  };
  
  console.log(JSON.stringify(logEntry));
}

// Basic health check without TypeScript dependencies
async function checkBasicHealth() {
  const issues = [];
  
  try {
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
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/universe_pool?select=id&limit=1`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
          },
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          issues.push(`Database connectivity error: HTTP ${response.status}`);
        }
      } catch (dbError) {
        issues.push(`Database connectivity error: ${dbError.message}`);
      }
    }
    
  } catch (error) {
    issues.push(`Health check system error: ${error.message}`);
  }
  
  return {
    healthy: issues.length === 0,
    issues
  };
}

async function runProductionPipeline() {
  const startTime = Date.now();
  
  try {
    logProduction('INFO', 'Starting MCE production pipeline', {
      config: PRODUCTION_CONFIG,
      nodeVersion: process.version,
      platform: process.platform
    });

    // Health check mode
    if (isHealthCheck) {
      logProduction('INFO', 'Running health checks');
      
      try {
        // Simple health check without importing pipeline modules
        const healthResult = await checkBasicHealth();
        
        logProduction('INFO', 'Health check completed', { health: healthResult });
        
        if (!healthResult.healthy) {
          logProduction('ERROR', 'Health check failed', { 
            issues: healthResult.issues 
          });
          process.exit(1);
        }
        
        logProduction('INFO', 'All health checks passed');
        process.exit(0);
        
      } catch (error) {
        logProduction('ERROR', 'Health check system failure', { 
          error: error.message,
          stack: error.stack 
        });
        process.exit(1);
      }
    }

    // Run the actual pipeline
    logProduction('INFO', 'Executing MCE pipeline');
    
    let runMCEPipeline;
    
    try {
      // Try JavaScript first
      const module = await import('../../lib/mce/pipeline/runOnce.js');
      runMCEPipeline = module.runMCEPipeline;
    } catch (jsError) {
      logProduction('ERROR', 'Cannot load MCE pipeline module', {
        jsError: jsError.message,
        suggestion: 'Ensure TypeScript files are compiled to JavaScript'
      });
      throw new Error('MCE pipeline module not available');
    }
    
    const result = await runMCEPipeline(PRODUCTION_CONFIG);
    
    const duration = Date.now() - startTime;
    
    // Log results
    logProduction('INFO', 'MCE pipeline completed', {
      success: result.success,
      duration,
      summary: result.summary,
      errorCount: result.errors.length
    });
    
    if (result.errors.length > 0) {
      logProduction('WARN', 'Pipeline completed with errors', {
        errors: result.errors
      });
    }
    
    // Update system health
    await updateSystemHealth(result, duration);
    
    // Exit with appropriate code
    if (result.success) {
      logProduction('INFO', 'MCE pipeline successful');
      process.exit(0);
    } else {
      logProduction('ERROR', 'MCE pipeline failed');
      process.exit(1);
    }

  } catch (error) {
    const duration = Date.now() - startTime;
    
    logProduction('ERROR', 'MCE pipeline fatal error', {
      error: error.message,
      stack: error.stack,
      duration
    });
    
    process.exit(1);
  }
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
      timestamp: result.timestamp,
      duration,
      success: result.success,
      summary: result.summary,
      lastRun: new Date().toISOString(),
      version: 'mce-pipeline-v1.0.0'
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
        key: 'mce_pipeline_status',
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