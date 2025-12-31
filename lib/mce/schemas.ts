// MCE Zod Schemas - Validation and Canonical Output
// These schemas ensure data integrity and deterministic serialization

import { z } from "zod";

// Base type schemas
export const TFSchema = z.enum(["1m", "5m", "15m", "1h", "4h"]);
export const SymbolSchema = z.enum(["BTCUSDT"]);
export const TrendClassSchema = z.enum(["up", "down", "range"]);
export const VolClassSchema = z.enum(["compressed", "normal", "expanded"]);

// Core data schemas
export const KlineSchema = z.object({
  symbol: SymbolSchema,
  tf: TFSchema,
  openTime: z.number().int().nonnegative(),
  closeTime: z.number().int().nonnegative(),
  open: z.number().finite().positive(),
  high: z.number().finite().positive(),
  low: z.number().finite().positive(),
  close: z.number().finite().positive(),
  volume: z.number().finite().nonnegative(),
  trades: z.number().int().nonnegative().optional(),
}).refine(
  (k) => k.high >= k.low && k.high >= k.open && k.high >= k.close && k.low <= k.open && k.low <= k.close,
  { message: "Invalid OHLC: high must be >= all prices, low must be <= all prices" }
).refine(
  (k) => k.closeTime > k.openTime,
  { message: "closeTime must be > openTime" }
);

export const FeatureVectorSchema = z.object({
  atr14: z.number().finite().nonnegative().nullable(),
  atr50: z.number().finite().nonnegative().nullable(),
  atrPct7d: z.number().min(0).max(100).nullable(),
  atrPct30d: z.number().min(0).max(100).nullable(),
  emaFast: z.number().finite().positive().nullable(),
  emaSlow: z.number().finite().positive().nullable(),
  trendStrength: z.number().min(0).max(1).nullable(),
  volNorm: z.number().min(0).max(1).nullable(),
  volZ: z.number().finite().nullable().optional(),
  volMA: z.number().finite().nonnegative().nullable().optional(),
});

export const DataQualitySchema = z.object({
  completeness: z.number().min(0).max(1),
  gaps: z.number().int().min(0),
  freshnessSec: z.number().min(0),
  source: z.literal("binance"),
  valid: z.boolean(),
});

export const RegimeChangeSchema = z.object({
  changed: z.boolean(),
  prevAsOf: z.number().int().nonnegative().optional(),
  prevTrend: TrendClassSchema.optional(),
  prevVol: VolClassSchema.optional(),
});

// Main MCE output schema (canonical)
export const RegimeSignatureSchema = z.object({
  v: z.literal("mce.v1"),
  symbol: SymbolSchema,
  tf: z.literal("1m"),
  asOf: z.number().int().nonnegative(),
  trend: TrendClassSchema,
  volatility: VolClassSchema,
  confidence: z.number().min(0).max(1),
  features: FeatureVectorSchema,
  quality: DataQualitySchema,
  change: RegimeChangeSchema,
  hash: z.string().regex(/^[a-f0-9]{64}$/, "Hash must be 64-character hex string"),
});

// Database row schemas
export const MarketDataRowSchema = z.object({
  id: z.number().int().positive(),
  symbol: z.string(),
  tf: z.string(),
  open_time: z.number().int().nonnegative(),
  close_time: z.number().int().nonnegative(),
  open: z.number().finite(),
  high: z.number().finite(),
  low: z.number().finite(),
  close: z.number().finite(),
  volume: z.number().finite().nonnegative(),
  trades: z.number().int().nonnegative().nullable(),
  source: z.string(),
  inserted_at: z.string(),
});

export const RegimeSignatureRowSchema = z.object({
  id: z.number().int().positive(),
  symbol: z.string(),
  tf: z.string(),
  as_of: z.number().int().nonnegative(),
  trend: z.string(),
  volatility: z.string(),
  confidence: z.number().min(0).max(1),
  quality: z.any(), // JSONB
  features: z.any(), // JSONB
  signature: z.any(), // JSONB
  hash: z.string(),
  inserted_at: z.string(),
});

export const SystemHealthRowSchema = z.object({
  key: z.string(),
  value: z.any(), // JSONB
  updated_at: z.string(),
});

// API schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    ok: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

export const RegimeHistoryQuerySchema = z.object({
  symbol: SymbolSchema.optional(),
  tf: TFSchema.optional(),
  from: z.number().int().nonnegative().optional(),
  to: z.number().int().nonnegative().optional(),
  limit: z.number().int().positive().max(1000).optional(),
});

// Binance API response schemas
export const BinanceKlineArraySchema = z.array(z.union([z.string(), z.number()])).length(12);

export const BinanceKlineResponseSchema = z.array(BinanceKlineArraySchema);

// Configuration schema
export const MCEConfigSchema = z.object({
  symbols: z.array(SymbolSchema),
  timeframes: z.array(TFSchema),
  features: z.object({
    atrPeriods: z.array(z.number().int().positive()),
    emaPeriods: z.array(z.number().int().positive()),
    lookbackDays: z.array(z.number().int().positive()),
  }),
  classification: z.object({
    trendThreshold: z.number().min(0).max(1),
    volCompressedPct: z.number().min(0).max(100),
    volExpandedPct: z.number().min(0).max(100),
    minConfidence: z.number().min(0).max(1),
  }),
  quality: z.object({
    minCompleteness: z.number().min(0).max(1),
    maxFreshnessSec: z.number().min(0),
    maxGapsPct: z.number().min(0).max(100),
  }),
});

// SSE event schemas
export const SSERegimeEventSchema = z.object({
  type: z.literal("regime"),
  data: RegimeSignatureSchema,
});

export const SSEHealthEventSchema = z.object({
  type: z.literal("health"),
  data: z.object({
    status: z.enum(["healthy", "degraded", "error"]),
    lastUpdate: z.number().int().nonnegative(),
    message: z.string().optional(),
  }),
});

export const SSEEventSchema = z.union([SSERegimeEventSchema, SSEHealthEventSchema]);

// Validation helper functions
export function validateKline(data: unknown): data is z.infer<typeof KlineSchema> {
  try {
    KlineSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateRegimeSignature(data: unknown): data is z.infer<typeof RegimeSignatureSchema> {
  try {
    RegimeSignatureSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateFeatureVector(data: unknown): data is z.infer<typeof FeatureVectorSchema> {
  try {
    FeatureVectorSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

// Canonical serialization helpers
export function canonicalizeNumber(num: number, decimals: number = 6): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function canonicalizeFeatureVector(features: z.infer<typeof FeatureVectorSchema>): z.infer<typeof FeatureVectorSchema> {
  return {
    atr14: features.atr14 !== null ? canonicalizeNumber(features.atr14) : null,
    atr50: features.atr50 !== null ? canonicalizeNumber(features.atr50) : null,
    atrPct7d: features.atrPct7d !== null ? canonicalizeNumber(features.atrPct7d, 2) : null,
    atrPct30d: features.atrPct30d !== null ? canonicalizeNumber(features.atrPct30d, 2) : null,
    emaFast: features.emaFast !== null ? canonicalizeNumber(features.emaFast) : null,
    emaSlow: features.emaSlow !== null ? canonicalizeNumber(features.emaSlow) : null,
    trendStrength: features.trendStrength !== null ? canonicalizeNumber(features.trendStrength, 4) : null,
    volNorm: features.volNorm !== null ? canonicalizeNumber(features.volNorm, 4) : null,
    volZ: features.volZ !== undefined && features.volZ !== null ? canonicalizeNumber(features.volZ, 4) : features.volZ,
    volMA: features.volMA !== undefined && features.volMA !== null ? canonicalizeNumber(features.volMA) : features.volMA,
  };
}

export function canonicalizeDataQuality(quality: z.infer<typeof DataQualitySchema>): z.infer<typeof DataQualitySchema> {
  return {
    completeness: canonicalizeNumber(quality.completeness, 4),
    gaps: quality.gaps,
    freshnessSec: quality.freshnessSec,
    source: quality.source,
    valid: quality.valid,
  };
}

// Type exports for convenience
export type KlineType = z.infer<typeof KlineSchema>;
export type FeatureVectorType = z.infer<typeof FeatureVectorSchema>;
export type DataQualityType = z.infer<typeof DataQualitySchema>;
export type RegimeSignatureType = z.infer<typeof RegimeSignatureSchema>;
export type MarketDataRowType = z.infer<typeof MarketDataRowSchema>;
export type RegimeSignatureRowType = z.infer<typeof RegimeSignatureRowSchema>;
export type SystemHealthRowType = z.infer<typeof SystemHealthRowSchema>;
export type MCEConfigType = z.infer<typeof MCEConfigSchema>;