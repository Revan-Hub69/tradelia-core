// Test Input Canon with real data
// Run: node test-input-canon.js

// Updated with latest live data
const testData = {
  symbol: "BTCUSDT",
  ts: Date.now(),
  source: "dashboard",
  regime: {
    version: "regime-4h-v1",
    regime: "TREND",
    stress: false,
    keptPrevious: true,
    metrics: {
      atr14: 725.3829108281786,
      ema20: 90005.26755946325,
      ema50: 89106.11114135226,
      ema200: 88984.42513263122,
      trendStrength: 1.2395610713856053,
      rangeRatio: 6.897736251171732,
      returnsStd20: 0.0035601419555910713,
      emaState: "aligned_strong"
    },
    allowedSetups: ["trend_pullback"],
    forbiddenSetups: ["range_rejection"]
  },
  universe: {
    meta: { anchorSymbol: "BTCUSDT", topN: 10, source: "rest+ws" },
    long: [
      {
        symbol: "BTCUSDT",
        side: "LONG",
        scores: { tradeability: 100, regimeMatch: 84, total: 84 },
        htf: {
          price: 91244.42,
          atrPct4h: 0.7949887903591021,
          regime: "TREND",
          bias: "BULL",
          stress: false,
          trendStrength: 1.2395610713856053,
          emaState: "aligned_strong"
        },
        ws: {
          bid: 91244.41,
          ask: 91244.42,
          spreadBpsNow: 0.0010959574889883735,
          spreadMeanBps60s: 0.0017110862797488351,
          msgRate60s: 2796,
          lastUpdateAgeSec: 0.493
        },
        reasons: { blocks: [], warnings: [], info: ["WS_OK", "SPREAD_OK", "ATR_OK", "REGIME_TREND", "BIAS_BULL"] }
      },
      {
        symbol: "ETHUSDT",
        side: "LONG",
        scores: { tradeability: 100, regimeMatch: 96, total: 96 },
        htf: {
          price: 3136.5,
          atrPct4h: 1.0249319383365607,
          regime: "TREND",
          bias: "BULL",
          trendStrength: 1.650227699329194,
          emaState: "aligned_strong"
        },
        ws: {
          spreadBpsNow: 0.031882620943433145,
          msgRate60s: 1888,
          lastUpdateAgeSec: 0.594
        },
        reasons: { blocks: [], warnings: [], info: ["WS_OK", "SPREAD_OK", "ATR_OK", "REGIME_TREND", "BIAS_BULL"] }
      },
      {
        symbol: "SUIUSDT",
        side: "LONG",
        scores: { tradeability: 97, regimeMatch: 98, total: 95 },
        htf: {
          price: 1.6991,
          atrPct4h: 2.120449537672634,
          regime: "TREND",
          bias: "BULL",
          trendStrength: 2.1281467376291845,
          emaState: "aligned_strong"
        },
        ws: {
          spreadBpsNow: 0.5884602936416218,
          msgRate60s: 617,
          lastUpdateAgeSec: 0.748
        },
        reasons: { blocks: [], warnings: [], info: ["WS_OK", "SPREAD_OK", "ATR_OK", "REGIME_TREND", "BIAS_BULL"] }
      }
    ],
    short: [
      {
        symbol: "GIGGLEUSDT",
        side: "SHORT",
        scores: { tradeability: 71, regimeMatch: 45, total: 32 },
        htf: {
          price: 77.5,
          atrPct4h: 3.589112757351318,
          regime: "TRANSITION",
          bias: "NEUTRAL"
        },
        ws: {
          spreadBpsNow: 1.2902393393981182,
          msgRate60s: 726,
          lastUpdateAgeSec: 1.018
        },
        reasons: { blocks: [], warnings: ["SPREAD_JITTER_HIGH", "IMPACT_HIGH"], info: ["WS_OK", "REGIME_TRANSITION"] }
      }
    ]
  }
};

async function testInputCanon() {
  console.log("🧪 Testing Input Canon with Real Data...\n");
  
  // Test BRICK1_ONLY
  console.log("=== BRICK1_ONLY Test ===");
  try {
    const response = await fetch("http://localhost:3000/api/trading/ai/nasa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "BRICK1_ONLY",
        input: testData
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log("✅ Status:", response.status);
      console.log("📊 Input Canon:");
      console.log(JSON.stringify(result.input_canon, null, 2));
      console.log("\n📋 Audit:");
      console.log("  Coverage:", result.output?.audit?.input_coverage_pct + "%");
      console.log("  Sanity Checks:");
      result.output?.audit?.sanity_checks?.forEach(c => {
        console.log(`    ${c.pass ? '✅' : '❌'} ${c.name}: ${c.detail}`);
      });
      console.log("\n🎯 AI Decision:");
      console.log("  State:", result.output?.status?.state);
      console.log("  GO/NO_GO:", result.output?.status?.go_no_go);
      console.log("  Confidence:", result.output?.status?.confidence + "%");
    } else {
      console.log("❌ Error:", result.error);
      console.log("  Details:", result.details || result.failed_checks);
      if (result.audit) {
        console.log("  Coverage:", result.coverage + "%");
        console.log("  Sanity Checks:");
        result.audit?.sanity_checks?.forEach(c => {
          console.log(`    ${c.pass ? '✅' : '❌'} ${c.name}: ${c.detail}`);
        });
      }
    }
  } catch (err) {
    console.log("💥 Request failed:", err.message);
  }
  
  // Verify ATR calculation manually
  console.log("\n=== Manual ATR Verification ===");
  const btcPrice = 91232.52;
  const atr14 = 725.3829;
  const atrFrac = atr14 / btcPrice;
  console.log(`BTC Price: $${btcPrice}`);
  console.log(`ATR14: ${atr14}`);
  console.log(`ATR Fraction: ${atrFrac.toFixed(6)} (${(atrFrac * 100).toFixed(2)}%)`);
  console.log(`Expected from htf.atrPct4h: 0.795%`);
  console.log(`Match: ${Math.abs(atrFrac * 100 - 0.795) < 0.01 ? '✅' : '❌'}`);
}

testInputCanon();
