// Regime Signature Generation
// Creates canonical RegimeSignature with deterministic hash

import crypto from "crypto";
import { type RegimeSignature, type FeatureVector, type DataQuality, type RegimeChange, type Symbol, type TF } from "../types";
import { RegimeSignatureSchema, canonicalizeFeatureVector, canonicalizeDataQuality } from "../schemas";
import { roundTo } from "../utils/math";

export interface SignatureConfig {
  version: "mce.v1";
  hashAlgorithm: "sha256";
  precision: {
    confidence: number;     // Decimal places for confidence
    features: number;       // Decimal places for feature values
    quality: number;        // Decimal places for quality metrics
  };
  canonicalization: {
    sortKeys: boolean;      // Sort JSON keys for determinism
    compactJson: boolean;   // Remove whitespace from JSON
  };
}

export const DEFAULT_SIGNATURE_CONFIG: SignatureConfig = {
  version: "mce.v1",
  hashAlgorithm: "sha256",
  precision: {
    confidence: 3,          // 0.001 precision
    features: 6,            // 0.000001 precision
    quality: 4,             // 0.0001 precision
  },
  canonicalization: {
    sortKeys: true,
    compactJson: true,
  },
};

// Generate canonical RegimeSignature
export function generateRegimeSignature(
  symbol: Symbol,
  asOf: number,
  trend: "up" | "down" | "range",
  volatility: "compressed" | "normal" | "expanded",
  confidence: number,
  features: FeatureVector,
  quality: DataQuality,
  change: RegimeChange,
  config: SignatureConfig = DEFAULT_SIGNATURE_CONFIG
): RegimeSignature {
  // Canonicalize inputs
  const canonicalFeatures = canonicalizeFeatureVector(features);
  const canonicalQuality = canonicalizeDataQuality(quality);
  const canonicalConfidence = roundTo(confidence, config.precision.confidence);
  
  // Create signature object (without hash first)
  const signatureWithoutHash: Omit<RegimeSignature, "hash"> = {
    v: config.version,
    symbol,
    tf: "1m", // MCE always uses 1m base timeframe
    asOf,
    trend,
    volatility,
    confidence: canonicalConfidence,
    features: canonicalFeatures,
    quality: canonicalQuality,
    change,
  };
  
  // Generate canonical hash
  const hash = generateCanonicalHash(signatureWithoutHash, config);
  
  // Create final signature
  const signature: RegimeSignature = {
    ...signatureWithoutHash,
    hash,
  };
  
  // Validate against schema
  const validated = RegimeSignatureSchema.parse(signature);
  
  return validated;
}

// Generate canonical hash for determinism
export function generateCanonicalHash(
  signatureData: Omit<RegimeSignature, "hash">,
  config: SignatureConfig = DEFAULT_SIGNATURE_CONFIG
): string {
  // Create canonical JSON representation
  const canonicalJson = createCanonicalJSON(signatureData, config);
  
  // Generate hash
  const hash = crypto
    .createHash(config.hashAlgorithm)
    .update(canonicalJson, "utf8")
    .digest("hex");
  
  return hash;
}

// Create canonical JSON string for hashing
function createCanonicalJSON(
  obj: any,
  config: SignatureConfig
): string {
  // Deep sort keys recursively
  const sortedObj = config.canonicalization.sortKeys ? deepSortKeys(obj) : obj;
  
  // Convert to JSON
  const jsonString = config.canonicalization.compactJson
    ? JSON.stringify(sortedObj)
    : JSON.stringify(sortedObj, null, 2);
  
  return jsonString;
}

// Recursively sort object keys for deterministic JSON
function deepSortKeys(obj: any): any {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSortKeys);
  }
  
  const sortedKeys = Object.keys(obj).sort();
  const sortedObj: any = {};
  
  for (const key of sortedKeys) {
    sortedObj[key] = deepSortKeys(obj[key]);
  }
  
  return sortedObj;
}

// Verify signature hash integrity
export function verifySignatureHash(
  signature: RegimeSignature,
  config: SignatureConfig = DEFAULT_SIGNATURE_CONFIG
): {
  valid: boolean;
  expectedHash: string;
  actualHash: string;
  error?: string;
} {
  try {
    // Extract signature without hash
    const { hash: actualHash, ...signatureWithoutHash } = signature;
    
    // Recalculate expected hash
    const expectedHash = generateCanonicalHash(signatureWithoutHash, config);
    
    return {
      valid: expectedHash === actualHash,
      expectedHash,
      actualHash,
    };
    
  } catch (error) {
    return {
      valid: false,
      expectedHash: "",
      actualHash: signature.hash || "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Create regime change object
export function createRegimeChange(
  previousSignature: RegimeSignature | null,
  currentTrend: "up" | "down" | "range",
  currentVolatility: "compressed" | "normal" | "expanded"
): RegimeChange {
  if (!previousSignature) {
    return {
      changed: true, // First signature is always a "change"
    };
  }
  
  const trendChanged = currentTrend !== previousSignature.trend;
  const volChanged = currentVolatility !== previousSignature.volatility;
  const changed = trendChanged || volChanged;
  
  return {
    changed,
    prevAsOf: changed ? previousSignature.asOf : undefined,
    prevTrend: changed ? previousSignature.trend : undefined,
    prevVol: changed ? previousSignature.volatility : undefined,
  };
}

// Validate signature completeness and consistency
export function validateSignature(signature: RegimeSignature): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  try {
    // Schema validation
    RegimeSignatureSchema.parse(signature);
  } catch (error) {
    errors.push(`Schema validation failed: ${error.message}`);
    return { valid: false, errors, warnings };
  }
  
  // Hash integrity check
  const hashCheck = verifySignatureHash(signature);
  if (!hashCheck.valid) {
    errors.push(`Hash verification failed: expected ${hashCheck.expectedHash}, got ${hashCheck.actualHash}`);
  }
  
  // Logical consistency checks
  if (signature.asOf <= 0) {
    errors.push("Invalid asOf timestamp");
  }
  
  if (signature.confidence < 0 || signature.confidence > 1) {
    errors.push(`Confidence out of range: ${signature.confidence}`);
  }
  
  // Feature completeness warnings
  const criticalFeatures = ['atr14', 'emaFast', 'emaSlow', 'trendStrength'];
  const missingCritical = criticalFeatures.filter(
    feature => signature.features[feature as keyof FeatureVector] === null
  );
  
  if (missingCritical.length > 0) {
    warnings.push(`Missing critical features: ${missingCritical.join(', ')}`);
  }
  
  // Data quality warnings
  if (signature.quality.completeness < 0.9) {
    warnings.push(`Low data completeness: ${(signature.quality.completeness * 100).toFixed(1)}%`);
  }
  
  if (signature.quality.freshnessSec > 300) {
    warnings.push(`Stale data: ${signature.quality.freshnessSec}s old`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Compare two signatures for differences
export function compareSignatures(
  sig1: RegimeSignature,
  sig2: RegimeSignature
): {
  identical: boolean;
  differences: Array<{
    field: string;
    value1: any;
    value2: any;
  }>;
  hashMatch: boolean;
} {
  const differences: Array<{ field: string; value1: any; value2: any }> = [];
  
  // Compare top-level fields
  const topLevelFields = ['v', 'symbol', 'tf', 'asOf', 'trend', 'volatility', 'confidence'];
  
  for (const field of topLevelFields) {
    const val1 = sig1[field as keyof RegimeSignature];
    const val2 = sig2[field as keyof RegimeSignature];
    
    if (val1 !== val2) {
      differences.push({ field, value1: val1, value2: val2 });
    }
  }
  
  // Compare features (deep comparison)
  const featureFields = Object.keys(sig1.features);
  for (const field of featureFields) {
    const val1 = sig1.features[field as keyof FeatureVector];
    const val2 = sig2.features[field as keyof FeatureVector];
    
    if (val1 !== val2) {
      differences.push({ field: `features.${field}`, value1: val1, value2: val2 });
    }
  }
  
  // Compare quality fields
  const qualityFields = Object.keys(sig1.quality);
  for (const field of qualityFields) {
    const val1 = sig1.quality[field as keyof DataQuality];
    const val2 = sig2.quality[field as keyof DataQuality];
    
    if (val1 !== val2) {
      differences.push({ field: `quality.${field}`, value1: val1, value2: val2 });
    }
  }
  
  // Compare change object
  const changeFields = Object.keys(sig1.change);
  for (const field of changeFields) {
    const val1 = sig1.change[field as keyof RegimeChange];
    const val2 = sig2.change[field as keyof RegimeChange];
    
    if (val1 !== val2) {
      differences.push({ field: `change.${field}`, value1: val1, value2: val2 });
    }
  }
  
  const hashMatch = sig1.hash === sig2.hash;
  const identical = differences.length === 0 && hashMatch;
  
  return {
    identical,
    differences,
    hashMatch,
  };
}

// Create signature summary for logging/display
export function getSignatureSummary(signature: RegimeSignature): {
  regime: string;
  confidence: string;
  dataAge: string;
  quality: string;
  hash: string;
} {
  const regime = `${signature.trend}/${signature.volatility}`;
  const confidence = `${(signature.confidence * 100).toFixed(1)}%`;
  
  const ageSeconds = (Date.now() - signature.asOf) / 1000;
  const dataAge = ageSeconds < 60 
    ? `${ageSeconds.toFixed(0)}s`
    : `${(ageSeconds / 60).toFixed(1)}m`;
  
  const quality = signature.quality.valid 
    ? `${(signature.quality.completeness * 100).toFixed(0)}%`
    : "invalid";
  
  const hash = signature.hash.substring(0, 8) + "...";
  
  return {
    regime,
    confidence,
    dataAge,
    quality,
    hash,
  };
}

// Export configuration type
export type { SignatureConfig };