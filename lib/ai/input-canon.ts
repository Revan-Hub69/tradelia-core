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
 * Convert raw regime data to canonical Brick1 format
 */
export function canonicalizeBrick1(rawData: any): Brick1Canon | null {
  if (!rawData?.regime4h) return null;

  const regime4h = rawData.regime4h;
  const metrics = regime4h.metrics || {};

  return {
    regime: regime4h.regime || "TRANSITION",
    stress_flag: Boolean(regime4h.stress),
    atr_frac: calculateAtrFrac(rawData), // Now rawData includes htf.price
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
    atr_pct: calculateAtrFrac(raw),
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

/**
 * Calculate ATR as fraction (0-0.3 typical range)
 * Standard: atr_frac = ATR / Price
 */
function calculateAtrFrac(raw: any): number {
  console.log(`🔍 ATR Debug - Raw data structure:`, JSON.stringify(raw, null, 2));
  
  // Get price from multiple sources
  let price = 0;
  
  // Try different price sources based on data structure
  if (raw.htf?.price) {
    price = Number(raw.htf.price);
    console.log(`📊 Price from raw.htf.price: ${price}`);
  } else if (raw.price) {
    price = Number(raw.price);
    console.log(`📊 Price from raw.price: ${price}`);
  } else if (raw.regime4h?.metrics?.price) {
    price = Number(raw.regime4h.metrics.price);
    console.log(`📊 Price from raw.regime4h.metrics.price: ${price}`);
  } else if (raw.market?.anchor?.htf?.price) {
    price = Number(raw.market.anchor.htf.price);
    console.log(`📊 Price from raw.market.anchor.htf.price: ${price}`);
  } else {
    // Fallback based on symbol
    const symbol = raw.symbol || raw.market?.anchor?.symbol || 'UNKNOWN';
    if (symbol.includes('BTC')) price = 91000;
    else if (symbol.includes('ETH')) price = 3200;
    else price = 50000;
    console.log(`📊 Price fallback for ${symbol}: ${price}`);
  }
  
  let atr = 0;
  
  // Try multiple sources for ATR value (absolute)
  if (raw.regime4h?.metrics?.atr14) {
    atr = Number(raw.regime4h.metrics.atr14);
    console.log(`📊 ATR from raw.regime4h.metrics.atr14: ${atr}`);
  } else if (raw.htf?.atr) {
    atr = Number(raw.htf.atr);
    console.log(`📊 ATR from raw.htf.atr: ${atr}`);
  } else if (raw.metrics?.atr14) {
    atr = Number(raw.metrics.atr14);
    console.log(`📊 ATR from raw.metrics.atr14: ${atr}`);
  } else if (raw.metrics?.atr) {
    atr = Number(raw.metrics.atr);
    console.log(`📊 ATR from raw.metrics.atr: ${atr}`);
  } else if (raw.regime?.metrics?.atr14) {
    atr = Number(raw.regime.metrics.atr14);
    console.log(`📊 ATR from raw.regime.metrics.atr14: ${atr}`);
  } else if (raw.market?.anchor?.regime4h?.metrics?.atr14) {
    atr = Number(raw.market.anchor.regime4h.metrics.atr14);
    console.log(`📊 ATR from raw.market.anchor.regime4h.metrics.atr14: ${atr}`);
  } else {
    console.log(`❌ No ATR found in data structure`);
  }
  
  console.log(`🔍 ATR Debug: atr=${atr}, price=${price}, symbol=${raw.symbol || raw.market?.anchor?.symbol || 'unknown'}`);
  
  if (atr <= 0 || price <= 0) {
    console.log(`❌ Invalid values: atr=${atr}, price=${price}`);
    return 0;
  }
  
  // Calculate fraction: ATR / Price
  const atr_frac = atr / price;
  
  console.log(`📊 ATR Result: ${atr} / ${price} = ${atr_frac} (${(atr_frac * 100).toFixed(2)}%)`);
  
  // Sanity cap at 30% (0.3)
  const result = Math.min(atr_frac, 0.3);
  console.log(`✅ Final ATR fraction: ${result} (${(result * 100).toFixed(2)}%)`);
  
  return result;
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