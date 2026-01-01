#!/usr/bin/env node

/**
 * MSF Production Pipeline Runner - Market Selection & Fit
 * 
 * CANONICAL ENTRYPOINT for MSF pipeline execution
 * Best practice: fail-closed, minimal inputs, deterministic outputs
 */

import { runMSFPipeline, analyzeMSFPerformance } from '../../lib/msf/pipeline/runOnce';
import { MSF_V15_CONFIG } from '../../lib/msf/types';
import { supabaseAdmin } from '../../lib/mce/db/supabase';
import type { UniverseActiveType } from '../../lib/ucm/schemas';

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
    service: 'msf-pipeline',
    message,
    runId: process.env.GITHUB_RUN_ID || `local-${Date.now()}`,
    ...data
  };
  
  console.log(JSON.stringify(logEntry));
}

// Check MSF system health
async function checkMSFHealth() {
  const issues: string[] = [];
  
  try {
    // Check environment variables
    if (!process.env.SUPABASE_URL) {
      issues.push('Missing SUPABASE_URL environment variable');
    }
    
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      issues.push('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    }
    
    // Check database connectivity and MSF tables
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const sb = supabaseAdmin();
        
        // Check MSF tables exist
        const [dayGateCheck, marketFitCheck] = await Promise.all([
          sb.from('msf_day_gates').select('id').limit(1),
          sb.from('msf_market_fits').select('id').limit(1)
        ]);
        
        if (dayGateCheck.error) {
          issues.push(`MSF day_gates table error: ${dayGateCheck.error.message}`);
        }
        
        if (marketFitCheck.error) {
          issues.push(`MSF market_fits table error: ${marketFitCheck.error.message}`);
        }
      }
    } catch (dbError: any) {
      issues.push(`Database connectivity error: ${dbError.message}`);
    }
    
    // Check MCE regime signature availability
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const sb = supabaseAdmin();
        const { data: regimeData, error: regimeError } = await sb
          .from('regime_signatures')
          .select('signature')
          .order('as_of', { ascending: false })
          .limit(1);
        
        if (regimeError) {
          issues.push(`MCE regime signature error: ${regimeError.message}`);
        } else if (!regimeData || regimeData.length === 0) {
          issues.push('No MCE regime signatures available');
        }
      }
    } catch (mceError: any) {
      issues.push(`MCE data check error: ${mceError.message}`);
    }
    
    // Check UCM universe availability
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const sb = supabaseAdmin();
        const { data: universeData, error: universeError } = await sb
          .from('universe_active')
          .select('as_of, symbols')
          .order('as_of', { ascending: false })
          .limit(1);
        
        if (universeError) {
          issues.push(`UCM universe error: ${universeError.message}`);
        } else if (!universeData || universeData.length === 0) {
          issues.push('No UCM universe available');
        }
      }
    } catch (ucmError: any) {
      issues.push(`UCM data check error: ${ucmError.message}`);
    }
    
  } catch (error: any) {
    issues.push(`Health check system error: ${error.message}`);
  }
  
  return {
    healthy: issues.length === 0,
    issues
  };
}

// Get latest MCE regime signature
async function getLatestRegime() {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('regime_signatures')
    .select('signature')
    .order('as_of', { ascending: false })
    .limit(1);
  
  if (error || !data || data.length === 0) {
    throw new Error('No MCE regime signature available');
  }
  
  return data[0].signature;
}

// Get latest UCM universe
async function getLatestUniverse(): Promise<UniverseActiveType> {
  const sb = supabaseAdmin();
  const { data, error } = await sb
    .from('universe_active')
    .select('as_of, version, target_count, min_count, max_count, symbols, core_included, meta, based_on, hash')
    .order('as_of', { ascending: false })
    .limit(1)
    .single();
  
  if (error || !data) {
    throw new Error('No UCM universe available');
  }
  
  return {
    v: (data.version || 'ucm.active.v1') as UniverseActiveType['v'],
    asOf: data.as_of,
    target: data.target_count,
    min: data.min_count,
    max: data.max_count,
    symbols: data.symbols || [],
    coreIncluded: data.core_included,
    meta: data.meta,
    basedOn: data.based_on,
    hash: data.hash,
  };
}

async function runProductionPipeline() {
  const startTime = Date.now();
  
  try {
    logProduction('INFO', 'Starting MSF production pipeline', {
      nodeVersion: process.version,
      platform: process.platform,
      config: {
        minRegimeConfidence: MSF_V15_CONFIG.minRegimeConfidence,
        minDataQuality: MSF_V15_CONFIG.minDataQuality,
        failClosed: MSF_V15_CONFIG.failClosed,
      }
    });

    // Health check mode
    if (isHealthCheck) {
      logProduction('INFO', 'Running MSF health checks');
      
      try {
        const healthResult = await checkMSFHealth();
        
        logProduction('INFO', 'MSF health check completed', { health: healthResult });
        
        if (!healthResult.healthy) {
          logProduction('ERROR', 'MSF health check failed', { 
            issues: healthResult.issues 
          });
          process.exit(1);
        }
        
        logProduction('INFO', 'All MSF health checks passed');
        process.exit(0);
        
      } catch (error: any) {
        logProduction('ERROR', 'MSF health check system failure', { 
          error: error.message,
          stack: error.stack 
        });
        process.exit(1);
      }
    }

    // Get required inputs
    logProduction('INFO', 'Fetching MSF inputs (MCE regime + UCM universe)');
    
    const [regime, universe] = await Promise.all([
      getLatestRegime(),
      getLatestUniverse()
    ]);
    
    logProduction('INFO', 'MSF inputs fetched', {
      regime: {
        trend: regime.trend,
        volatility: regime.volatility,
        confidence: regime.confidence,
        asOf: regime.asOf,
      },
      universe: {
        symbols: universe.symbols.length,
        asOf: universe.asOf,
      }
    });

    // Run the MSF pipeline
    logProduction('INFO', 'Executing MSF pipeline');
    
    const result = await runMSFPipeline({
      regime,
      universe,
      config: MSF_V15_CONFIG,
      useEnhancedSnapshots: true,    // Use orderbook data for accurate spreads
      saveSnapshots: !isHealthCheck, // Save snapshots unless health check
    });
    
    const duration = Date.now() - startTime;
    
    // Log results with structured data
    logProduction('INFO', 'MSF pipeline completed', {
      success: result.success,
      duration,
      dayGate: {
        tradableDay: result.dayGate.tradableDay,
        countA: result.dayGate.countA,
        countB: result.dayGate.countB,
        reasons: result.dayGate.reasons,
      },
      kpis: result.kpis,
      errorCount: result.errors.length,
      warningCount: result.warnings.length
    });
    
    if (isVerbose || result.errors.length > 0) {
      logProduction('INFO', 'MSF pipeline detailed results', {
        marketFits: {
          total: result.marketFits.length,
          byClass: {
            A: result.marketFits.filter(f => f.fitClass === 'A').length,
            B: result.marketFits.filter(f => f.fitClass === 'B').length,
            C: result.marketFits.filter(f => f.fitClass === 'C').length,
            NO_TRADE: result.marketFits.filter(f => f.fitClass === 'NO_TRADE').length,
          },
          avgFriction: result.marketFits.reduce((sum, f) => sum + f.frictionScore, 0) / result.marketFits.length,
          avgDataQuality: result.marketFits.reduce((sum, f) => sum + f.dataQuality, 0) / result.marketFits.length,
        }
      });
    }
    
    if (result.errors.length > 0) {
      logProduction('WARN', 'MSF pipeline completed with errors', {
        errors: result.errors
      });
    }
    
    // Analyze performance if verbose
    if (isVerbose) {
      try {
        const performance = await analyzeMSFPerformance(7);
        logProduction('INFO', 'MSF performance analysis', {
          dayGateAnalysis: performance.dayGateAnalysis,
          fitClassAnalysis: performance.fitClassAnalysis,
        });
      } catch (perfError: any) {
        logProduction('WARN', 'Failed to analyze MSF performance', {
          error: perfError.message
        });
      }
    }
    
    // Update system health
    await updateSystemHealth(result, duration);
    
    // Exit with appropriate code
    if (result.success) {
      logProduction('INFO', 'MSF pipeline successful');
      process.exit(0);
    } else {
      logProduction('ERROR', 'MSF pipeline failed');
      process.exit(1);
    }

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    logProduction('ERROR', 'MSF pipeline fatal error', {
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
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logProduction('WARN', 'Cannot update system health - missing Supabase credentials');
      return;
    }
    
    const healthData = {
      timestamp: result.timestamp,
      duration,
      success: result.success,
      dayGate: {
        tradableDay: result.dayGate.tradableDay,
        countA: result.dayGate.countA,
        countB: result.dayGate.countB,
      },
      kpis: result.kpis,
      lastRun: new Date().toISOString(),
      version: 'msf-pipeline-v1.0.0'
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
        key: 'msf_pipeline_status',
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
