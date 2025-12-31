#!/usr/bin/env node

// MSF Development Simulation Script
// Provides mock data for MSF testing - NOT for production use

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

console.log('🧪 MSF Development Simulation');
console.log('⚠️  MOCK DATA ONLY - Not for production use');

// Mock regime data
const mockRegime = {
  v: "mce.regime.v2",
  asOf: Date.now(),
  trend: "up",
  volatility: "normal", 
  confidence: 0.8,
  hash: "mock-regime-hash"
};

// Mock universe data
const mockUniverse = {
  symbols: ["BTCUSDT", "ETHUSDT", "ADAUSDT"],
  hash: "mock-universe-hash"
};

// Mock symbol snapshots with deterministic seed
function generateMockSnapshot(symbol, seed = 0) {
  // Use symbol as seed for deterministic mock data
  const symbolSeed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), seed);
  
  // Simple deterministic "random" based on seed
  const deterministicRandom = (s) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  return {
    symbol,
    spread: deterministicRandom(symbolSeed) * 0.001, // 0-0.1% spread
    atr: deterministicRandom(symbolSeed + 1) * 50 + 10, // 10-60 ATR
    gaps: Math.floor(deterministicRandom(symbolSeed + 2) * 3), // 0-2 gaps
    completeness: 0.95 + deterministicRandom(symbolSeed + 3) * 0.05, // 95-100%
    volume24h: deterministicRandom(symbolSeed + 4) * 10000000 + 1000000, // 1M-11M
    lastUpdate: mockRegime.asOf - Math.floor(deterministicRandom(symbolSeed + 5) * 300000), // last 5 min
  };
}

// Generate mock snapshots
const mockSnapshots = mockUniverse.symbols.map(symbol => generateMockSnapshot(symbol));

console.log('\n📊 Mock Data Generated:');
console.log('Regime:', mockRegime.trend, mockRegime.volatility, `confidence: ${mockRegime.confidence}`);
console.log('Universe:', mockUniverse.symbols.length, 'symbols');
console.log('Snapshots:');
mockSnapshots.forEach(snap => {
  console.log(`  ${snap.symbol}: spread ${(snap.spread * 10000).toFixed(1)}bps, gaps ${snap.gaps}`);
});

console.log('\n🔧 To use in development:');
console.log('1. Set MSF_USE_MOCK_DATA=true environment variable');
console.log('2. Import mock data from this script');
console.log('3. Pass to MSF pipeline for testing');

console.log('\n⚠️  Remember: Replace with real Binance API for production!');

export { mockRegime, mockUniverse, mockSnapshots, generateMockSnapshot };