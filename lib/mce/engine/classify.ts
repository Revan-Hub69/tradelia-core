// Regime Classification Engine
// Rule-based classification with anti-flip smoothing

import { type TrendClass, type VolClass, type FeatureVector } from "../types";
import { type KlineType } from "../schemas";
import { roundTo, clamp } from "../utils/math";

export interface ClassificationConfig {
  trend: {
    minStrength: number;        // Minimum trend strength to avoid "range"
    strongThreshold: number;    // Threshold for strong trend classification
    emaAlignmentWeight: number; // Weight for EMA alignment in trend decision
  };
  volatility: {
    compressedPct: number;      // ATR percentile threshold for compressed
    expandedPct: number;        // ATR percentile threshold for expanded
    fallbackATRMultiple: number; // Fallback ATR multiple if percentiles unavailable
  };
  confidence: {
    minDataQuality: number;     // Minimum data quality for high confidence
    trendStrengthWeight: number; // Weight of trend strength in confidence
    volClarityWeight: number;   // Weight of volatility clarity in confidence
    dataQualityWeight: number;  // Weight of data quality in confidence
  };
  antiFlip: {
    enabled: boolean;           // Enable anti-flip smoothing
    streakRequired: number;     // Consecutive periods required for regime change
    hysteresisMargin: number;   // Margin for hysteresis (0.1 = 10% margin)
  };
}

export const DEFAULT_CLASSIFICATION_CONFIG: ClassificationConfig = {
  trend: {
    minStrength: 0.3,
    strongThreshold: 0.7,
    emaAlignmentWeight: 0.6,
  },
  volatility: {
    compressedPct: 30,
    expandedPct: 70,
    fallbackATRMultiple: 1.5,
  },
  confidence: {
    minDataQuality: 0.8,
    trendStrengthWeight: 0.4,
    volClarityWeight: 0.3,
    dataQualityWeight: 0.3,
  },
  antiFlip: {
    enabled: true,
    streakRequired: 2,
    hysteresisMargin: 0.15,
  },
};

export interface ClassificationResult {
  trend: TrendClass;
  volatility: VolClass;
  confidence: number;
  intermediate: {
    trendScore: number;         // Raw trend score (-1 to 1)
    volScore: number;           // Raw volatility score (0-100 percentile)
    trendStrengthUsed: number | null;
    emaAlignmentScore: number | null;
    volPercentileUsed: number | null;
    dataQualityScore: number;
  };
  reasoning: {
    trendReason: string;
    volReason: string;
    confidenceFactors: string[];
  };
}

// Classify trend based on EMA alignment and trend strength
export function classifyTrend(
  features: FeatureVector,
  currentPrice: number,
  config: ClassificationConfig["trend"] = DEFAULT_CLASSIFICATION_CONFIG.trend
): {
  trend: TrendClass;
  score: number;
  alignmentScore: number | null;
  reason: string;
} {
  const { emaFast, emaSlow, trendStrength } = features;
  
  // Default to range if missing critical data
  if (emaFast === null || emaSlow === null || trendStrength === null) {
    return {
      trend: "range",
      score: 0,
      alignmentScore: null,
      reason: "Missing EMA or trend strength data",
    };
  }

  // Calculate EMA alignment score
  const emaAlignmentScore = calculateEMAAlignment(emaFast, emaSlow, currentPrice);
  
  // Combine trend strength and EMA alignment
  const trendScore = (
    trendStrength * (1 - config.emaAlignmentWeight) +
    Math.abs(emaAlignmentScore) * config.emaAlignmentWeight
  );

  // Determine trend direction
  let trend: TrendClass;
  let reason: string;

  if (trendScore < config.minStrength) {
    trend = "range";
    reason = `Trend strength ${trendScore.toFixed(3)} below minimum ${config.minStrength}`;
  } else {
    // Use EMA alignment to determine direction
    if (emaAlignmentScore > 0) {
      trend = "up";
      reason = `Bullish alignment (${emaAlignmentScore.toFixed(3)}) with strength ${trendScore.toFixed(3)}`;
    } else {
      trend = "down";
      reason = `Bearish alignment (${emaAlignmentScore.toFixed(3)}) with strength ${trendScore.toFixed(3)}`;
    }
  }

  return {
    trend,
    score: emaAlignmentScore,
    alignmentScore: emaAlignmentScore,
    reason,
  };
}

// Calculate EMA alignment score (-1 to 1)
function calculateEMAAlignment(emaFast: number, emaSlow: number, currentPrice: number): number {
  // Check EMA order and price position
  const emaAligned = emaFast > emaSlow;
  const priceAboveEMA = currentPrice > emaFast;
  
  // Calculate alignment strength based on EMA separation
  const emaSeparation = Math.abs(emaFast - emaSlow) / emaSlow;
  const priceSeparation = Math.abs(currentPrice - emaFast) / emaFast;
  
  // Combine separations for alignment strength
  const alignmentStrength = Math.min(1, (emaSeparation + priceSeparation) * 2);
  
  // Determine direction and apply strength
  if (emaAligned && priceAboveEMA) {
    return alignmentStrength; // Bullish
  } else if (!emaAligned && !priceAboveEMA) {
    return -alignmentStrength; // Bearish
  } else {
    return 0; // Mixed signals = range
  }
}

// Classify volatility based on ATR percentiles
export function classifyVolatility(
  features: FeatureVector,
  config: ClassificationConfig["volatility"] = DEFAULT_CLASSIFICATION_CONFIG.volatility
): {
  volatility: VolClass;
  score: number;
  percentileUsed: number | null;
  reason: string;
} {
  const { atrPct7d, atrPct30d, atr14, atr50 } = features;
  
  // Use 7-day percentile as primary, 30-day as fallback
  let percentile = atrPct7d ?? atrPct30d;
  let percentileSource = atrPct7d !== null ? "7d" : "30d";
  
  // Fallback to ATR ratio if percentiles unavailable
  if (percentile === null && atr14 !== null && atr50 !== null && atr50 > 0) {
    const atrRatio = atr14 / atr50;
    // Convert ratio to approximate percentile (rough heuristic)
    percentile = Math.min(100, Math.max(0, (atrRatio - 0.5) * 100));
    percentileSource = "ATR ratio fallback";
  }
  
  if (percentile === null) {
    return {
      volatility: "normal",
      score: 50, // Default to middle
      percentileUsed: null,
      reason: "No volatility data available",
    };
  }

  // Classify based on percentile thresholds
  let volatility: VolClass;
  let reason: string;

  if (percentile <= config.compressedPct) {
    volatility = "compressed";
    reason = `ATR percentile ${percentile.toFixed(1)} <= ${config.compressedPct} (${percentileSource})`;
  } else if (percentile >= config.expandedPct) {
    volatility = "expanded";
    reason = `ATR percentile ${percentile.toFixed(1)} >= ${config.expandedPct} (${percentileSource})`;
  } else {
    volatility = "normal";
    reason = `ATR percentile ${percentile.toFixed(1)} in normal range (${percentileSource})`;
  }

  return {
    volatility,
    score: percentile,
    percentileUsed: percentile,
    reason,
  };
}

// Calculate classification confidence
export function calculateConfidence(
  trendScore: number,
  volScore: number,
  dataQualityScore: number,
  config: ClassificationConfig["confidence"] = DEFAULT_CLASSIFICATION_CONFIG.confidence
): {
  confidence: number;
  factors: string[];
} {
  const factors: string[] = [];
  
  // Trend clarity component (how far from neutral)
  const trendClarity = Math.abs(trendScore);
  const trendComponent = trendClarity * config.trendStrengthWeight;
  factors.push(`Trend clarity: ${(trendClarity * 100).toFixed(1)}%`);
  
  // Volatility clarity component (how far from 50th percentile)
  const volClarity = Math.abs(volScore - 50) / 50; // 0-1 scale
  const volComponent = volClarity * config.volClarityWeight;
  factors.push(`Vol clarity: ${(volClarity * 100).toFixed(1)}%`);
  
  // Data quality component
  const dataComponent = dataQualityScore * config.dataQualityWeight;
  factors.push(`Data quality: ${(dataQualityScore * 100).toFixed(1)}%`);
  
  // Combine components
  const rawConfidence = trendComponent + volComponent + dataComponent;
  
  // Apply minimum data quality threshold
  const qualityPenalty = dataQualityScore < config.minDataQuality ? 0.5 : 1.0;
  const finalConfidence = clamp(rawConfidence * qualityPenalty, 0, 1);
  
  if (qualityPenalty < 1.0) {
    factors.push(`Quality penalty applied (${dataQualityScore.toFixed(2)} < ${config.minDataQuality})`);
  }
  
  return {
    confidence: roundTo(finalConfidence, 3),
    factors,
  };
}

// Main classification function
export function classifyRegime(
  features: FeatureVector,
  currentPrice: number,
  dataQualityScore: number = 1.0,
  config: ClassificationConfig = DEFAULT_CLASSIFICATION_CONFIG
): ClassificationResult {
  // Classify trend
  const trendResult = classifyTrend(features, currentPrice, config.trend);
  
  // Classify volatility
  const volResult = classifyVolatility(features, config.volatility);
  
  // Calculate confidence
  const confidenceResult = calculateConfidence(
    trendResult.score,
    volResult.score,
    dataQualityScore,
    config.confidence
  );
  
  return {
    trend: trendResult.trend,
    volatility: volResult.volatility,
    confidence: confidenceResult.confidence,
    intermediate: {
      trendScore: roundTo(trendResult.score, 4),
      volScore: roundTo(volResult.score, 2),
      trendStrengthUsed: features.trendStrength,
      emaAlignmentScore: trendResult.alignmentScore,
      volPercentileUsed: volResult.percentileUsed,
      dataQualityScore: roundTo(dataQualityScore, 3),
    },
    reasoning: {
      trendReason: trendResult.reason,
      volReason: volResult.reason,
      confidenceFactors: confidenceResult.factors,
    },
  };
}

// Anti-flip smoothing state
interface AntiFlipState {
  currentRegime: { trend: TrendClass; volatility: VolClass } | null;
  streakCount: number;
  pendingRegime: { trend: TrendClass; volatility: VolClass } | null;
  lastChangeTime: number | null;
}

// Apply anti-flip smoothing to prevent rapid regime changes
export function applyAntiFlipSmoothing(
  newClassification: Pick<ClassificationResult, "trend" | "volatility">,
  state: AntiFlipState,
  config: ClassificationConfig["antiFlip"] = DEFAULT_CLASSIFICATION_CONFIG.antiFlip,
  currentTime: number = Date.now()
): {
  finalRegime: { trend: TrendClass; volatility: VolClass };
  changed: boolean;
  newState: AntiFlipState;
  reason: string;
} {
  if (!config.enabled) {
    // No smoothing - accept new classification immediately
    return {
      finalRegime: { trend: newClassification.trend, volatility: newClassification.volatility },
      changed: true,
      newState: {
        currentRegime: { trend: newClassification.trend, volatility: newClassification.volatility },
        streakCount: 1,
        pendingRegime: null,
        lastChangeTime: currentTime,
      },
      reason: "Anti-flip smoothing disabled",
    };
  }

  const newRegime = { trend: newClassification.trend, volatility: newClassification.volatility };
  
  // Initialize state if first classification
  if (state.currentRegime === null) {
    return {
      finalRegime: newRegime,
      changed: true,
      newState: {
        currentRegime: newRegime,
        streakCount: 1,
        pendingRegime: null,
        lastChangeTime: currentTime,
      },
      reason: "Initial regime classification",
    };
  }

  // Check if regime is the same as current
  const isSameRegime = (
    newRegime.trend === state.currentRegime.trend &&
    newRegime.volatility === state.currentRegime.volatility
  );

  if (isSameRegime) {
    // Same regime - reset pending and increment streak
    return {
      finalRegime: state.currentRegime,
      changed: false,
      newState: {
        ...state,
        streakCount: state.streakCount + 1,
        pendingRegime: null,
      },
      reason: "Regime unchanged",
    };
  }

  // Different regime - check if it matches pending
  const isSamePending = state.pendingRegime && (
    newRegime.trend === state.pendingRegime.trend &&
    newRegime.volatility === state.pendingRegime.volatility
  );

  if (isSamePending) {
    // Continue pending streak
    const newStreakCount = state.streakCount + 1;
    
    if (newStreakCount >= config.streakRequired) {
      // Streak requirement met - change regime
      return {
        finalRegime: newRegime,
        changed: true,
        newState: {
          currentRegime: newRegime,
          streakCount: 1,
          pendingRegime: null,
          lastChangeTime: currentTime,
        },
        reason: `Regime change after ${newStreakCount} consecutive periods`,
      };
    } else {
      // Continue pending
      return {
        finalRegime: state.currentRegime,
        changed: false,
        newState: {
          ...state,
          streakCount: newStreakCount,
        },
        reason: `Pending regime change (${newStreakCount}/${config.streakRequired})`,
      };
    }
  } else {
    // New different regime - start new pending
    return {
      finalRegime: state.currentRegime,
      changed: false,
      newState: {
        ...state,
        streakCount: 1,
        pendingRegime: newRegime,
      },
      reason: "New regime detected, starting confirmation period",
    };
  }
}

// Validate classification inputs
export function validateClassificationInputs(
  features: FeatureVector,
  currentPrice: number
): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check current price
  if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
    errors.push(`Invalid current price: ${currentPrice}`);
  }

  // Check critical features
  if (features.emaFast === null || features.emaSlow === null) {
    errors.push("Missing critical EMA data");
  }

  if (features.trendStrength === null) {
    warnings.push("Missing trend strength data");
  }

  if (features.atr14 === null) {
    warnings.push("Missing ATR14 data");
  }

  if (features.atrPct7d === null && features.atrPct30d === null) {
    warnings.push("Missing ATR percentile data for volatility classification");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Export anti-flip state type for external use
export type { AntiFlipState };