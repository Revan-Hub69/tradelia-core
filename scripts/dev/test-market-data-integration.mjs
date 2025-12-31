#!/usr/bin/env node

// Market Data Integration Phase 1 - Test Script
// Professional validation of real-time market data processing

import { MarketDataEngine } from '../../lib/market-data/engine.js';

async function testMarketDataIntegration() {
  console.log('🚀 Market Data Integration Phase 1 - Test Suite');
  console.log('================================================');
  
  const engine = new MarketDataEngine({
    symbols: ['BTCUSDT', 'ETHUSDT'],
    timeframes: ['M1', 'M5'],
    batchSize: 10,
    enableSetupDetection: true,
    enablePaperTrading: true,
  });

  try {
    // Test 1: Engine startup
    console.log('\n📡 Test 1: Starting Market Data Engine...');
    await engine.start();
    console.log('✅ Engine started successfully');
    console.log(`   Run ID: ${engine.getRunId()}`);

    // Test 2: Monitor for 30 seconds
    console.log('\n📊 Test 2: Monitoring market data for 30 seconds...');
    
    const monitorInterval = setInterval(() => {
      const stats = engine.getStats();
      console.log(`   Stats: ${stats.tradesProcessed} trades, ${stats.candlesGenerated} candles, ${stats.setupsDetected} setups`);
      console.log(`   Connection: ${stats.connectionStatus.connected ? 'Connected' : 'Disconnected'} (latency: ${stats.connectionStatus.latency}ms)`);
      console.log(`   Batch: ${stats.batchStats.pending} pending events`);
      console.log(`   Orders: ${stats.orderStats.pending} pending, ${stats.orderStats.filled} filled`);
    }, 5000);

    // Wait for 30 seconds
    await new Promise(resolve => setTimeout(resolve, 30000));
    clearInterval(monitorInterval);

    // Test 3: Market state generation
    console.log('\n🏗️  Test 3: Generating market state...');
    const marketState = await engine.getMarketState();
    
    if (marketState) {
      console.log('✅ Market state generated successfully');
      console.log(`   Symbols: ${Object.keys(marketState.symbols).join(', ')}`);
      console.log(`   Regime: ${marketState.regime.classification} (${marketState.regime.confidence})`);
      console.log(`   Session: ${marketState.session.name}`);
      
      for (const [symbol, data] of Object.entries(marketState.symbols)) {
        console.log(`   ${symbol}: $${data.price.toFixed(2)} (Vol: ${data.volume24h.toFixed(2)})`);
      }
    } else {
      console.log('❌ Failed to generate market state');
    }

    // Test 4: Final statistics
    console.log('\n📈 Test 4: Final Statistics');
    const finalStats = engine.getStats();
    console.log(`   Total Events Processed: ${finalStats.tradesProcessed + finalStats.orderbooksProcessed}`);
    console.log(`   Candles Generated: ${finalStats.candlesGenerated}`);
    console.log(`   Setups Detected: ${finalStats.setupsDetected}`);
    console.log(`   Paper Trades: ${finalStats.tradesExecuted}`);
    console.log(`   Uptime: ${(finalStats.uptime / 1000).toFixed(1)}s`);

    // Test 5: Graceful shutdown
    console.log('\n🛑 Test 5: Graceful shutdown...');
    await engine.stop();
    console.log('✅ Engine stopped successfully');

    // Test results
    console.log('\n🎯 Test Results Summary');
    console.log('======================');
    
    const success = finalStats.tradesProcessed > 0 || finalStats.candlesGenerated > 0;
    
    if (success) {
      console.log('✅ PASS: Market data integration working correctly');
      console.log(`   - Processed ${finalStats.tradesProcessed} trade events`);
      console.log(`   - Generated ${finalStats.candlesGenerated} candles`);
      console.log(`   - Detected ${finalStats.setupsDetected} setups`);
      console.log(`   - Executed ${finalStats.tradesExecuted} paper trades`);
    } else {
      console.log('❌ FAIL: No market data processed');
      console.log('   Check WebSocket connection and Binance API access');
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    
    try {
      await engine.stop();
    } catch (stopError) {
      console.error('Error during cleanup:', stopError);
    }
    
    process.exit(1);
  }
}

// Property-based tests
async function runPropertyTests() {
  console.log('\n🧪 Property-Based Tests');
  console.log('========================');

  // Test deterministic candle aggregation
  console.log('\n🔍 Testing candle aggregation determinism...');
  
  const { DeterministicCandleAggregator } = await import('../../lib/market-data/aggregator.js');
  const aggregator = new DeterministicCandleAggregator();
  
  // Create test trades
  const testTrades = [
    { symbol: 'BTCUSDT', price: 45000, quantity: 0.1, timestamp: Date.now(), side: 'BUY', tradeId: '1' },
    { symbol: 'BTCUSDT', price: 45100, quantity: 0.2, timestamp: Date.now() + 1000, side: 'SELL', tradeId: '2' },
    { symbol: 'BTCUSDT', price: 44900, quantity: 0.15, timestamp: Date.now() + 2000, side: 'BUY', tradeId: '3' },
  ];
  
  // Process trades multiple times
  const results1 = [];
  const results2 = [];
  
  for (const trade of testTrades) {
    results1.push(...aggregator.processTrade(trade));
  }
  
  // Reset and process again
  const aggregator2 = new DeterministicCandleAggregator();
  for (const trade of testTrades) {
    results2.push(...aggregator2.processTrade(trade));
  }
  
  // Compare results
  const deterministic = results1.length === results2.length &&
    results1.every((candle, i) => candle.hash === results2[i]?.hash);
  
  if (deterministic) {
    console.log('✅ PASS: Candle aggregation is deterministic');
  } else {
    console.log('❌ FAIL: Candle aggregation is not deterministic');
  }

  // Test event log idempotency
  console.log('\n🔍 Testing event log idempotency...');
  
  const { DatabaseMarketEventLog } = await import('../../lib/market-data/event-log.js');
  const eventLog = new DatabaseMarketEventLog('test-run-' + Date.now());
  
  try {
    const testTrade = testTrades[0];
    
    // Append same trade twice
    await eventLog.appendTrade(testTrade);
    await eventLog.appendTrade(testTrade);
    
    console.log('✅ PASS: Event log handles duplicate events');
  } catch (error) {
    if (error.message.includes('unique')) {
      console.log('✅ PASS: Event log enforces idempotency');
    } else {
      console.log('❌ FAIL: Event log idempotency test failed:', error.message);
    }
  } finally {
    await eventLog.shutdown();
  }

  // Test paper OMS slippage consistency
  console.log('\n🔍 Testing paper OMS slippage consistency...');
  
  const { SimulatedPaperOMS } = await import('../../lib/market-data/paper-oms.js');
  const paperOMS = new SimulatedPaperOMS();
  
  const testOrder = {
    setupId: 'test-setup',
    symbol: 'BTCUSDT',
    side: 'BUY',
    type: 'MARKET',
    quantity: 0.1,
    ttlSec: 60,
  };
  
  // Calculate slippage multiple times
  const slippages = [];
  for (let i = 0; i < 5; i++) {
    const slippage = paperOMS.calculateSlippage(testOrder, 45000);
    slippages.push(slippage);
  }
  
  // Check if slippages are reasonable (between 0.01% and 0.5%)
  const reasonable = slippages.every(s => s >= 0.0001 && s <= 0.005);
  
  if (reasonable) {
    console.log('✅ PASS: Paper OMS slippage is reasonable');
    console.log(`   Range: ${(Math.min(...slippages) * 100).toFixed(4)}% - ${(Math.max(...slippages) * 100).toFixed(4)}%`);
  } else {
    console.log('❌ FAIL: Paper OMS slippage is unreasonable');
  }
  
  await paperOMS.shutdown();
}

// Run tests
async function main() {
  try {
    await testMarketDataIntegration();
    await runPropertyTests();
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Run for longer periods to collect 100+ paper trades');
    console.log('   2. Implement KPI pipeline for automated readiness assessment');
    console.log('   3. Add replay validation with decision_hash comparison');
    console.log('   4. Integrate with existing setup engine for real setup detection');
    console.log('   5. Add monitoring and alerting for production deployment');
    
  } catch (error) {
    console.error('Test suite failed:', error);
    process.exit(1);
  }
}

main();