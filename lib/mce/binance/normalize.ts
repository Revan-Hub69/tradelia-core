// Binance Data Normalization and Validation
// Converts raw Binance API responses to MCE canonical format

import { z } from "zod";
import { KlineSchema, type KlineType } from "../schemas";
import { type Symbol, type TF, MCEError, DataQualityError } from "../types";

// Raw Binance kline array structure
interface BinanceKlineRaw extends Array<string | number> {
  0: number;  // Open time
  1: string;  // Open
  2: string;  // High
  3: string;  // Low
  4: string;  // Close
  5: string;  // Volume
  6: number;  // Close time
  7: string;  // Quote asset volume
  8: number;  // Number of trades
  9: string;  // Taker buy base asset volume
  10: string; // Taker buy quote asset volume
  11: string; // Ignore
}

// Normalize single Binance kline to MCE format
export function normalizeBinanceKline(
  raw: BinanceKlineRaw,
  symbol: Symbol,
  tf: TF
): KlineType {
  try {
    // Extract and convert data types
    const kline = {
      symbol,
      tf,
      openTime: Number(raw[0]),
      closeTime: Number(raw[6]),
      open: parseFloat(raw[1] as string),
      high: parseFloat(raw[2] as string),
      low: parseFloat(raw[3] as string),
      close: parseFloat(raw[4] as string),
      volume: parseFloat(raw[5] as string),
      trades: Number(raw[8]),
    };

    // Validate using Zod schema
    const validated = KlineSchema.parse(kline);
    
    return validated;
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new DataQualityError(
        `Invalid kline data: ${error.issues.map(e => e.message).join(", ")}`,
        { raw, symbol, tf, zodErrors: error.issues }
      );
    }
    
    throw new MCEError(
      `Failed to normalize Binance kline: ${error instanceof Error ? error.message : 'Unknown error'}`,
      "NORMALIZATION_ERROR",
      { raw, symbol, tf, originalError: error }
    );
  }
}

// Normalize array of Binance klines
export function normalizeBinanceKlines(
  rawKlines: BinanceKlineRaw[],
  symbol: Symbol,
  tf: TF
): KlineType[] {
  const normalized: KlineType[] = [];
  const errors: Array<{ index: number; error: Error }> = [];

  for (let i = 0; i < rawKlines.length; i++) {
    try {
      const kline = normalizeBinanceKline(rawKlines[i], symbol, tf);
      normalized.push(kline);
    } catch (error) {
      errors.push({ index: i, error: error as Error });
    }
  }

  // If we have too many errors, fail the entire batch
  const errorRate = errors.length / rawKlines.length;
  if (errorRate > 0.05) { // More than 5% errors
    throw new DataQualityError(
      `Too many normalization errors: ${errors.length}/${rawKlines.length} (${(errorRate * 100).toFixed(1)}%)`,
      { symbol, tf, errors: errors.slice(0, 10) } // Include first 10 errors
    );
  }

  // Log warnings for individual errors but continue
  if (errors.length > 0) {
    console.warn(`MCE: Skipped ${errors.length} invalid klines for ${symbol} ${tf}`);
  }

  return normalized;
}

// Validate kline sequence for gaps and ordering
export function validateKlineSequence(
  klines: KlineType[],
  expectedInterval: TF
): {
  valid: boolean;
  gaps: Array<{ after: number; expected: number; actual: number }>;
  outOfOrder: Array<{ index: number; time: number; prevTime: number }>;
  duplicates: Array<{ index: number; time: number }>;
} {
  const gaps: Array<{ after: number; expected: number; actual: number }> = [];
  const outOfOrder: Array<{ index: number; time: number; prevTime: number }> = [];
  const duplicates: Array<{ index: number; time: number }> = [];
  
  if (klines.length === 0) {
    return { valid: true, gaps, outOfOrder, duplicates };
  }

  // Calculate expected interval in milliseconds
  const intervalMs = getIntervalMs(expectedInterval);
  
  // Track seen timestamps for duplicate detection
  const seenTimes = new Set<number>();
  
  for (let i = 0; i < klines.length; i++) {
    const kline = klines[i];
    
    // Check for duplicates
    if (seenTimes.has(kline.openTime)) {
      duplicates.push({ index: i, time: kline.openTime });
      continue;
    }
    seenTimes.add(kline.openTime);
    
    // Check ordering (skip first kline)
    if (i > 0) {
      const prevKline = klines[i - 1];
      
      // Check if current kline is before previous (out of order)
      if (kline.openTime <= prevKline.openTime) {
        outOfOrder.push({
          index: i,
          time: kline.openTime,
          prevTime: prevKline.openTime,
        });
        continue;
      }
      
      // Check for gaps (missing intervals)
      const expectedTime = prevKline.openTime + intervalMs;
      if (kline.openTime > expectedTime) {
        gaps.push({
          after: prevKline.openTime,
          expected: expectedTime,
          actual: kline.openTime,
        });
      }
    }
  }
  
  const valid = gaps.length === 0 && outOfOrder.length === 0 && duplicates.length === 0;
  
  return { valid, gaps, outOfOrder, duplicates };
}

// Calculate data completeness for a time range
export function calculateCompleteness(
  klines: KlineType[],
  startTime: number,
  endTime: number,
  interval: TF
): {
  completeness: number; // 0-1
  expected: number;
  actual: number;
  gaps: number;
} {
  if (klines.length === 0) {
    return { completeness: 0, expected: 0, actual: 0, gaps: 0 };
  }

  const intervalMs = getIntervalMs(interval);
  const expected = Math.floor((endTime - startTime) / intervalMs);
  
  // Count actual klines within the time range
  const actual = klines.filter(
    k => k.openTime >= startTime && k.openTime < endTime
  ).length;
  
  const gaps = Math.max(0, expected - actual);
  const completeness = expected > 0 ? actual / expected : 0;
  
  return { completeness, expected, actual, gaps };
}

// Check data freshness
export function calculateFreshness(
  klines: KlineType[],
  interval: TF,
  now: number = Date.now()
): {
  freshnessSec: number;
  isStale: boolean;
  lastDataTime: number | null;
} {
  if (klines.length === 0) {
    return {
      freshnessSec: Infinity,
      isStale: true,
      lastDataTime: null,
    };
  }

  // Find the most recent kline
  const lastKline = klines.reduce((latest, current) =>
    current.closeTime > latest.closeTime ? current : latest
  );

  const freshnessSec = (now - lastKline.closeTime) / 1000;
  
  // Consider data stale if it's more than 2 intervals old
  const intervalMs = getIntervalMs(interval);
  const staleThreshold = (intervalMs * 2) / 1000; // Convert to seconds
  const isStale = freshnessSec > staleThreshold;

  return {
    freshnessSec,
    isStale,
    lastDataTime: lastKline.closeTime,
  };
}

// Utility function to get interval in milliseconds
function getIntervalMs(interval: TF): number {
  const intervals: Record<TF, number> = {
    "1m": 60_000,
    "5m": 300_000,
    "15m": 900_000,
    "1h": 3_600_000,
    "4h": 14_400_000,
  };
  
  return intervals[interval];
}

// Remove duplicate klines (keep the first occurrence)
export function deduplicateKlines(klines: KlineType[]): KlineType[] {
  const seen = new Set<string>();
  const deduplicated: KlineType[] = [];
  
  for (const kline of klines) {
    // Create unique key from symbol, tf, and openTime
    const key = `${kline.symbol}-${kline.tf}-${kline.openTime}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(kline);
    }
  }
  
  return deduplicated;
}

// Sort klines by openTime (ascending)
export function sortKlines(klines: KlineType[]): KlineType[] {
  return [...klines].sort((a, b) => a.openTime - b.openTime);
}

// Clean and prepare klines for processing
export function cleanKlines(klines: KlineType[]): {
  cleaned: KlineType[];
  removed: {
    duplicates: number;
    outOfOrder: number;
  };
} {
  // Remove duplicates
  const deduplicated = deduplicateKlines(klines);
  const duplicatesRemoved = klines.length - deduplicated.length;
  
  // Sort by time
  const sorted = sortKlines(deduplicated);
  
  // Note: We don't remove out-of-order items after sorting,
  // but we track how many were reordered
  const outOfOrderCount = klines.length - sorted.length;
  
  return {
    cleaned: sorted,
    removed: {
      duplicates: duplicatesRemoved,
      outOfOrder: outOfOrderCount,
    },
  };
}

// Validate that kline data makes sense (basic sanity checks)
export function validateKlineData(kline: KlineType): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check OHLC relationships
  if (kline.high < kline.low) {
    errors.push("High price is less than low price");
  }
  
  if (kline.high < kline.open || kline.high < kline.close) {
    errors.push("High price is less than open or close price");
  }
  
  if (kline.low > kline.open || kline.low > kline.close) {
    errors.push("Low price is greater than open or close price");
  }
  
  // Check for reasonable price values (not zero, not negative)
  if (kline.open <= 0 || kline.high <= 0 || kline.low <= 0 || kline.close <= 0) {
    errors.push("Price values must be positive");
  }
  
  // Check volume
  if (kline.volume < 0) {
    errors.push("Volume cannot be negative");
  }
  
  // Check time relationship
  if (kline.closeTime <= kline.openTime) {
    errors.push("Close time must be after open time");
  }
  
  // Check for reasonable price ranges (detect obvious errors)
  const priceRange = kline.high - kline.low;
  const avgPrice = (kline.high + kline.low) / 2;
  const rangePercent = (priceRange / avgPrice) * 100;
  
  // Flag if price range is more than 50% (likely data error)
  if (rangePercent > 50) {
    errors.push(`Suspicious price range: ${rangePercent.toFixed(1)}%`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}