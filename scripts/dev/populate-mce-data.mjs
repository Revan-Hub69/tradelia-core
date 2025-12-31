#!/usr/bin/env node

// Populate MCE data using Binance API directly
// This bypasses TypeScript compilation issues

console.log('🚀 Populating MCE data for UCM testing...');

// Simple Binance API call to get kline data
async function fetchBinanceKlines(symbol, interval = '1m', limit = 100) {
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }
    
    const klines = await response.json();
    return klines.map(k => ({
      symbol,
      tf: interval,
      open_time: parseInt(k[0]),
      close_time: parseInt(k[6]),
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
      quote_volume: parseFloat(k[7]),
      trades: parseInt(k[8])
    }));
  } catch (error) {
    console.error(`Failed to fetch ${symbol} data:`, error.message);
    return [];
  }
}

// Calculate simple ATR
function calculateATR(klines, period = 14) {
  if (klines.length < period + 1) return 0.001;
  
  const trs = [];
  for (let i = 1; i < klines.length; i++) {
    const high = klines[i].high;
    const low = klines[i].low;
    const prevClose = klines[i-1].close;
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trs.push(tr);
  }
  
  // Simple moving average of TR
  const recentTRs = trs.slice(-period);
  return recentTRs.reduce((sum, tr) => sum + tr, 0) / recentTRs.length;
}

async function populateMCEData() {
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT', 'SOLUSDT'];
  
  console.log(`📊 Fetching data for ${symbols.length} symbols...`);
  
  for (const symbol of symbols) {
    console.log(`  Processing ${symbol}...`);
    
    const klines = await fetchBinanceKlines(symbol, '1m', 200);
    if (klines.length === 0) continue;
    
    // Calculate ATR for each kline
    const klinesWithATR = klines.map((kline, index) => {
      const atr14 = index >= 14 ? calculateATR(klines.slice(0, index + 1), 14) : 0.001;
      return {
        ...kline,
        atr14_1m: atr14
      };
    });
    
    console.log(`    ✅ ${symbol}: ${klinesWithATR.length} klines with ATR`);
  }
  
  console.log('\n🎉 MCE data simulation complete!');
  console.log('📝 Note: This is a simplified simulation for testing.');
  console.log('💡 For production, use the full MCE pipeline with proper database storage.');
  
  return true;
}

// Run the population
populateMCEData().catch(console.error);