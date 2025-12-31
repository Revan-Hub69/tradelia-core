#!/usr/bin/env node

// Test Binance Integration for MSF
// Verifies real data collection works correctly

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log('🧪 Testing Binance Integration for MSF');
console.log('=====================================\n');

// Get Binance configuration
const BINANCE_API_URL = process.env.BINANCE_API_URL || 'https://api.binance.com';
const BINANCE_USER_AGENT = process.env.BINANCE_USER_AGENT || 'Tradelia/1.0';

console.log(`🔗 Using Binance API: ${BINANCE_API_URL}`);
console.log(`👤 User Agent: ${BINANCE_USER_AGENT}\n`);

// Test configuration
const TEST_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT'];
const TEST_TIMEOUT = 30000; // 30 seconds

async function testBinanceHealth() {
  console.log('1. Testing Binance API connectivity...');
  
  try {
    const response = await fetch(`${BINANCE_API_URL}/api/v3/time`, {
      headers: { "User-Agent": BINANCE_USER_AGENT },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const latency = Date.now() - data.serverTime;
    
    console.log(`   ✅ Binance API connected (latency: ${Math.abs(latency)}ms)`);
    return true;
    
  } catch (error) {
    console.log(`   ❌ Binance API failed: ${error.message}`);
    return false;
  }
}

async function testKlinesData() {
  console.log('\n2. Testing klines data collection...');
  
  try {
    const symbol = 'BTCUSDT';
    const url = `${BINANCE_API_URL}/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": BINANCE_USER_AGENT },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const klines = await response.json();
    
    if (!Array.isArray(klines) || klines.length === 0) {
      throw new Error('Invalid klines data');
    }
    
    console.log(`   ✅ Collected ${klines.length} klines for ${symbol}`);
    
    // Test data structure
    const firstKline = klines[0];
    if (!Array.isArray(firstKline) || firstKline.length < 11) {
      throw new Error('Invalid kline structure');
    }
    
    const price = parseFloat(firstKline[4]); // Close price
    const volume = parseFloat(firstKline[5]); // Volume
    
    console.log(`   📊 Latest: price=${price}, volume=${volume.toFixed(2)}`);
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Klines test failed: ${error.message}`);
    return false;
  }
}

async function testOrderbookData() {
  console.log('\n3. Testing orderbook data collection...');
  
  try {
    const symbol = 'BTCUSDT';
    const url = `${BINANCE_API_URL}/api/v3/ticker/bookTicker?symbol=${symbol}`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": BINANCE_USER_AGENT },
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const ticker = await response.json();
    
    const bid = parseFloat(ticker.bidPrice);
    const ask = parseFloat(ticker.askPrice);
    
    if (bid <= 0 || ask <= 0 || ask <= bid) {
      throw new Error('Invalid orderbook data');
    }
    
    const spread = (ask - bid) / ((ask + bid) / 2);
    const spreadBps = spread * 10000;
    
    console.log(`   ✅ ${symbol} orderbook: bid=${bid}, ask=${ask}`);
    console.log(`   📈 Spread: ${spreadBps.toFixed(1)} bps`);
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Orderbook test failed: ${error.message}`);
    return false;
  }
}

async function testSnapshotCalculation() {
  console.log('\n4. Testing snapshot calculation...');
  
  try {
    const symbol = 'BTCUSDT';
    
    // Get klines data
    const klinesUrl = `${BINANCE_API_URL}/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`;
    const klinesResponse = await fetch(klinesUrl, {
      headers: { "User-Agent": BINANCE_USER_AGENT },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!klinesResponse.ok) {
      throw new Error(`Klines HTTP ${klinesResponse.status}`);
    }
    
    const klines = await klinesResponse.json();
    
    // Calculate basic metrics
    const closes = klines.map(k => parseFloat(k[4]));
    const volumes = klines.map(k => parseFloat(k[5]));
    const highs = klines.map(k => parseFloat(k[2]));
    const lows = klines.map(k => parseFloat(k[3]));
    const times = klines.map(k => k[0]);
    
    // Calculate spread estimate
    const avgPrice = closes.reduce((sum, price) => sum + price, 0) / closes.length;
    const avgRange = klines.reduce((sum, k) => {
      const high = parseFloat(k[2]);
      const low = parseFloat(k[3]);
      return sum + (high - low);
    }, 0) / klines.length;
    
    const estimatedSpread = avgRange / avgPrice;
    const spreadBps = estimatedSpread * 10000;
    
    // Calculate ATR
    let atrSum = 0;
    const atrPeriod = Math.min(14, klines.length - 1);
    
    for (let i = 1; i <= atrPeriod; i++) {
      const high = parseFloat(klines[i][2]);
      const low = parseFloat(klines[i][3]);
      const prevClose = parseFloat(klines[i-1][4]);
      
      const trueRange = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
      
      atrSum += trueRange;
    }
    
    const atr = atrSum / atrPeriod;
    
    // Calculate gaps
    const expectedInterval = 60 * 1000; // 1 minute
    let gaps = 0;
    
    for (let i = 1; i < times.length; i++) {
      const timeDiff = times[i] - times[i-1];
      if (timeDiff > expectedInterval * 1.5) {
        gaps += Math.floor(timeDiff / expectedInterval) - 1;
      }
    }
    
    // Calculate completeness
    const completeness = Math.max(0, (klines.length - gaps) / klines.length);
    
    // Calculate 24h volume
    const volume24h = volumes.reduce((sum, vol) => sum + vol, 0);
    
    console.log(`   ✅ Snapshot calculated for ${symbol}:`);
    console.log(`   📊 Spread: ${spreadBps.toFixed(1)} bps`);
    console.log(`   📈 ATR: ${atr.toFixed(2)}`);
    console.log(`   🕳️  Gaps: ${gaps}`);
    console.log(`   ✔️  Completeness: ${(completeness * 100).toFixed(1)}%`);
    console.log(`   💰 Volume 24h: ${volume24h.toFixed(0)}`);
    
    return true;
    
  } catch (error) {
    console.log(`   ❌ Snapshot calculation failed: ${error.message}`);
    return false;
  }
}

async function testMultipleSymbols() {
  console.log('\n5. Testing multiple symbols collection...');
  
  try {
    const results = [];
    
    for (const symbol of TEST_SYMBOLS) {
      try {
        const url = `${BINANCE_API_URL}/api/v3/ticker/bookTicker?symbol=${symbol}`;
        const response = await fetch(url, {
          headers: { "User-Agent": BINANCE_USER_AGENT },
          signal: AbortSignal.timeout(5000)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const ticker = await response.json();
        const bid = parseFloat(ticker.bidPrice);
        const ask = parseFloat(ticker.askPrice);
        const spread = (ask - bid) / ((ask + bid) / 2);
        const spreadBps = spread * 10000;
        
        results.push({ symbol, spreadBps, success: true });
        console.log(`   ✅ ${symbol}: ${spreadBps.toFixed(1)} bps`);
        
        // Small delay to be nice to API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        results.push({ symbol, error: error.message, success: false });
        console.log(`   ❌ ${symbol}: ${error.message}`);
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    console.log(`   📊 Success rate: ${successCount}/${TEST_SYMBOLS.length} (${(successCount/TEST_SYMBOLS.length*100).toFixed(1)}%)`);
    
    return successCount > 0;
    
  } catch (error) {
    console.log(`   ❌ Multiple symbols test failed: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Binance integration tests...\n');
  
  const tests = [
    { name: 'Binance Health', fn: testBinanceHealth },
    { name: 'Klines Data', fn: testKlinesData },
    { name: 'Orderbook Data', fn: testOrderbookData },
    { name: 'Snapshot Calculation', fn: testSnapshotCalculation },
    { name: 'Multiple Symbols', fn: testMultipleSymbols },
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await Promise.race([
        test.fn(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Test timeout')), TEST_TIMEOUT)
        )
      ]);
      
      results.push({ name: test.name, success: result });
      
    } catch (error) {
      console.log(`   ❌ ${test.name} timed out or crashed: ${error.message}`);
      results.push({ name: test.name, success: false, error: error.message });
    }
  }
  
  // Summary
  console.log('\n📋 Test Results Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    if (result.error) {
      console.log(`     Error: ${result.error}`);
    }
  });
  
  console.log(`\n🎯 Overall: ${passed}/${total} tests passed (${(passed/total*100).toFixed(1)}%)`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Binance integration is ready.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check network connectivity and API access.');
    process.exit(1);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled rejection:', reason);
  process.exit(1);
});

// Run tests
runAllTests().catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});