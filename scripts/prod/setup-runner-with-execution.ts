#!/usr/bin/env tsx

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Enhanced Setup Runner - Real data + Paper execution + Outcome tracking
import { setupEngine } from '../../lib/setup/engine/index';
import { buildRealMarketState } from '../../lib/setup/market-feed';
import { paperExecutionEngine } from '../../lib/setup/paper-execution';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT'];
const INTERVAL = 15000; // 15 seconds

// Track current prices for execution
let currentPrices: Record<string, number> = {};

async function runCycle() {
  try {
    console.log(`🔄 ${new Date().toISOString()}`);
    
    // Build market state with real data
    const marketState = await buildRealMarketState(SYMBOLS);
    
    // Extract current prices for execution engine
    for (const symbol of SYMBOLS) {
      // Get price from structure levels (temporary until we have proper price feed)
      const structure = marketState.structure[symbol];
      if (structure && structure.M15 && structure.M15[0]) {
        currentPrices[symbol] = structure.M15[0].level * 1.001; // Simulate current price slightly above structure
      }
    }
    
    // 1. CHECK ORDER FILLS AND UPDATE POSITIONS
    await paperExecutionEngine.checkOrderFills(currentPrices);
    await paperExecutionEngine.updatePositions(currentPrices);
    
    // 2. PROCESS MARKET STATE FOR NEW SETUPS
    const decision = await setupEngine.processMarketState(marketState);
    
    // 3. SUBMIT NEW SETUPS TO PAPER EXECUTION
    if (decision.allowed && decision.setups.length > 0) {
      for (const setup of decision.setups) {
        const orderId = await paperExecutionEngine.submitSetupOrder(setup);
        console.log(`📋 Submitted setup ${setup.setupId} as order ${orderId}`);
      }
    }
    
    // 4. LOG RESULTS
    console.log(`Decision: ${decision.allowed ? '✅ ALLOWED' : '❌ BLOCKED'}`);
    console.log(`New setups: ${decision.setups.length}`);
    
    if (decision.setups.length > 0) {
      for (const setup of decision.setups) {
        console.log(`  🎯 ${setup.setupType} ${setup.direction} ${setup.symbol} @ ${setup.entryModel.price} (${(setup.confidenceScore * 100).toFixed(0)}%)`);
      }
    }
    
    // 5. SHOW ACTIVE SETUPS AND EXECUTION STATS
    const engineStats = await setupEngine.getEngineStats();
    const executionStats = paperExecutionEngine.getExecutionStats();
    
    console.log(`Active setups: ${engineStats.activeSetups}/${engineStats.maxConcurrentSetups}`);
    console.log(`Paper trading: ${executionStats.activePositions} positions, $${executionStats.totalPnL.toFixed(2)} PnL, ${(executionStats.winRate * 100).toFixed(1)}% win rate`);
    
  } catch (error) {
    console.error('❌ Cycle failed:', error.message);
  }
}

// Run immediately then every 15s
runCycle();
setInterval(runCycle, INTERVAL);

console.log('🚀 Enhanced Setup Runner started - real data + paper execution');
console.log('Features: Market data → Setup detection → Paper orders → Outcome tracking');
console.log('Press Ctrl+C to stop');

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping...');
  
  // Show final stats
  const executionStats = paperExecutionEngine.getExecutionStats();
  console.log('\n📊 Final Paper Trading Stats:');
  console.log(`- Total Orders: ${executionStats.totalOrders}`);
  console.log(`- Fill Rate: ${(executionStats.fillRate * 100).toFixed(1)}%`);
  console.log(`- Active Positions: ${executionStats.activePositions}`);
  console.log(`- Closed Positions: ${executionStats.closedPositions}`);
  console.log(`- Total PnL: $${executionStats.totalPnL.toFixed(2)}`);
  console.log(`- Win Rate: ${(executionStats.winRate * 100).toFixed(1)}%`);
  
  process.exit(0);
});