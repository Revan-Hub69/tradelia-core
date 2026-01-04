// NASA-Grade Audit System
// Deterministic validation, coverage tracking, conflict detection

import { createHash } from "crypto";

export interface AuditResult {
  input_hash: string;
  input_coverage_pct: number;
  sanity_checks: SanityCheck[];
  conflicts: string[];
  assumptions: string[];
  timestamp: number;
}

export interface SanityCheck {
  name: string;
  pass: boolean;
  detail: string;
  value?: number;
  threshold?: number;
}

export interface InputCanon {
  brick1?: Brick1Canon;
  brick2?: Brick2Canon;
  meta: {
    anchor_symbol: string;
    timestamp: number;
    source: string;
  };
}

export interface Brick1Canon {
  regime: "TREND" | "RANGE" | "TRANSITION";
  stress_flag: boolean;
  atr_frac: number; // ATR as fraction (0-0.3), not percentage
  spread_bps: number;
  trend_strength: number;
  range_ratio: number;
  returns_std: number;
  ema_state: "BULL" | "BEAR" | "NEUTRAL";
  freshness_ms: number;
}

export interface Brick2Canon {
  candidates: Array<{
    symbol: string;
    side: "LONG" | "SHORT";
    score: number;
    spread_bps: number;
    atr_pct: number;
    liquidity_grade: "A" | "B" | "C" | "D";
    regime_match: number;
    cleanliness: number;
  }>;
}

/**
 * Generate deterministic hash of input data
 */
export function generateInputHash(input: InputCanon): string {
  const normalized = JSON.stringify(input, Object.keys(input).sort());
  return createHash('sha256').update(normalized).digest('hex').substring(0, 16);
}

/**
 * Calculate input coverage percentage based on required fields
 */
export function calculateInputCoverage(input: InputCanon, mode: string): number {
  const requiredFields = getRequiredFields(mode);
  let presentFields = 0;
  let totalFields = requiredFields.length;

  for (const field of requiredFields) {
    if (getNestedValue(input, field) !== undefined && getNestedValue(input, field) !== null) {
      presentFields++;
    }
  }

  return Math.round((presentFields / totalFields) * 100);
}

/**
 * Run deterministic sanity checks
 */
export function runSanityChecks(input: InputCanon): SanityCheck[] {
  const checks: SanityCheck[] = [];

  // Timestamp freshness
  const age = Date.now() - input.meta.timestamp;
  checks.push({
    name: "timestamp_fresh",
    pass: age < 300_000, // 5 minutes
    detail: `Data age: ${Math.round(age / 1000)}s`,
    value: age,
    threshold: 300_000
  });

  // Brick1 checks
  if (input.brick1) {
    // Spread sanity
    checks.push({
      name: "spread_reasonable",
      pass: input.brick1.spread_bps >= 0.1 && input.brick1.spread_bps <= 100,
      detail: `Spread: ${input.brick1.spread_bps}bps`,
      value: input.brick1.spread_bps,
      threshold: 100
    });

    // ATR sanity - now using fraction (0-0.3 typical)
    checks.push({
      name: "atr_reasonable",
      pass: input.brick1.atr_frac >= 0.001 && input.brick1.atr_frac <= 0.3,
      detail: `ATR: ${(input.brick1.atr_frac * 100).toFixed(2)}%`,
      value: input.brick1.atr_frac,
      threshold: 0.3
    });

    // Trend strength bounds
    checks.push({
      name: "trend_strength_bounds",
      pass: input.brick1.trend_strength >= -1 && input.brick1.trend_strength <= 1,
      detail: `Trend strength: ${input.brick1.trend_strength.toFixed(3)}`,
      value: input.brick1.trend_strength,
      threshold: 1
    });

    // Returns std sanity (must be > 0 for valid calculation)
    checks.push({
      name: "returns_std_valid",
      pass: input.brick1.returns_std > 0.001,
      detail: `Returns std: ${input.brick1.returns_std.toFixed(4)}`,
      value: input.brick1.returns_std,
      threshold: 0.001
    });
  }

  // Brick2 checks
  if (input.brick2) {
    // Candidates count
    checks.push({
      name: "candidates_count",
      pass: input.brick2.candidates.length > 0 && input.brick2.candidates.length <= 50,
      detail: `Candidates: ${input.brick2.candidates.length}`,
      value: input.brick2.candidates.length,
      threshold: 50
    });

    // Score bounds
    const invalidScores = input.brick2.candidates.filter(c => c.score < 0 || c.score > 100);
    checks.push({
      name: "scores_valid",
      pass: invalidScores.length === 0,
      detail: `Invalid scores: ${invalidScores.length}`,
      value: invalidScores.length,
      threshold: 0
    });
  }

  return checks;
}

/**
 * Detect logical conflicts in the data
 */
export function detectConflicts(input: InputCanon): string[] {
  const conflicts: string[] = [];

  if (input.brick1) {
    // Regime vs trend strength conflict
    if (input.brick1.regime === "TREND" && Math.abs(input.brick1.trend_strength) < 0.3) {
      conflicts.push(`Regime=TREND but trend_strength=${input.brick1.trend_strength.toFixed(3)} is weak`);
    }

    if (input.brick1.regime === "RANGE" && Math.abs(input.brick1.trend_strength) > 0.7) {
      conflicts.push(`Regime=RANGE but trend_strength=${input.brick1.trend_strength.toFixed(3)} is strong`);
    }

    // EMA state vs trend strength
    if (input.brick1.ema_state === "BULL" && input.brick1.trend_strength < -0.2) {
      conflicts.push(`EMA_state=BULL but trend_strength=${input.brick1.trend_strength.toFixed(3)} is bearish`);
    }

    if (input.brick1.ema_state === "BEAR" && input.brick1.trend_strength > 0.2) {
      conflicts.push(`EMA_state=BEAR but trend_strength=${input.brick1.trend_strength.toFixed(3)} is bullish`);
    }
  }

  return conflicts;
}

/**
 * Generate complete audit for input
 */
export function auditInput(input: InputCanon, mode: string): AuditResult {
  return {
    input_hash: generateInputHash(input),
    input_coverage_pct: calculateInputCoverage(input, mode),
    sanity_checks: runSanityChecks(input),
    conflicts: detectConflicts(input),
    assumptions: generateAssumptions(input),
    timestamp: Date.now()
  };
}

// Helper functions
function getRequiredFields(mode: string): string[] {
  const brick1Fields = [
    "brick1.regime", "brick1.stress_flag", "brick1.atr_pct", 
    "brick1.spread_bps", "brick1.trend_strength", "brick1.range_ratio",
    "meta.anchor_symbol", "meta.timestamp"
  ];
  
  const brick2Fields = [
    "brick2.candidates", "meta.anchor_symbol", "meta.timestamp"
  ];

  switch (mode) {
    case "BRICK1_ONLY": return brick1Fields;
    case "BRICK2_ONLY": return brick2Fields;
    case "BRICK1_PLUS_BRICK2": return [...brick1Fields, ...brick2Fields];
    default: return [];
  }
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function generateAssumptions(input: InputCanon): string[] {
  const assumptions: string[] = [];
  
  if (input.brick1) {
    assumptions.push("Market data represents current conditions");
    if (input.brick1.freshness_ms > 60_000) {
      assumptions.push("Stale data may not reflect current market state");
    }
  }
  
  if (input.brick2) {
    assumptions.push("Universe screening reflects tradeable opportunities");
    if (input.brick2.candidates.length < 5) {
      assumptions.push("Limited candidate pool may reduce opportunities");
    }
  }
  
  return assumptions;
}