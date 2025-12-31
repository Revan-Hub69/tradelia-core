#!/usr/bin/env tsx

// Test API endpoints to verify the system is operational
async function testAPIEndpoints() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Setup Engine API endpoints...\n');
  
  try {
    // Test current setups endpoint
    console.log('📊 Testing /api/setup/current...');
    const currentResponse = await fetch(`${baseUrl}/api/setup/current`);
    
    if (currentResponse.ok) {
      const currentData = await currentResponse.json();
      console.log('✅ Current setups API working');
      console.log(`   Active setups: ${currentData.data.activeSetups.length}`);
      console.log(`   Engine stats: ${currentData.data.stats.activeSetups}/${currentData.data.stats.maxConcurrentSetups}`);
      console.log(`   Total risk: $${currentData.data.stats.totalRisk}`);
    } else {
      console.log(`❌ Current setups API failed: ${currentResponse.status}`);
    }
    
    // Test KPIs endpoint
    console.log('\n📈 Testing /api/setup/kpis...');
    const kpisResponse = await fetch(`${baseUrl}/api/setup/kpis`);
    
    if (kpisResponse.ok) {
      const kpisData = await kpisResponse.json();
      console.log('✅ KPIs API working');
      console.log(`   Total setups: ${kpisData.data.totalSetups}`);
      console.log(`   Win rate: ${(kpisData.data.winRate * 100).toFixed(1)}%`);
      console.log(`   Expectancy: ${kpisData.data.expectancy.toFixed(2)}`);
    } else {
      console.log(`❌ KPIs API failed: ${kpisResponse.status}`);
    }
    
    console.log('\n✅ API endpoint tests completed');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.log('\n💡 Make sure the Next.js dev server is running: npm run dev');
  }
}

testAPIEndpoints();