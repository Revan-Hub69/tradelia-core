#!/usr/bin/env node

// Phase 1 Readiness Verification
// Comprehensive check of all components before operational demo

import { promises as fs } from 'fs';
import { supabaseAdmin } from '../../lib/mce/db/supabase.ts';

async function verifyDatabaseSchema() {
  console.log('🗄️  Verifying Database Schema...');
  
  try {
    const supabase = supabaseAdmin();
    
    // Check required tables
    const requiredTables = [
      'market_data_runs',
      'market_data_events', 
      'market_data_candles',
      'paper_trades',
      'setup_events',
      'setup_detections'
    ];
    
    for (const table of requiredTables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
        
      if (error) {
        console.log(`❌ Table ${table}: ${error.message}`);
        return false;
      } else {
        console.log(`✅ Table ${table}: OK`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database verification failed:', error);
    return false;
  }
}

async function verifyFileStructure() {
  console.log('\n📁 Verifying File Structure...');
  
  const requiredFiles = [
    // Market Data Engine
    'lib/market-data/engine.js',
    'lib/market-data/adapter.js', 
    'lib/market-data/aggregator.js',
    'lib/market-data/event-log.js',
    'lib/market-data/paper-oms.js',
    'lib/market-data/types.js',
    
    // Setup Engine
    'lib/setup/engine/index.js',
    'lib/setup/engine/detector.js',
    'lib/setup/engine/validator.js',
    'lib/setup/engine/breakout-rules.js',
    'lib/setup/logger.js',
    'lib/setup/types.js',
    
    // API Routes
    'app/api/market-data/status/route.ts',
    'app/api/setup/current/route.ts',
    'app/api/health/detailed/route.ts',
    
    // Dashboard
    'app/dashboard/market-data/page.tsx',
    'hooks/use-market-data-dashboard.ts',
    'components/dashboard/market-data/StatusCard.tsx',
    'components/dashboard/market-data/KPIGrid.tsx',
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    try {
      await fs.access(file);
      console.log(`✅ ${file}`);
    } catch (error) {
      console.log(`❌ ${file}: NOT FOUND`);
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

async function verifyEnvironmentConfig() {
  console.log('\n🔧 Verifying Environment Configuration...');
  
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  let allConfigured = true;
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: CONFIGURED`);
    } else {
      console.log(`❌ ${envVar}: MISSING`);
      allConfigured = false;
    }
  }
  
  return allConfigured;
}

async function verifyAPIEndpoints() {
  console.log('\n🔌 Verifying API Endpoints...');
  
  const endpoints = [
    '/api/health',
    '/api/health/detailed',
    '/api/market-data/status',
    '/api/setup/current',
    '/api/setup/kpis'
  ];
  
  let allWorking = true;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`);
      if (response.ok) {
        console.log(`✅ ${endpoint}: OK (${response.status})`);
      } else {
        console.log(`⚠️  ${endpoint}: ${response.status}`);
        if (response.status !== 401) { // 401 is expected for protected endpoints
          allWorking = false;
        }
      }
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
      allWorking = false;
    }
  }
  
  return allWorking;
}

async function verifyDashboardComponents() {
  console.log('\n🖥️  Verifying Dashboard Components...');
  
  try {
    // Test hook import
    const { useMarketDataDashboard, dashboardUtils } = await import('../../hooks/use-market-data-dashboard.ts');
    console.log('✅ Dashboard hook: IMPORTABLE');
    
    // Test utility functions
    const testNumber = dashboardUtils.formatNumber(1234.56, 2);
    const testDuration = dashboardUtils.formatDuration(3600000);
    const testColor = dashboardUtils.getStatusColor('GREEN');
    
    console.log('✅ Utility functions: WORKING');
    console.log(`   - formatNumber: ${testNumber}`);
    console.log(`   - formatDuration: ${testDuration}`);
    console.log(`   - getStatusColor: ${testColor}`);
    
    return true;
  } catch (error) {
    console.error('❌ Dashboard components verification failed:', error);
    return false;
  }
}

async function generateReadinessReport() {
  console.log('\n📊 PHASE 1 READINESS REPORT');
  console.log('=' .repeat(50));
  
  const checks = [
    { name: 'Database Schema', test: verifyDatabaseSchema },
    { name: 'File Structure', test: verifyFileStructure },
    { name: 'Environment Config', test: verifyEnvironmentConfig },
    { name: 'API Endpoints', test: verifyAPIEndpoints },
    { name: 'Dashboard Components', test: verifyDashboardComponents }
  ];
  
  const results = [];
  
  for (const check of checks) {
    const result = await check.test();
    results.push({ name: check.name, passed: result });
  }
  
  console.log('\n📋 SUMMARY:');
  let allPassed = true;
  
  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status} - ${result.name}`);
    if (!result.passed) allPassed = false;
  }
  
  console.log('\n' + '=' .repeat(50));
  
  if (allPassed) {
    console.log('🎉 PHASE 1 SYSTEM IS READY FOR OPERATIONAL DEMO!');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Start development server: npm run dev');
    console.log('   2. Run operational demo: node scripts/dev/start-operational-demo.mjs');
    console.log('   3. Open dashboard: http://localhost:3000/dashboard/market-data');
    console.log('   4. Monitor real-time data flow');
    console.log('\n🎯 The complete operational loop will be active:');
    console.log('   📊 Binance real-time data');
    console.log('   🔄 Event processing & aggregation');
    console.log('   🎯 Setup detection engine');
    console.log('   💰 Paper trading execution');
    console.log('   📈 KPI calculation & tracking');
    console.log('   🖥️  Professional dashboard monitoring');
  } else {
    console.log('❌ SYSTEM NOT READY - Please fix the failing checks above');
    console.log('\n🔧 Common fixes:');
    console.log('   - Run database migrations: npm run db:migrate');
    console.log('   - Check .env.local configuration');
    console.log('   - Ensure development server is running');
    console.log('   - Verify all dependencies are installed');
  }
  
  return allPassed;
}

// Main execution
async function main() {
  console.log('🔍 PHASE 1 READINESS VERIFICATION');
  console.log('Checking all components for operational demo\n');
  
  const isReady = await generateReadinessReport();
  
  if (!isReady) {
    process.exit(1);
  }
}

main().catch(console.error);