#!/usr/bin/env node

// UCM Pipeline Test - Simplified version for testing
// This simulates the UCM pipeline without TypeScript compilation

console.log('🎯 Running UCM Pipeline Test...\n');

// Simulate eligibility data collection
async function simulateEligibilityCollection() {
  console.log('📊 Simulating eligibility data collection...');
  
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT'];
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
      console.log(`  ❌ ${symbol}: Failed to fetch data`);
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

// Simulate universe generation
function simulateUniverseGeneration(rankings) {
  console.log('🌌 Simulating universe generation...');
  
  const coreSymbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT'];
  const eligibleRankings = rankings.filter(r => r.eligible);
  const target = 20;
  const min = 12;
  const max = 25;
  
  // Select active symbols (simplified - no hysteresis for this test)
  let activeSymbols = [];
  
  // Add core symbols first (if eligible)
  coreSymbols.forEach(symbol => {
    const ranking = eligibleRankings.find(r => r.symbol === symbol);
    if (ranking) {
      activeSymbols.push(symbol);
    }
  });
  
  // Add non-core symbols up to target
  const nonCoreEligible = eligibleRankings.filter(r => !coreSymbols.includes(r.symbol));
  const remainingSlots = Math.min(target - activeSymbols.length, nonCoreEligible.length);
  
  for (let i = 0; i < remainingSlots; i++) {
    activeSymbols.push(nonCoreEligible[i].symbol);
  }
  
  const universeActive = {
    v: 'ucm.active.v1',
    asOf: Date.now(),
    target,
    min,
    max,
    symbols: activeSymbols,
    coreIncluded: coreSymbols.every(s => activeSymbols.includes(s)),
    meta: {
      added: activeSymbols, // All are new in this test
      removed: [],
      blacklisted: []
    }
  };
  
  console.log(`  🎯 Target: ${target}, Generated: ${activeSymbols.length}`);
  console.log(`  🔥 Core included: ${universeActive.coreIncluded ? 'Yes' : 'No'}`);
  console.log(`  📋 Active symbols: ${activeSymbols.join(', ')}`);
  
  return universeActive;
}

// Main pipeline simulation
async function runUCMPipelineTest() {
  try {
    console.log('🚀 Starting UCM Pipeline Test...\n');
    
    // Step 1: Collect eligibility data
    const eligibilitySnapshots = await simulateEligibilityCollection();
    console.log(`\n✅ Collected ${eligibilitySnapshots.length} eligibility snapshots\n`);
    
    if (eligibilitySnapshots.length === 0) {
      console.log('❌ No eligibility data collected. Cannot proceed.');
      return;
    }
    
    // Step 2: Rank symbols
    const rankings = simulateRanking(eligibilitySnapshots);
    const eligibleCount = rankings.filter(r => r.eligible).length;
    console.log(`\n✅ Ranked ${rankings.length} symbols (${eligibleCount} eligible)\n`);
    
    // Step 3: Generate universe
    const universeActive = simulateUniverseGeneration(rankings);
    console.log(`\n✅ Generated active universe with ${universeActive.symbols.length} symbols\n`);
    
    // Step 4: Summary
    console.log('📊 UCM Pipeline Test Summary:');
    console.log('=' .repeat(50));
    console.log(`✅ Eligibility Collection: ${eligibilitySnapshots.length} snapshots`);
    console.log(`✅ Ranking Algorithm: ${rankings.length} symbols ranked`);
    console.log(`✅ Universe Generation: ${universeActive.symbols.length} active symbols`);
    console.log(`✅ Core Symbols Included: ${universeActive.coreIncluded ? 'Yes' : 'No'}`);
    
    const avgScore = rankings.reduce((sum, r) => sum + r.rankScore, 0) / rankings.length;
    console.log(`📈 Average Rank Score: ${avgScore.toFixed(2)}`);
    console.log(`🎯 Eligible Symbols: ${eligibleCount}/${rankings.length} (${(eligibleCount/rankings.length*100).toFixed(1)}%)`);
    
    console.log('\n🎉 UCM Pipeline Test Completed Successfully!');
    console.log('\n📝 Next Steps:');
    console.log('1. Implement real database storage');
    console.log('2. Add hysteresis logic for stability');
    console.log('3. Create API endpoints for dashboard');
    console.log('4. Add monitoring and alerting');
    
    return universeActive;
    
  } catch (error) {
    console.error('❌ UCM Pipeline Test Failed:', error.message);
    return null;
  }
}

// Run the test
runUCMPipelineTest();