#!/usr/bin/env tsx

// Load environment variables first
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { setupEngine } from '../lib/setup/engine/index';
import { buildRealMarketState } from '../lib/setup/market-feed';

async function testSetupDetection() {
  try {
    console.log('🧪 Testing setup detection with real market data...');
    
    const symbols = ['BTCUSDT', 'ETHUSDT'];
    
    // Build market state with real data
    const marketState = await buildRealMarketState(symbols);
    
    console.log('📊 Market State:');
    console.log(`- Regime: ${marketState.regime.trend}/${marketState.regime.volatility} (${(marketState.regime.confidence * 100).toFixed(1)}%)`);
    console.log(`- Day Gate: ${marketState.universeFit.dayGate.tradableDay ? 'OPEN' : 'CLOSED'}`);
    console.log(`- Symbols: ${symbols.join(', ')}`);
    
    // Process through setup engine
    const decision = await setupEngine.processMarketState(marketState);
    
    console.log('\n🎯 Setup Engine Decision:');
    console.log(`- Allowed: ${decision.allowed ? '✅ YES' : '❌ NO'}`);
    console.log(`- Setups Generated: ${decision.setups.length}`);
    console.log(`- Reason Codes: ${decision.reasonCodes.join(', ') || 'none'}`);
    
    if (decision.setups.length > 0) {
      console.log('\n📋 Generated Setups:');
      for (const setup of decision.setups) {
        console.log(`  🎯 ${setup.setupType} ${setup.direction} ${setup.symbol}`);
        console.log(`     Entry: ${setup.entryModel.price} (${setup.entryModel.type})`);
        console.log(`     Stop: ${setup.stopModel.level}`);
        console.log(`     Target: ${setup.targets.primary}`);
        console.log(`     Confidence: ${(setup.confidenceScore * 100).toFixed(1)}%`);
        console.log(`     Risk/Reward: ${setup.riskReward.toFixed(2)}`);
        console.log(`     Max Risk: $${setup.maxRisk}`);
        console.log(`     Expires: ${new Date(setup.expiresAt).toISOString()}`);
        console.log('');
      }
    }
    
    // Show engine stats
    const stats = await setupEngine.getEngineStats();
    console.log('📈 Engine Stats:');
    console.log(`- Active Setups: ${stats.activeSetups}/${stats.maxConcurrentSetups}`);
    console.log(`- Total Risk: $${stats.totalRisk}`);
    console.log(`- Avg Confidence: ${(stats.avgConfidenceScore * 100).toFixed(1)}%`);
    console.log(`- Avg Risk/Reward: ${stats.avgRiskReward.toFixed(2)}`);
    
    console.log('\n✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSetupDetection();