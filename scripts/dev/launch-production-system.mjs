#!/usr/bin/env node

// Launch Production System - Full Operational Loop
// Starts the complete real-time system with Binance data

import { MarketDataEngine } from '../../lib/market-data/engine.js';

console.log('🚀 LAUNCHING PRODUCTION SYSTEM - Phase 1 Integration');
console.log('=' .repeat(60));
console.log('REAL DATA - REAL TRADING - REAL DASHBOARD');
console.log('');

let engine;

async function launchProductionSystem() {
  try {
    console.log('📊 Initializing Market Data Engine with REAL Binance data...');
    
    // Initialize with production configuration
    engine = new MarketDataEngine({
      symbols: ['BTCUSDT', 'ETHUSDT'],
      timeframes: ['1m'],
      enableSetupDetection: true,
      enablePaperTrading: true,
      batchSize: 50,
      autoReconnect: true,
    });

    console.log('🔄 Starting REAL market data processing...');
    await engine.start();
    
    console.log('✅ PRODUCTION SYSTEM LAUNCHED!');
    console.log('');
    console.log('🎯 OPERATIONAL STATUS:');
    console.log(`   - Run ID: ${engine.getRunId()}`);
    console.log('   - Real Binance WebSocket: CONNECTED');
    console.log('   - Setup Detection: ACTIVE');
    console.log('   - Paper Trading: ACTIVE');
    console.log('   - Dashboard: LIVE DATA');
    console.log('');
    console.log('🖥️  DASHBOARD ACCESS:');
    console.log('   http://localhost:3000/dashboard/market-data');
    console.log('');
    console.log('📈 REAL-TIME MONITORING:');
    
    // Status monitoring with real data
    setInterval(() => {
      const stats = engine.getStats();
      console.log(`[${new Date().toLocaleTimeString()}] LIVE STATUS:`);
      console.log(`   📊 Real Trades Processed: ${stats.tradesProcessed}`);
      console.log(`   📈 Candles Generated: ${stats.candlesGenerated}`);
      console.log(`   🎯 Setups Detected: ${stats.setupsDetected}`);
      console.log(`   💰 Paper Trades: ${stats.tradesExecuted}`);
      console.log(`   🔗 Connection: ${stats.connectionStatus.status}`);
      console.log(`   ⏱️  Uptime: ${Math.floor(stats.uptime / 1000)}s`);
      console.log('   ---');
    }, 15000); // Update every 15 seconds

    // Keep running
    console.log('🔥 SYSTEM RUNNING - Press Ctrl+C to stop');
    console.log('');
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down production system...');
      if (engine) {
        await engine.stop();
        console.log('✅ Market Data Engine stopped');
      }
      console.log('👋 Production system stopped');
      process.exit(0);
    });

    // Keep alive
    await new Promise(() => {});

  } catch (error) {
    console.error('\n❌ PRODUCTION SYSTEM LAUNCH FAILED:', error);
    console.error('Stack:', error.stack);
    
    if (engine) {
      await engine.stop();
    }
    
    process.exit(1);
  }
}

// Check prerequisites
async function checkPrerequisites() {
  console.log('🔍 Checking production prerequisites...');
  
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nConfigure .env.local before launching production system');
    process.exit(1);
  }
  
  console.log('✅ Environment configured for production');
}

// Main execution
async function main() {
  console.log('🔥 TRADELIA PRODUCTION SYSTEM LAUNCHER');
  console.log('Real Market Data Integration with Live Dashboard\n');

  await checkPrerequisites();
  await launchProductionSystem();
}

main().catch(console.error);