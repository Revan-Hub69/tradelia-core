// Mathematical utilities for MCE calculations
// Scale-invariant and deterministic implementations

// Simple Moving Average (SMA)
export function sma(values: number[], period: number): number | null {
  if (values.length < period || period <= 0) {
    return null;
  }
  
  const sum = values.slice(-period).reduce((acc, val) => acc + val, 0);
  return sum / period;
}

// Exponential Moving Average (EMA)
export function ema(values: number[], period: number): number | null {
  if (values.length === 0 || period <= 0) {
    return null;
  }
  
  // Use SMA for the first value if we don't have enough data
  if (values.length < period) {
    return sma(values, values.length);
  }
  
  const multiplier = 2 / (period + 1);
  let emaValue = sma(values.slice(0, period), period);
  
  if (emaValue === null) {
    return null;
  }
  
  // Calculate EMA for remaining values
  for (let i = period; i < values.length; i++) {
    emaValue = (values[i] * multiplier) + (emaValue * (1 - multiplier));
  }
  
  return emaValue;
}

// True Range calculation
export function trueRange(high: number, low: number, prevClose: number): number {
  const hl = high - low;
  const hc = Math.abs(high - prevClose);
  const lc = Math.abs(low - prevClose);
  
  return Math.max(hl, hc, lc);
}

// Average True Range (ATR)
export function atr(
  highs: number[],
  lows: number[],
  closes: number[],
  period: number
): number | null {
  if (highs.length !== lows.length || lows.length !== closes.length) {
    throw new Error("Arrays must have equal length");
  }
  
  if (highs.length < period + 1 || period <= 0) {
    return null;
  }
  
  // Calculate True Range for each period
  const trValues: number[] = [];
  
  for (let i = 1; i < highs.length; i++) {
    const tr = trueRange(highs[i], lows[i], closes[i - 1]);
    trValues.push(tr);
  }
  
  // Calculate ATR as SMA of True Range values
  return sma(trValues, period);
}

// Percentile calculation (for volatility classification)
export function percentile(values: number[], p: number): number | null {
  if (values.length === 0 || p < 0 || p > 100) {
    return null;
  }
  
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  
  if (Number.isInteger(index)) {
    return sorted[index];
  }
  
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// Z-score calculation
export function zScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) {
    return 0;
  }
  
  return (value - mean) / stdDev;
}

// Standard deviation
export function standardDeviation(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return Math.sqrt(avgSquaredDiff);
}

// Normalize value to 0-1 range
export function normalize(value: number, min: number, max: number): number {
  if (max === min) {
    return 0.5; // Return middle value if no range
  }
  
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

// Clamp value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Round to specified decimal places (for canonical output)
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// Check if number is finite and not NaN
export function isValidNumber(value: number): boolean {
  return Number.isFinite(value) && !Number.isNaN(value);
}

// Safe division (returns null if divisor is 0)
export function safeDivide(numerator: number, denominator: number): number | null {
  if (denominator === 0 || !isValidNumber(numerator) || !isValidNumber(denominator)) {
    return null;
  }
  
  return numerator / denominator;
}

// Calculate percentage change
export function percentageChange(oldValue: number, newValue: number): number | null {
  if (oldValue === 0 || !isValidNumber(oldValue) || !isValidNumber(newValue)) {
    return null;
  }
  
  return ((newValue - oldValue) / oldValue) * 100;
}

// Linear interpolation
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

// Moving window calculation helper
export function movingWindow<T>(
  array: T[],
  windowSize: number,
  fn: (window: T[]) => number | null
): (number | null)[] {
  const results: (number | null)[] = [];
  
  for (let i = 0; i < array.length; i++) {
    if (i < windowSize - 1) {
      results.push(null); // Not enough data
    } else {
      const window = array.slice(i - windowSize + 1, i + 1);
      results.push(fn(window));
    }
  }
  
  return results;
}

// Exponential smoothing
export function exponentialSmoothing(
  values: number[],
  alpha: number
): number[] {
  if (values.length === 0 || alpha < 0 || alpha > 1) {
    return [];
  }
  
  const smoothed: number[] = [values[0]];
  
  for (let i = 1; i < values.length; i++) {
    const smoothedValue = alpha * values[i] + (1 - alpha) * smoothed[i - 1];
    smoothed.push(smoothedValue);
  }
  
  return smoothed;
}

// Calculate correlation coefficient between two arrays
export function correlation(x: number[], y: number[]): number | null {
  if (x.length !== y.length || x.length === 0) {
    return null;
  }
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
  const sumY2 = y.reduce((sum, val) => sum + val * val, 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) {
    return null;
  }
  
  return numerator / denominator;
}