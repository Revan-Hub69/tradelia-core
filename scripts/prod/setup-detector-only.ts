#!/usr/bin/env tsx

// Setup Detector ONLY - No paper trading, just pure setup generation
// You get the setups, you decide what to do with them

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { setupEngine } from '../../lib/setup/engine/index';
import { buildRealMarketState } from '../../lib/setup/market-feed';

const SYMBOLS = ['BTCUSDT', 'ETHUSDT'];
const INTERVAL = 15000; // 15 seconds

async function runDetection() {
  try {
    console.log(`🔍 ${new Date().toISOString()}`);
    
    // Build market state with real data
    const marketState = await buildRealMarketState(SYMBOLS);
    
    // Process market state for new setups
    const decision = await setupEngine.processMarketState(marketState);
    
    // Log results
    console.log(`Decision: ${decision.allowed ? '✅ ALLOWED' : '❌ BLOCKED'}`);
    console.log(`New setups: ${decision.setups.length}`);
    
    if (decision.setups.length > 0) {
      console.log('\n🎯 DETECTED SETUPS:');
      for (const setup of decision.setups) {
        console.log(`\n📋 SETUP ID: ${setup.setupId}`);
        console.log(`   Type: ${setup.setupType}`);
        console.log(`   Direction: ${setup.direction}`);
        console.log(`   Symbol: ${setup.symbol}`);
        console.log(`   Entry: ${setup.entryModel.price}`);
        console.log(`   Stop: ${setup.stopModel.level}`);
        console.log(`   Target: ${setup.targets.primary}`);
        console.log(`   Confidence: ${(setup.confidenceScore * 100).toFixed(0)}%`);
        console.log(`   Risk/Reward: ${setup.riskReward.toFixed(2)}`);
        console.log(`   TTL: ${setup.entryModel.ttlSec}s`);
        console.log(`   Evidence: ${setup.evidence.join(', ')}`);
        
        // Calculate position size for 1% risk
        const riskAmount = 1000; // $1000 risk per trade
        const stopDistance = Math.abs(setup.entryModel.price - setup.stopModel.level);
        const positionSize = riskAmount / stopDistance;
        console.log(`   Position Size (1% risk): ${positionSize.toFixed(4)} units`);
      }
    }
    
    // Show engine stats
    const engineStats = await setupEngine.getEngineStats();
    console.log(`\nEngine: ${engineStats.activeSetups}/${engineStats.maxConcurrentSetups} active setups`);
    
  } catch (error) {
    console.error('❌ Detection failed:', error instanceof Error ? error.message : String(error));
  }
}

// Run immediately then every 15s
runDetection();
setInterval(runDetection, INTERVAL);

console.log('🚀 Setup Detector started - DETECTION ONLY');
console.log('Features: Real market data → Setup detection → YOU decide execution');
console.log('Press Ctrl+C to stop');

process.on('SIGINT', () => {
  console.log('\n🛑 Stopping setup detector...');
  process.exit(0);
});