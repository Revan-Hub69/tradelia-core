#!/usr/bin/env node

/**
 * Test Binance API Connectivity
 * Verifies that we can connect to Binance and fetch market data
 */

import fetch from 'node-fetch';

const BINANCE_API = 'https://api.binance.com';
const TESTNET_API = 'https://testnet.binance.vision';

async function testEndpoint(baseUrl, name) {
  console.log(`\n📡 Testing ${name}...`);
  console.log(`   URL: ${baseUrl}`);
  
  try {
    // Test 1: Server time (lightweight)
    console.log('   ✓ Testing /api/v3/time...');
    const timeStart = Date.now();
    const timeRes = await fetch(`${baseUrl}/api/v3/time`, {
      timeout: 5000,
      headers: { 'User-Agent': 'Tradelia/1.0' }
    });
    const timeLatency = Date.now() - timeStart;
    
    if (!timeRes.ok) {
      console.log(`   ✗ Server time failed: HTTP ${timeRes.status}`);
      return { success: false, error: `HTTP ${timeRes.status}` };
    }
    
    const timeData = await timeRes.json();
    console.log(`   ✓ Server time: ${new Date(timeData.serverTime).toISOString()} (latency: ${timeLatency}ms)`);
    
    // Test 2: Get BTCUSDT klines (1m, last 5)
    console.log('   ✓ Testing /api/v3/klines (BTCUSDT 1m)...');
    const klinesStart = Date.now();
    const klinesRes = await fetch(
      `${baseUrl}/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=5`,
      {
        timeout: 5000,
        headers: { 'User-Agent': 'Tradelia/1.0' }
      }
    );
    const klinesLatency = Date.now() - klinesStart;
    
    if (!klinesRes.ok) {
      console.log(`   ✗ Klines failed: HTTP ${klinesRes.status}`);
      return { success: false, error: `HTTP ${klinesRes.status}` };
    }
    
    const klinesData = await klinesRes.json();
    
    if (!Array.isArray(klinesData) || klinesData.length === 0) {
      console.log(`   ✗ Invalid klines response`);
      return { success: false, error: 'Invalid response format' };
    }
    
    const latestKline = klinesData[klinesData.length - 1];
    const closePrice = parseFloat(latestKline[4]);
    const volume = parseFloat(latestKline[7]);
    
    console.log(`   ✓ BTCUSDT latest: $${closePrice.toFixed(2)} (volume: ${volume.toFixed(0)} USDT, latency: ${klinesLatency}ms)`);
    
    // Test 3: Get ETHUSDT klines
    console.log('   ✓ Testing /api/v3/klines (ETHUSDT 1m)...');
    const ethStart = Date.now();
    const ethRes = await fetch(
      `${baseUrl}/api/v3/klines?symbol=ETHUSDT&interval=1m&limit=1`,
      {
        timeout: 5000,
        headers: { 'User-Agent': 'Tradelia/1.0' }
      }
    );
    const ethLatency = Date.now() - ethStart;
    
    if (!ethRes.ok) {
      console.log(`   ✗ ETHUSDT failed: HTTP ${ethRes.status}`);
      return { success: false, error: `HTTP ${ethRes.status}` };
    }
    
    const ethData = await ethRes.json();
    const ethPrice = parseFloat(ethData[0][4]);
    console.log(`   ✓ ETHUSDT latest: $${ethPrice.toFixed(2)} (latency: ${ethLatency}ms)`);
    
    return {
      success: true,
      latencies: {
        time: timeLatency,
        klines: klinesLatency,
        eth: ethLatency
      },
      data: {
        btcPrice: closePrice,
        ethPrice: ethPrice
      }
    };
    
  } catch (error) {
    console.log(`   ✗ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔍 Binance Connectivity Test');
  console.log('═'.repeat(50));
  
  // Test production API
  const prodResult = await testEndpoint(BINANCE_API, 'Production API');
  
  // Test testnet API
  const testnetResult = await testEndpoint(TESTNET_API, 'Testnet API');
  
  // Summary
  console.log('\n📊 Summary');
  console.log('═'.repeat(50));
  
  if (prodResult.success) {
    console.log('✅ Production API: WORKING');
    console.log(`   Avg latency: ${Math.round((prodResult.latencies.time + prodResult.latencies.klines) / 2)}ms`);
    console.log(`   BTC: $${prodResult.data.btcPrice.toFixed(2)}`);
    console.log(`   ETH: $${prodResult.data.ethPrice.toFixed(2)}`);
  } else {
    console.log(`❌ Production API: FAILED (${prodResult.error})`);
  }
  
  if (testnetResult.success) {
    console.log('✅ Testnet API: WORKING');
    console.log(`   Avg latency: ${Math.round((testnetResult.latencies.time + testnetResult.latencies.klines) / 2)}ms`);
  } else {
    console.log(`❌ Testnet API: FAILED (${testnetResult.error})`);
  }
  
  // Recommendation
  console.log('\n💡 Recommendation');
  console.log('═'.repeat(50));
  
  if (prodResult.success) {
    console.log('✅ Binance is accessible. You can use production API.');
    console.log('   MCE pipeline can fetch real market data.');
  } else if (testnetResult.success) {
    console.log('⚠️  Production API is blocked, but Testnet works.');
    console.log('   Options:');
    console.log('   1. Use Testnet for development/testing');
    console.log('   2. Configure fallback to alternative data source (Twelve Data, Finnhub, etc.)');
    console.log('   3. Use VPN/proxy to access production API');
  } else {
    console.log('❌ Both APIs are unreachable.');
    console.log('   Check your internet connection or firewall settings.');
  }
  
  process.exit(prodResult.success ? 0 : 1);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
