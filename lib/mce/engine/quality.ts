// Data Quality Assessment
// Evaluates completeness, freshness, and reliability of market data

import { type KlineType, type DataQuality, type TF } from "../schemas";
import { tfToMs } from "../utils/time";
import { roundTo } from "../utils/math";

export interface QualityConfig {
  completeness: {
    minThreshold: number;     // Minimum completeness for "valid" data
    lookbackHours: number;    // Hours to look back for completeness check
  };
  freshness: {
    maxStaleSeconds: number;  // Max seconds before data is considered stale
    warningSeconds: number;   // Seconds before warning about staleness
  };
  gaps: {
    maxGapMinutes: number;    // Max gap in minutes before quality degrades
    maxGapsPercent: number;   // Max percentage of gaps allowed
  };
}

export const DEFAULT_QUALITY_CONFIG: QualityConfig = {
  completeness: {
    minThreshold: 0.95,       // 95% completeness required
    lookbackHours: 24,        // Check last 24 hours
  },
  freshness: {
    maxStaleSeconds: 300,     // 5 minutes max staleness
    warningSeconds: 120,      // Warn after 2 minutes
  },
  gaps: {
    maxGapMinutes: 5,         // Max 5-minute gap
    maxGapsPercent: 2.0,      // Max 2% gaps
  },
};

// Calculate data completeness for a time range
export function calculateCompleteness(
  klines: KlineType[],
  tf: TF,
  lookbackHours: number = 24,
  endTime: number = Date.now()
): {
  completeness: number;
  expected: number;
  actual: number;
  gaps: number;
  startTime: number;
  endTime: number;
} {
  const intervalMs = tfToMs(tf);
  const lookbackMs = lookbackHours * 60 * 60 * 1000;
  const startTime = endTime - lookbackMs;
  
  // Calculate expected number of intervals
  const expected = Math.floor(lookbackMs / intervalMs);
  
  // Count actual klines in the time range
  const actualKlines = klines.filter(
    k => k.openTime >= startTime && k.openTime < endTime
  );
  
  const actual = actualKlines.length;
  const gaps = Math.max(0, expected - actual);
  const completeness = expected > 0 ? actual / expected : 0;
  
  return {
    completeness: roundTo(completeness, 4),
    expected,
    actual,
    gaps,
    startTime,
    endTime,
  };
}

// Calculate data freshness
export function calculateFreshness(
  klines: KlineType[],
  currentTime: number = Date.now()
): {
  freshnessSec: number;
  isStale: boolean;
  isWarning: boolean;
  lastDataTime: number | null;
  timeSinceLastData: string;
} {
  if (klines.length === 0) {
    return {
      freshnessSec: Infinity,
      isStale: true,
      isWarning: true,
      lastDataTime: null,
      timeSinceLastData: "No data available",
    };
  }

  // Find the most recent kline by close time
  const lastKline = klines.reduce((latest, current) =>
    current.closeTime > latest.closeTime ? current : latest
  );

  const freshnessSec = (currentTime - lastKline.closeTime) / 1000;
  
  // Format time since last data
  const timeSinceLastData = formatTimeDuration(freshnessSec);
  
  return {
    freshnessSec: roundTo(freshnessSec, 1),
    isStale: freshnessSec > DEFAULT_QUALITY_CONFIG.freshness.maxStaleSeconds,
    isWarning: freshnessSec > DEFAULT_QUALITY_CONFIG.freshness.warningSeconds,
    lastDataTime: lastKline.closeTime,
    timeSinceLastData,
  };
}

// Detect and analyze data gaps
export function analyzeDataGaps(
  klines: KlineType[],
  tf: TF
): {
  gaps: Array<{
    startTime: number;
    endTime: number;
    durationMs: number;
    durationMinutes: number;
    intervalsSkipped: number;
  }>;
  totalGapTime: number;
  largestGapMinutes: number;
  gapCount: number;
} {
  const gaps: Array<{
    startTime: number;
    endTime: number;
    durationMs: number;
    durationMinutes: number;
    intervalsSkipped: number;
  }> = [];

  if (klines.length < 2) {
    return {
      gaps,
      totalGapTime: 0,
      largestGapMinutes: 0,
      gapCount: 0,
    };
  }

  const intervalMs = tfToMs(tf);
  
  // Sort klines by open time to ensure proper order
  const sortedKlines = [...klines].sort((a, b) => a.openTime - b.openTime);
  
  for (let i = 1; i < sortedKlines.length; i++) {
    const prevKline = sortedKlines[i - 1];
    const currKline = sortedKlines[i];
    
    const expectedNextTime = prevKline.openTime + intervalMs;
    const actualTime = currKline.openTime;
    
    if (actualTime > expectedNextTime) {
      const gapDuration = actualTime - expectedNextTime;
      const gapMinutes = gapDuration / (60 * 1000);
      const intervalsSkipped = Math.floor(gapDuration / intervalMs);
      
      gaps.push({
        startTime: expectedNextTime,
        endTime: actualTime,
        durationMs: gapDuration,
        durationMinutes: roundTo(gapMinutes, 1),
        intervalsSkipped,
      });
    }
  }

  const totalGapTime = gaps.reduce((sum, gap) => sum + gap.durationMs, 0);
  const largestGapMinutes = gaps.length > 0 
    ? Math.max(...gaps.map(gap => gap.durationMinutes))
    : 0;

  return {
    gaps,
    totalGapTime,
    largestGapMinutes: roundTo(largestGapMinutes, 1),
    gapCount: gaps.length,
  };
}

// Assess overall data quality
export function assessDataQuality(
  klines: KlineType[],
  tf: TF,
  config: QualityConfig = DEFAULT_QUALITY_CONFIG,
  currentTime: number = Date.now()
): DataQuality {
  // Calculate completeness
  const completenessResult = calculateCompleteness(
    klines,
    tf,
    config.completeness.lookbackHours,
    currentTime
  );

  // Calculate freshness
  const freshnessResult = calculateFreshness(klines, currentTime);

  // Analyze gaps
  const gapsResult = analyzeDataGaps(klines, tf);

  // Calculate gap percentage
  const totalTimeSpan = completenessResult.endTime - completenessResult.startTime;
  const gapPercentage = totalTimeSpan > 0 
    ? (gapsResult.totalGapTime / totalTimeSpan) * 100
    : 0;

  // Determine overall validity
  const isComplete = completenessResult.completeness >= config.completeness.minThreshold;
  const isFresh = !freshnessResult.isStale;
  const hasAcceptableGaps = (
    gapsResult.largestGapMinutes <= config.gaps.maxGapMinutes &&
    gapPercentage <= config.gaps.maxGapsPercent
  );

  const valid = isComplete && isFresh && hasAcceptableGaps;

  return {
    completeness: completenessResult.completeness,
    gaps: gapsResult.gapCount,
    freshnessSec: freshnessResult.freshnessSec,
    source: "binance",
    valid,
  };
}

// Calculate data quality score (0-1)
export function calculateQualityScore(
  dataQuality: DataQuality,
  config: QualityConfig = DEFAULT_QUALITY_CONFIG
): {
  score: number;
  breakdown: {
    completenessScore: number;
    freshnessScore: number;
    gapsScore: number;
  };
  factors: string[];
} {
  const factors: string[] = [];
  
  // Completeness score (0-1)
  const completenessScore = Math.min(1, dataQuality.completeness / config.completeness.minThreshold);
  factors.push(`Completeness: ${(dataQuality.completeness * 100).toFixed(1)}%`);
  
  // Freshness score (0-1, exponential decay)
  const freshnessScore = Math.exp(-dataQuality.freshnessSec / config.freshness.maxStaleSeconds);
  factors.push(`Freshness: ${dataQuality.freshnessSec.toFixed(1)}s ago`);
  
  // Gaps score (0-1, based on gap count relative to data size)
  const expectedDataPoints = 1440; // Assume ~24h of 1m data for baseline
  const gapRatio = dataQuality.gaps / expectedDataPoints;
  const gapsScore = Math.max(0, 1 - (gapRatio * 10)); // Penalize gaps heavily
  factors.push(`Gaps: ${dataQuality.gaps} detected`);
  
  // Weighted average (completeness is most important)
  const weights = { completeness: 0.5, freshness: 0.3, gaps: 0.2 };
  const score = (
    completenessScore * weights.completeness +
    freshnessScore * weights.freshness +
    gapsScore * weights.gaps
  );
  
  return {
    score: roundTo(score, 3),
    breakdown: {
      completenessScore: roundTo(completenessScore, 3),
      freshnessScore: roundTo(freshnessScore, 3),
      gapsScore: roundTo(gapsScore, 3),
    },
    factors,
  };
}

// Get data quality summary for display
export function getQualitySummary(
  klines: KlineType[],
  tf: TF,
  config: QualityConfig = DEFAULT_QUALITY_CONFIG
): {
  status: "excellent" | "good" | "fair" | "poor" | "critical";
  score: number;
  issues: string[];
  recommendations: string[];
  dataQuality: DataQuality;
} {
  const dataQuality = assessDataQuality(klines, tf, config);
  const qualityScore = calculateQualityScore(dataQuality, config);
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Analyze issues and provide recommendations
  if (dataQuality.completeness < 0.95) {
    issues.push(`Low completeness: ${(dataQuality.completeness * 100).toFixed(1)}%`);
    recommendations.push("Check data ingestion pipeline for missing intervals");
  }
  
  if (dataQuality.freshnessSec > config.freshness.warningSeconds) {
    issues.push(`Stale data: ${formatTimeDuration(dataQuality.freshnessSec)} old`);
    recommendations.push("Verify real-time data feed is active");
  }
  
  if (dataQuality.gaps > 10) {
    issues.push(`Many gaps: ${dataQuality.gaps} detected`);
    recommendations.push("Investigate data source reliability");
  }
  
  // Determine status based on score
  let status: "excellent" | "good" | "fair" | "poor" | "critical";
  if (qualityScore.score >= 0.95) {
    status = "excellent";
  } else if (qualityScore.score >= 0.85) {
    status = "good";
  } else if (qualityScore.score >= 0.7) {
    status = "fair";
  } else if (qualityScore.score >= 0.5) {
    status = "poor";
  } else {
    status = "critical";
  }
  
  return {
    status,
    score: qualityScore.score,
    issues,
    recommendations,
    dataQuality,
  };
}

// Validate data quality assessment inputs
export function validateQualityInputs(klines: KlineType[], tf: TF): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!["1m", "5m", "15m", "1h", "4h"].includes(tf)) {
    errors.push(`Invalid timeframe: ${tf}`);
  }
  
  if (klines.length === 0) {
    errors.push("No klines provided for quality assessment");
  }
  
  // Check for basic data integrity
  for (let i = 0; i < Math.min(klines.length, 10); i++) {
    const kline = klines[i];
    
    if (!Number.isFinite(kline.openTime) || !Number.isFinite(kline.closeTime)) {
      errors.push(`Invalid timestamps at index ${i}`);
      break;
    }
    
    if (kline.closeTime <= kline.openTime) {
      errors.push(`Invalid time relationship at index ${i}`);
      break;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper function to format time duration
function formatTimeDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds.toFixed(0)}s`;
  } else if (seconds < 3600) {
    return `${(seconds / 60).toFixed(1)}m`;
  } else if (seconds < 86400) {
    return `${(seconds / 3600).toFixed(1)}h`;
  } else {
    return `${(seconds / 86400).toFixed(1)}d`;
  }
}