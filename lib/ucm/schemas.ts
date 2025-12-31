// UCM Zod Schemas - Validation and Type Safety
// Universe Control Module data validation and canonical serialization

import { z } from "zod";
import crypto from "crypto";

// Base schemas for UCM data types
export const UniversePoolSchema = z.object({
  v: z.literal("ucm.pool.v1"),
  asOf: z.number().int().nonnegative(),
  symbols: z.array(z.string()).min(10).max(150),
  coreSymbols: z.array(z.string()).min(3).max(10),
  hash: z.string().regex(/^[a-f0-9]{64}$/, "Hash must be 64-character hex string"),
});

export const EligibilitySnapshotSchema = z.object({
  symbol: z.string().min(1),
  asOf: z.number().int().nonnegative(),
  volQuote_24h: z.number().nonnegative(),
  spreadBps: z.number().nonnegative(),
  completeness_60m: z.number().min(0).max(1),
  gaps_60m: z.number().int().min(0),
  atr14_1m: z.number().positive(),
  atrPercentile_1m: z.number().min(0).max(100),
});

export const UniverseStateSchema = z.object({
  symbol: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE", "BLACKLISTED"]),
  enteredAt: z.number().int().nonnegative().optional(),
  exitedAt: z.number().int().nonnegative().optional(),
  cooldownUntil: z.number().int().nonnegative().optional(),
  blacklistUntil: z.number().int().nonnegative().optional(),
});

export const UniverseActiveSchema = z.object({
  v: z.literal("ucm.active.v1"),
  asOf: z.number().int().nonnegative(),
  target: z.number().int().positive(),
  min: z.number().int().positive(),
  max: z.number().int().positive(),
  symbols: z.array(z.string()),
  coreIncluded: z.boolean(),
  meta: z.object({
    added: z.array(z.string()),
    removed: z.array(z.string()),
    blacklisted: z.array(z.string()),
  }),
  basedOn: z.object({
    poolHash: z.string(),
    eligibilityBatchHash: z.string(),
    prevActiveHash: z.string().optional(),
  }),
  hash: z.string().regex(/^[a-f0-9]{64}$/),
});

// Database row schemas for type safety
export const UniversePoolRowSchema = z.object({
  id: z.number().int().positive(),
  version: z.string(),
  as_of: z.number().int().nonnegative(),
  symbols: z.any(), // JSONB
  core_symbols: z.any(), // JSONB
  hash: z.string(),
  created_at: z.string(),
});

export const UniverseStateRowSchema = z.object({
  symbol: z.string(),
  status: z.string(),
  entered_at: z.number().int().nonnegative().nullable(),
  exited_at: z.number().int().nonnegative().nullable(),
  cooldown_until: z.number().int().nonnegative().nullable(),
  blacklist_until: z.number().int().nonnegative().nullable(),
  updated_at: z.string(),
});

export const UniverseActiveRowSchema = z.object({
  id: z.number().int().positive(),
  as_of: z.number().int().nonnegative(),
  version: z.string(),
  target_count: z.number().int().positive(),
  min_count: z.number().int().positive(),
  max_count: z.number().int().positive(),
  symbols: z.any(), // JSONB
  core_included: z.boolean(),
  meta: z.any(), // JSONB
  based_on: z.any(), // JSONB
  hash: z.string(),
  created_at: z.string(),
});

export const EligibilitySnapshotRowSchema = z.object({
  symbol: z.string(),
  as_of: z.number().int().nonnegative(),
  vol_quote_24h: z.number(),
  spread_bps: z.number(),
  completeness_60m: z.number(),
  gaps_60m: z.number().int(),
  atr14_1m: z.number(),
  atr_percentile_1m: z.number(),
  created_at: z.string(),
});

// Type exports for convenience
export type UniversePoolType = z.infer<typeof UniversePoolSchema>;
export type EligibilitySnapshotType = z.infer<typeof EligibilitySnapshotSchema>;
export type UniverseStateType = z.infer<typeof UniverseStateSchema>;
export type UniverseActiveType = z.infer<typeof UniverseActiveSchema>;

// Database row types
export type UniversePoolRowType = z.infer<typeof UniversePoolRowSchema>;
export type UniverseStateRowType = z.infer<typeof UniverseStateRowSchema>;
export type UniverseActiveRowType = z.infer<typeof UniverseActiveRowSchema>;
export type EligibilitySnapshotRowType = z.infer<typeof EligibilitySnapshotRowSchema>;

// Validation helper functions
export function validateUniversePool(data: unknown): data is UniversePoolType {
  try {
    UniversePoolSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateEligibilitySnapshot(data: unknown): data is EligibilitySnapshotType {
  try {
    EligibilitySnapshotSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateUniverseState(data: unknown): data is UniverseStateType {
  try {
    UniverseStateSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

export function validateUniverseActive(data: unknown): data is UniverseActiveType {
  try {
    UniverseActiveSchema.parse(data);
    return true;
  } catch {
    return false;
  }
}

// Canonical hash generation for deterministic versioning
export function generatePoolHash(symbols: string[], coreSymbols: string[]): string {
  const canonical = {
    symbols: [...symbols].sort(),
    coreSymbols: [...coreSymbols].sort(),
  };
  
  const canonicalJson = JSON.stringify(canonical);
  return crypto.createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}

export function generateEligibilityBatchHash(snapshots: EligibilitySnapshotType[]): string {
  // Sort by symbol for deterministic ordering
  const sortedSnapshots = [...snapshots].sort((a, b) => a.symbol.localeCompare(b.symbol));
  
  // Create canonical representation
  const canonical = sortedSnapshots.map(s => ({
    symbol: s.symbol,
    asOf: s.asOf,
    volQuote_24h: Math.round(s.volQuote_24h * 100) / 100, // 2 decimal precision
    spreadBps: Math.round(s.spreadBps * 100) / 100,
    completeness_60m: Math.round(s.completeness_60m * 10000) / 10000, // 4 decimal precision
    gaps_60m: s.gaps_60m,
    atr14_1m: Math.round(s.atr14_1m * 1000000) / 1000000, // 6 decimal precision
    atrPercentile_1m: Math.round(s.atrPercentile_1m * 100) / 100,
  }));
  
  const canonicalJson = JSON.stringify(canonical);
  return crypto.createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}

export function generateUniverseActiveHash(
  universeActive: Omit<UniverseActiveType, 'hash'>
): string {
  // Create canonical representation without hash
  const canonical = {
    v: universeActive.v,
    asOf: universeActive.asOf,
    target: universeActive.target,
    min: universeActive.min,
    max: universeActive.max,
    symbols: [...universeActive.symbols], // Preserve order (already ranked)
    coreIncluded: universeActive.coreIncluded,
    meta: {
      added: [...universeActive.meta.added].sort(),
      removed: [...universeActive.meta.removed].sort(),
      blacklisted: [...universeActive.meta.blacklisted].sort(),
    },
    basedOn: universeActive.basedOn,
  };
  
  const canonicalJson = JSON.stringify(canonical);
  return crypto.createHash('sha256').update(canonicalJson, 'utf8').digest('hex');
}

// API response schemas
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    ok: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  });

export const UniverseActiveApiResponseSchema = ApiResponseSchema(UniverseActiveSchema);
export const UniversePoolApiResponseSchema = ApiResponseSchema(UniversePoolSchema);

// Query parameter schemas
export const UniverseDiffQuerySchema = z.object({
  from: z.number().int().nonnegative().optional(),
  to: z.number().int().nonnegative().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type UniverseDiffQueryType = z.infer<typeof UniverseDiffQuerySchema>;

// Diff result schema
export const UniverseDiffSchema = z.object({
  from: z.number().int().nonnegative(),
  to: z.number().int().nonnegative(),
  changes: z.array(z.object({
    asOf: z.number().int().nonnegative(),
    added: z.array(z.string()),
    removed: z.array(z.string()),
    blacklisted: z.array(z.string()),
    activeCount: z.number().int().nonnegative(),
  })),
});

export type UniverseDiffType = z.infer<typeof UniverseDiffSchema>;

// Error types for UCM operations
export class UCMError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'UCMError';
  }
}

export class EligibilityError extends UCMError {
  constructor(message: string) {
    super(message, 'ELIGIBILITY_ERROR');
  }
}

export class HysteresisError extends UCMError {
  constructor(message: string) {
    super(message, 'HYSTERESIS_ERROR');
  }
}

export class UniverseGenerationError extends UCMError {
  constructor(message: string) {
    super(message, 'UNIVERSE_GENERATION_ERROR');
  }
}