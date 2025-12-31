#!/usr/bin/env node

// Test the new health check endpoint
console.log('🏥 Testing Health Check Endpoint...\n');

async function testHealthCheck() {
  try {
    const response = await fetch('http://localhost:3000/api/health');
    
    if (!response.ok) {
      console.log(`❌ Health check returned status: ${response.status}`);
      const text = await response.text();
      console.log('Response:', text);
      return;
    }
    
    const health = await response.json();
    
    console.log('🎯 Overall Status:', health.status.toUpperCase());
    console.log('⏱️  Response Time:', response.headers.get('X-Response-Time'));
    console.log('🕐 Uptime:', Math.round(health.uptime), 'seconds');
    console.log('📊 Summary:', health.summary);
    
    console.log('\n📋 Component Health:');
    health.checks.forEach(check => {
      const icon = check.status === 'healthy' ? '✅' : 
                   check.status === 'degraded' ? '⚠️' : '❌';
      const latency = check.latency ? ` (${check.latency}ms)` : '';
      console.log(`  ${icon} ${check.name}${latency}`);
      
      if (check.error) {
        console.log(`      Error: ${check.error}`);
      }
      
      if (check.details) {
        Object.entries(check.details).forEach(([key, value]) => {
          console.log(`      ${key}: ${JSON.stringify(value)}`);
        });
      }
    });
    
    console.log('\n🎉 Health check test completed!');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Cannot connect to server. Make sure it\'s running:');
      console.log('   npm run dev');
    } else {
      console.error('❌ Health check test failed:', error.message);
    }
  }
}

testHealthCheck();