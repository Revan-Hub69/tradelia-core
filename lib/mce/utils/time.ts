// Time utilities for MCE
// Handles timeframe conversions and time-based calculations

import { type TF } from "../types";

// Convert timeframe to milliseconds
export function tfToMs(tf: TF): number {
  const intervals: Record<TF, number> = {
    "1m": 60_000,
    "5m": 300_000,
    "15m": 900_000,
    "1h": 3_600_000,
    "4h": 14_400_000,
  };
  
  return intervals[tf];
}

// Convert milliseconds to timeframe (if exact match)
export function msToTF(ms: number): TF | null {
  const mapping: Record<number, TF> = {
    60_000: "1m",
    300_000: "5m",
    900_000: "15m",
    3_600_000: "1h",
    14_400_000: "4h",
  };
  
  return mapping[ms] || null;
}

// Round timestamp to timeframe boundary
export function roundToTimeframe(timestamp: number, intervalMs: number): number {
  return Math.floor(timestamp / intervalMs) * intervalMs;
}

// Get next timeframe boundary
export function getNextBoundary(timestamp: number, tf: TF): number {
  const intervalMs = tfToMs(tf);
  const rounded = roundToTimeframe(timestamp, intervalMs);
  return rounded + intervalMs;
}

// Check if timestamp is on timeframe boundary
export function isOnBoundary(timestamp: number, tf: TF): boolean {
  const intervalMs = tfToMs(tf);
  return timestamp % intervalMs === 0;
}

// Generate expected timestamps for a time range
export function generateTimestamps(
  startTime: number,
  endTime: number,
  tf: TF
): number[] {
  const intervalMs = tfToMs(tf);
  const timestamps: number[] = [];
  
  let current = roundToTimeframe(startTime, intervalMs);
  
  while (current < endTime) {
    if (current >= startTime) {
      timestamps.push(current);
    }
    current += intervalMs;
  }
  
  return timestamps;
}

// Find missing timestamps in a sequence
export function findMissingTimestamps(
  actualTimestamps: number[],
  expectedStart: number,
  expectedEnd: number,
  tf: TF
): number[] {
  const expected = generateTimestamps(expectedStart, expectedEnd, tf);
  const actualSet = new Set(actualTimestamps);
  
  return expected.filter(timestamp => !actualSet.has(timestamp));
}

// Calculate time gaps between consecutive timestamps
export function calculateTimeGaps(
  timestamps: number[],
  tf: TF
): Array<{ after: number; gap: number; expected: number }> {
  if (timestamps.length < 2) {
    return [];
  }
  
  const intervalMs = tfToMs(tf);
  const gaps: Array<{ after: number; gap: number; expected: number }> = [];
  
  for (let i = 1; i < timestamps.length; i++) {
    const prev = timestamps[i - 1];
    const current = timestamps[i];
    const expected = prev + intervalMs;
    
    if (current > expected) {
      gaps.push({
        after: prev,
        gap: current - expected,
        expected,
      });
    }
  }
  
  return gaps;
}

// Format timestamp for display
export function formatTimestamp(timestamp: number, format: "iso" | "local" | "utc" = "iso"): string {
  const date = new Date(timestamp);
  
  switch (format) {
    case "iso":
      return date.toISOString();
    case "local":
      return date.toLocaleString();
    case "utc":
      return date.toUTCString();
    default:
      return date.toISOString();
  }
}

// Parse various timestamp formats to milliseconds
export function parseTimestamp(input: string | number | Date): number {
  if (typeof input === "number") {
    // Assume milliseconds if > year 2000 timestamp
    return input > 946684800000 ? input : input * 1000;
  }
  
  if (input instanceof Date) {
    return input.getTime();
  }
  
  // Try to parse string
  const parsed = new Date(input);
  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid timestamp format: ${input}`);
  }
  
  return parsed.getTime();
}

// Get current time aligned to timeframe
export function getCurrentAlignedTime(tf: TF): number {
  const intervalMs = tfToMs(tf);
  return roundToTimeframe(Date.now(), intervalMs);
}

// Check if timestamp is recent (within N intervals)
export function isRecent(
  timestamp: number,
  tf: TF,
  intervals: number = 2,
  now: number = Date.now()
): boolean {
  const intervalMs = tfToMs(tf);
  const threshold = now - (intervals * intervalMs);
  return timestamp >= threshold;
}

// Calculate age in intervals
export function getAgeInIntervals(
  timestamp: number,
  tf: TF,
  now: number = Date.now()
): number {
  const intervalMs = tfToMs(tf);
  return Math.floor((now - timestamp) / intervalMs);
}

// Get time range for last N periods
export function getLastNPeriods(
  tf: TF,
  periods: number,
  endTime: number = Date.now()
): { start: number; end: number } {
  const intervalMs = tfToMs(tf);
  const alignedEnd = roundToTimeframe(endTime, intervalMs);
  const start = alignedEnd - (periods * intervalMs);
  
  return { start, end: alignedEnd };
}

// Validate timestamp sequence
export function validateTimestampSequence(
  timestamps: number[],
  tf: TF
): {
  valid: boolean;
  errors: Array<{
    type: "gap" | "duplicate" | "out_of_order" | "invalid_boundary";
    index: number;
    timestamp: number;
    details?: any;
  }>;
} {
  const errors: Array<{
    type: "gap" | "duplicate" | "out_of_order" | "invalid_boundary";
    index: number;
    timestamp: number;
    details?: any;
  }> = [];
  
  const intervalMs = tfToMs(tf);
  const seen = new Set<number>();
  
  for (let i = 0; i < timestamps.length; i++) {
    const timestamp = timestamps[i];
    
    // Check for duplicates
    if (seen.has(timestamp)) {
      errors.push({
        type: "duplicate",
        index: i,
        timestamp,
      });
      continue;
    }
    seen.add(timestamp);
    
    // Check if on boundary
    if (!isOnBoundary(timestamp, tf)) {
      const intervalMs = tfToMs(tf);
      errors.push({
        type: "invalid_boundary",
        index: i,
        timestamp,
        details: { expected: roundToTimeframe(timestamp, intervalMs) },
      });
    }
    
    // Check ordering and gaps (skip first timestamp)
    if (i > 0) {
      const prevTimestamp = timestamps[i - 1];
      
      // Check ordering
      if (timestamp <= prevTimestamp) {
        errors.push({
          type: "out_of_order",
          index: i,
          timestamp,
          details: { previous: prevTimestamp },
        });
        continue;
      }
      
      // Check for gaps
      const expectedNext = prevTimestamp + intervalMs;
      if (timestamp > expectedNext) {
        errors.push({
          type: "gap",
          index: i,
          timestamp,
          details: { 
            expected: expectedNext,
            gap: timestamp - expectedNext,
          },
        });
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Convert between different time units
export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// Sleep utility for rate limiting
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}