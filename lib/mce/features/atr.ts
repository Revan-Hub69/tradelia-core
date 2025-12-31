// Average True Range (ATR) calculation
// Scale-invariant volatility measurement

import { type KlineType } from "../schemas";
import { atr, trueRange, sma, isValidNumber, roundTo } from "../utils/math";

export interface ATRResult {
  atr14: number | null;
  atr50: number | null;
  currentTR: number | null;
  atrPct7d: number | null;   // ATR percentile in 7-day window
  atrPct30d: number | null;  // ATR percentile in 30-day window
}

// Calculate ATR for multiple periods
export function calculateATR(
  klines: KlineType[],
  periods: number[] = [14, 50]
): Partial<ATRResult> {
  if (klines.length < 2) {
    return {
      atr14: null,
      atr50: null,
      currentTR: null,
    };
  }

  // Extract price arrays
  const highs = klines.map(k => k.high);
  const lows = klines.map(k => k.low);
  const closes = klines.map(k => k.close);

  const result: Partial<ATRResult> = {};

  // Calculate ATR for each period
  for (const period of periods) {
    const atrValue = atr(highs, lows, closes, period);
    
    if (period === 14) {
      result.atr14 = atrValue !== null ? roundTo(atrValue, 6) : null;
    } else if (period === 50) {
      result.atr50 = atrValue !== null ? roundTo(atrValue, 6) : null;
    }
  }

  // Calculate current True Range
  if (klines.length >= 2) {
    const lastKline = klines[klines.length - 1];
    const prevKline = klines[klines.length - 2];
    
    const currentTR = trueRange(lastKline.high, lastKline.low, prevKline.close);
    result.currentTR = roundTo(currentTR, 6);
  }

  return result;
}

// Calculate ATR percentiles for volatility classification
export function calculateATRPercentiles(
  klines: KlineType[],
  lookbackDays: number[] = [7, 30]
): Pick<ATRResult, "atrPct7d" | "atrPct30d"> {
  const result: Pick<ATRResult, "atrPct7d" | "atrPct30d"> = {
    atrPct7d: null,
    atrPct30d: null,
  };

  if (klines.length < 15) { // Need at least 15 periods for ATR14
    return result;
  }

  // Calculate ATR14 for all periods
  const atr14Values: number[] = [];
  
  for (let i = 14; i < klines.length; i++) {
    const window = klines.slice(0, i + 1);
    const highs = window.map(k => k.high);
    const lows = window.map(k => k.low);
    const closes = window.map(k => k.close);
    
    const atrValue = atr(highs, lows, closes, 14);
    if (atrValue !== null && isValidNumber(atrValue)) {
      atr14Values.push(atrValue);
    }
  }

  if (atr14Values.length === 0) {
    return result;
  }

  const currentATR = atr14Values[atr14Values.length - 1];

  // Calculate percentiles for different lookback periods
  for (const days of lookbackDays) {
    // Approximate periods per day (assuming 1m timeframe base)
    const periodsPerDay = 1440; // 24 * 60 minutes
    const lookbackPeriods = days * periodsPerDay;
    
    // Get ATR values for the lookback window
    const windowStart = Math.max(0, atr14Values.length - lookbackPeriods);
    const windowATRs = atr14Values.slice(windowStart);
    
    if (windowATRs.length < 10) { // Need minimum data
      continue;
    }

    // Calculate percentile of current ATR in the window
    const sortedATRs = [...windowATRs].sort((a, b) => a - b);
    const percentile = calculatePercentileRank(currentATR, sortedATRs);
    
    if (days === 7) {
      result.atrPct7d = roundTo(percentile, 2);
    } else if (days === 30) {
      result.atrPct30d = roundTo(percentile, 2);
    }
  }

  return result;
}

// Calculate percentile rank of a value in a sorted array
function calculatePercentileRank(value: number, sortedArray: number[]): number {
  if (sortedArray.length === 0) {
    return 50; // Default to median if no data
  }

  let count = 0;
  for (const item of sortedArray) {
    if (item < value) {
      count++;
    } else if (item === value) {
      count += 0.5; // Count half for equal values
    }
  }

  return (count / sortedArray.length) * 100;
}

// Classify volatility based on ATR percentiles
export function classifyVolatility(
  atrPct7d: number | null,
  atrPct30d: number | null,
  thresholds: { compressed: number; expanded: number } = { compressed: 30, expanded: 70 }
): "compressed" | "normal" | "expanded" {
  // Use 7-day percentile as primary, 30-day as fallback
  const primaryPct = atrPct7d ?? atrPct30d;
  
  if (primaryPct === null) {
    return "normal"; // Default if no data
  }

  if (primaryPct <= thresholds.compressed) {
    return "compressed";
  } else if (primaryPct >= thresholds.expanded) {
    return "expanded";
  } else {
    return "normal";
  }
}

// Calculate ATR-based trend strength (normalized by volatility)
export function calculateATRTrendStrength(
  klines: KlineType[],
  emaDiff: number | null,
  atr14: number | null
): number | null {
  if (emaDiff === null || atr14 === null || atr14 === 0) {
    return null;
  }

  // Normalize EMA difference by ATR to get scale-invariant trend strength
  const trendStrength = Math.abs(emaDiff) / atr14;
  
  // Clamp to 0-1 range (values > 1 indicate very strong trends)
  return roundTo(Math.min(1, trendStrength), 4);
}

// Validate ATR calculation inputs
export function validateATRInputs(klines: KlineType[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (klines.length < 2) {
    errors.push("Need at least 2 klines for ATR calculation");
  }

  // Check for valid OHLC data
  for (let i = 0; i < klines.length; i++) {
    const kline = klines[i];
    
    if (!isValidNumber(kline.high) || !isValidNumber(kline.low) || !isValidNumber(kline.close)) {
      errors.push(`Invalid price data at index ${i}`);
      continue;
    }

    if (kline.high < kline.low) {
      errors.push(`High < Low at index ${i}`);
    }

    if (kline.high < kline.close || kline.low > kline.close) {
      errors.push(`Close outside High-Low range at index ${i}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Calculate ATR with full validation and error handling
export function calculateATRSafe(
  klines: KlineType[],
  periods: number[] = [14, 50],
  lookbackDays: number[] = [7, 30]
): ATRResult {
  const defaultResult: ATRResult = {
    atr14: null,
    atr50: null,
    currentTR: null,
    atrPct7d: null,
    atrPct30d: null,
  };

  // Validate inputs
  const validation = validateATRInputs(klines);
  if (!validation.valid) {
    console.warn("ATR calculation validation failed:", validation.errors);
    return defaultResult;
  }

  try {
    // Calculate basic ATR values
    const atrValues = calculateATR(klines, periods);
    
    // Calculate percentiles
    const percentiles = calculateATRPercentiles(klines, lookbackDays);
    
    return {
      ...defaultResult,
      ...atrValues,
      ...percentiles,
    };

  } catch (error) {
    console.error("ATR calculation failed:", error);
    return defaultResult;
  }
}