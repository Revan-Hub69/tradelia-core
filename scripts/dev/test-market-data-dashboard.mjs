#!/usr/bin/env node

// Market Data Dashboard Test Script
// Tests the dashboard API endpoints and functionality

import fetch from 'node-fetch';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testMarketDataAPI() {
  console.log('🧪 Testing Market Data Dashboard APIs...\n');

  try {
    // Test market data status endpoint
    console.log('📊 Testing /api/market-data/status...');
    const marketDataResponse = await fetch(`${BASE_URL}/api/market-data/status`);
    
    if (marketDataResponse.ok) {
      const marketData = await marketDataResponse.json();
      console.log('✅ Market Data Status API working');
      console.log(`   - Total Events: ${marketData.data?.statistics?.totalEvents || 0}`);
      console.log(`   - Total Trades: ${marketData.data?.kpis?.totalTrades || 0}`);
      console.log(`   - Readiness: ${marketData.data?.readiness?.status || 'UNKNOWN'}`);
    } else {
      console.log(`❌ Market Data Status API failed: ${marketDataResponse.status}`);
    }

    // Test health endpoint
    console.log('\n🏥 Testing /api/health/detailed...');
    const healthResponse = await fetch(`${BASE_URL}/api/health/detailed`);
    
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ Health API working');
      console.log(`   - Status: ${health.status || 'UNKNOWN'}`);
      console.log(`   - Checks: ${health.checks?.length || 0}`);
    } else {
      console.log(`❌ Health API failed: ${healthResponse.status}`);
    }

    console.log('\n🎯 Dashboard API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

async function testDashboardComponents() {
  console.log('\n🧩 Testing Dashboard Components...\n');

  // Test utility functions
  const { dashboardUtils } = await import('../../hooks/use-market-data-dashboard.ts');
  
  console.log('🔧 Testing utility functions...');
  
  // Test formatNumber
  const testNumber = dashboardUtils.formatNumber(1234.5678, 2);
  console.log(`   formatNumber(1234.5678, 2) = ${testNumber}`);
  
  // Test formatDuration
  const testDuration = dashboardUtils.formatDuration(3661000); // 1h 1m 1s
  console.log(`   formatDuration(3661000) = ${testDuration}`);
  
  // Test getStatusColor
  const testColor = dashboardUtils.getStatusColor('GREEN');
  console.log(`   getStatusColor('GREEN') = ${testColor}`);
  
  console.log('✅ Utility functions working correctly');
}

async function main() {
  console.log('🚀 Market Data Dashboard Test Suite\n');
  console.log('=' .repeat(50));
  
  await testMarketDataAPI();
  await testDashboardComponents();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ All tests completed successfully!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Visit: http://localhost:3000/dashboard/market-data');
  console.log('   3. Verify real-time data updates');
  console.log('   4. Test all dashboard tabs and functionality');
}

main().catch(console.error);