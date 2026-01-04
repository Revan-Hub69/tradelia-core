// NASA-Grade Input Canonicalization
// Compress raw data to essential features, prevent context explosion

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
  atr_pct: number;
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
 * Convert raw regime data to canonical Brick1 format
 */
export function canonicalizeBrick1(rawData: any): Brick1Canon | null {
  if (!rawData?.regime4h) return null;

  const regime4h = rawData.regime4h;
  const metrics = regime4h.metrics || {};

  return {
    regime: regime4h.regime || "TRANSITION",
    stress_flag: Boolean(regime4h.stress),
    atr_pct: Number(metrics.atr14) || 0,
    spread_bps: Number(rawData.spread_bps) || 0,
    trend_strength: Math.max(-1, Math.min(1, Number(metrics.trendStrength) || 0)),
    range_ratio: Math.max(0, Math.min(1, Number(metrics.rangeRatio) || 0)),
    returns_std: Number(metrics.returnsStd) || 0,
    ema_state: determineEmaState(metrics),
    freshness_ms: Date.now() - (rawData.ts || Date.now())
  };
}

/**
 * Convert raw universe data to canonical Brick2 format
 */
export function canonicalizeBrick2(rawData: any): Brick2Canon | null {
  if (!rawData?.long && !rawData?.short) return null;

  const candidates: Brick2Canon['candidates'] = [];

  // Process long candidates
  if (Array.isArray(rawData.long)) {
    for (const candidate of rawData.long.slice(0, 25)) { // Limit to top 25
      const canonical = canonicalizeCandidate(candidate, "LONG");
      if (canonical) candidates.push(canonical);
    }
  }

  // Process short candidates
  if (Array.isArray(rawData.short)) {
    for (const candidate of rawData.short.slice(0, 25)) { // Limit to top 25
      const canonical = canonicalizeCandidate(candidate, "SHORT");
      if (canonical) candidates.push(canonical);
    }
  }

  return { candidates };
}

/**
 * Create complete canonical input from raw data
 */
export function createInputCanon(rawData: any, mode: string): InputCanon {
  const canon: InputCanon = {
    meta: {
      anchor_symbol: rawData.symbol || "UNKNOWN",
      timestamp: rawData.ts || Date.now(),
      source: rawData.source || "unknown"
    }
  };

  // Add brick1 data if needed
  if (mode === "BRICK1_ONLY" || mode === "BRICK1_PLUS_BRICK2") {
    const brick1 = canonicalizeBrick1(rawData.market?.anchor);
    if (brick1) canon.brick1 = brick1;
  }

  // Add brick2 data if needed
  if (mode === "BRICK2_ONLY" || mode === "BRICK1_PLUS_BRICK2") {
    const brick2 = canonicalizeBrick2(rawData.universe);
    if (brick2) canon.brick2 = brick2;
  }

  return canon;
}

// Helper functions
function canonicalizeCandidate(raw: any, side: "LONG" | "SHORT"): Brick2Canon['candidates'][0] | null {
  if (!raw?.symbol) return null;

  return {
    symbol: raw.symbol,
    side,
    score: Number(raw.scores?.total) || 0,
    spread_bps: Number(raw.ws?.spreadBpsNow) || 0,
    atr_pct: calculateAtrPct(raw),
    liquidity_grade: determineLiquidityGrade(raw),
    regime_match: Number(raw.scores?.regimeMatch) || 0,
    cleanliness: calculateCleanliness(raw)
  };
}

function determineEmaState(metrics: any): "BULL" | "BEAR" | "NEUTRAL" {
  const ema20 = Number(metrics.ema20) || 0;
  const ema50 = Number(metrics.ema50) || 0;
  const ema200 = Number(metrics.ema200) || 0;

  if (ema20 > ema50 && ema50 > ema200) return "BULL";
  if (ema20 < ema50 && ema50 < ema200) return "BEAR";
  return "NEUTRAL";
}

function calculateAtrPct(raw: any): number {
  // Try multiple sources for ATR - ensure it's a percentage (0-1 range)
  let atr = 0;
  
  if (raw.htf?.atr) {
    atr = Number(raw.htf.atr);
  } else if (raw.metrics?.atr14) {
    atr = Number(raw.metrics.atr14);
  } else if (raw.htf?.price && raw.volatility) {
    atr = Number(raw.volatility) / Number(raw.htf.price);
  }
  
  // Ensure ATR is in reasonable range (0-50% max)
  if (atr > 1) {
    // If ATR looks like absolute value, convert to percentage
    const price = Number(raw.htf?.price) || 1;
    atr = atr / price;
  }
  
  // Cap at 50% for sanity
  return Math.min(atr, 0.5);
}

function determineLiquidityGrade(raw: any): "A" | "B" | "C" | "D" {
  const spread = Number(raw.ws?.spreadBpsNow) || 999;
  const volume = Number(raw.volume24h) || 0;

  // Grade based on spread and volume
  if (spread <= 2 && volume > 1000000) return "A";
  if (spread <= 5 && volume > 100000) return "B";
  if (spread <= 20 && volume > 10000) return "C";
  return "D";
}

function calculateCleanliness(raw: any): number {
  // Cleanliness = inverse of choppiness/noise
  const rangeRatio = Number(raw.metrics?.rangeRatio) || 0.5;
  const trendStrength = Math.abs(Number(raw.metrics?.trendStrength) || 0);
  
  // Higher trend strength + lower range ratio = cleaner
  return Math.min(1, trendStrength * (1 - rangeRatio));
}

/**
 * Validate canonical input meets minimum requirements
 */
export function validateInputCanon(canon: InputCanon, mode: string): string[] {
  const errors: string[] = [];

  // Meta validation
  if (!canon.meta.anchor_symbol) {
    errors.push("Missing anchor_symbol");
  }

  if (!canon.meta.timestamp || canon.meta.timestamp <= 0) {
    errors.push("Invalid timestamp");
  }

  // Brick1 validation
  if ((mode === "BRICK1_ONLY" || mode === "BRICK1_PLUS_BRICK2") && !canon.brick1) {
    errors.push("Missing brick1 data for mode " + mode);
  }

  // Brick2 validation
  if ((mode === "BRICK2_ONLY" || mode === "BRICK1_PLUS_BRICK2") && !canon.brick2) {
    errors.push("Missing brick2 data for mode " + mode);
  }

  if (canon.brick2 && canon.brick2.candidates.length === 0) {
    errors.push("No valid candidates in brick2");
  }

  return errors;
}