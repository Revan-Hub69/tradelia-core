// UCM Data Collection Pipeline - Collect eligibility data for universe selection
// Integrates with existing MCE data and Binance API to gather required metrics

import { EligibilitySnapshotType, EligibilityError } from "../schemas";
import { UCM_CONFIG } from "../config";
import { BinanceClient } from "../../mce/binance/client";
import { supabaseAdmin } from "../../mce/db/supabase";
import { roundTo } from "../../mce/utils/math";

export interface CollectionResult {
  snapshots: EligibilitySnapshotType[];
  errors: string[];
  stats: {
    requested: number;
    collected: number;
    failed: number;
    avgCompleteness: number;
    avgSpread: number;
  };
}

export async function collectEligibilitySnapshots(
  symbols: string[]
): Promise<EligibilitySnapshotType[]> {
  const result = await collectEligibilitySnapshotsWithStats(symbols);
  return result.snapshots;
}

export async function collectEligibilitySnapshotsWithStats(
  symbols: string[]
): Promise<CollectionResult> {
  const errors: string[] = [];
  const snapshots: EligibilitySnapshotType[] = [];
  const asOf = Date.now();
  
  try {
    // Process symbols in batches to avoid overwhelming APIs
    const batchSize = UCM_CONFIG.DATA_COLLECTION.max_symbols_per_batch;
    const batches = [];
    
    for (let i = 0; i < symbols.length; i += batchSize) {
      batches.push(symbols.slice(i, i + batchSize));
    }
    
    for (const batch of batches) {
      const batchSnapshots = await collectBatchSnapshots(batch, asOf);
      snapshots.push(...batchSnapshots.snapshots);
      errors.push(...batchSnapshots.errors);
    }
    
    // Calculate stats
    const stats = calculateCollectionStats(symbols, snapshots);
    
    return {
      snapshots,
      errors,
      stats,
    };
    
  } catch (error) {
    throw new EligibilityError(
      `Failed to collect eligibility snapshots: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

interface BatchCollectionResult {
  snapshots: EligibilitySnapshotType[];
  errors: string[];
}

async function collectBatchSnapshots(
  symbols: string[],
  asOf: number
): Promise<BatchCollectionResult> {
  const snapshots: EligibilitySnapshotType[] = [];
  const errors: string[] = [];
  
  try {
    // 1. Collect 24h ticker data from Binance (for volume and spread)
    const tickerData = await collect24hTickerData(symbols);
    
    // 2. Collect ATR and completeness data from MCE database
    const mceData = await collectMCEData(symbols);
    
    // 3. Combine data into eligibility snapshots
    for (const symbol of symbols) {
      try {
        const ticker = tickerData.get(symbol);
        const mce = mceData.get(symbol);
        
        if (!ticker) {
          errors.push(`Missing ticker data for ${symbol}`);
          continue;
        }
        
        if (!mce) {
          errors.push(`Missing MCE data for ${symbol}`);
          continue;
        }
        
        const snapshot: EligibilitySnapshotType = {
          symbol,
          asOf,
          volQuote_24h: ticker.volume,
          spreadBps: ticker.spreadBps,
          completeness_60m: mce.completeness,
          gaps_60m: mce.gaps,
          atr14_1m: mce.atr14,
          atrPercentile_1m: mce.atrPercentile,
        };
        
        snapshots.push(snapshot);
        
      } catch (error) {
        errors.push(`Failed to create snapshot for ${symbol}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
  } catch (error) {
    errors.push(`Batch collection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return { snapshots, errors };
}

interface TickerData {
  volume: number;
  spreadBps: number;
}

async function collect24hTickerData(symbols: string[]): Promise<Map<string, TickerData>> {
  const tickerMap = new Map<string, TickerData>();
  
  try {
    const binanceClient = new BinanceClient();
    
    // Get 24h ticker statistics
    const tickers = await binanceClient.get24hTicker();
    
    for (const symbol of symbols) {
      const ticker = tickers.find(t => t.symbol === symbol);
      
      if (ticker) {
        // Calculate spread from price and count (proxy)
        // Note: This is a simplified spread calculation
        // In production, you might want to use order book data
        const price = parseFloat(ticker.lastPrice);
        const spreadBps = calculateSpreadProxy(ticker);
        
        tickerMap.set(symbol, {
          volume: parseFloat(ticker.quoteVolume),
          spreadBps: roundTo(spreadBps, 2),
        });
      }
    }
    
  } catch (error) {
    throw new EligibilityError(`Failed to collect 24h ticker data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return tickerMap;
}

function calculateSpreadProxy(ticker: any): number {
  // Simplified spread calculation based on price change and volume
  // This is a proxy since we don't have real-time order book data
  
  const price = parseFloat(ticker.lastPrice);
  const priceChange = Math.abs(parseFloat(ticker.priceChangePercent));
  const volume = parseFloat(ticker.volume);
  
  // Base spread estimate (very rough approximation)
  let spreadBps = 5; // Default 5 bps for major pairs
  
  // Adjust based on price volatility
  if (priceChange > 5) spreadBps += 10; // High volatility = wider spread
  else if (priceChange > 2) spreadBps += 5;
  
  // Adjust based on volume (lower volume = wider spread)
  if (volume < 1000) spreadBps += 20;
  else if (volume < 10000) spreadBps += 10;
  else if (volume < 100000) spreadBps += 5;
  
  return Math.min(spreadBps, 100); // Cap at 100 bps
}

interface MCEData {
  completeness: number;
  gaps: number;
  atr14: number;
  atrPercentile: number;
}

async function collectMCEData(symbols: string[]): Promise<Map<string, MCEData>> {
  const mceMap = new Map<string, MCEData>();
  
  try {
    // Get data quality and ATR from MCE market_data table
    const windowStart = Date.now() - (UCM_CONFIG.DATA_COLLECTION.completeness_window_minutes * 60 * 1000);
    
    for (const symbol of symbols) {
      try {
        // Get recent market data for completeness calculation
        const { data: marketData, error: marketError } = await supabaseAdmin
          .from('market_data')
          .select('open_time, atr14_1m')
          .eq('symbol', symbol)
          .eq('tf', '1m')
          .gte('open_time', windowStart)
          .order('open_time', { ascending: true });
        
        if (marketError) {
          throw new Error(`Market data query failed: ${marketError.message}`);
        }
        
        if (!marketData || marketData.length === 0) {
          // No data available
          mceMap.set(symbol, {
            completeness: 0,
            gaps: 999,
            atr14: 0.001, // Minimum ATR to avoid division by zero
            atrPercentile: 0,
          });
          continue;
        }
        
        // Calculate completeness and gaps
        const expectedBars = UCM_CONFIG.DATA_COLLECTION.completeness_window_minutes;
        const actualBars = marketData.length;
        const completeness = Math.min(1, actualBars / expectedBars);
        
        // Count gaps (simplified - just missing bars)
        const gaps = Math.max(0, expectedBars - actualBars);
        
        // Get latest ATR14
        const latestData = marketData[marketData.length - 1];
        const atr14 = latestData?.atr14_1m || 0.001;
        
        // Calculate ATR percentile (simplified - would need historical window)
        const atrPercentile = await calculateATRPercentile(symbol, atr14);
        
        mceMap.set(symbol, {
          completeness: roundTo(completeness, 4),
          gaps,
          atr14: roundTo(atr14, 6),
          atrPercentile: roundTo(atrPercentile, 2),
        });
        
      } catch (error) {
        // Set default values for failed symbols
        mceMap.set(symbol, {
          completeness: 0,
          gaps: 999,
          atr14: 0.001,
          atrPercentile: 0,
        });
      }
    }
    
  } catch (error) {
    throw new EligibilityError(`Failed to collect MCE data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return mceMap;
}

async function calculateATRPercentile(symbol: string, currentATR: number): Promise<number> {
  try {
    // Get historical ATR data for percentile calculation
    const windowStart = Date.now() - (UCM_CONFIG.DATA_COLLECTION.atr_percentile_window * 60 * 1000);
    
    const { data: historicalData, error } = await supabaseAdmin
      .from('market_data')
      .select('atr14_1m')
      .eq('symbol', symbol)
      .eq('tf', '1m')
      .gte('open_time', windowStart)
      .order('open_time', { ascending: true });
    
    if (error || !historicalData || historicalData.length < 50) {
      // Not enough data for reliable percentile, return middle value
      return 50;
    }
    
    // Calculate percentile
    const atrValues = historicalData
      .map(d => d.atr14_1m)
      .filter(atr => atr > 0)
      .sort((a, b) => a - b);
    
    if (atrValues.length === 0) return 50;
    
    // Find position of current ATR in sorted array
    let position = 0;
    for (let i = 0; i < atrValues.length; i++) {
      if (currentATR > atrValues[i]) {
        position = i + 1;
      } else {
        break;
      }
    }
    
    const percentile = (position / atrValues.length) * 100;
    return Math.min(100, Math.max(0, percentile));
    
  } catch (error) {
    // Return default percentile on error
    return 50;
  }
}

function calculateCollectionStats(
  requested: string[],
  collected: EligibilitySnapshotType[]
): CollectionResult['stats'] {
  const requestedCount = requested.length;
  const collectedCount = collected.length;
  const failedCount = requestedCount - collectedCount;
  
  const avgCompleteness = collected.length > 0 
    ? collected.reduce((sum, s) => sum + s.completeness_60m, 0) / collected.length
    : 0;
  
  const avgSpread = collected.length > 0
    ? collected.reduce((sum, s) => sum + s.spreadBps, 0) / collected.length
    : 0;
  
  return {
    requested: requestedCount,
    collected: collectedCount,
    failed: failedCount,
    avgCompleteness: roundTo(avgCompleteness, 4),
    avgSpread: roundTo(avgSpread, 2),
  };
}

// Utility functions for data collection
export async function validateDataCollection(
  snapshots: EligibilitySnapshotType[]
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalSymbols: number;
    validSymbols: number;
    eligibleSymbols: number;
    blacklistCandidates: number;
  };
}> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  let validSymbols = 0;
  let eligibleSymbols = 0;
  let blacklistCandidates = 0;
  
  for (const snapshot of snapshots) {
    try {
      // Validate snapshot data
      if (snapshot.volQuote_24h < 0) {
        errors.push(`${snapshot.symbol}: Negative volume`);
        continue;
      }
      
      if (snapshot.spreadBps < 0 || snapshot.spreadBps > 1000) {
        errors.push(`${snapshot.symbol}: Invalid spread (${snapshot.spreadBps} bps)`);
        continue;
      }
      
      if (snapshot.completeness_60m < 0 || snapshot.completeness_60m > 1) {
        errors.push(`${snapshot.symbol}: Invalid completeness (${snapshot.completeness_60m})`);
        continue;
      }
      
      if (snapshot.atr14_1m <= 0) {
        errors.push(`${snapshot.symbol}: Invalid ATR (${snapshot.atr14_1m})`);
        continue;
      }
      
      validSymbols++;
      
      // Check eligibility
      if (snapshot.completeness_60m >= 0.99 && 
          snapshot.gaps_60m === 0 && 
          snapshot.spreadBps <= UCM_CONFIG.SPREAD_ENTER_MAX &&
          snapshot.atr14_1m >= UCM_CONFIG.ATR_MIN) {
        eligibleSymbols++;
      }
      
      // Check blacklist candidates
      if (snapshot.completeness_60m < UCM_CONFIG.HARD_DQ.completeness_60m ||
          snapshot.gaps_60m > 0 ||
          snapshot.spreadBps > UCM_CONFIG.SPREAD_HARD_MAX) {
        blacklistCandidates++;
      }
      
      // Warnings for edge cases
      if (snapshot.completeness_60m < 0.95) {
        warnings.push(`${snapshot.symbol}: Low completeness (${(snapshot.completeness_60m * 100).toFixed(1)}%)`);
      }
      
      if (snapshot.spreadBps > 25) {
        warnings.push(`${snapshot.symbol}: High spread (${snapshot.spreadBps} bps)`);
      }
      
    } catch (error) {
      errors.push(`${snapshot.symbol}: Validation error - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalSymbols: snapshots.length,
      validSymbols,
      eligibleSymbols,
      blacklistCandidates,
    },
  };
}

export function getCollectionSummary(result: CollectionResult): string {
  const { snapshots, errors, stats } = result;
  
  const successRate = stats.requested > 0 ? (stats.collected / stats.requested * 100).toFixed(1) : '0';
  
  return [
    `Collection Summary:`,
    `- Requested: ${stats.requested} symbols`,
    `- Collected: ${stats.collected} symbols (${successRate}%)`,
    `- Failed: ${stats.failed} symbols`,
    `- Avg Completeness: ${(stats.avgCompleteness * 100).toFixed(1)}%`,
    `- Avg Spread: ${stats.avgSpread} bps`,
    errors.length > 0 ? `- Errors: ${errors.length}` : '',
  ].filter(Boolean).join('\n');
}