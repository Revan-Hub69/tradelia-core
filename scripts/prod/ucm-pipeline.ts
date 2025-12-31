#!/usr/bin/env node

/**
 * UCM Production Pipeline Runner - Complete Implementation
 * 
 * CANONICAL ENTRYPOINT for UCM pipeline execution
 * Used by: GitHub Actions, cron jobs, manual production runs
 */

import { runUCMPipeline, analyzePipelineResult, formatPipelineReport } from '../../lib/ucm/pipeline/runOnce';

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
    service: 'ucm-pipeline',
    message,
    runId: process.env.GITHUB_RUN_ID || `local-${Date.now()}`,
    ...data
  };
  
  console.log(JSON.stringify(logEntry));
}

// Check UCM system health
async function checkUCMHealth() {
  const issues: string[] = [];
  
  try {
    // Check environment variables
    if (!process.env.SUPABASE_URL) {
      issues.push('Missing SUPABASE_URL environment variable');
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      issues.push('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }
    
    // Check Binance API connectivity
    try {
      const response = await fetch('https://api.binance.com/api/v3/ping', {
        signal: AbortSignal.timeout(5000)
      });
      
      if (!response.ok) {
        issues.push(`Binance API error: HTTP ${response.status}`);
      }
    } catch (apiError: any) {
      issues.push(`Binance API connectivity error: ${apiError.message}`);
    }
    
    // Check Supabase database connectivity
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/system_health?select=key&limit=1`, {
          headers: {
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          issues.push(`Supabase database error: HTTP ${response.status}`);
        }
      }
    } catch (dbError: any) {
      issues.push(`Database connectivity error: ${dbError.message}`);
    }
    
  } catch (error: any) {
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
    logProduction('INFO', 'Starting UCM production pipeline', {
      nodeVersion: process.version,
      platform: process.platform
    });

    // Health check mode
    if (isHealthCheck) {
      logProduction('INFO', 'Running UCM health checks');
      
      try {
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
        
      } catch (error: any) {
        logProduction('ERROR', 'UCM health check system failure', { 
          error: error.message,
          stack: error.stack 
        });
        process.exit(1);
      }
    }

    // Run the complete UCM pipeline
    logProduction('INFO', 'Executing UCM pipeline');
    
    const result = await runUCMPipeline();
    
    const duration = Date.now() - startTime;
    
    // Analyze pipeline performance
    const analysis = analyzePipelineResult(result);
    
    // Log results with structured data
    logProduction('INFO', 'UCM pipeline completed', {
      success: result.success,
      duration,
      performance: analysis.performance,
      kpis: analysis.kpis,
      errorCount: result.errors.length,
      warningCount: result.warnings.length
    });
    
    if (isVerbose || result.errors.length > 0 || analysis.performance !== 'excellent') {
      logProduction('INFO', 'UCM pipeline detailed results', {
        universeActive: result.universeActive ? {
          symbols: result.universeActive.symbols,
          asOf: result.universeActive.asOf
        } : null,
        changes: result.stats.changes,
        stats: {
          collection: result.stats.collection,
          generation: result.stats.generation,
          health: result.stats.health
        },
        analysis: {
          performance: analysis.performance,
          issues: analysis.issues,
          recommendations: analysis.recommendations
        }
      });
    }
    
    // Log formatted report for human readability
    if (isVerbose) {
      const report = formatPipelineReport(result);
      console.log('\n' + report + '\n');
    }
    
    if (result.errors.length > 0) {
      logProduction('WARN', 'UCM pipeline completed with errors', {
        errors: result.errors
      });
    }
    
    if (analysis.issues.length > 0) {
      logProduction('WARN', 'UCM pipeline performance issues detected', {
        issues: analysis.issues,
        recommendations: analysis.recommendations
      });
    }
    
    // Update system health
    await updateSystemHealth(result, analysis, duration);
    
    // Exit with appropriate code based on success and performance
    if (result.success && analysis.performance !== 'poor') {
      logProduction('INFO', 'UCM pipeline successful');
      process.exit(0);
    } else if (result.success) {
      logProduction('WARN', 'UCM pipeline completed with performance issues');
      process.exit(0); // Still successful, just with warnings
    } else {
      logProduction('ERROR', 'UCM pipeline failed');
      process.exit(1);
    }

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    logProduction('ERROR', 'UCM pipeline fatal error', {
      error: error.message,
      stack: error.stack,
      duration
    });
    
    process.exit(1);
  }
}

// Update system health record
async function updateSystemHealth(result: any, analysis: any, duration: number) {
  try {
    // Simple fetch-based update without importing modules
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logProduction('WARN', 'Cannot update system health - missing Supabase credentials');
      return;
    }
    
    const healthData = {
      timestamp: result.stats.execution.startTime,
      duration,
      success: result.success,
      performance: analysis.performance,
      kpis: analysis.kpis,
      universeSize: result.universeActive?.symbols.length || 0,
      changes: result.stats.changes,
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