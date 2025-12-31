#!/usr/bin/env node

// MCE Pipeline Runner Script
// Executes the complete MCE pipeline once
// Used by GitHub Actions and manual execution

import { runMCEPipeline, checkPipelineHealth } from '../lib/mce/pipeline/runOnce.js';

// Configuration from environment variables
const config = {
  symbols: (process.env.MCE_SYMBOLS || 'BTCUSDT').split(','),
  timeframes: (process.env.MCE_TIMEFRAMES || '1m,5m,15m,1h,4h').split(','),
  dataLookback: {
    hours: parseInt(process.env.MCE_LOOKBACK_HOURS || '48'),
    minKlines: parseInt(process.env.MCE_MIN_KLINES || '100'),
  },
  processing: {
    enableAntiFlip: process.env.MCE_ENABLE_ANTIFLIP !== 'false',
    maxRetries: parseInt(process.env.MCE_MAX_RETRIES || '3'),
    timeoutMs: parseInt(process.env.MCE_TIMEOUT_MS || '30000'),
  },
  output: {
    saveToDatabase: process.env.MCE_SAVE_TO_DB !== 'false',
    logResults: process.env.MCE_LOG_RESULTS !== 'false',
  },
};

// Parse command line arguments
const args = process.argv.slice(2);
const isHealthCheck = args.includes('--health');
const isVerbose = args.includes('--verbose');
const isDryRun = args.includes('--dry-run');

if (isDryRun) {
  config.output.saveToDatabase = false;
  console.log('🧪 DRY RUN MODE - No data will be saved to database');
}

async function main() {
  try {
    console.log(`🤖 MCE Pipeline Runner - ${new Date().toISOString()}`);
    
    if (isVerbose) {
      console.log('📋 Configuration:');
      console.log(JSON.stringify(config, null, 2));
    }

    // Health check mode
    if (isHealthCheck) {
      console.log('🏥 Running health checks...');
      
      const health = await checkPipelineHealth();
      
      console.log('📊 Health Check Results:');
      for (const check of health.checks) {
        const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
        const latency = check.latency ? ` (${check.latency}ms)` : '';
        console.log(`   ${icon} ${check.name}: ${check.message}${latency}`);
      }
      
      if (!health.healthy) {
        console.log('❌ Health check failed - pipeline may not function correctly');
        process.exit(1);
      } else {
        console.log('✅ All health checks passed');
        process.exit(0);
      }
    }

    // Run the pipeline
    console.log('🚀 Starting MCE pipeline execution...');
    
    const result = await runMCEPipeline(config);
    
    // Output results
    if (isVerbose || !result.success) {
      console.log('\n📈 Pipeline Results:');
      console.log(`   Duration: ${result.duration}ms`);
      console.log(`   Success Rate: ${result.summary.successCount}/${result.summary.totalProcessed}`);
      console.log(`   Avg Data Quality: ${(result.summary.avgDataQuality * 100).toFixed(1)}%`);
      console.log(`   Avg Calculation Time: ${result.summary.avgCalculationTime.toFixed(0)}ms`);
      
      if (result.errors.length > 0) {
        console.log('\n❌ Errors:');
        result.errors.forEach(error => console.log(`   - ${error}`));
      }
      
      if (isVerbose) {
        console.log('\n📋 Detailed Results:');
        for (const res of result.results) {
          const status = res.success ? '✅' : '❌';
          const regime = res.signature ? `${res.signature.trend}/${res.signature.volatility}` : 'N/A';
          const confidence = res.signature ? `${(res.signature.confidence * 100).toFixed(1)}%` : 'N/A';
          const quality = `${(res.metrics.dataQualityScore * 100).toFixed(0)}%`;
          
          console.log(`   ${status} ${res.symbol} ${res.tf}: ${regime} (conf: ${confidence}, qual: ${quality})`);
          
          if (res.error) {
            console.log(`       Error: ${res.error}`);
          }
        }
      }
    }

    // Update system health in database
    if (config.output.saveToDatabase && !isDryRun) {
      await updateSystemHealth(result);
    }

    // Exit with appropriate code
    if (result.success) {
      console.log('✅ MCE pipeline completed successfully');
      process.exit(0);
    } else {
      console.log('❌ MCE pipeline completed with errors');
      process.exit(1);
    }

  } catch (error) {
    console.error('💥 MCE pipeline failed:', error.message);
    
    if (isVerbose && error.stack) {
      console.error('Stack trace:', error.stack);
    }
    
    process.exit(1);
  }
}

// Update system health record
async function updateSystemHealth(result) {
  try {
    const { supabaseAdmin } = await import('../lib/mce/db/supabase.js');
    const sb = supabaseAdmin();
    
    const healthData = {
      timestamp: result.timestamp,
      duration: result.duration,
      success: result.success,
      summary: result.summary,
      lastRun: new Date().toISOString(),
    };
    
    await sb
      .from('system_health')
      .upsert({
        key: 'mce_pipeline_status',
        value: healthData,
      }, {
        onConflict: 'key',
      });
      
  } catch (error) {
    console.warn('⚠️ Failed to update system health:', error.message);
  }
}

// Handle process signals gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});