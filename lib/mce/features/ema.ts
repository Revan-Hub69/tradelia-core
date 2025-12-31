// Exponential Moving Average (EMA) calculation
// Trend detection and strength measurement

import { type KlineType } from "../types";
import { ema, isValidNumber, roundTo, percentageChange } from "../utils/math";

export interface EMAResult {
  emaFast: number | null;    // EMA 20 (fast)
  emaSlow: number | null;    // EMA 50 (slow)
  emaDiff: number | null;    // Fast - Slow (raw difference)
  emaDiffPct: number | null; // Percentage difference
  trendStrength: number | null; // 0-1 normalized trend strength
}

// Calculate EMA for multiple periods
export function calculateEMA(
  klines: KlineType[],
  periods: number[] = [20, 50]
): Pick<EMAResult, "emaFast" | "emaSlow" | "emaDiff" | "emaDiffPct"> {
  const result: Pick<EMAResult, "emaFast" | "emaSlow" | "emaDiff" | "emaDiffPct"> = {
    emaFast: null,
    emaSlow: null,
    emaDiff: null,
    emaDiffPct: null,
  };

  if (klines.length === 0) {
    return result;
  }

  // Extract close prices
  const closes = klines.map(k => k.close);

  // Calculate EMAs for each period
  for (const period of periods) {
    const emaValue = ema(closes, period);
    
    if (emaValue !== null && isValidNumber(emaValue)) {
      if (period === 20) {
        result.emaFast = roundTo(emaValue, 6);
      } else if (period === 50) {
        result.emaSlow = roundTo(emaValue, 6);
      }
    }
  }

  // Calculate EMA difference and percentage
  if (result.emaFast !== null && result.emaSlow !== null) {
    result.emaDiff = roundTo(result.emaFast - result.emaSlow, 6);
    
    const pctChange = percentageChange(result.emaSlow, result.emaFast);
    result.emaDiffPct = pctChange !== null ? roundTo(pctChange, 4) : null;
  }

  return result;
}

// Calculate trend strength based on EMA difference and price action
export function calculateTrendStrength(
  klines: KlineType[],
  emaFast: number | null,
  emaSlow: number | null,
  atr14: number | null = null
): number | null {
  if (klines.length === 0 || emaFast === null || emaSlow === null) {
    return null;
  }

  const currentPrice = klines[klines.length - 1].close;
  const emaDiff = emaFast - emaSlow;
  
  // Method 1: EMA difference normalized by current price (scale-invariant)
  let trendStrength = Math.abs(emaDiff) / currentPrice;
  
  // Method 2: If ATR is available, normalize by ATR (volatility-adjusted)
  if (atr14 !== null && atr14 > 0) {
    trendStrength = Math.abs(emaDiff) / atr14;
  }
  
  // Clamp to 0-1 range and apply smoothing
  trendStrength = Math.min(1, trendStrength);
  
  // Apply sigmoid-like smoothing to make values more interpretable
  // This maps small differences to lower values and larger differences to higher values
  const smoothed = 2 / (1 + Math.exp(-10 * trendStrength)) - 1;
  
  return roundTo(Math.max(0, smoothed), 4);
}

// Classify trend direction based on EMA relationship
export function classifyTrend(
  emaFast: number | null,
  emaSlow: number | null,
  currentPrice: number,
  trendStrength: number | null,
  minStrength: number = 0.3
): "up" | "down" | "range" {
  if (emaFast === null || emaSlow === null || trendStrength === null) {
    return "range"; // Default if no data
  }

  // Require minimum trend strength to avoid false signals
  if (trendStrength < minStrength) {
    return "range";
  }

  // Check EMA alignment and price position
  const emaAligned = emaFast > emaSlow;
  const priceAboveEMA = currentPrice > emaFast;
  
  if (emaAligned && priceAboveEMA) {
    return "up";
  } else if (!emaAligned && !priceAboveEMA) {
    return "down";
  } else {
    return "range"; // Mixed signals
  }
}

// Calculate EMA slope (rate of change)
export function calculateEMASlope(
  klines: KlineType[],
  period: number = 20,
  lookback: number = 5
): number | null {
  if (klines.length < period + lookback) {
    return null;
  }

  const closes = klines.map(k => k.close);
  
  // Calculate EMA for current and lookback periods
  const currentEMA = ema(closes, period);
  const lookbackEMA = ema(closes.slice(0, -lookback), period);
  
  if (currentEMA === null || lookbackEMA === null) {
    return null;
  }

  // Calculate slope as percentage change per period
  const slope = ((currentEMA - lookbackEMA) / lookbackEMA) * 100 / lookback;
  
  return roundTo(slope, 4);
}

// Detect EMA crossovers
export function detectEMACrossover(
  klines: KlineType[],
  fastPeriod: number = 20,
  slowPeriod: number = 50
): {
  crossover: "bullish" | "bearish" | "none";
  strength: number | null;
  barsAgo: number | null;
} {
  const result = {
    crossover: "none" as "bullish" | "bearish" | "none",
    strength: null as number | null,
    barsAgo: null as number | null,
  };

  if (klines.length < Math.max(fastPeriod, slowPeriod) + 5) {
    return result;
  }

  const closes = klines.map(k => k.close);
  
  // Calculate EMAs for recent periods
  const recentEMAs: Array<{ fast: number | null; slow: number | null }> = [];
  
  for (let i = Math.max(fastPeriod, slowPeriod); i < klines.length; i++) {
    const windowCloses = closes.slice(0, i + 1);
    const fastEMA = ema(windowCloses, fastPeriod);
    const slowEMA = ema(windowCloses, slowPeriod);
    
    recentEMAs.push({ fast: fastEMA, slow: slowEMA });
  }

  // Look for crossovers in recent periods (last 10 bars)
  const lookbackBars = Math.min(10, recentEMAs.length - 1);
  
  for (let i = recentEMAs.length - 1; i >= recentEMAs.length - lookbackBars; i--) {
    const current = recentEMAs[i];
    const previous = recentEMAs[i - 1];
    
    if (!current.fast || !current.slow || !previous.fast || !previous.slow) {
      continue;
    }

    const currentAbove = current.fast > current.slow;
    const previousAbove = previous.fast > previous.slow;
    
    // Detect crossover
    if (currentAbove && !previousAbove) {
      result.crossover = "bullish";
      result.barsAgo = recentEMAs.length - 1 - i;
      result.strength = Math.abs(current.fast - current.slow) / current.slow;
      break;
    } else if (!currentAbove && previousAbove) {
      result.crossover = "bearish";
      result.barsAgo = recentEMAs.length - 1 - i;
      result.strength = Math.abs(current.fast - current.slow) / current.slow;
      break;
    }
  }

  if (result.strength !== null) {
    result.strength = roundTo(result.strength, 4);
  }

  return result;
}

// Validate EMA calculation inputs
export function validateEMAInputs(klines: KlineType[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (klines.length === 0) {
    errors.push("No klines provided for EMA calculation");
  }

  // Check for valid close prices
  for (let i = 0; i < klines.length; i++) {
    const close = klines[i].close;
    
    if (!isValidNumber(close) || close <= 0) {
      errors.push(`Invalid close price at index ${i}: ${close}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Calculate EMA with full validation and error handling
export function calculateEMASafe(
  klines: KlineType[],
  periods: number[] = [20, 50],
  atr14: number | null = null
): EMAResult {
  const defaultResult: EMAResult = {
    emaFast: null,
    emaSlow: null,
    emaDiff: null,
    emaDiffPct: null,
    trendStrength: null,
  };

  // Validate inputs
  const validation = validateEMAInputs(klines);
  if (!validation.valid) {
    console.warn("EMA calculation validation failed:", validation.errors);
    return defaultResult;
  }

  try {
    // Calculate basic EMA values
    const emaValues = calculateEMA(klines, periods);
    
    // Calculate trend strength
    const trendStrength = calculateTrendStrength(
      klines,
      emaValues.emaFast,
      emaValues.emaSlow,
      atr14
    );
    
    return {
      ...emaValues,
      trendStrength,
    };

  } catch (error) {
    console.error("EMA calculation failed:", error);
    return defaultResult;
  }
}