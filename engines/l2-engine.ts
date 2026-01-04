/**
 * L2 Engine - Level 2 Order Book Analysis
 * 
 * Implements:
 * - Imbalance calculation per BPS range
 * - Void detection with rolling baseline
 * - Microprice and divergence
 * - Liquidity stress assessment
 */

import {
  type DataQuality,
  type DataStatus,
  type L2AnalysisOutput,
  type VoidLevel,
  computeDataStatus,
  computeImbalance,
  computeMicroprice,
  detectVoids,
  STALENESS_THRESHOLDS,
} from "@/lib/trading/setup/contracts";

// =============================================================================
// L2 ENGINE STATE
// =============================================================================

interface L2EngineState {
  // Rolling statistics for void detection
  rollingLiquidityP10: Map<string, number>;  // symbol -> p10
  rollingLiquidityHistory: Map<string, number[]>;  // symbol -> last N notionals
  
  // Last analysis cache
  lastAnalysis: Map<string, L2AnalysisOutput>;
}

const state: L2EngineState = {
  rollingLiquidityP10: new Map(),
  rollingLiquidityHistory: new Map(),
  lastAnalysis: new Map(),
};

const ROLLING_WINDOW_SIZE = 100;  // Number of samples for rolling stats

// =============================================================================
// ROLLING STATISTICS
// =============================================================================

function updateRollingLiquidity(symbol: string, notionals: number[]): void {
  const history = state.rollingLiquidityHistory.get(symbol) || [];
  
  // Add new samples
  for (const n of notionals) {
    history.push(n);
  }
  
  // Trim to window size
  while (history.length > ROLLING_WINDOW_SIZE) {
    history.shift();
  }
  
  state.rollingLiquidityHistory.set(symbol, history);
  
  // Calculate p10
  if (history.length >= 10) {
    const sorted = [...history].sort((a, b) => a - b);
    const p10Index = Math.floor(sorted.length * 0.1);
    state.rollingLiquidityP10.set(symbol, sorted[p10Index]);
  }
}

function getRollingP10(symbol: string): number {
  return state.rollingLiquidityP10.get(symbol) || 0;
}

// =============================================================================
// MAIN ANALYSIS FUNCTION
// =============================================================================

export interface L2EngineInput {
  symbol: string;
  bids: Array<{ price: number; qty: number }>;
  asks: Array<{ price: number; qty: number }>;
  tickSize: number;
  asOfMs: number;
}

export function analyzeL2(input: L2EngineInput): L2AnalysisOutput {
  const now = Date.now();
  const stalenessMs = now - input.asOfMs;
  const status = computeDataStatus(stalenessMs, STALENESS_THRESHOLDS.L2_DEPTH);
  
  const quality: DataQuality = {
    status,
    asOfMs: input.asOfMs,
    stalenessMs,
    source: "ws",
  };
  
  // Early return if data is missing
  if (input.bids.length === 0 || input.asks.length === 0) {
    return createEmptyOutput(quality);
  }
  
  // Calculate mid price
  const bestBid = input.bids[0];
  const bestAsk = input.asks[0];
  const midPrice = (bestBid.price + bestAsk.price) / 2;
  
  // Calculate imbalances at different BPS ranges
  const imbalance5bps = computeImbalance(input.bids, input.asks, midPrice, 5);
  const imbalance10bps = computeImbalance(input.bids, input.asks, midPrice, 10);
  const imbalance20bps = computeImbalance(input.bids, input.asks, midPrice, 20);
  
  // Update rolling liquidity stats
  const allNotionals = [
    ...input.bids.map(b => b.price * b.qty),
    ...input.asks.map(a => a.price * a.qty),
  ];
  updateRollingLiquidity(input.symbol, allNotionals);
  
  // Detect voids
  const rollingP10 = getRollingP10(input.symbol);
  const allLevels = [
    ...input.bids.map(b => ({ ...b, side: "BID" as const })),
    ...input.asks.map(a => ({ ...a, side: "ASK" as const })),
  ];
  const voidLevels = detectVoids(allLevels, rollingP10, midPrice, 50);
  
  // Calculate void score (0-1)
  const voidScore = calculateVoidScore(voidLevels);
  
  // Calculate microprice
  const microprice = computeMicroprice(bestBid, bestAsk);
  const micropriceDiv = (microprice - midPrice) / input.tickSize;
  
  // Assess liquidity stress
  const liquidityStress = assessLiquidityStress(
    imbalance5bps,
    imbalance10bps,
    voidScore,
    input.bids.length,
    input.asks.length
  );
  
  const output: L2AnalysisOutput = {
    quality,
    imbalance5bps,
    imbalance10bps,
    imbalance20bps,
    voidLevels,
    voidScore,
    microprice,
    micropriceDiv,
    liquidityStress,
  };
  
  // Cache result
  state.lastAnalysis.set(input.symbol, output);
  
  return output;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createEmptyOutput(quality: DataQuality): L2AnalysisOutput {
  return {
    quality: { ...quality, status: "MISSING" as DataStatus },
    imbalance5bps: 0,
    imbalance10bps: 0,
    imbalance20bps: 0,
    voidLevels: [],
    voidScore: 0,
    microprice: 0,
    micropriceDiv: 0,
    liquidityStress: "HIGH",
  };
}

function calculateVoidScore(voids: VoidLevel[]): number {
  if (voids.length === 0) return 0;
  
  // Score based on number and severity of voids
  let score = 0;
  for (const v of voids) {
    // Closer voids are more significant
    const distanceFactor = Math.max(0, 1 - v.distanceFromMidBps / 50);
    // Larger deficit is more significant
    const deficitFactor = 1 - v.liqDeficitRatio;
    score += distanceFactor * deficitFactor;
  }
  
  // Normalize to 0-1
  return Math.min(1, score / 5);  // 5 significant voids = max score
}

function assessLiquidityStress(
  imbalance5: number,
  imbalance10: number,
  voidScore: number,
  bidLevels: number,
  askLevels: number
): "LOW" | "MEDIUM" | "HIGH" {
  // Factors that increase stress:
  // 1. High imbalance (one-sided book)
  // 2. High void score (thin liquidity)
  // 3. Few levels (shallow book)
  
  const imbalanceStress = Math.max(Math.abs(imbalance5), Math.abs(imbalance10));
  const depthStress = Math.min(bidLevels, askLevels) < 10 ? 0.3 : 0;
  
  const totalStress = imbalanceStress * 0.4 + voidScore * 0.4 + depthStress * 0.2;
  
  if (totalStress > 0.6) return "HIGH";
  if (totalStress > 0.3) return "MEDIUM";
  return "LOW";
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export function getLastL2Analysis(symbol: string): L2AnalysisOutput | null {
  return state.lastAnalysis.get(symbol) || null;
}

export function clearL2State(symbol?: string): void {
  if (symbol) {
    state.rollingLiquidityP10.delete(symbol);
    state.rollingLiquidityHistory.delete(symbol);
    state.lastAnalysis.delete(symbol);
  } else {
    state.rollingLiquidityP10.clear();
    state.rollingLiquidityHistory.clear();
    state.lastAnalysis.clear();
  }
}
