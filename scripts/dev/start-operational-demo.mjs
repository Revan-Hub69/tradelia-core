#!/usr/bin/env node

// Start Operational Demo - Full Phase 1 Integration
// Starts the complete operational loop for dashboard demonstration

import { MarketDataEngine } from '../../lib/market-data/engine.js';

let engine;
let isRunning = false;

async function startOperationalDemo() {
  console.log('🚀 STARTING OPERATIONAL DEMO - Phase 1 Integration');
  console.log('=' .repeat(60));
  console.log('This will run the complete operational loop for dashboard demo\n');

  try {
    // Initialize Market Data Engine with demo configuration
    console.log('📊 Initializing Market Data Engine...');
    engine = new MarketDataEngine({
      symbols: ['BTCUSDT', 'ETHUSDT'], // Multiple symbols for better demo
      timeframes: ['1m'],
      enableSetupDetection: true,
      enablePaperTrading: true,
      batchSize: 20,
      autoReconnect: true,
    });

    // Start the engine
    console.log('🔄 Starting Market Data Engine...');
    await engine.start();
    isRunning = true;
    
    console.log('✅ Market Data Engine started successfully!');
    console.log(`   - Run ID: ${engine.getRunId()}`);
    console.log(`   - Symbols: BTCUSDT, ETHUSDT`);
    console.log(`   - Setup Detection: ENABLED`);
    console.log(`   - Paper Trading: ENABLED`);
    console.log(`   - Dashboard: http://localhost:3000/dashboard/market-data`);

    // Status monitoring loop
    console.log('\n📈 Starting status monitoring...');
    console.log('Press Ctrl+C to stop the demo\n');

    let lastStats = { tradesProcessed: 0, setupsDetected: 0, tradesExecuted: 0 };
    
    const statusInterval = setInterval(() => {
      const stats = engine.getStats();
      const newTrades = stats.tradesProcessed - lastStats.tradesProcessed;
      const newSetups = stats.setupsDetected - lastStats.setupsDetected;
      const newPaperTrades = stats.tradesExecuted - lastStats.tradesExecuted;
      
      console.log(`[${new Date().toLocaleTimeString()}] Status Update:`);
      console.log(`   📊 Trades: ${stats.tradesProcessed} (+${newTrades})`);
      console.log(`   📈 Candles: ${stats.candlesGenerated}`);
      console.log(`   🎯 Setups: ${stats.setupsDetected} (+${newSetups})`);
      console.log(`   💰 Paper Trades: ${stats.tradesExecuted} (+${newPaperTrades})`);
      console.log(`   🔗 Connection: ${stats.connectionStatus.status}`);
      console.log(`   ⏱️  Uptime: ${Math.floor(stats.uptime / 1000)}s`);
      console.log('   ---');
      
      lastStats = {
        tradesProcessed: stats.tradesProcessed,
        setupsDetected: stats.setupsDetected,
        tradesExecuted: stats.tradesExecuted,
      };
    }, 10000); // Update every 10 seconds

    // Dashboard reminder
    const dashboardReminder = setInterval(() => {
      console.log(`\n🖥️  Dashboard available at: http://localhost:3000/dashboard/market-data`);
      console.log('   - Real-time data updates every 30 seconds');
      console.log('   - All tabs should show live metrics');
      console.log('   - Setup detection and paper trading active\n');
    }, 60000); // Remind every minute

    // Graceful shutdown handling
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down operational demo...');
      clearInterval(statusInterval);
      clearInterval(dashboardReminder);
      
      if (engine && isRunning) {
        await engine.stop();
        console.log('✅ Market Data Engine stopped');
      }
      
      console.log('👋 Demo stopped. Dashboard data will remain available.');
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {}); // Run indefinitely until Ctrl+C

  } catch (error) {
    console.error('\n❌ DEMO STARTUP FAILED:', error);
    console.error('Stack:', error.stack);
    
    if (engine && isRunning) {
      await engine.stop();
    }
    
    process.exit(1);
  }
}

async function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  // Check environment variables
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env.local file');
    process.exit(1);
  }
  
  console.log('✅ Environment variables configured');
  
  // Check if development server is running
  try {
    const response = await fetch('http://localhost:3000/api/health');
    if (response.ok) {
      console.log('✅ Development server is running');
    } else {
      console.log('⚠️  Development server may not be fully ready');
    }
  } catch (error) {
    console.log('⚠️  Development server not detected. Make sure to run: npm run dev');
  }
}

// Main execution
async function main() {
  console.log('🔥 TRADELIA OPERATIONAL DEMO LAUNCHER');
  console.log('Full Phase 1 Integration with Real-time Dashboard\n');

  await checkPrerequisites();
  await startOperationalDemo();
}

main().catch(console.error);