/**
 * Setup Engine - Main Orchestrator
 * 
 * Combines:
 * - L2 Engine (order book analysis)
 * - Tape Engine (order flow analysis)
 * - Structure analysis (from regime)
 * - Gating rules
 * - Scoring system
 * 
 * Outputs: SetupCandidate with full audit trail
 */

import { analyzeL2 } from "./l2-engine";
import { analyzeTape, ingestTrades } from "./tape-engine";
import {
  type DataStatus,
  type GateResult,
  type L2AnalysisOutput,
  type TapeAnalysisOutput,
  runGates,
  DEFAULT_GATE_CONFIG,
} from "@/lib/trading/setup/contracts";
import {
  type SetupCandidate,
  type SetupType,
  type ScoringInput,
  calculateSetupScore,
  generateSetupId,
  getMinRiskReward,
  INVALIDATION_RULES,
} from "@/lib/trading/setup/scoring";

// =============================================================================
// SETUP ENGINE TYPES
// =============================================================================

export interface SetupEngineInput {
  // Symbol info
  symbol: string;
  tickSize: number;
  
  // Current market state
  currentPrice: number;
  spreadBps: number;
  
  // Regime context (from BRICK 1)
  regime: {
    type: "TREND" | "RANGE" | "TRANSITION";
    strength: number;
    direction: "UP" | "DOWN" | "NEUTRAL";
    stress: boolean;
  };
  
  // Structure levels (from BRICK 1)
  structure: {
    swingHigh: number;
    swingLow: number;
    nearestResistance: number;
    nearestSupport: number;
    levelStrength: number;  // 0-1
  };
  
  // ATR for stop calculation
  atr: {
    current: number;
    previous: number;
  };
  
  // L2 data
  l2: {
    bids: Array<{ price: number; qty: number }>;
    asks: Array<{ price: number; qty: number }>;
    asOfMs: number;
  };
  
  // Tape data (recent trades)
  tape: {
    trades: Array<{ price: number; qty: number; ts: number; isBuyerMaker: boolean }>;
    asOfMs: number;
  };
  
  // Optional: Derivatives data
  derivatives?: {
    fundingRate?: number;
    fundingZScore?: number;
    oiDeltaPct?: number;
    priceDeltaPct?: number;
  };
}

export interface SetupEngineOutput {
  // Status
  status: "SETUP_FOUND" | "NO_SETUP" | "BLOCKED" | "REVIEW";
  
  // Setup candidate (if found)
  setup: SetupCandidate | null;
  
  // Analysis results (for debugging/audit)
  analysis: {
    l2: L2AnalysisOutput;
    tape: TapeAnalysisOutput;
    gate: GateResult;
  };
  
  // Reasons
  reasons: string[];
  
  // Timestamp
  timestamp: number;
}

// =============================================================================
// SETUP TYPE DETECTION
// =============================================================================

interface SetupTypeResult {
  type: SetupType | null;
  direction: "LONG" | "SHORT" | null;
  confidence: number;
  reasons: string[];
}

function detectSetupType(
  regime: SetupEngineInput["regime"],
  structure: SetupEngineInput["structure"],
  l2: L2AnalysisOutput,
  tape: TapeAnalysisOutput,
  currentPrice: number
): SetupTypeResult {
  const reasons: string[] = [];
  
  // Check regime compatibility
  if (regime.type === "TRANSITION") {
    reasons.push("Regime TRANSITION - no setups allowed");
    return { type: null, direction: null, confidence: 0, reasons };
  }
  
  // BREAKOUT detection
  if (regime.type === "TREND" && regime.strength > 0.6) {
    // Check for structural break
    const breakingResistance = currentPrice > structure.nearestResistance;
    const breakingSupport = currentPrice < structure.nearestSupport;
    
    if (breakingResistance && regime.direction === "UP") {
      // Check L2 imbalance favors breakout
      if (l2.imbalance10bps > 0.3) {
        // Check CVD aligned
        if (tape.slope5m > 0) {
          reasons.push("Breakout UP: price > resistance, L2 bid-heavy, CVD positive");
          return { type: "BREAKOUT", direction: "LONG", confidence: 0.7, reasons };
        }
      }
    }
    
    if (breakingSupport && regime.direction === "DOWN") {
      if (l2.imbalance10bps < -0.3) {
        if (tape.slope5m < 0) {
          reasons.push("Breakout DOWN: price < support, L2 ask-heavy, CVD negative");
          return { type: "BREAKOUT", direction: "SHORT", confidence: 0.7, reasons };
        }
      }
    }
  }
  
  // PULLBACK detection
  if (regime.type === "TREND" && regime.strength > 0.5) {
    const pullbackToSupport = currentPrice <= structure.nearestSupport * 1.005;
    const pullbackToResistance = currentPrice >= structure.nearestResistance * 0.995;
    
    if (pullbackToSupport && regime.direction === "UP") {
      // Check for trend resumption signals
      if (tape.aggressionRatio > 0.2 && tape.slope5m > 0) {
        reasons.push("Pullback LONG: price at support in uptrend, buying resuming");
        return { type: "PULLBACK", direction: "LONG", confidence: 0.65, reasons };
      }
    }
    
    if (pullbackToResistance && regime.direction === "DOWN") {
      if (tape.aggressionRatio < -0.2 && tape.slope5m < 0) {
        reasons.push("Pullback SHORT: price at resistance in downtrend, selling resuming");
        return { type: "PULLBACK", direction: "SHORT", confidence: 0.65, reasons };
      }
    }
  }
  
  // SWEEP detection
  if (regime.type === "RANGE" || (regime.type === "TREND" && regime.strength < 0.4)) {
    const sweptHigh = currentPrice > structure.swingHigh;
    const sweptLow = currentPrice < structure.swingLow;
    
    if (sweptHigh && tape.absorptionZones.some(z => z.direction === "ASK" && z.strength > 500)) {
      // Check for CVD flip
      if (tape.slope1m < 0 && tape.slope5m > 0) {
        reasons.push("Sweep reversal SHORT: swept high, absorption detected, CVD flipping");
        return { type: "SWEEP", direction: "SHORT", confidence: 0.55, reasons };
      }
    }
    
    if (sweptLow && tape.absorptionZones.some(z => z.direction === "BID" && z.strength > 500)) {
      if (tape.slope1m > 0 && tape.slope5m < 0) {
        reasons.push("Sweep reversal LONG: swept low, absorption detected, CVD flipping");
        return { type: "SWEEP", direction: "LONG", confidence: 0.55, reasons };
      }
    }
  }
  
  reasons.push("No valid setup pattern detected");
  return { type: null, direction: null, confidence: 0, reasons };
}

// =============================================================================
// ENTRY/STOP/TARGET CALCULATION
// =============================================================================

function calculateEntry(
  setupType: SetupType,
  direction: "LONG" | "SHORT",
  currentPrice: number,
  structure: SetupEngineInput["structure"],
  tickSize: number
): { price: number; type: "LIMIT" | "STOP" | "MARKET"; ttlSeconds: number } {
  const rules = INVALIDATION_RULES[setupType];
  
  switch (setupType) {
    case "BREAKOUT":
      // Entry at 50% retracement of breakout candle (approximated)
      const retrace = direction === "LONG"
        ? currentPrice - (currentPrice - structure.nearestResistance) * 0.5
        : currentPrice + (structure.nearestSupport - currentPrice) * 0.5;
      return {
        price: Math.round(retrace / tickSize) * tickSize,
        type: "LIMIT",
        ttlSeconds: rules.ttlSeconds,
      };
    
    case "PULLBACK":
      // Entry at structural level
      const level = direction === "LONG" ? structure.nearestSupport : structure.nearestResistance;
      return {
        price: Math.round(level / tickSize) * tickSize,
        type: "LIMIT",
        ttlSeconds: rules.ttlSeconds,
      };
    
    case "SWEEP":
      // Entry at sweep level (original boundary)
      const sweepLevel = direction === "LONG" ? structure.swingLow : structure.swingHigh;
      return {
        price: Math.round(sweepLevel / tickSize) * tickSize,
        type: "LIMIT",
        ttlSeconds: rules.ttlSeconds,
      };
    
    default:
      return {
        price: currentPrice,
        type: "MARKET",
        ttlSeconds: 60,
      };
  }
}

function calculateStop(
  setupType: SetupType,
  direction: "LONG" | "SHORT",
  entryPrice: number,
  structure: SetupEngineInput["structure"],
  atr: number,
  tickSize: number
): { price: number; type: "STRUCTURAL" | "ATR_BASED"; reasoning: string } {
  const atrBuffer = atr * 0.5;
  
  switch (setupType) {
    case "BREAKOUT":
      // Stop below/above breakout level + buffer
      const breakoutStop = direction === "LONG"
        ? structure.nearestResistance - atrBuffer
        : structure.nearestSupport + atrBuffer;
      return {
        price: Math.round(breakoutStop / tickSize) * tickSize,
        type: "STRUCTURAL",
        reasoning: `Below breakout level (${structure.nearestResistance}) + 0.5 ATR buffer`,
      };
    
    case "PULLBACK":
      // Stop beyond next structural level
      const pullbackStop = direction === "LONG"
        ? structure.swingLow - atrBuffer
        : structure.swingHigh + atrBuffer;
      return {
        price: Math.round(pullbackStop / tickSize) * tickSize,
        type: "STRUCTURAL",
        reasoning: `Beyond swing ${direction === "LONG" ? "low" : "high"} + 0.5 ATR buffer`,
      };
    
    case "SWEEP":
      // ATR-based stop (structural may be unreliable after sweep)
      const sweepStop = direction === "LONG"
        ? entryPrice - atr
        : entryPrice + atr;
      return {
        price: Math.round(sweepStop / tickSize) * tickSize,
        type: "ATR_BASED",
        reasoning: `1 ATR from entry (structural unreliable post-sweep)`,
      };
    
    default:
      return {
        price: direction === "LONG" ? entryPrice - atr : entryPrice + atr,
        type: "ATR_BASED",
        reasoning: "Default 1 ATR stop",
      };
  }
}

function calculateTargets(
  setupType: SetupType,
  direction: "LONG" | "SHORT",
  entryPrice: number,
  stopPrice: number,
  structure: SetupEngineInput["structure"]
): { primary: { price: number; reasoning: string }; secondary?: { price: number; reasoning: string } } {
  const risk = Math.abs(entryPrice - stopPrice);
  const minRR = getMinRiskReward(setupType);
  const minReward = risk * minRR;
  
  // Primary target: next structural level or minimum R:R
  let primaryPrice: number;
  let primaryReasoning: string;
  
  if (direction === "LONG") {
    const structuralTarget = structure.nearestResistance;
    const minTarget = entryPrice + minReward;
    primaryPrice = Math.max(structuralTarget, minTarget);
    primaryReasoning = primaryPrice === structuralTarget
      ? `Nearest resistance at ${structuralTarget}`
      : `Minimum ${minRR}:1 R:R target`;
  } else {
    const structuralTarget = structure.nearestSupport;
    const minTarget = entryPrice - minReward;
    primaryPrice = Math.min(structuralTarget, minTarget);
    primaryReasoning = primaryPrice === structuralTarget
      ? `Nearest support at ${structuralTarget}`
      : `Minimum ${minRR}:1 R:R target`;
  }
  
  // Secondary target: extended (if room)
  const extendedReward = risk * (minRR + 1);
  const secondaryPrice = direction === "LONG"
    ? entryPrice + extendedReward
    : entryPrice - extendedReward;
  
  return {
    primary: { price: primaryPrice, reasoning: primaryReasoning },
    secondary: { price: secondaryPrice, reasoning: `Extended target at ${minRR + 1}:1 R:R` },
  };
}

// =============================================================================
// MAIN ENGINE FUNCTION
// =============================================================================

export function runSetupEngine(input: SetupEngineInput): SetupEngineOutput {
  const timestamp = Date.now();
  const reasons: string[] = [];
  
  // 1. Ingest tape data
  ingestTrades(input.symbol, input.tape.trades);
  
  // 2. Run L2 analysis
  const l2Analysis = analyzeL2({
    symbol: input.symbol,
    bids: input.l2.bids,
    asks: input.l2.asks,
    tickSize: input.tickSize,
    asOfMs: input.l2.asOfMs,
  });
  
  // 3. Run tape analysis
  const tapeAnalysis = analyzeTape({
    symbol: input.symbol,
    microprice: l2Analysis.microprice,
    tickSize: input.tickSize,
    currentPrice: input.currentPrice,
    asOfMs: input.tape.asOfMs,
  });
  
  // 4. Run gates
  const gateResult = runGates({
    spreadBps: input.spreadBps,
    l2Quality: l2Analysis.quality,
    tapeQuality: tapeAnalysis.quality,
    atrCurrent: input.atr.current,
    atrPrevious: input.atr.previous,
    regimeMatch: input.regime.type !== "TRANSITION",
  }, DEFAULT_GATE_CONFIG);
  
  // 5. Check gate status
  if (gateResult.status === "BLOCKED") {
    reasons.push(...gateResult.whyNotTrade);
    return {
      status: "BLOCKED",
      setup: null,
      analysis: { l2: l2Analysis, tape: tapeAnalysis, gate: gateResult },
      reasons,
      timestamp,
    };
  }
  
  // 6. Detect setup type
  const setupTypeResult = detectSetupType(
    input.regime,
    input.structure,
    l2Analysis,
    tapeAnalysis,
    input.currentPrice
  );
  
  reasons.push(...setupTypeResult.reasons);
  
  if (!setupTypeResult.type || !setupTypeResult.direction) {
    return {
      status: gateResult.status === "HOLD" ? "REVIEW" : "NO_SETUP",
      setup: null,
      analysis: { l2: l2Analysis, tape: tapeAnalysis, gate: gateResult },
      reasons,
      timestamp,
    };
  }
  
  // 7. Calculate entry/stop/targets
  const entry = calculateEntry(
    setupTypeResult.type,
    setupTypeResult.direction,
    input.currentPrice,
    input.structure,
    input.tickSize
  );
  
  const stop = calculateStop(
    setupTypeResult.type,
    setupTypeResult.direction,
    entry.price,
    input.structure,
    input.atr.current,
    input.tickSize
  );
  
  const targets = calculateTargets(
    setupTypeResult.type,
    setupTypeResult.direction,
    entry.price,
    stop.price,
    input.structure
  );
  
  // 8. Calculate R:R
  const riskBps = Math.abs(entry.price - stop.price) / entry.price * 10000;
  const rewardBps = Math.abs(targets.primary.price - entry.price) / entry.price * 10000;
  const ratio = rewardBps / riskBps;
  
  // 9. Validate R:R
  const minRR = getMinRiskReward(setupTypeResult.type);
  if (ratio < minRR) {
    reasons.push(`R:R ${ratio.toFixed(2)} below minimum ${minRR} for ${setupTypeResult.type}`);
    return {
      status: "NO_SETUP",
      setup: null,
      analysis: { l2: l2Analysis, tape: tapeAnalysis, gate: gateResult },
      reasons,
      timestamp,
    };
  }
  
  // 10. Calculate score
  const scoringInput: ScoringInput = {
    setupType: setupTypeResult.type,
    direction: setupTypeResult.direction,
    regimeStrength: input.regime.strength,
    structureStrength: input.structure.levelStrength,
    l2Imbalance: l2Analysis.imbalance10bps,
    cvdSlope5m: tapeAnalysis.slope5m,
    absorptionZones: tapeAnalysis.absorptionZones,
    fundingRate: input.derivatives?.fundingRate,
    fundingZScore: input.derivatives?.fundingZScore,
    oiDeltaPct: input.derivatives?.oiDeltaPct,
    priceDeltaPct: input.derivatives?.priceDeltaPct,
    spreadBps: input.spreadBps,
    dataStatuses: [l2Analysis.quality.status, tapeAnalysis.quality.status],
  };
  
  const score = calculateSetupScore(scoringInput);
  
  // 11. Build setup candidate
  const setupId = generateSetupId(
    input.symbol,
    setupTypeResult.type,
    setupTypeResult.direction,
    entry.price,
    timestamp
  );
  
  const setup: SetupCandidate = {
    setupId,
    symbol: input.symbol,
    setupType: setupTypeResult.type,
    direction: setupTypeResult.direction,
    timestamp,
    entry: {
      type: entry.type,
      price: entry.price,
      ttlSeconds: entry.ttlSeconds,
      slippageToleranceBps: 10,
    },
    stop: {
      type: stop.type,
      price: stop.price,
      reasoning: stop.reasoning,
    },
    targets: {
      primary: targets.primary,
      secondary: targets.secondary,
    },
    riskReward: {
      ratio,
      riskBps,
      rewardBps,
    },
    score,
    gateResult: {
      status: gateResult.status,
      whyNotTrade: gateResult.whyNotTrade,
    },
    execution: {
      expectedSlippageBps: input.spreadBps * 0.5 + l2Analysis.micropriceDiv * 0.1,
      liquidityScore: 1 - l2Analysis.voidScore,
      dataStatus: combineDataStatus(l2Analysis.quality.status, tapeAnalysis.quality.status) as "OK" | "DEGRADED" | "STALE",
    },
    invalidation: {
      priceLevel: setupTypeResult.direction === "LONG"
        ? input.structure.swingLow
        : input.structure.swingHigh,
      timeExpiry: timestamp + entry.ttlSeconds * 1000,
      conditions: [
        INVALIDATION_RULES[setupTypeResult.type].priceInvalidation,
        INVALIDATION_RULES[setupTypeResult.type].cvdInvalidation,
      ],
    },
    evidence: [
      { type: "REGIME", description: `${input.regime.type} (${input.regime.strength.toFixed(2)})`, value: input.regime.strength, timestamp },
      { type: "L2", description: `Imbalance10: ${l2Analysis.imbalance10bps.toFixed(3)}`, value: l2Analysis.imbalance10bps, timestamp },
      { type: "TAPE", description: `CVD slope5m: ${tapeAnalysis.slope5m.toFixed(2)}`, value: tapeAnalysis.slope5m, timestamp },
      { type: "STRUCTURE", description: `Level strength: ${input.structure.levelStrength.toFixed(2)}`, value: input.structure.levelStrength, timestamp },
    ],
  };
  
  reasons.push(`Setup found: ${setupTypeResult.type} ${setupTypeResult.direction} with score ${score.total}`);
  
  return {
    status: gateResult.status === "HOLD" ? "REVIEW" : "SETUP_FOUND",
    setup,
    analysis: { l2: l2Analysis, tape: tapeAnalysis, gate: gateResult },
    reasons,
    timestamp,
  };
}

// =============================================================================
// HELPERS
// =============================================================================

function combineDataStatus(s1: DataStatus, s2: DataStatus): DataStatus {
  const rank = { OK: 3, DEGRADED: 2, STALE: 1, MISSING: 0 };
  const minRank = Math.min(rank[s1], rank[s2]);
  const statusByRank: Record<number, DataStatus> = { 3: "OK", 2: "DEGRADED", 1: "STALE", 0: "MISSING" };
  return statusByRank[minRank];
}
