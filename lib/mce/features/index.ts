// MCE Features - Main calculation engine
// Combines all feature calculations into a single interface

import { type KlineType, type FeatureVectorType } from "../schemas";
import { calculateATRSafe, type ATRResult } from "./atr";
import { calculateEMASafe, type EMAResult } from "./ema";
import { calculateVolumeSafe, type VolumeResult } from "./volume";
import { roundTo } from "../utils/math";

export interface FeatureCalculationResult {
  features: FeatureVectorType;
  intermediate: {
    atr: ATRResult;
    ema: EMAResult;
    volume: VolumeResult;
  };
  metadata: {
    klinesUsed: number;
    calculationTime: number;
    errors: string[];
    warnings: string[];
  };
}

// Default configuration for feature calculation
export const DEFAULT_FEATURE_CONFIG = {
  atr: {
    periods: [14, 50] as number[],
    lookbackDays: [7, 30] as number[],
  },
  ema: {
    periods: [20, 50] as number[],
  },
  volume: {
    ma: 20,
    zscore: 50,
    norm: 100,
  },
  minKlines: 60, // Minimum klines required for reliable calculation
};

// Calculate all features for a set of klines
export function calculateFeatures(
  klines: KlineType[],
  config = DEFAULT_FEATURE_CONFIG
): FeatureCalculationResult {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Initialize default result
  const defaultFeatures: FeatureVectorType = {
    atr14: null,
    atr50: null,
    atrPct7d: null,
    atrPct30d: null,
    emaFast: null,
    emaSlow: null,
    trendStrength: null,
    volNorm: null,
    volZ: null,
    volMA: null,
  };

  const result: FeatureCalculationResult = {
    features: defaultFeatures,
    intermediate: {
      atr: {
        atr14: null,
        atr50: null,
        currentTR: null,
        atrPct7d: null,
        atrPct30d: null,
      },
      ema: {
        emaFast: null,
        emaSlow: null,
        emaDiff: null,
        emaDiffPct: null,
        trendStrength: null,
      },
      volume: {
        volNorm: null,
        volMA: null,
        volZ: null,
        volTrend: null,
      },
    },
    metadata: {
      klinesUsed: klines.length,
      calculationTime: 0,
      errors,
      warnings,
    },
  };

  // Validate minimum data requirements
  if (klines.length === 0) {
    errors.push("No klines provided for feature calculation");
    result.metadata.calculationTime = Date.now() - startTime;
    return result;
  }

  if (klines.length < config.minKlines) {
    warnings.push(`Only ${klines.length} klines available, minimum ${config.minKlines} recommended`);
  }

  try {
    // Calculate ATR features
    const atrResult = calculateATRSafe(klines, config.atr.periods, config.atr.lookbackDays);
    result.intermediate.atr = atrResult;

    // Calculate EMA features (pass ATR14 for trend strength calculation)
    const emaResult = calculateEMASafe(klines, config.ema.periods, atrResult.atr14);
    result.intermediate.ema = emaResult;

    // Calculate volume features
    const volumeResult = calculateVolumeSafe(klines, config.volume);
    result.intermediate.volume = volumeResult;

    // Combine into final feature vector
    result.features = {
      atr14: atrResult.atr14,
      atr50: atrResult.atr50,
      atrPct7d: atrResult.atrPct7d,
      atrPct30d: atrResult.atrPct30d,
      emaFast: emaResult.emaFast,
      emaSlow: emaResult.emaSlow,
      trendStrength: emaResult.trendStrength,
      volNorm: volumeResult.volNorm,
      volZ: volumeResult.volZ,
      volMA: volumeResult.volMA,
    };

  } catch (error) {
    errors.push(`Feature calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  result.metadata.calculationTime = Date.now() - startTime;
  return result;
}

// Validate feature vector completeness
export function validateFeatures(features: FeatureVectorType): {
  valid: boolean;
  completeness: number; // 0-1
  missingFeatures: string[];
  criticalMissing: boolean;
} {
  const allFeatures = [
    'atr14', 'atr50', 'atrPct7d', 'atrPct30d',
    'emaFast', 'emaSlow', 'trendStrength',
    'volNorm', 'volZ', 'volMA'
  ];

  const criticalFeatures = ['atr14', 'emaFast', 'emaSlow', 'trendStrength'];
  
  const missingFeatures: string[] = [];
  let presentCount = 0;

  for (const feature of allFeatures) {
    const value = features[feature as keyof FeatureVectorType];
    if (value === null || value === undefined) {
      missingFeatures.push(feature);
    } else {
      presentCount++;
    }
  }

  const completeness = presentCount / allFeatures.length;
  
  // Check if critical features are missing
  const criticalMissing = criticalFeatures.some(
    feature => features[feature as keyof FeatureVectorType] === null
  );

  return {
    valid: completeness >= 0.7 && !criticalMissing, // At least 70% complete and no critical missing
    completeness: roundTo(completeness, 2),
    missingFeatures,
    criticalMissing,
  };
}

// Get feature calculation summary
export function getFeatureSummary(result: FeatureCalculationResult): {
  status: "complete" | "partial" | "failed";
  completeness: number;
  hasErrors: boolean;
  hasWarnings: boolean;
  executionTime: number;
  dataQuality: "good" | "fair" | "poor";
} {
  const validation = validateFeatures(result.features);
  
  let status: "complete" | "partial" | "failed";
  if (result.metadata.errors.length > 0) {
    status = "failed";
  } else if (validation.completeness >= 0.9) {
    status = "complete";
  } else {
    status = "partial";
  }

  let dataQuality: "good" | "fair" | "poor";
  if (validation.completeness >= 0.9 && !validation.criticalMissing) {
    dataQuality = "good";
  } else if (validation.completeness >= 0.7 && !validation.criticalMissing) {
    dataQuality = "fair";
  } else {
    dataQuality = "poor";
  }

  return {
    status,
    completeness: validation.completeness,
    hasErrors: result.metadata.errors.length > 0,
    hasWarnings: result.metadata.warnings.length > 0,
    executionTime: result.metadata.calculationTime,
    dataQuality,
  };
}

// Calculate features with retry logic for robustness
export function calculateFeaturesRobust(
  klines: KlineType[],
  config = DEFAULT_FEATURE_CONFIG,
  maxRetries: number = 2
): FeatureCalculationResult {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = calculateFeatures(klines, config);
      
      // If we have critical errors, retry with reduced requirements
      if (result.metadata.errors.length > 0 && attempt < maxRetries) {
        // Use reduced minimum klines requirement for retry
        const reducedMinKlines = Math.max(20, config.minKlines / 2);
        return calculateFeatures(klines, { ...config, minKlines: reducedMinKlines });
      }
      
      return result;
      
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        // Final attempt failed, return error result
        return {
          features: {
            atr14: null,
            atr50: null,
            atrPct7d: null,
            atrPct30d: null,
            emaFast: null,
            emaSlow: null,
            trendStrength: null,
            volNorm: null,
            volZ: null,
            volMA: null,
          },
          intermediate: {
            atr: { atr14: null, atr50: null, currentTR: null, atrPct7d: null, atrPct30d: null },
            ema: { emaFast: null, emaSlow: null, emaDiff: null, emaDiffPct: null, trendStrength: null },
            volume: { volNorm: null, volMA: null, volZ: null, volTrend: null },
          },
          metadata: {
            klinesUsed: klines.length,
            calculationTime: 0,
            errors: [`All ${maxRetries + 1} attempts failed: ${lastError?.message}`],
            warnings: [],
          },
        };
      }
    }
  }
  
  // This should never be reached, but TypeScript requires it
  throw lastError || new Error("Unknown error in feature calculation");
}

// Export individual calculation functions for direct use
export {
  calculateATRSafe as calculateATR,
  calculateEMASafe as calculateEMA,
  calculateVolumeSafe as calculateVolume,
};

// Export types
export type { ATRResult, EMAResult, VolumeResult };