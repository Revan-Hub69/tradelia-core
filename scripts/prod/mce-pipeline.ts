#!/usr/bin/env node

/**
 * MCE Production Pipeline Runner - Complete Implementation
 * 
 * CANONICAL ENTRYPOINT for MCE pipeline execution
 * Used by: GitHub Actions, cron jobs, manual production runs
 */

import { runMCEPipeline, checkPipelineHealth, type PipelineConfig } from '../../lib/mce/pipeline/runOnce';

// Production configuration
const PRODUCTION_CONFIG: PipelineConfig = {
  symbols: ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT'],
  timeframes: ['1m', '5m', '15m', '1h', '4h'],
  dataLookback: {
    hours: 400,
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
};

// Parse command line arguments
const args = process.argv.slice(2);
const isHealthCheck = args.includes('--health');
const isVerbose = args.includes('--verbose');

// Production logging
function logProduction(level: string, message: string, data: any = {}) {
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
      logProduction('INFO', 'Running MCE health checks');
      
      try {
        const health = await checkPipelineHealth();
        
        logProduction('INFO', 'MCE health check completed', { health });
        
        if (!health.healthy) {
          logProduction('ERROR', 'MCE health check failed', { 
            failedChecks: health.checks.filter(c => c.status !== 'pass') 
          });
          process.exit(1);
        }
        
        logProduction('INFO', 'All MCE health checks passed');
        process.exit(0);
        
      } catch (error: any) {
        logProduction('ERROR', 'MCE health check system failure', { 
          error: error.message,
          stack: error.stack 
        });
        process.exit(1);
      }
    }

    // Run the complete MCE pipeline
    logProduction('INFO', 'Executing MCE pipeline');
    
    const result = await runMCEPipeline(PRODUCTION_CONFIG);
    
    const duration = Date.now() - startTime;
    
    // Log results with structured data
    logProduction('INFO', 'MCE pipeline completed', {
      success: result.success,
      duration,
      summary: result.summary,
      errorCount: result.errors.length
    });
    
    if (isVerbose || result.errors.length > 0) {
      logProduction('INFO', 'MCE pipeline detailed results', {
        results: result.results.map(r => ({
          symbol: r.symbol,
          tf: r.tf,
          success: r.success,
          regime: r.signature ? `${r.signature.trend}/${r.signature.volatility}` : 'N/A',
          confidence: r.signature ? `${(r.signature.confidence * 100).toFixed(1)}%` : 'N/A',
          quality: `${(r.metrics.dataQualityScore * 100).toFixed(0)}%`,
          error: r.error || undefined
        }))
      });
    }
    
    if (result.errors.length > 0) {
      logProduction('WARN', 'MCE pipeline completed with errors', {
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

  } catch (error: any) {
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
async function updateSystemHealth(result: any, duration: number) {
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
      
  } catch (error: any) {
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
runProductionPipeline().catch((error: any) => {
  logProduction('ERROR', 'Fatal error in main', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});
