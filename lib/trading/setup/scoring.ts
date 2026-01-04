/**
 * BRICK 3: Setup Scoring System
 * 
 * Scoring con:
 * - Somma pesata (non moltiplicativa) per stabilità
 * - Cap per ogni fattore per evitare esplosioni
 * - contrib[] per audit trail completo
 * - Clamp finale 0-100
 */

// =============================================================================
// SCORING CONTRACTS
// =============================================================================

export interface ScoreContribution {
  factor: string;
  rawValue: number;
  normalizedValue: number;  // -1 to +1 or 0 to 1
  weight: number;
  contribution: number;     // weight * normalizedValue
  capped: boolean;          // True if value was capped
}

export interface SetupScore {
  total: number;            // 0-100
  confidence: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";
  contributions: ScoreContribution[];
  baseScore: number;
  adjustedScore: number;
  cappedFactors: string[];
  timestamp: number;
}

export type SetupType = "BREAKOUT" | "PULLBACK" | "SWEEP" | "FUNDING_FADE";

// =============================================================================
// SCORING CONFIGURATION
// =============================================================================

export interface ScoringConfig {
  baseScores: Record<SetupType, number>;
  weights: Record<string, number>;
  caps: Record<string, { min: number; max: number }>;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  baseScores: {
    BREAKOUT: 50,
    PULLBACK: 55,
    SWEEP: 45,
    FUNDING_FADE: 40,
  },
  weights: {
    regimeStrength: 15,
    structureStrength: 12,
    l2Imbalance: 10,
    cvdAlignment: 10,
    absorptionStrength: 8,
    fundingSignal: 5,
    oiSignal: 5,
    spreadQuality: 8,
    dataQuality: 7,
  },
  caps: {
    regimeStrength: { min: -1, max: 1 },
    structureStrength: { min: 0, max: 1 },
    l2Imbalance: { min: -1, max: 1 },
    cvdAlignment: { min: -1, max: 1 },
    absorptionStrength: { min: 0, max: 1 },
    fundingSignal: { min: -1, max: 1 },
    oiSignal: { min: -1, max: 1 },
    spreadQuality: { min: 0, max: 1 },
    dataQuality: { min: 0, max: 1 },
  },
};

// =============================================================================
// NORMALIZATION FUNCTIONS
// =============================================================================

/**
 * Clamp value to range
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Normalize regime strength to [-1, 1]
 * Input: 0-1 strength value
 * Output: -1 (weak) to +1 (strong), centered at 0.5
 */
export function normalizeRegimeStrength(strength: number): number {
  // 0.5 = neutral, <0.5 = weak (negative), >0.5 = strong (positive)
  return clamp((strength - 0.5) * 2, -1, 1);
}

/**
 * Normalize structure level strength to [0, 1]
 * Already in 0-1 range from structure engine
 */
export function normalizeStructureStrength(strength: number): number {
  return clamp(strength, 0, 1);
}

/**
 * Normalize L2 imbalance to [-1, 1]
 * Positive = bid heavy (bullish), Negative = ask heavy (bearish)
 * For LONG setups, positive is good; for SHORT, negative is good
 */
export function normalizeL2Imbalance(
  imbalance: number,
  direction: "LONG" | "SHORT"
): number {
  const normalized = clamp(imbalance, -1, 1);
  // Flip sign for SHORT so positive always means "favorable"
  return direction === "SHORT" ? -normalized : normalized;
}

/**
 * Normalize CVD alignment to [-1, 1]
 * +1 = perfectly aligned with setup direction
 * 0 = neutral
 * -1 = divergent (against setup direction)
 */
export function normalizeCVDAlignment(
  cvdSlope: number,
  direction: "LONG" | "SHORT",
  slopeThreshold: number = 100
): number {
  // Normalize slope to -1 to +1 range
  const normalizedSlope = clamp(cvdSlope / slopeThreshold, -1, 1);
  // For LONG, positive slope is good; for SHORT, negative is good
  return direction === "SHORT" ? -normalizedSlope : normalizedSlope;
}

/**
 * Normalize absorption strength to [0, 1]
 * Based on absorption zones detected
 */
export function normalizeAbsorptionStrength(
  absorptionZones: Array<{ strength: number; direction: "BID" | "ASK" }>,
  setupDirection: "LONG" | "SHORT"
): number {
  if (absorptionZones.length === 0) return 0;
  
  // Find absorption in favorable direction
  const favorableDir = setupDirection === "LONG" ? "BID" : "ASK";
  const favorableZones = absorptionZones.filter(z => z.direction === favorableDir);
  
  if (favorableZones.length === 0) return 0;
  
  // Max strength normalized to 0-1 (assuming 1000 is very strong)
  const maxStrength = Math.max(...favorableZones.map(z => z.strength));
  return clamp(maxStrength / 1000, 0, 1);
}

/**
 * Normalize funding signal to [-1, 1]
 * For contrarian setups: extreme funding in opposite direction is good
 */
export function normalizeFundingSignal(
  fundingRate: number,
  zScore: number,
  setupDirection: "LONG" | "SHORT"
): number {
  // Extreme positive funding = crowded long = good for SHORT
  // Extreme negative funding = crowded short = good for LONG
  const signal = clamp(zScore / 3, -1, 1); // 3 sigma = max
  return setupDirection === "SHORT" ? signal : -signal;
}

/**
 * Normalize OI signal to [-1, 1]
 * Rising OI with price = accumulation (bullish)
 * Falling OI with price = distribution (bearish)
 */
export function normalizeOISignal(
  oiDeltaPct: number,
  priceDeltaPct: number,
  setupDirection: "LONG" | "SHORT"
): number {
  // Accumulation: OI up + price up = bullish
  // Distribution: OI down + price down = bearish
  const sameDirection = (oiDeltaPct > 0 && priceDeltaPct > 0) || 
                        (oiDeltaPct < 0 && priceDeltaPct < 0);
  
  const magnitude = clamp(Math.abs(oiDeltaPct) / 10, 0, 1); // 10% = max
  const signal = sameDirection ? magnitude : -magnitude;
  
  // For LONG, accumulation is good; for SHORT, distribution is good
  return setupDirection === "LONG" ? signal : -signal;
}

/**
 * Normalize spread quality to [0, 1]
 * Lower spread = higher quality
 */
export function normalizeSpreadQuality(
  spreadBps: number,
  maxAcceptableBps: number = 15
): number {
  if (spreadBps >= maxAcceptableBps) return 0;
  return 1 - (spreadBps / maxAcceptableBps);
}

/**
 * Normalize data quality to [0, 1]
 * Based on combined status of all data feeds
 */
export function normalizeDataQuality(
  statuses: Array<"OK" | "DEGRADED" | "STALE" | "MISSING">
): number {
  const scores = { OK: 1, DEGRADED: 0.6, STALE: 0.2, MISSING: 0 };
  const total = statuses.reduce((sum, s) => sum + scores[s], 0);
  return total / statuses.length;
}

// =============================================================================
// MAIN SCORING FUNCTION
// =============================================================================

export interface ScoringInput {
  setupType: SetupType;
  direction: "LONG" | "SHORT";
  
  // Regime
  regimeStrength: number;       // 0-1
  
  // Structure
  structureStrength: number;    // 0-1
  
  // L2
  l2Imbalance: number;          // -1 to +1
  
  // CVD
  cvdSlope5m: number;           // Raw slope value
  
  // Absorption
  absorptionZones: Array<{ strength: number; direction: "BID" | "ASK" }>;
  
  // Funding (optional)
  fundingRate?: number;
  fundingZScore?: number;
  
  // OI (optional)
  oiDeltaPct?: number;
  priceDeltaPct?: number;
  
  // Quality
  spreadBps: number;
  dataStatuses: Array<"OK" | "DEGRADED" | "STALE" | "MISSING">;
}

/**
 * Calculate setup score with full audit trail
 * 
 * Formula: score = base + Σ(weight_i * normalized_feature_i)
 * All features normalized to [-1, 1] or [0, 1]
 * Final score clamped to [0, 100]
 */
export function calculateSetupScore(
  input: ScoringInput,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): SetupScore {
  const contributions: ScoreContribution[] = [];
  const cappedFactors: string[] = [];
  
  // Helper to add contribution
  const addContribution = (
    factor: string,
    rawValue: number,
    normalizedValue: number,
    weight: number
  ) => {
    const caps = config.caps[factor] || { min: -1, max: 1 };
    const capped = normalizedValue < caps.min || normalizedValue > caps.max;
    const clampedValue = clamp(normalizedValue, caps.min, caps.max);
    
    if (capped) cappedFactors.push(factor);
    
    contributions.push({
      factor,
      rawValue,
      normalizedValue: clampedValue,
      weight,
      contribution: weight * clampedValue,
      capped,
    });
  };
  
  // 1. Regime Strength
  const regimeNorm = normalizeRegimeStrength(input.regimeStrength);
  addContribution("regimeStrength", input.regimeStrength, regimeNorm, config.weights.regimeStrength);
  
  // 2. Structure Strength
  const structureNorm = normalizeStructureStrength(input.structureStrength);
  addContribution("structureStrength", input.structureStrength, structureNorm, config.weights.structureStrength);
  
  // 3. L2 Imbalance
  const l2Norm = normalizeL2Imbalance(input.l2Imbalance, input.direction);
  addContribution("l2Imbalance", input.l2Imbalance, l2Norm, config.weights.l2Imbalance);
  
  // 4. CVD Alignment
  const cvdNorm = normalizeCVDAlignment(input.cvdSlope5m, input.direction);
  addContribution("cvdAlignment", input.cvdSlope5m, cvdNorm, config.weights.cvdAlignment);
  
  // 5. Absorption Strength
  const absNorm = normalizeAbsorptionStrength(input.absorptionZones, input.direction);
  addContribution("absorptionStrength", input.absorptionZones.length, absNorm, config.weights.absorptionStrength);
  
  // 6. Funding Signal (if available)
  if (input.fundingRate !== undefined && input.fundingZScore !== undefined) {
    const fundingNorm = normalizeFundingSignal(input.fundingRate, input.fundingZScore, input.direction);
    addContribution("fundingSignal", input.fundingZScore, fundingNorm, config.weights.fundingSignal);
  }
  
  // 7. OI Signal (if available)
  if (input.oiDeltaPct !== undefined && input.priceDeltaPct !== undefined) {
    const oiNorm = normalizeOISignal(input.oiDeltaPct, input.priceDeltaPct, input.direction);
    addContribution("oiSignal", input.oiDeltaPct, oiNorm, config.weights.oiSignal);
  }
  
  // 8. Spread Quality
  const spreadNorm = normalizeSpreadQuality(input.spreadBps);
  addContribution("spreadQuality", input.spreadBps, spreadNorm, config.weights.spreadQuality);
  
  // 9. Data Quality
  const dataQualityNorm = normalizeDataQuality(input.dataStatuses);
  addContribution("dataQuality", input.dataStatuses.length, dataQualityNorm, config.weights.dataQuality);
  
  // Calculate total
  const baseScore = config.baseScores[input.setupType];
  const adjustmentSum = contributions.reduce((sum, c) => sum + c.contribution, 0);
  const adjustedScore = baseScore + adjustmentSum;
  const total = clamp(Math.round(adjustedScore), 0, 100);
  
  // Determine confidence level
  let confidence: SetupScore["confidence"];
  if (total >= 80) confidence = "VERY_HIGH";
  else if (total >= 65) confidence = "HIGH";
  else if (total >= 50) confidence = "MEDIUM";
  else confidence = "LOW";
  
  return {
    total,
    confidence,
    contributions,
    baseScore,
    adjustedScore,
    cappedFactors,
    timestamp: Date.now(),
  };
}

// =============================================================================
// SETUP CANDIDATE OUTPUT
// =============================================================================

export interface SetupCandidate {
  // Identity
  setupId: string;            // SHA-256 hash
  symbol: string;
  setupType: SetupType;
  direction: "LONG" | "SHORT";
  timestamp: number;
  
  // Entry
  entry: {
    type: "LIMIT" | "STOP" | "MARKET";
    price: number;
    ttlSeconds: number;
    slippageToleranceBps: number;
  };
  
  // Stop
  stop: {
    type: "STRUCTURAL" | "ATR_BASED" | "LIQUIDITY_VOID";
    price: number;
    reasoning: string;
  };
  
  // Targets
  targets: {
    primary: { price: number; reasoning: string };
    secondary?: { price: number; reasoning: string };
  };
  
  // Risk/Reward
  riskReward: {
    ratio: number;
    riskBps: number;
    rewardBps: number;
  };
  
  // Scoring
  score: SetupScore;
  
  // Gating
  gateResult: {
    status: "GO" | "REVIEW" | "HOLD" | "BLOCKED";
    whyNotTrade: string[];
  };
  
  // Execution realism
  execution: {
    expectedSlippageBps: number;
    liquidityScore: number;     // 0-1
    dataStatus: "OK" | "DEGRADED" | "STALE";
  };
  
  // Invalidation
  invalidation: {
    priceLevel?: number;
    timeExpiry: number;
    conditions: string[];
  };
  
  // Evidence chain for audit
  evidence: Array<{
    type: string;
    description: string;
    value: number;
    timestamp: number;
  }>;
}

/**
 * Generate deterministic setup ID
 */
export function generateSetupId(
  symbol: string,
  setupType: SetupType,
  direction: "LONG" | "SHORT",
  entryPrice: number,
  timestamp: number
): string {
  const input = `${symbol}:${setupType}:${direction}:${entryPrice}:${timestamp}`;
  // Simple hash for client-side (use crypto.createHash on server)
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `setup_${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

// =============================================================================
// TTL AND INVALIDATION RULES BY SETUP TYPE
// =============================================================================

export interface InvalidationRules {
  ttlSeconds: number;
  priceInvalidation: string;
  cvdInvalidation: string;
  timeInvalidation: string;
}

export const INVALIDATION_RULES: Record<SetupType, InvalidationRules> = {
  BREAKOUT: {
    ttlSeconds: 180,  // 3 minutes
    priceInvalidation: "Price returns below breakout level",
    cvdInvalidation: "CVD diverges against breakout direction",
    timeInvalidation: "No fill within TTL",
  },
  PULLBACK: {
    ttlSeconds: 900,  // 15 minutes
    priceInvalidation: "Price breaks swing low/high against trend",
    cvdInvalidation: "CVD fails to resume trend direction",
    timeInvalidation: "Pullback exceeds 50% retracement",
  },
  SWEEP: {
    ttlSeconds: 300,  // 5 minutes
    priceInvalidation: "Price fails to reverse within 5 bars",
    cvdInvalidation: "CVD flip does not occur",
    timeInvalidation: "No reversal confirmation within TTL",
  },
  FUNDING_FADE: {
    ttlSeconds: 28800,  // 8 hours (funding period)
    priceInvalidation: "Price moves 2 ATR against position",
    cvdInvalidation: "N/A for funding fade",
    timeInvalidation: "Funding rate normalizes before entry",
  },
};

/**
 * Get minimum R:R by setup type
 */
export function getMinRiskReward(setupType: SetupType): number {
  const minRR: Record<SetupType, number> = {
    BREAKOUT: 1.2,
    PULLBACK: 1.5,
    SWEEP: 1.8,
    FUNDING_FADE: 2.0,
  };
  return minRR[setupType];
}
