/**
 * BRICK 3: Setup Engine - Desk-Grade Contracts
 * 
 * Definizioni operative per:
 * 1. DataStatus + staleness per ogni feed
 * 2. Formule deterministiche (imbalance, void, absorption, tradeSign)
 * 3. Gating rules (HOLD/REVIEW + whyNotTrade)
 * 4. Scoring con cap/clamp + contrib[] auditabile
 */

// =============================================================================
// 1. DATA STATUS & FRESHNESS CONTRACTS
// =============================================================================

export type DataStatus = "OK" | "DEGRADED" | "STALE" | "MISSING";

export interface DataQuality {
  status: DataStatus;
  asOfMs: number;           // Timestamp del dato
  stalenessMs: number;      // now() - asOfMs
  source: string;           // "ws" | "rest" | "cache"
}

/** Soglie di staleness per tipo di dato (ms) */
export const STALENESS_THRESHOLDS = {
  L1_PRICE: { OK: 1000, DEGRADED: 5000, STALE: 15000 },
  L2_DEPTH: { OK: 2000, DEGRADED: 10000, STALE: 30000 },
  TAPE: { OK: 2000, DEGRADED: 10000, STALE: 30000 },
  FUNDING: { OK: 60000, DEGRADED: 300000, STALE: 900000 },  // 1m/5m/15m
  OI: { OK: 60000, DEGRADED: 300000, STALE: 900000 },
  LS_RATIO: { OK: 60000, DEGRADED: 300000, STALE: 900000 },
} as const;

/** Calcola DataStatus da staleness */
export function computeDataStatus(
  stalenessMs: number,
  thresholds: { OK: number; DEGRADED: number; STALE: number }
): DataStatus {
  if (stalenessMs <= thresholds.OK) return "OK";
  if (stalenessMs <= thresholds.DEGRADED) return "DEGRADED";
  if (stalenessMs <= thresholds.STALE) return "STALE";
  return "MISSING";
}

// =============================================================================
// 2. L2 ANALYSIS CONTRACTS (Imbalance, Voids, Absorption)
// =============================================================================

export interface L2AnalysisInput {
  bids: Array<{ price: number; qty: number }>;  // Sorted desc by price
  asks: Array<{ price: number; qty: number }>;  // Sorted asc by price
  midPrice: number;
  tickSize: number;
  asOfMs: number;
}

export interface L2AnalysisOutput {
  quality: DataQuality;
  
  // Imbalance per fascia BPS dal mid (NON per livelli)
  imbalance5bps: number;    // -1 to +1
  imbalance10bps: number;
  imbalance20bps: number;
  
  // Voids
  voidLevels: VoidLevel[];
  voidScore: number;        // 0-1 aggregato
  
  // Microprice
  microprice: number;
  micropriceDiv: number;    // Divergenza dal mid in ticks
  
  // Liquidity stress
  liquidityStress: "LOW" | "MEDIUM" | "HIGH";
}

export interface VoidLevel {
  price: number;
  side: "BID" | "ASK";
  distanceFromMidBps: number;
  liqDeficitRatio: number;  // actual / expected
}

/**
 * Calcola imbalance per fascia BPS
 * Formula: (BidNotional - AskNotional) / (BidNotional + AskNotional + eps)
 * 
 * @param bids - Bid levels sorted desc
 * @param asks - Ask levels sorted asc
 * @param midPrice - Mid price
 * @param bpsRange - Range in basis points from mid
 */
export function computeImbalance(
  bids: Array<{ price: number; qty: number }>,
  asks: Array<{ price: number; qty: number }>,
  midPrice: number,
  bpsRange: number
): number {
  const EPS = 1e-10;
  const rangePrice = midPrice * (bpsRange / 10000);
  
  // Bid notional within range
  let bidNotional = 0;
  for (const { price, qty } of bids) {
    if (midPrice - price <= rangePrice) {
      bidNotional += price * qty;
    }
  }
  
  // Ask notional within range
  let askNotional = 0;
  for (const { price, qty } of asks) {
    if (price - midPrice <= rangePrice) {
      askNotional += price * qty;
    }
  }
  
  const total = bidNotional + askNotional + EPS;
  return (bidNotional - askNotional) / total;
}

/**
 * Detect void levels
 * Void = liquidity at level < p10 of rolling distribution
 * 
 * @param levels - Order book levels
 * @param rollingP10 - 10th percentile of rolling liquidity
 * @param midPrice - Mid price
 * @param maxDistanceBps - Max distance from mid to consider
 */
export function detectVoids(
  levels: Array<{ price: number; qty: number; side: "BID" | "ASK" }>,
  rollingP10: number,
  midPrice: number,
  maxDistanceBps: number = 50
): VoidLevel[] {
  const voids: VoidLevel[] = [];
  const maxDistance = midPrice * (maxDistanceBps / 10000);
  
  for (const { price, qty, side } of levels) {
    const distance = Math.abs(price - midPrice);
    if (distance > maxDistance) continue;
    
    const notional = price * qty;
    if (notional < rollingP10 && rollingP10 > 0) {
      voids.push({
        price,
        side,
        distanceFromMidBps: (distance / midPrice) * 10000,
        liqDeficitRatio: notional / rollingP10,
      });
    }
  }
  
  return voids;
}

/**
 * Compute microprice
 * Formula: (bidPrice * askQty + askPrice * bidQty) / (bidQty + askQty)
 */
export function computeMicroprice(
  bestBid: { price: number; qty: number },
  bestAsk: { price: number; qty: number }
): number {
  const totalQty = bestBid.qty + bestAsk.qty;
  if (totalQty === 0) return (bestBid.price + bestAsk.price) / 2;
  return (bestBid.price * bestAsk.qty + bestAsk.price * bestBid.qty) / totalQty;
}

// =============================================================================
// 3. TAPE/CVD ANALYSIS CONTRACTS
// =============================================================================

export interface TapeAnalysisInput {
  trades: Array<{
    price: number;
    qty: number;
    ts: number;
    isBuyerMaker: boolean;  // Binance: true = seller aggressor
  }>;
  microprice: number;
  asOfMs: number;
}

export interface TapeAnalysisOutput {
  quality: DataQuality;
  
  // CVD per window
  cvd1m: number;
  cvd5m: number;
  cvd15m: number;
  
  // CVD slope (momentum)
  slope1m: number;
  slope5m: number;
  
  // Aggression ratio
  aggressionRatio: number;  // -1 (sell) to +1 (buy)
  
  // Divergence
  priceCvdDivergence: boolean;
  divergenceType: "BULLISH" | "BEARISH" | "NONE";
  
  // Absorption
  absorptionZones: AbsorptionZone[];
  
  // Exhaustion
  exhaustionFlag: boolean;
  exhaustionScore: number;  // 0-1
}

export interface AbsorptionZone {
  price: number;
  volume: number;
  priceMovement: number;    // Ticks moved despite volume
  strength: number;         // volume / max(|Δprice|, eps)
  direction: "BID" | "ASK";
}

/**
 * Classify trade direction (deterministic)
 * 
 * Rule: 
 * - If isBuyerMaker = true → seller aggressor → SELL
 * - If isBuyerMaker = false → buyer aggressor → BUY
 * 
 * Binance aggTrade already provides this via isBuyerMaker
 */
export function classifyTradeSign(isBuyerMaker: boolean): 1 | -1 {
  // isBuyerMaker = true means the maker was a buyer, so the taker (aggressor) was a seller
  return isBuyerMaker ? -1 : 1;
}

/**
 * Compute CVD for a window
 */
export function computeCVD(
  trades: Array<{ qty: number; isBuyerMaker: boolean }>,
): number {
  let cvd = 0;
  for (const trade of trades) {
    const sign = classifyTradeSign(trade.isBuyerMaker);
    cvd += sign * trade.qty;
  }
  return cvd;
}

/**
 * Detect absorption
 * Formula: absorption_strength = volume / max(|Δprice|, eps)
 * 
 * @param trades - Trades in window
 * @param tickSize - Minimum price increment
 * @param windowMs - Window size in ms
 * @param strengthThreshold - Minimum strength to flag (default: 500)
 */
export function detectAbsorption(
  trades: Array<{ price: number; qty: number; ts: number; isBuyerMaker: boolean }>,
  tickSize: number,
  windowMs: number,
  strengthThreshold: number = 500
): AbsorptionZone[] {
  if (trades.length < 2) return [];
  
  const EPS = tickSize;
  const zones: AbsorptionZone[] = [];
  
  // Group trades by price level (rounded to tick)
  const byPrice = new Map<number, { volume: number; buys: number; sells: number }>();
  
  for (const trade of trades) {
    const roundedPrice = Math.round(trade.price / tickSize) * tickSize;
    const existing = byPrice.get(roundedPrice) || { volume: 0, buys: 0, sells: 0 };
    existing.volume += trade.qty;
    if (classifyTradeSign(trade.isBuyerMaker) > 0) {
      existing.buys += trade.qty;
    } else {
      existing.sells += trade.qty;
    }
    byPrice.set(roundedPrice, existing);
  }
  
  // Find price range
  const prices = Array.from(byPrice.keys()).sort((a, b) => a - b);
  if (prices.length < 2) return [];
  
  const priceRange = prices[prices.length - 1] - prices[0];
  const priceMovementTicks = priceRange / tickSize;
  
  // Check each level for absorption
  for (const [price, data] of byPrice) {
    const strength = data.volume / Math.max(priceMovementTicks, EPS);
    
    if (strength >= strengthThreshold) {
      zones.push({
        price,
        volume: data.volume,
        priceMovement: priceMovementTicks,
        strength,
        direction: data.buys > data.sells ? "BID" : "ASK",
      });
    }
  }
  
  return zones;
}

/**
 * Detect exhaustion
 * High volume with minimal price movement
 */
export function detectExhaustion(
  trades: Array<{ price: number; qty: number }>,
  tickSize: number,
  volumeThreshold: number,  // Rolling percentile
): { flag: boolean; score: number } {
  if (trades.length < 2) return { flag: false, score: 0 };
  
  const totalVolume = trades.reduce((sum, t) => sum + t.qty, 0);
  const prices = trades.map(t => t.price);
  const priceRange = Math.max(...prices) - Math.min(...prices);
  const priceMovementTicks = priceRange / tickSize;
  
  // Exhaustion = high volume, low movement
  const volumeRatio = totalVolume / volumeThreshold;
  const movementPenalty = Math.max(0, 1 - priceMovementTicks / 10);
  
  const score = Math.min(1, volumeRatio * movementPenalty);
  const flag = score > 0.7 && priceMovementTicks < 5;
  
  return { flag, score };
}

// =============================================================================
// 4. DERIVATIVES DATA CONTRACTS (Funding, OI, L/S)
// =============================================================================

export interface FundingAnalysis {
  quality: DataQuality;
  currentRate: number;        // -0.01 to +0.1 typical
  predictedRate?: number;     // Optional, may not be available
  isEstimate: boolean;        // True if predictedRate is derived
  rateZScore: number;         // vs 30-day mean
  extremeFlag: boolean;       // |rate| > 0.05%
  signal: "LONG_BIAS" | "SHORT_BIAS" | "NEUTRAL";
}

export interface OIAnalysis {
  quality: DataQuality;
  current: number;
  delta1h: number;
  delta4h: number;
  delta1hPct: number;
  delta4hPct: number;
  priceOIDivergence: boolean;
  signal: "ACCUMULATION" | "DISTRIBUTION" | "NEUTRAL";
}

export interface LSRatioAnalysis {
  quality: DataQuality;
  topTraderRatio: number;
  globalRatio: number;
  extremeLong: boolean;       // ratio > 2.0
  extremeShort: boolean;      // ratio < 0.5
  signal: "CONTRARIAN_SHORT" | "CONTRARIAN_LONG" | "NEUTRAL";
}

// =============================================================================
// 5. GATING RULES (Kill Switches)
// =============================================================================

export type GateStatus = "GO" | "REVIEW" | "HOLD" | "BLOCKED";

export interface GateResult {
  status: GateStatus;
  whyNotTrade: string[];
  passedGates: string[];
  failedGates: string[];
}

export interface GateConfig {
  maxSpreadBps: number;           // e.g., 15
  maxL2Staleness: number;         // ms
  maxTapeStaleness: number;       // ms
  minL2Status: DataStatus;        // "OK" or "DEGRADED"
  minTapeStatus: DataStatus;
  maxAtrJumpPct: number;          // e.g., 50% jump = volatility spike
  fundingExtremeThreshold: number; // e.g., 0.0005 (0.05%)
  requireOIConfirmation: boolean;
}

export const DEFAULT_GATE_CONFIG: GateConfig = {
  maxSpreadBps: 15,
  maxL2Staleness: 30000,
  maxTapeStaleness: 30000,
  minL2Status: "DEGRADED",
  minTapeStatus: "DEGRADED",
  maxAtrJumpPct: 50,
  fundingExtremeThreshold: 0.0005,
  requireOIConfirmation: true,
};

/**
 * Run all gates and return aggregated result
 */
export function runGates(
  input: {
    spreadBps: number;
    l2Quality: DataQuality;
    tapeQuality: DataQuality;
    atrCurrent: number;
    atrPrevious: number;
    funding?: FundingAnalysis;
    oi?: OIAnalysis;
    regimeMatch: boolean;
  },
  config: GateConfig = DEFAULT_GATE_CONFIG
): GateResult {
  const whyNotTrade: string[] = [];
  const passedGates: string[] = [];
  const failedGates: string[] = [];
  
  // Gate 1: Spread
  if (input.spreadBps > config.maxSpreadBps) {
    failedGates.push("SPREAD_TOO_WIDE");
    whyNotTrade.push(`Spread ${input.spreadBps.toFixed(1)}bps > max ${config.maxSpreadBps}bps`);
  } else {
    passedGates.push("SPREAD_OK");
  }
  
  // Gate 2: L2 Quality
  const l2StatusRank = { OK: 3, DEGRADED: 2, STALE: 1, MISSING: 0 };
  const minL2Rank = l2StatusRank[config.minL2Status];
  if (l2StatusRank[input.l2Quality.status] < minL2Rank) {
    failedGates.push("L2_QUALITY_LOW");
    whyNotTrade.push(`L2 status ${input.l2Quality.status}, need ${config.minL2Status}+`);
  } else {
    passedGates.push("L2_QUALITY_OK");
  }
  
  // Gate 3: Tape Quality
  const minTapeRank = l2StatusRank[config.minTapeStatus];
  if (l2StatusRank[input.tapeQuality.status] < minTapeRank) {
    failedGates.push("TAPE_QUALITY_LOW");
    whyNotTrade.push(`Tape status ${input.tapeQuality.status}, need ${config.minTapeStatus}+`);
  } else {
    passedGates.push("TAPE_QUALITY_OK");
  }
  
  // Gate 4: Volatility Spike
  if (input.atrPrevious > 0) {
    const atrJumpPct = ((input.atrCurrent - input.atrPrevious) / input.atrPrevious) * 100;
    if (atrJumpPct > config.maxAtrJumpPct) {
      failedGates.push("VOLATILITY_SPIKE");
      whyNotTrade.push(`ATR jumped ${atrJumpPct.toFixed(1)}% > max ${config.maxAtrJumpPct}%`);
    } else {
      passedGates.push("VOLATILITY_OK");
    }
  }
  
  // Gate 5: Regime Match
  if (!input.regimeMatch) {
    failedGates.push("REGIME_MISMATCH");
    whyNotTrade.push("Setup type incompatible with current regime");
  } else {
    passedGates.push("REGIME_MATCH");
  }
  
  // Gate 6: Funding Extreme without OI confirmation
  if (input.funding?.extremeFlag && config.requireOIConfirmation) {
    if (!input.oi || input.oi.signal === "NEUTRAL") {
      failedGates.push("FUNDING_EXTREME_NO_OI");
      whyNotTrade.push("Extreme funding without OI confirmation → HOLD");
    } else {
      passedGates.push("FUNDING_OI_CONFIRMED");
    }
  }
  
  // Determine overall status
  let status: GateStatus;
  if (failedGates.length === 0) {
    status = "GO";
  } else if (failedGates.some(g => ["SPREAD_TOO_WIDE", "L2_QUALITY_LOW", "REGIME_MISMATCH"].includes(g))) {
    status = "BLOCKED";
  } else if (failedGates.some(g => ["TAPE_QUALITY_LOW", "VOLATILITY_SPIKE"].includes(g))) {
    status = "HOLD";
  } else {
    status = "REVIEW";
  }
  
  return { status, whyNotTrade, passedGates, failedGates };
}
