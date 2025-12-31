#!/usr/bin/env node

// Simple Trading Dashboard Test
// Just checks if the dashboard is accessible

import fetch from 'node-fetch';

const DASHBOARD_URL = 'http://localhost:3001/dashboard/trading';

async function testDashboardAccess() {
  console.log('🎯 SIMPLE TRADING DASHBOARD TEST');
  console.log('=' .repeat(40));

  try {
    console.log('📊 Testing dashboard page access...');
    const response = await fetch(DASHBOARD_URL, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      console.log('✅ Trading dashboard is accessible');
      console.log(`   - Status: ${response.status}`);
      console.log(`   - URL: ${DASHBOARD_URL}`);
      
      const html = await response.text();
      if (html.includes('Trading Dashboard')) {
        console.log('✅ Dashboard content loaded correctly');
      } else {
        console.log('⚠️  Dashboard content may not be fully loaded');
      }
    } else {
      console.log(`❌ Dashboard access failed: ${response.status}`);
    }

    console.log('\n🎉 DASHBOARD TEST COMPLETE!');
    console.log('\nNext steps:');
    console.log('   1. Open browser to: http://localhost:3001/dashboard/trading');
    console.log('   2. Verify the three tabs are working');
    console.log('   3. Check that the operational flow is clear');

  } catch (error) {
    console.error('❌ Dashboard test failed:', error.message);
  }
}

testDashboardAccess();