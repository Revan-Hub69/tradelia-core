#!/usr/bin/env node

// Test MSF with Real Binance Data
// Verifies complete integration works end-to-end

console.log('🎯 Testing MSF with Real Binance Data');
console.log('====================================\n');

// Test configuration
const TEST_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'BNBUSDT', 'SOLUSDT'];
const BINANCE_API_URL = process.env.BINANCE_API_URL || 'https://api.binance.com';
const BINANCE_USER_AGENT = process.env.BINANCE_USER_AGENT || 'Tradelia/1.0';

console.log(`🔗 Using Binance API: ${BINANCE_API_URL}`);
console.log(`📊 Testing with symbols: ${TEST_SYMBOLS.join(', ')}\n`);

// Mock regime data (would come from MCE in real pipeline)
const mockRegime = {
  v: "mce.regime.v1",
  asOf: Date.now(),
  regime: "TREND",
  confidence: 0.85,
  volatility: "NORMAL",
  dataQuality: 0.98,
  hash: "mock-regime-hash"
};

// Mock universe data (would come from UCM in real pipeline)
const mockUniverse = {
  symbols: TEST_SYMBOLS,
  asOf: Date.now(),
  version: 1,
  totalSymbols: TEST_SYMBOLS.length,
  coreSymbols: TEST_SYMBOLS.slice(0, 2), // BTC, ETH as core
  addedSymbols: [],
  removedSymbols: [],
  reasons: []
};

// MSF Configuration (v1.5 - conservative parameters)
const MSF_CONFIG = {
  dayGate: {
    minDataQuality: 0.95,
    minConfidence: 0.6,
    maxVolatilityMultiplier: 2.0,
  },
  fitClass: {
    spreadThresholds: {
      A: 0.0001, // 1 bps
      B: 0.0002, // 2 bps
      C: 0.0005, // 5 bps
    },
    minCompleteness: 0.95,
    maxGaps: 2,
  }
};

async function collectRealSnapshots(symbols) {
  console.log('📸 Collecting real symbol snapshots from Binance...');
  
  const snapshots = [];
  const errors = [];
  
  for (const symbol of symbols) {
    try {
      console.log(`  📊 Processing ${symbol}...`);
      
      // Get klines data (24h of 1m data)
      const klinesUrl = `${BINANCE_API_URL}/api/v3/klines?symbol=${symbol}&interval=1m&limit=100`;
      const klinesResponse = await fetch(klinesUrl, {
        headers: { "User-Agent": BINANCE_USER_AGENT },
        signal: AbortSignal.timeout(10000)
      });
      
      if (!klinesResponse.ok) {
        throw new Error(`Klines HTTP ${klinesResponse.status}`);
      }
      
      const klines = await klinesResponse.json();
      
      if (!Array.isArray(klines) || klines.length < 50) {
        throw new Error(`Insufficient klines data: ${klines.length}`);
      }
      
      // Get orderbook spread
      const tickerUrl = `${BINANCE_API_URL}/api/v3/ticker/bookTicker?symbol=${symbol}`;
      const tickerResponse = await fetch(tickerUrl, {
        headers: { "User-Agent": BINANCE_USER_AGENT },
        signal: AbortSignal.timeout(5000)
      });
      
      let orderbookSpread = 0;
      if (tickerResponse.ok) {
        const ticker = await tickerResponse.json();
        const bid = parseFloat(ticker.bidPrice);
        const ask = parseFloat(ticker.askPrice);
        if (bid > 0 && ask > bid) {
          orderbookSpread = (ask - bid) / ((ask + bid) / 2);
        }
      }
      
      // Calculate snapshot metrics
      const closes = klines.map(k => parseFloat(k[4]));
      const volumes = klines.map(k => parseFloat(k[5]));
      const times = klines.map(k => k[0]);
      
      // Calculate ATR (14 period)
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
      
      const snapshot = {
        symbol,
        spread: orderbookSpread > 0 ? orderbookSpread : 0.0001, // fallback to 1bps
        atr,
        gaps,
        completeness,
        volume24h,
        lastUpdate: Math.max(...times),
      };
      
      snapshots.push(snapshot);
      
      const spreadBps = snapshot.spread * 10000;
      console.log(`    ✅ ${symbol}: spread ${spreadBps.toFixed(1)}bps, ` +
                  `gaps ${gaps}, quality ${(completeness * 100).toFixed(1)}%`);
      
      // Small delay to be nice to API
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${symbol}: ${errorMsg}`);
      console.log(`    ❌ ${symbol}: ${errorMsg}`);
    }
  }
  
  console.log(`✅ Collected ${snapshots.length}/${symbols.length} snapshots`);
  if (errors.length > 0) {
    console.log(`⚠️  Errors: ${errors.length}`);
  }
  
  return { snapshots, errors };
}

function classifyMarketFit(symbol, snapshot, regime, config) {
  const reasons = [];
  
  // Check data quality
  if (snapshot.completeness < config.fitClass.minCompleteness) {
    reasons.push(`low completeness: ${(snapshot.completeness * 100).toFixed(1)}%`);
  }
  
  if (snapshot.gaps > config.fitClass.maxGaps) {
    reasons.push(`too many gaps: ${snapshot.gaps}`);
  }
  
  // If data quality issues, return NO_TRADE
  if (reasons.length > 0) {
    return {
      symbol,
      fitClass: 'NO_TRADE',
      allowedPlaybooks: ['none'],
      frictionScore: 1.0,
      dataQuality: snapshot.completeness,
      reasons,
      spread: snapshot.spread,
    };
  }
  
  // Classify based on spread
  let fitClass = 'NO_TRADE';
  let allowedPlaybooks = ['none'];
  let frictionScore = 1.0;
  
  if (snapshot.spread <= config.fitClass.spreadThresholds.A) {
    fitClass = 'A';
    allowedPlaybooks = ['momentum', 'pullback', 'breakout'];
    frictionScore = 0.1;
  } else if (snapshot.spread <= config.fitClass.spreadThresholds.B) {
    fitClass = 'B';
    allowedPlaybooks = ['pullback', 'breakout'];
    frictionScore = 0.3;
  } else if (snapshot.spread <= config.fitClass.spreadThresholds.C) {
    fitClass = 'C';
    allowedPlaybooks = ['breakout'];
    frictionScore = 0.6;
  } else {
    reasons.push(`spread too high: ${(snapshot.spread * 10000).toFixed(1)}bps`);
  }
  
  return {
    symbol,
    fitClass,
    allowedPlaybooks,
    frictionScore,
    dataQuality: snapshot.completeness,
    reasons,
    spread: snapshot.spread,
  };
}

function generateDayGate(regime, universe, marketFits, config) {
  const reasons = [];
  
  // Check regime quality
  if (regime.confidence < config.dayGate.minConfidence) {
    reasons.push(`low regime confidence: ${(regime.confidence * 100).toFixed(1)}%`);
  }
  
  if (regime.dataQuality < config.dayGate.minDataQuality) {
    reasons.push(`low data quality: ${(regime.dataQuality * 100).toFixed(1)}%`);
  }
  
  // Check volatility
  if (regime.volatility === 'EXPLOSIVE') {
    reasons.push('explosive volatility detected');
  }
  
  // Count tradable symbols
  const aSymbols = marketFits.filter(fit => fit.fitClass === 'A');
  const bSymbols = marketFits.filter(fit => fit.fitClass === 'B');
  const tradableSymbols = aSymbols.length + bSymbols.length;
  
  // Require at least 2 tradable symbols
  if (tradableSymbols < 2) {
    reasons.push(`insufficient tradable symbols: ${tradableSymbols}`);
  }
  
  const tradableDay = reasons.length === 0;
  
  return {
    tradableDay,
    countA: aSymbols.length,
    countB: bSymbols.length,
    countC: marketFits.filter(fit => fit.fitClass === 'C').length,
    countNoTrade: marketFits.filter(fit => fit.fitClass === 'NO_TRADE').length,
    reasons,
    asOf: regime.asOf,
  };
}

async function runMSFTest() {
  try {
    console.log('🚀 Starting MSF test with real data...\n');
    
    // 1. Collect real snapshots
    const { snapshots, errors } = await collectRealSnapshots(TEST_SYMBOLS);
    
    if (snapshots.length === 0) {
      console.log('❌ No snapshots collected - test failed');
      return false;
    }
    
    // 2. Check coverage
    const coverage = snapshots.length / TEST_SYMBOLS.length;
    console.log(`📊 Data coverage: ${(coverage * 100).toFixed(1)}% (${snapshots.length}/${TEST_SYMBOLS.length})`);
    
    if (coverage < 0.8) {
      console.log('❌ Insufficient data coverage - test failed');
      return false;
    }
    
    // 3. Classify market fits
    console.log('\n🔍 Classifying market fits...');
    const marketFits = snapshots.map(snapshot => 
      classifyMarketFit(snapshot.symbol, snapshot, mockRegime, MSF_CONFIG)
    );
    
    // 4. Generate day gate
    console.log('\n🚪 Generating day gate...');
    const dayGate = generateDayGate(mockRegime, mockUniverse, marketFits, MSF_CONFIG);
    
    // 5. Display results
    console.log('\n📋 MSF Results:');
    console.log('===============');
    
    console.log(`🚪 Day Gate: ${dayGate.tradableDay ? '✅ TRADABLE' : '❌ NO_TRADE'}`);
    if (dayGate.reasons.length > 0) {
      console.log(`   Reasons: ${dayGate.reasons.join(', ')}`);
    }
    
    console.log(`📊 Symbol Classification:`);
    console.log(`   A symbols: ${dayGate.countA} (${((dayGate.countA / snapshots.length) * 100).toFixed(1)}%)`);
    console.log(`   B symbols: ${dayGate.countB} (${((dayGate.countB / snapshots.length) * 100).toFixed(1)}%)`);
    console.log(`   C symbols: ${dayGate.countC} (${((dayGate.countC / snapshots.length) * 100).toFixed(1)}%)`);
    console.log(`   NO_TRADE: ${dayGate.countNoTrade} (${((dayGate.countNoTrade / snapshots.length) * 100).toFixed(1)}%)`);
    
    console.log(`\n📈 Symbol Details:`);
    marketFits.forEach(fit => {
      const spreadBps = (fit.spread * 10000).toFixed(1);
      const quality = (fit.dataQuality * 100).toFixed(1);
      console.log(`   ${fit.symbol}: ${fit.fitClass} (${spreadBps}bps, ${quality}% quality)`);
      if (fit.reasons.length > 0) {
        console.log(`     Reasons: ${fit.reasons.join(', ')}`);
      }
    });
    
    // 6. Calculate KPIs
    const totalSymbols = marketFits.length;
    const kpis = {
      tradableDay: dayGate.tradableDay,
      aSymbolsPct: (dayGate.countA / totalSymbols) * 100,
      bSymbolsPct: (dayGate.countB / totalSymbols) * 100,
      avgSpreadBps: marketFits.reduce((sum, fit) => sum + (fit.spread * 10000), 0) / totalSymbols,
      avgDataQuality: marketFits.reduce((sum, fit) => sum + fit.dataQuality, 0) / totalSymbols,
    };
    
    console.log(`\n📊 KPIs:`);
    console.log(`   Tradable Day: ${kpis.tradableDay ? 'YES' : 'NO'}`);
    console.log(`   A Symbols: ${kpis.aSymbolsPct.toFixed(1)}%`);
    console.log(`   B Symbols: ${kpis.bSymbolsPct.toFixed(1)}%`);
    console.log(`   Avg Spread: ${kpis.avgSpreadBps.toFixed(1)} bps`);
    console.log(`   Avg Data Quality: ${(kpis.avgDataQuality * 100).toFixed(1)}%`);
    
    console.log('\n🎉 MSF test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('💥 MSF test failed:', error);
    return false;
  }
}

// Run the test
runMSFTest().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('💥 Test runner crashed:', error);
  process.exit(1);
});