// NASA-Grade Input Canonicalization
// Compress raw data to essential features, prevent context explosion
// ALL canonicalization happens server-side - NO client-side mock/fallback

export interface InputCanon {
  brick1?: Brick1Canon;
  brick2?: Brick2Canon;
  meta: {
    anchor_symbol: string;
    timestamp: number;
    source: string;
  };
  missing_fields: string[]; // Track what's missing for audit
}

export interface Brick1Canon {
  regime: "TREND" | "RANGE" | "TRANSITION";
  stress_flag: boolean;
  atr_frac: number; // ATR as fraction (0-0.3), not percentage
  spread_bps: number;
  trend_strength: number; // Normalized to [-1, 1] via tanh
  range_ratio: number; // Normalized to [0, 1] via sigmoid
  returns_std: number;
  ema_state: "BULL" | "BEAR" | "NEUTRAL";
  freshness_ms: number;
  // Raw values preserved for audit/conflict detection
  _raw_trend_strength?: number;
  _raw_range_ratio?: number;
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
 * NASA-grade: NO fallbacks, track missing fields
 */
export function canonicalizeBrick1(rawData: any, anchorSymbol: string, universe: any): { canon: Brick1Canon | null; missing: string[] } {
  const missing: string[] = [];
  
  // Try multiple sources for regime data
  const regime = rawData?.regime || rawData?.regime4h?.regime;
  const metrics = rawData?.metrics || rawData?.regime4h?.metrics || rawData;
  
  if (!regime) missing.push("regime");
  
  // Get price from universe anchor candidate (most reliable source)
  let price = 0;
  if (universe?.long) {
    const anchor = universe.long.find((c: any) => c.symbol === anchorSymbol);
    if (anchor?.htf?.price) price = Number(anchor.htf.price);
  }
  if (!price && universe?.short) {
    const anchor = universe.short.find((c: any) => c.symbol === anchorSymbol);
    if (anchor?.htf?.price) price = Number(anchor.htf.price);
  }
  if (!price && metrics?.close) price = Number(metrics.close);
  if (!price && rawData?.close) price = Number(rawData.close);
  
  // Get ATR from metrics
  const atr14 = Number(metrics?.atr14) || 0;
  
  // Calculate ATR fraction (NASA-grade: single formula)
  let atr_frac = 0;
  if (atr14 > 0 && price > 0) {
    atr_frac = atr14 / price;
  } else {
    missing.push("atr_frac (atr14 or price missing)");
  }
  
  // Get spread from WS data in universe (real data)
  let spread_bps = 0;
  if (universe?.long) {
    const anchor = universe.long.find((c: any) => c.symbol === anchorSymbol);
    if (anchor?.ws?.spreadBpsNow) spread_bps = Number(anchor.ws.spreadBpsNow);
  }
  if (!spread_bps && universe?.short) {
    const anchor = universe.short.find((c: any) => c.symbol === anchorSymbol);
    if (anchor?.ws?.spreadBpsNow) spread_bps = Number(anchor.ws.spreadBpsNow);
  }
  if (!spread_bps) missing.push("spread_bps");
  
  // Get other metrics - NO CLAMPING, preserve original values for audit
  const trendStrength = Number(metrics?.trendStrength) || 0;
  const rangeRatio = Number(metrics?.rangeRatio) || 0;
  const returnsStd = Number(metrics?.returnsStd) || Number(metrics?.returnsStd20) || 0;
  
  if (!trendStrength && trendStrength !== 0) missing.push("trendStrength");
  if (!rangeRatio && rangeRatio !== 0) missing.push("rangeRatio");
  if (!returnsStd) missing.push("returnsStd");
  
  // If critical fields missing, return null
  if (!regime || atr_frac === 0) {
    return { canon: null, missing };
  }

  // Normalize trend_strength to [-1, 1] using tanh-like scaling
  // Original values can be > 1 (e.g., 1.24), this preserves relative strength
  const normalizedTrendStrength = Math.tanh(trendStrength);
  
  // Normalize range_ratio to [0, 1] using sigmoid-like scaling
  // Original values can be >> 1 (e.g., 6.89), this preserves relative magnitude
  const normalizedRangeRatio = rangeRatio / (1 + rangeRatio);

  return {
    canon: {
      regime: regime || "TRANSITION",
      stress_flag: Boolean(rawData?.stress || rawData?.regime4h?.stress),
      atr_frac: Math.min(atr_frac, 0.3), // Cap at 30%
      spread_bps: spread_bps || 0,
      trend_strength: normalizedTrendStrength, // Now properly normalized
      range_ratio: normalizedRangeRatio, // Now properly normalized
      returns_std: returnsStd,
      ema_state: determineEmaState(metrics),
      freshness_ms: Date.now() - (rawData?.ts || Date.now()),
      // Preserve raw values for audit
      _raw_trend_strength: trendStrength,
      _raw_range_ratio: rangeRatio
    },
    missing
  };
}

/**
 * Convert raw universe data to canonical Brick2 format
 * NASA-grade: NO fallbacks, use real WS data
 */
export function canonicalizeBrick2(rawData: any): { canon: Brick2Canon | null; missing: string[] } {
  const missing: string[] = [];
  
  if (!rawData?.long && !rawData?.short) {
    missing.push("universe candidates (long or short)");
    return { canon: null, missing };
  }

  const candidates: Brick2Canon['candidates'] = [];

  // Process long candidates
  if (Array.isArray(rawData.long)) {
    for (const candidate of rawData.long.slice(0, 25)) {
      const canonical = canonicalizeCandidate(candidate, "LONG");
      if (canonical) candidates.push(canonical);
    }
  }

  // Process short candidates
  if (Array.isArray(rawData.short)) {
    for (const candidate of rawData.short.slice(0, 25)) {
      const canonical = canonicalizeCandidate(candidate, "SHORT");
      if (canonical) candidates.push(canonical);
    }
  }

  if (candidates.length === 0) {
    missing.push("valid candidates after filtering");
    return { canon: null, missing };
  }

  return { canon: { candidates }, missing };
}

/**
 * Create complete canonical input from raw data
 * NASA-grade: Server-side only, NO client fallbacks
 */
export function createInputCanon(rawData: any, mode: string): InputCanon {
  const anchorSymbol = rawData.symbol || "UNKNOWN";
  const allMissing: string[] = [];
  
  const canon: InputCanon = {
    meta: {
      anchor_symbol: anchorSymbol,
      timestamp: rawData.ts || Date.now(),
      source: rawData.source || "unknown"
    },
    missing_fields: []
  };

  // Add brick1 data if needed
  if (mode === "BRICK1_ONLY" || mode === "BRICK1_PLUS_BRICK2") {
    const { canon: brick1, missing } = canonicalizeBrick1(rawData.regime, anchorSymbol, rawData.universe);
    if (brick1) {
      canon.brick1 = brick1;
    }
    allMissing.push(...missing.map(m => `brick1.${m}`));
  }

  // Add brick2 data if needed
  if (mode === "BRICK2_ONLY" || mode === "BRICK1_PLUS_BRICK2") {
    const { canon: brick2, missing } = canonicalizeBrick2(rawData.universe);
    if (brick2) {
      canon.brick2 = brick2;
    }
    allMissing.push(...missing.map(m => `brick2.${m}`));
  }

  canon.missing_fields = allMissing;
  return canon;
}

// Helper functions
function canonicalizeCandidate(raw: any, side: "LONG" | "SHORT"): Brick2Canon['candidates'][0] | null {
  if (!raw?.symbol) return null;

  // Use real WS data for spread (NASA-grade: no fallback)
  const spreadBps = Number(raw.ws?.spreadBpsNow) || 0;
  
  // Calculate ATR% from htf data (real data)
  let atrPct = 0;
  if (raw.htf?.atrPct4h) {
    atrPct = Number(raw.htf.atrPct4h);
  } else if (raw.htf?.atr && raw.htf?.price) {
    atrPct = (Number(raw.htf.atr) / Number(raw.htf.price)) * 100;
  }

  return {
    symbol: raw.symbol,
    side,
    score: Number(raw.scores?.total) || 0,
    spread_bps: spreadBps,
    atr_pct: atrPct,
    liquidity_grade: determineLiquidityGrade(raw),
    regime_match: Number(raw.scores?.regimeMatch) || 0,
    cleanliness: calculateCleanliness(raw)
  };
}

function determineEmaState(metrics: any): "BULL" | "BEAR" | "NEUTRAL" {
  const ema20 = Number(metrics?.ema20) || 0;
  const ema50 = Number(metrics?.ema50) || 0;
  const ema200 = Number(metrics?.ema200) || 0;

  if (ema20 > ema50 && ema50 > ema200) return "BULL";
  if (ema20 < ema50 && ema50 < ema200) return "BEAR";
  return "NEUTRAL";
}

function determineLiquidityGrade(raw: any): "A" | "B" | "C" | "D" {
  const spread = Number(raw.ws?.spreadBpsNow) || 999;
  const volume = Number(raw.volume24h) || 0;

  if (spread <= 2 && volume > 1000000) return "A";
  if (spread <= 5 && volume > 100000) return "B";
  if (spread <= 20 && volume > 10000) return "C";
  return "D";
}

function calculateCleanliness(raw: any): number {
  const rangeRatio = Number(raw.metrics?.rangeRatio) || 0.5;
  const trendStrength = Math.abs(Number(raw.metrics?.trendStrength) || 0);
  
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