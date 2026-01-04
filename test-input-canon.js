// Test Input Canon with real data
// Run: node test-input-canon.js

const testData = {
  symbol: "BTCUSDT",
  ts: Date.now(),
  source: "dashboard",
  regime: {
    version: "regime-4h-v1",
    regime: "TREND",
    stress: false,
    metrics: {
      atr14: 725.3829108281786,
      ema20: 90004.13422612991,
      ema50: 89105.6444746856,
      ema200: 88984.30672467101,
      trendStrength: 1.2386420165571557,
      rangeRatio: 6.897736251171732,
      returnsStd20: 0.0035650673912921574,
      emaState: "aligned_strong"
    }
  },
  universe: {
    meta: { anchorSymbol: "BTCUSDT", topN: 10 },
    long: [
      {
        symbol: "BTCUSDT",
        side: "LONG",
        scores: { tradeability: 100, regimeMatch: 84, total: 84 },
        htf: {
          price: 91232.52,
          atrPct4h: 0.7950924854735774,
          regime: "TREND",
          bias: "BULL",
          stress: false
        },
        ws: {
          bid: 91232.52,
          ask: 91232.53,
          spreadBpsNow: 0.001096100321103829,
          msgRate60s: 4180,
          lastUpdateAgeSec: 0.044
        }
      },
      {
        symbol: "ETHUSDT",
        side: "LONG",
        scores: { tradeability: 100, regimeMatch: 96, total: 96 },
        htf: {
          price: 3135.9,
          atrPct4h: 1.0251280412617183,
          regime: "TREND",
          bias: "BULL"
        },
        ws: {
          spreadBpsNow: 0.03188872111802983,
          msgRate60s: 3162,
          lastUpdateAgeSec: 0.397
        }
      }
    ],
    short: []
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
