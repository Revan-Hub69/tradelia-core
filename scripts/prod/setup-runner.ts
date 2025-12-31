#!/usr/bin/env tsx

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Minimal Setup Runner - Makes the system actually work
import { setupEngine } from '../../lib/setup/engine/index';
import { buildRealMarketState } from '../../lib/setup/market-feed';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT'];
const INTERVAL = 15000; // 15 seconds

async function runCycle() {
  try {
    console.log(`🔄 ${new Date().toISOString()}`);
    
    // Build market state with real data
    const marketState = await buildRealMarketState(SYMBOLS);
    
    // Process through setup engine
    const decision = await setupEngine.processMarketState(marketState);
    
    // Log results
    console.log(`Decision: ${decision.allowed ? '✅ ALLOWED' : '❌ BLOCKED'}`);
    console.log(`New setups: ${decision.setups.length}`);
    
    if (decision.setups.length > 0) {
      for (const setup of decision.setups) {
        console.log(`  🎯 ${setup.setupType} ${setup.direction} ${setup.symbol} @ ${setup.entryModel.price} (${(setup.confidenceScore * 100).toFixed(0)}%)`);
      }
    }
    
    // Show active setups
    const stats = await setupEngine.getEngineStats();
    console.log(`Active: ${stats.activeSetups}/${stats.maxConcurrentSetups}`);
    
  } catch (error) {
    console.error('❌ Cycle failed:', error instanceof Error ? error.message : String(error));
  }
}

// Run immediately then every 15s
runCycle();
setInterval(runCycle, INTERVAL);

console.log('🚀 Setup Runner started - generating real setups every 15s');
console.log('Press Ctrl+C to stop');

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping...');
  process.exit(0);
});