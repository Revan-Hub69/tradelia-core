#!/usr/bin/env node

/**
 * UCM Development Simulation Script
 * 
 * FOR DEVELOPMENT/TESTING ONLY - NOT FOR PRODUCTION
 * 
 * This script simulates UCM pipeline execution with mock data
 * and provides detailed debugging information.
 */

console.log('🎯 UCM Development Simulation\n');

// Copy the existing simulation logic from ucm-run-once.mjs
// but mark it clearly as development-only

// Simulate eligibility data collection
async function simulateEligibilityCollection() {
  console.log('📊 Simulating eligibility data collection...');
  
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT', 'LINKUSDT'];
  const eligibilitySnapshots = [];
  
  for (const symbol of symbols) {
    // Simulate fetching 24h ticker data
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const ticker = await response.json();
      
      if (ticker.symbol) {
        const snapshot = {
          symbol,
          as_of: Date.now(),
          vol_quote_24h: parseFloat(ticker.quoteVolume),
          spread_bps: Math.random() * 10 + 2, // 2-12 bps simulation
          completeness_60m: 0.99 + Math.random() * 0.01, // 99-100%
          gaps_60m: Math.random() < 0.1 ? 1 : 0, // 10% chance of 1 gap
          atr14_1m: Math.random() * 0.002 + 0.001, // 0.001-0.003
          atr_percentile_1m: Math.random() * 100 // 0-100
        };
        
        eligibilitySnapshots.push(snapshot);
        console.log(`  ✅ ${symbol}: Vol=${(snapshot.vol_quote_24h/1e6).toFixed(0)}M, Spread=${snapshot.spread_bps.toFixed(1)}bps`);
      }
    } catch (error) {
      console.log(`  ❌ ${symbol}: Failed to fetch data - ${error.message}`);
    }
  }
  
  return eligibilitySnapshots;
}

// Simulate ranking algorithm
function simulateRanking(snapshots) {
  console.log('🏆 Simulating ranking algorithm...');
  
  const rankings = snapshots.map(snapshot => {
    // Simplified ranking score calculation
    const volScore = Math.min(100, (snapshot.vol_quote_24h / 1e9) * 100); // Normalize to 0-100
    const frictionScore = Math.max(0, 100 - (snapshot.spread_bps * 5)); // Lower spread = higher score
    const qualityScore = snapshot.completeness_60m * 100;
    
    const rankScore = (0.55 * volScore) + (0.25 * frictionScore) + (0.20 * qualityScore);
    
    const eligible = snapshot.completeness_60m >= 0.99 && 
                    snapshot.gaps_60m === 0 && 
                    snapshot.spread_bps <= 25 &&
                    snapshot.atr14_1m >= 0.0005;
    
    return {
      symbol: snapshot.symbol,
      rankScore: Math.round(rankScore * 100) / 100,
      eligible,
      volScore: Math.round(volScore),
      frictionScore: Math.round(frictionScore),
      qualityScore: Math.round(qualityScore)
    };
  });
  
  // Sort by rank score
  rankings.sort((a, b) => b.rankScore - a.rankScore);
  
  rankings.forEach((rank, index) => {
    const status = rank.eligible ? '✅' : '❌';
    console.log(`  ${index + 1}. ${status} ${rank.symbol}: Score=${rank.rankScore} (Vol=${rank.volScore}, Friction=${rank.frictionScore}, Quality=${rank.qualityScore})`);
  });
  
  return rankings;
}

// Simulate universe generation with hysteresis
function simulateUniverseGeneration(rankings) {
  console.log('🌌 Simulating universe generation with hysteresis...');
  
  const coreSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT'];
  const eligibleRankings = rankings.filter(r => r.eligible);
  const target = 20;
  const min = 12;
  const max = 25;
  
  // Simulate previous universe (for hysteresis)
  const previousUniverse = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT', 'ADAUSDT', 'DOTUSDT'];
  
  // Select active symbols with hysteresis simulation
  let activeSymbols = [];
  
  // Add core symbols first (if eligible)
  coreSymbols.forEach(symbol => {
    const ranking = eligibleRankings.find(r => r.symbol === symbol);
    if (ranking) {
      activeSymbols.push(symbol);
    }
  });
  
  // Add previous symbols that are still eligible (hysteresis effect)
  previousUniverse.forEach(symbol => {
    if (!activeSymbols.includes(symbol)) {
      const ranking = eligibleRankings.find(r => r.symbol === symbol);
      if (ranking && ranking.rankScore > 60) { // Lower threshold for existing symbols
        activeSymbols.push(symbol);
      }
    }
  });
  
  // Add new symbols up to target
  const nonIncludedEligible = eligibleRankings.filter(r => !activeSymbols.includes(r.symbol));
  const remainingSlots = Math.min(target - activeSymbols.length, nonIncludedEligible.length);
  
  for (let i = 0; i < remainingSlots; i++) {
    if (nonIncludedEligible[i].rankScore > 70) { // Higher threshold for new symbols
      activeSymbols.push(nonIncludedEligible[i].symbol);
    }
  }
  
  // Calculate turnover
  const added = activeSymbols.filter(s => !previousUniverse.includes(s));
  const removed = previousUniverse.filter(s => !activeSymbols.includes(s));
  
  const universeActive = {
    v: 'ucm.active.v1',
    asOf: Date.now(),
    target,
    min,
    max,
    symbols: activeSymbols,
    coreIncluded: coreSymbols.every(s => activeSymbols.includes(s)),
    meta: {
      added,
      removed,
      blacklisted: []
    }
  };
  
  console.log(`  🎯 Target: ${target}, Generated: ${activeSymbols.length}`);
  console.log(`  🔥 Core included: ${universeActive.coreIncluded ? 'Yes' : 'No'}`);
  console.log(`  ➕ Added: ${added.length} symbols (${added.join(', ') || 'none'})`);
  console.log(`  ➖ Removed: ${removed.length} symbols (${removed.join(', ') || 'none'})`);
  console.log(`  📋 Active symbols: ${activeSymbols.join(', ')}`);
  
  return { universeActive, turnover: { added, removed } };
}

// Main pipeline simulation
async function runUCMSimulation() {
  try {
    console.log('🚀 Starting UCM Development Simulation...\n');
    
    // Step 1: Collect eligibility data
    const eligibilitySnapshots = await simulateEligibilityCollection();
    console.log(`\n✅ Collected ${eligibilitySnapshots.length} eligibility snapshots\n`);
    
    if (eligibilitySnapshots.length === 0) {
      console.log('❌ No eligibility data collected. Cannot proceed.');
      return { success: false, error: 'No data collected' };
    }
    
    // Step 2: Rank symbols
    const rankings = simulateRanking(eligibilitySnapshots);
    const eligibleCount = rankings.filter(r => r.eligible).length;
    console.log(`\n✅ Ranked ${rankings.length} symbols (${eligibleCount} eligible)\n`);
    
    // Step 3: Generate universe with hysteresis
    const { universeActive, turnover } = simulateUniverseGeneration(rankings);
    console.log(`\n✅ Generated active universe with ${universeActive.symbols.length} symbols\n`);
    
    // Step 4: Summary with KPIs
    console.log('📊 UCM Simulation Summary:');
    console.log('=' .repeat(60));
    console.log(`✅ Eligibility Collection: ${eligibilitySnapshots.length} snapshots`);
    console.log(`✅ Ranking Algorithm: ${rankings.length} symbols ranked`);
    console.log(`✅ Universe Generation: ${universeActive.symbols.length} active symbols`);
    console.log(`✅ Core Symbols Included: ${universeActive.coreIncluded ? 'Yes' : 'No'}`);
    
    const avgScore = rankings.reduce((sum, r) => sum + r.rankScore, 0) / rankings.length;
    const turnoverRate = (turnover.added.length + turnover.removed.length) / universeActive.symbols.length;
    
    console.log(`📈 Average Rank Score: ${avgScore.toFixed(2)}`);
    console.log(`🎯 Eligible Symbols: ${eligibleCount}/${rankings.length} (${(eligibleCount/rankings.length*100).toFixed(1)}%)`);
    console.log(`🔄 Turnover Rate: ${(turnoverRate * 100).toFixed(1)}% (${turnover.added.length + turnover.removed.length} changes)`);
    
    // KPI Validation
    console.log('\n🎯 KPI Validation:');
    const kpiResults = [];
    
    if (universeActive.symbols.length >= 12 && universeActive.symbols.length <= 25) {
      kpiResults.push('✅ Universe size within bounds');
    } else {
      kpiResults.push(`❌ Universe size out of bounds: ${universeActive.symbols.length}`);
    }
    
    if (turnoverRate <= 0.5) {
      kpiResults.push('✅ Turnover rate acceptable');
    } else {
      kpiResults.push(`❌ Turnover rate too high: ${(turnoverRate * 100).toFixed(1)}%`);
    }
    
    if (universeActive.coreIncluded) {
      kpiResults.push('✅ All core symbols included');
    } else {
      kpiResults.push('❌ Missing core symbols');
    }
    
    if (eligibleCount >= 12) {
      kpiResults.push('✅ Sufficient eligible symbols');
    } else {
      kpiResults.push(`❌ Insufficient eligible symbols: ${eligibleCount}`);
    }
    
    kpiResults.forEach(result => console.log(`  ${result}`));
    
    const allKPIsPassed = kpiResults.every(r => r.startsWith('✅'));
    
    console.log('\n🎉 UCM Simulation Completed!');
    console.log(`📊 Overall Status: ${allKPIsPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log('\n📝 Next Steps:');
    console.log('1. Use scripts/prod/ucm-pipeline.mjs for production runs');
    console.log('2. Check /api/health for system status');
    console.log('3. Monitor turnover rates in production');
    console.log('4. Validate hysteresis behavior over time');
    
    return {
      success: allKPIsPassed,
      universeActive,
      turnover,
      eligibilityCount: eligibleCount,
      rankings,
      kpis: {
        universeSize: universeActive.symbols.length,
        turnoverRate,
        coreIncluded: universeActive.coreIncluded,
        eligibleCount
      }
    };
    
  } catch (error) {
    console.error('❌ UCM Simulation Failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run simulation
runUCMSimulation();