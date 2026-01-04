// Debug ATR calculation
async function debugATR() {
  console.log("🔍 Debug ATR Calculation...");
  
  // Simulate the data structure from UI
  const testInput = {
    symbol: "BTCUSDT",
    ts: Date.now(),
    source: "dashboard",
    market: {
      anchor: {
        symbol: "BTCUSDT",
        regime4h: {
          regime: "TREND",
          stress: false,
          metrics: {
            atr14: 725.3829,  // This is the problematic value
            trendStrength: 1.2427,
            rangeRatio: 6.8977,
            returnsStd: 0.1,
            ema20: 45000,
            ema50: 44000,
            ema200: 43000
          }
        },
        ts: Date.now(),
        spread_bps: 2.5,
        htf: {
          price: 91000  // BTC price
        }
      }
    }
  };

  try {
    console.log("📤 Input data:");
    console.log("ATR14:", testInput.market.anchor.regime4h.metrics.atr14);
    console.log("Price:", testInput.market.anchor.htf.price);
    console.log("Expected ATR fraction:", testInput.market.anchor.regime4h.metrics.atr14 / testInput.market.anchor.htf.price);
    
    const response = await fetch("http://localhost:3000/api/trading/ai/nasa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "BRICK1_ONLY",
        input: testInput
      })
    });

    console.log("📊 Response status:", response.status);
    
    const result = await response.json();
    console.log("📋 Response:", JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error("💥 Error:", error.message);
  }
}

debugATR();