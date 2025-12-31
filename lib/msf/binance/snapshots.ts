// MSF Binance Snapshots - Real Data Collection
// Collects symbol snapshots from Binance API for MSF classification

import { binanceClient, isValidBinanceSymbol } from "../../mce/binance/client";
import { SymbolSnapshot, MSFError } from "../types";
import { supabaseAdmin } from "../../mce/db/supabase";
import { getBinanceConfig } from "../../config/binance";

// Configuration for snapshot collection
export interface SnapshotConfig {
  lookbackHours: number;        // Hours of data to analyze
  minKlines: number;           // Minimum klines required
  timeout: number;             // Timeout per symbol (ms)
  maxConcurrent: number;       // Max concurrent requests
}

const DEFAULT_SNAPSHOT_CONFIG: SnapshotConfig = {
  lookbackHours: 24,           // 24 hours of data
  minKlines: 100,              // At least 100 data points
  timeout: 10000,              // 10s timeout per symbol
  maxConcurrent: 3,            // 3 concurrent requests (conservative)
};

// Collect real symbol snapshots from Binance
export async function collectRealSymbolSnapshots(
  symbols: string[],
  config: SnapshotConfig = DEFAULT_SNAPSHOT_CONFIG
): Promise<SymbolSnapshot[]> {
  console.log(`📸 Collecting real snapshots for ${symbols.length} symbols...`);
  
  // Validate symbols
  const validSymbols = symbols.filter(symbol => {
    if (!isValidBinanceSymbol(symbol)) {
      console.warn(`⚠️ Invalid symbol format: ${symbol}`);
      return false;
    }
    return true;
  });
  
  if (validSymbols.length === 0) {
    throw new MSFError('No valid symbols to collect snapshots for', 'INVALID_SYMBOLS');
  }
  
  console.log(`✅ Processing ${validSymbols.length} valid symbols`);
  
  // Collect snapshots with concurrency control
  const snapshots: SymbolSnapshot[] = [];
  const errors: string[] = [];
  
  // Process symbols in batches to control concurrency
  for (let i = 0; i < validSymbols.length; i += config.maxConcurrent) {
    const batch = validSymbols.slice(i, i + config.maxConcurrent);
    
    const batchPromises = batch.map(symbol => 
      collectSingleSnapshot(symbol, config)
        .catch(error => {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`${symbol}: ${errorMsg}`);
          return null;
        })
    );
    
    const batchResults = await Promise.all(batchPromises);
    
    // Add successful snapshots
    batchResults.forEach(snapshot => {
      if (snapshot) {
        snapshots.push(snapshot);
      }
    });
    
    // Small delay between batches to be nice to Binance
    if (i + config.maxConcurrent < validSymbols.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log(`✅ Collected ${snapshots.length}/${validSymbols.length} snapshots`);
  
  if (errors.length > 0) {
    console.warn(`⚠️ Errors: ${errors.length}`);
    errors.forEach(error => console.warn(`  ${error}`));
  }
  
  return snapshots;
}

// Collect snapshot for a single symbol
async function collectSingleSnapshot(
  symbol: string,
  config: SnapshotConfig
): Promise<SymbolSnapshot> {
  const startTime = Date.now();
  
  try {
    // Get recent klines (1m interval for granular analysis)
    const lookbackMs = config.lookbackHours * 60 * 60 * 1000;
    const klinesNeeded = Math.min(config.lookbackHours * 60, 1000); // Max 1000 from Binance
    
    console.log(`  📊 ${symbol}: Fetching ${klinesNeeded} klines...`);
    
    const klines = await Promise.race([
      binanceClient.getRecentKlines(symbol, '1m', klinesNeeded),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), config.timeout)
      )
    ]);
    
    if (klines.length < config.minKlines) {
      throw new MSFError(
        `Insufficient data: ${klines.length} < ${config.minKlines} required`,
        'INSUFFICIENT_DATA'
      );
    }
    
    // Calculate snapshot metrics
    const snapshot = calculateSnapshotMetrics(symbol, klines, startTime);
    
    console.log(`  ✅ ${symbol}: spread ${(snapshot.spread * 10000).toFixed(1)}bps, ` +
                `gaps ${snapshot.gaps}, quality ${(snapshot.completeness * 100).toFixed(1)}%`);
    
    return snapshot;
    
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    throw new MSFError(`Failed to collect snapshot for ${symbol}: ${errorMsg}`, 'COLLECTION_FAILED');
  }
}

// Calculate snapshot metrics from klines data
function calculateSnapshotMetrics(
  symbol: string,
  klines: any[],
  collectionTime: number
): SymbolSnapshot {
  // Extract OHLCV data
  const closes = klines.map(k => parseFloat(k[4])); // Close prices
  const volumes = klines.map(k => parseFloat(k[5])); // Volumes
  const highs = klines.map(k => parseFloat(k[2])); // High prices
  const lows = klines.map(k => parseFloat(k[3])); // Low prices
  const times = klines.map(k => k[0] as number); // Open times
  
  // Calculate spread (estimated from high-low range)
  // Note: This is not true bid-ask spread, but price volatility proxy
  const avgPrice = closes.reduce((sum, price) => sum + price, 0) / closes.length;
  const avgRange = klines.reduce((sum, k) => {
    const high = parseFloat(k[2]);
    const low = parseFloat(k[3]);
    return sum + (high - low);
  }, 0) / klines.length;
  
  const estimatedSpread = avgRange / avgPrice; // As percentage
  
  // Calculate ATR (Average True Range) - 14 period
  const atrPeriod = Math.min(14, klines.length - 1);
  let atrSum = 0;
  
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
  
  // Calculate gaps (missing time periods)
  const expectedInterval = 60 * 1000; // 1 minute in ms
  let gaps = 0;
  
  for (let i = 1; i < times.length; i++) {
    const timeDiff = times[i] - times[i-1];
    if (timeDiff > expectedInterval * 1.5) { // Allow 50% tolerance
      gaps += Math.floor(timeDiff / expectedInterval) - 1;
    }
  }
  
  // Calculate completeness
  const expectedKlines = klines.length;
  const actualKlines = klines.length - gaps;
  const completeness = Math.max(0, actualKlines / expectedKlines);
  
  // Calculate 24h volume
  const volume24h = volumes.reduce((sum, vol) => sum + vol, 0);
  
  // Get last update time
  const lastUpdate = Math.max(...times);
  
  return {
    symbol,
    spread: estimatedSpread,
    atr,
    gaps,
    completeness,
    volume24h,
    lastUpdate,
  };
}

// Get orderbook-based spread (more accurate but requires additional API call)
export async function getOrderbookSpread(symbol: string): Promise<number> {
  try {
    const config = getBinanceConfig();
    const url = `${config.baseUrl}/api/v3/ticker/bookTicker?symbol=${symbol}`;
    
    const response = await fetch(url, {
      headers: { "User-Agent": config.userAgent },
      signal: AbortSignal.timeout(5000),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    const bid = parseFloat(data.bidPrice);
    const ask = parseFloat(data.askPrice);
    
    if (bid <= 0 || ask <= 0 || ask <= bid) {
      throw new Error('Invalid orderbook data');
    }
    
    const spread = (ask - bid) / ((ask + bid) / 2); // Percentage spread
    return spread;
    
  } catch (error) {
    console.warn(`⚠️ Failed to get orderbook spread for ${symbol}:`, error);
    return 0; // Fallback to 0 if orderbook unavailable
  }
}

// Enhanced snapshot collection with orderbook data
export async function collectEnhancedSnapshots(
  symbols: string[],
  config: SnapshotConfig = DEFAULT_SNAPSHOT_CONFIG
): Promise<SymbolSnapshot[]> {
  console.log(`📸 Collecting enhanced snapshots with orderbook data...`);
  
  // First collect basic snapshots
  const basicSnapshots = await collectRealSymbolSnapshots(symbols, config);
  
  // Enhance with orderbook spreads (best effort)
  const enhancedSnapshots = await Promise.all(
    basicSnapshots.map(async (snapshot) => {
      try {
        const orderbookSpread = await getOrderbookSpread(snapshot.symbol);
        if (orderbookSpread > 0) {
          // Use orderbook spread if available and reasonable
          return {
            ...snapshot,
            spread: orderbookSpread,
          };
        }
      } catch (error) {
        // Keep original spread if orderbook fails
      }
      
      return snapshot;
    })
  );
  
  console.log(`✅ Enhanced ${enhancedSnapshots.length} snapshots with orderbook data`);
  
  return enhancedSnapshots;
}

// Health check for Binance connectivity
export async function checkBinanceHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  error?: string;
}> {
  return binanceClient.healthCheck();
}

// Save snapshots to database for analysis/debugging
export async function saveSnapshotsToDb(snapshots: SymbolSnapshot[]): Promise<void> {
  if (snapshots.length === 0) return;
  
  try {
    const sb = supabaseAdmin();
    const timestamp = Date.now();
    
    const rows = snapshots.map(snapshot => ({
      symbol: snapshot.symbol,
      collected_at: timestamp,
      spread_pct: snapshot.spread,
      atr: snapshot.atr,
      gaps: snapshot.gaps,
      completeness: snapshot.completeness,
      volume_24h: snapshot.volume24h,
      last_update: snapshot.lastUpdate,
      snapshot_data: snapshot,
    }));
    
    const { error } = await sb
      .from('msf_snapshots')
      .insert(rows);
    
    if (error) {
      console.warn('Failed to save snapshots to database:', error);
    } else {
      console.log(`💾 Saved ${snapshots.length} snapshots to database`);
    }
    
  } catch (error) {
    console.warn('Error saving snapshots:', error);
  }
}