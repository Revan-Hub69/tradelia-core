// Volume analysis for market context
// Volume normalization and trend detection

import { type KlineType } from "../schemas";
import { sma, zScore, standardDeviation, isValidNumber, roundTo, normalize } from "../utils/math";

export interface VolumeResult {
  volNorm: number | null;     // 0-1 normalized volume
  volMA: number | null;       // Volume moving average
  volZ: number | null;        // Volume z-score
  volTrend: "increasing" | "decreasing" | "stable" | null;
}

// Calculate volume moving average
export function calculateVolumeMA(
  klines: KlineType[],
  period: number = 20
): number | null {
  if (klines.length < period) {
    return null;
  }

  const volumes = klines.map(k => k.volume);
  const volMA = sma(volumes, period);
  
  return volMA !== null ? roundTo(volMA, 2) : null;
}

// Normalize volume to 0-1 range based on recent history
export function normalizeVolume(
  klines: KlineType[],
  lookbackPeriods: number = 100
): number | null {
  if (klines.length === 0) {
    return null;
  }

  const currentVolume = klines[klines.length - 1].volume;
  
  // Use available data if less than lookback
  const windowSize = Math.min(lookbackPeriods, klines.length);
  const recentKlines = klines.slice(-windowSize);
  
  const volumes = recentKlines.map(k => k.volume);
  const minVol = Math.min(...volumes);
  const maxVol = Math.max(...volumes);
  
  // Normalize current volume
  const normalized = normalize(currentVolume, minVol, maxVol);
  
  return roundTo(normalized, 4);
}

// Calculate volume z-score (standard deviations from mean)
export function calculateVolumeZScore(
  klines: KlineType[],
  period: number = 50
): number | null {
  if (klines.length < period) {
    return null;
  }

  const volumes = klines.slice(-period).map(k => k.volume);
  const currentVolume = klines[klines.length - 1].volume;
  
  const mean = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  const stdDev = standardDeviation(volumes);
  
  if (stdDev === 0) {
    return 0; // No variation in volume
  }

  const zScoreValue = zScore(currentVolume, mean, stdDev);
  
  return roundTo(zScoreValue, 3);
}

// Detect volume trend over recent periods
export function detectVolumeTrend(
  klines: KlineType[],
  shortPeriod: number = 5,
  longPeriod: number = 20
): "increasing" | "decreasing" | "stable" | null {
  if (klines.length < longPeriod) {
    return null;
  }

  const volumes = klines.map(k => k.volume);
  
  const shortMA = sma(volumes.slice(-shortPeriod), shortPeriod);
  const longMA = sma(volumes.slice(-longPeriod), longPeriod);
  
  if (shortMA === null || longMA === null) {
    return null;
  }

  const difference = (shortMA - longMA) / longMA;
  const threshold = 0.1; // 10% threshold for trend detection
  
  if (difference > threshold) {
    return "increasing";
  } else if (difference < -threshold) {
    return "decreasing";
  } else {
    return "stable";
  }
}

// Calculate volume-weighted average price (VWAP) for context
export function calculateVWAP(
  klines: KlineType[],
  period?: number
): number | null {
  if (klines.length === 0) {
    return null;
  }

  const windowKlines = period ? klines.slice(-period) : klines;
  
  if (windowKlines.length === 0) {
    return null;
  }

  let totalVolumePrice = 0;
  let totalVolume = 0;
  
  for (const kline of windowKlines) {
    // Use typical price (HLC/3) weighted by volume
    const typicalPrice = (kline.high + kline.low + kline.close) / 3;
    totalVolumePrice += typicalPrice * kline.volume;
    totalVolume += kline.volume;
  }
  
  if (totalVolume === 0) {
    return null;
  }
  
  return roundTo(totalVolumePrice / totalVolume, 6);
}

// Analyze volume in relation to price movement
export function analyzeVolumePrice(
  klines: KlineType[],
  period: number = 10
): {
  volumePriceCorrelation: number | null;
  volumeConfirmation: "confirmed" | "divergent" | "neutral";
} {
  if (klines.length < period + 1) {
    return {
      volumePriceCorrelation: null,
      volumeConfirmation: "neutral",
    };
  }

  const recentKlines = klines.slice(-period);
  
  // Calculate price changes and volume changes
  const priceChanges: number[] = [];
  const volumeChanges: number[] = [];
  
  for (let i = 1; i < recentKlines.length; i++) {
    const prevKline = recentKlines[i - 1];
    const currKline = recentKlines[i];
    
    const priceChange = (currKline.close - prevKline.close) / prevKline.close;
    const volumeChange = (currKline.volume - prevKline.volume) / prevKline.volume;
    
    priceChanges.push(priceChange);
    volumeChanges.push(volumeChange);
  }
  
  // Calculate correlation
  let correlation: number | null = null;
  if (priceChanges.length > 0) {
    const n = priceChanges.length;
    const sumX = priceChanges.reduce((sum, val) => sum + val, 0);
    const sumY = volumeChanges.reduce((sum, val) => sum + val, 0);
    const sumXY = priceChanges.reduce((sum, val, i) => sum + val * volumeChanges[i], 0);
    const sumX2 = priceChanges.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = volumeChanges.reduce((sum, val) => sum + val * val, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    if (denominator !== 0) {
      correlation = roundTo(numerator / denominator, 3);
    }
  }
  
  // Determine volume confirmation
  let volumeConfirmation: "confirmed" | "divergent" | "neutral" = "neutral";
  
  if (correlation !== null) {
    if (correlation > 0.3) {
      volumeConfirmation = "confirmed"; // Volume confirms price movement
    } else if (correlation < -0.3) {
      volumeConfirmation = "divergent"; // Volume diverges from price
    }
  }
  
  return {
    volumePriceCorrelation: correlation,
    volumeConfirmation,
  };
}

// Validate volume data
export function validateVolumeInputs(klines: KlineType[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (klines.length === 0) {
    errors.push("No klines provided for volume analysis");
  }

  // Check for valid volume data
  for (let i = 0; i < klines.length; i++) {
    const volume = klines[i].volume;
    
    if (!isValidNumber(volume) || volume < 0) {
      errors.push(`Invalid volume at index ${i}: ${volume}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Calculate volume metrics with full validation
export function calculateVolumeSafe(
  klines: KlineType[],
  periods: { ma: number; zscore: number; norm: number } = { ma: 20, zscore: 50, norm: 100 }
): VolumeResult {
  const defaultResult: VolumeResult = {
    volNorm: null,
    volMA: null,
    volZ: null,
    volTrend: null,
  };

  // Validate inputs
  const validation = validateVolumeInputs(klines);
  if (!validation.valid) {
    console.warn("Volume calculation validation failed:", validation.errors);
    return defaultResult;
  }

  try {
    // Calculate volume metrics
    const volMA = calculateVolumeMA(klines, periods.ma);
    const volNorm = normalizeVolume(klines, periods.norm);
    const volZ = calculateVolumeZScore(klines, periods.zscore);
    const volTrend = detectVolumeTrend(klines);
    
    return {
      volNorm,
      volMA,
      volZ,
      volTrend,
    };

  } catch (error) {
    console.error("Volume calculation failed:", error);
    return defaultResult;
  }
}

// Get volume profile summary
export function getVolumeProfile(klines: KlineType[]): {
  avgVolume: number | null;
  maxVolume: number | null;
  minVolume: number | null;
  volumeStdDev: number | null;
  highVolumeThreshold: number | null; // 2 std devs above mean
} {
  if (klines.length === 0) {
    return {
      avgVolume: null,
      maxVolume: null,
      minVolume: null,
      volumeStdDev: null,
      highVolumeThreshold: null,
    };
  }

  const volumes = klines.map(k => k.volume);
  
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  const maxVolume = Math.max(...volumes);
  const minVolume = Math.min(...volumes);
  const volumeStdDev = standardDeviation(volumes);
  const highVolumeThreshold = avgVolume + (2 * volumeStdDev);
  
  return {
    avgVolume: roundTo(avgVolume, 2),
    maxVolume: roundTo(maxVolume, 2),
    minVolume: roundTo(minVolume, 2),
    volumeStdDev: roundTo(volumeStdDev, 2),
    highVolumeThreshold: roundTo(highVolumeThreshold, 2),
  };
}