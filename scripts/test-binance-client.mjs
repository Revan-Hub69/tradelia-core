#!/usr/bin/env node

// Test script for Binance client
// Run with: node scripts/test-binance-client.mjs

import { BinanceClient } from '../lib/mce/binance/client.js';
import { normalizeBinanceKlines } from '../lib/mce/binance/normalize.js';

async function testBinanceClient() {
  console.log('🧪 Testing Binance Client...\n');

  const client = new BinanceClient();

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const health = await client.healthCheck();
    console.log(`   Connected: ${health.connected}`);
    console.log(`   Latency: ${health.latencyMs}ms`);
    if (health.error) {
      console.log(`   Error: ${health.error}`);
    }
    console.log();

    if (!health.connected) {
      console.log('❌ Cannot connect to Binance API. Stopping tests.');
      return;
    }

    // Test 2: Get recent klines
    console.log('2. Testing recent klines fetch...');
    const rawKlines = await client.getRecentKlines('BTCUSDT', '1m', 10);
    console.log(`   Fetched ${rawKlines.length} raw klines`);
    
    if (rawKlines.length > 0) {
      const firstKline = rawKlines[0];
      console.log(`   First kline: ${new Date(firstKline[0]).toISOString()}`);
      console.log(`   OHLC: ${firstKline[1]} / ${firstKline[2]} / ${firstKline[3]} / ${firstKline[4]}`);
    }
    console.log();

    // Test 3: Normalize klines
    console.log('3. Testing kline normalization...');
    const normalizedKlines = normalizeBinanceKlines(rawKlines, 'BTCUSDT', '1m');
    console.log(`   Normalized ${normalizedKlines.length} klines`);
    
    if (normalizedKlines.length > 0) {
      const firstNormalized = normalizedKlines[0];
      console.log(`   First normalized: ${new Date(firstNormalized.openTime).toISOString()}`);
      console.log(`   OHLC: ${firstNormalized.open} / ${firstNormalized.high} / ${firstNormalized.low} / ${firstNormalized.close}`);
      console.log(`   Volume: ${firstNormalized.volume}, Trades: ${firstNormalized.trades}`);
    }
    console.log();

    // Test 4: Rate limiting
    console.log('4. Testing rate limiting (3 rapid requests)...');
    const start = Date.now();
    
    const promises = [
      client.getRecentKlines('BTCUSDT', '1m', 5),
      client.getRecentKlines('BTCUSDT', '5m', 5),
      client.getRecentKlines('BTCUSDT', '15m', 5),
    ];
    
    const results = await Promise.all(promises);
    const elapsed = Date.now() - start;
    
    console.log(`   Completed 3 requests in ${elapsed}ms`);
    console.log(`   Results: ${results.map(r => r.length).join(', ')} klines`);
    console.log();

    console.log('✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.context) {
      console.error('   Context:', error.context);
    }
  }
}

// Run tests
testBinanceClient().catch(console.error);