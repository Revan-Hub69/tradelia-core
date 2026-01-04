/**
 * Tape Engine - Trade Tape / Order Flow Analysis
 * 
 * Implements:
 * - CVD (Cumulative Volume Delta) calculation
 * - Aggression ratio
 * - Absorption detection
 * - Exhaustion detection
 * - Price-CVD divergence
 */

import {
  type DataQuality,
  type DataStatus,
  type TapeAnalysisOutput,
  computeDataStatus,
  classifyTradeSign,
  computeCVD,
  detectAbsorption,
  detectExhaustion,
  STALENESS_THRESHOLDS,
} from "@/lib/trading/setup/contracts";

// =============================================================================
// TAPE ENGINE STATE
// =============================================================================

interface TapeEngineState {
  // Trade history per symbol (rolling windows)
  tradeHistory: Map<string, TradeRecord[]>;
  
  // CVD history for slope calculation
  cvdHistory: Map<string, Array<{ ts: number; cvd: number }>>;
  
  // Rolling volume stats for exhaustion detection
  rollingVolumeP90: Map<string, number>;
  
  // Last analysis cache
  lastAnalysis: Map<string, TapeAnalysisOutput>;
}

interface TradeRecord {
  price: number;
  qty: number;
  ts: number;
  isBuyerMaker: boolean;
}

const state: TapeEngineState = {
  tradeHistory: new Map(),
  cvdHistory: new Map(),
  rollingVolumeP90: new Map(),
  lastAnalysis: new Map(),
};

const MAX_TRADE_HISTORY = 5000;  // ~15 minutes of active trading
const CVD_HISTORY_SIZE = 100;

// =============================================================================
// TRADE INGESTION
// =============================================================================

export function ingestTrades(
  symbol: string,
  trades: Array<{ price: number; qty: number; ts: number; isBuyerMaker: boolean }>
): void {
  const history = state.tradeHistory.get(symbol) || [];
  
  for (const trade of trades) {
    history.push(trade);
  }
  
  // Trim to max size
  while (history.length > MAX_TRADE_HISTORY) {
    history.shift();
  }
  
  state.tradeHistory.set(symbol, history);
  
  // Update rolling volume stats
  updateRollingVolume(symbol, history);
}

function updateRollingVolume(symbol: string, trades: TradeRecord[]): void {
  if (trades.length < 100) return;
  
  // Calculate volume per minute for last 15 minutes
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const recentTrades = trades.filter(t => now - t.ts < windowMs);
  
  if (recentTrades.length < 50) return;
  
  // Group by minute
  const volumePerMinute: number[] = [];
  const minuteMs = 60 * 1000;
  
  for (let i = 0; i < 15; i++) {
    const start = now - (i + 1) * minuteMs;
    const end = now - i * minuteMs;
    const vol = recentTrades
      .filter(t => t.ts >= start && t.ts < end)
      .reduce((sum, t) => sum + t.qty, 0);
    volumePerMinute.push(vol);
  }
  
  // Calculate p90
  const sorted = [...volumePerMinute].sort((a, b) => a - b);
  const p90Index = Math.floor(sorted.length * 0.9);
  state.rollingVolumeP90.set(symbol, sorted[p90Index]);
}

// =============================================================================
// MAIN ANALYSIS FUNCTION
// =============================================================================

export interface TapeEngineInput {
  symbol: string;
  microprice: number;
  tickSize: number;
  currentPrice: number;
  asOfMs: number;
}

export function analyzeTape(input: TapeEngineInput): TapeAnalysisOutput {
  const now = Date.now();
  const stalenessMs = now - input.asOfMs;
  const status = computeDataStatus(stalenessMs, STALENESS_THRESHOLDS.TAPE);
  
  const quality: DataQuality = {
    status,
    asOfMs: input.asOfMs,
    stalenessMs,
    source: "ws",
  };
  
  const trades = state.tradeHistory.get(input.symbol) || [];
  
  // Early return if no trades
  if (trades.length === 0) {
    return createEmptyOutput(quality);
  }
  
  // Filter trades by time windows
  const trades1m = trades.filter(t => now - t.ts < 60 * 1000);
  const trades5m = trades.filter(t => now - t.ts < 5 * 60 * 1000);
  const trades15m = trades.filter(t => now - t.ts < 15 * 60 * 1000);
  
  // Calculate CVD for each window
  const cvd1m = computeCVD(trades1m);
  const cvd5m = computeCVD(trades5m);
  const cvd15m = computeCVD(trades15m);
  
  // Update CVD history for slope calculation
  updateCVDHistory(input.symbol, cvd5m);
  
  // Calculate CVD slopes
  const slope1m = calculateCVDSlope(input.symbol, 60 * 1000);
  const slope5m = calculateCVDSlope(input.symbol, 5 * 60 * 1000);
  
  // Calculate aggression ratio
  const aggressionRatio = calculateAggressionRatio(trades5m);
  
  // Detect price-CVD divergence
  const { divergence, divergenceType } = detectDivergence(
    input.symbol,
    input.currentPrice,
    cvd5m
  );
  
  // Detect absorption zones
  const absorptionZones = detectAbsorption(
    trades5m.map(t => ({ ...t })),
    input.tickSize,
    5 * 60 * 1000,
    500
  );
  
  // Detect exhaustion
  const volumeP90 = state.rollingVolumeP90.get(input.symbol) || 1000;
  const { flag: exhaustionFlag, score: exhaustionScore } = detectExhaustion(
    trades1m,
    input.tickSize,
    volumeP90
  );
  
  const output: TapeAnalysisOutput = {
    quality,
    cvd1m,
    cvd5m,
    cvd15m,
    slope1m,
    slope5m,
    aggressionRatio,
    priceCvdDivergence: divergence,
    divergenceType,
    absorptionZones,
    exhaustionFlag,
    exhaustionScore,
  };
  
  // Cache result
  state.lastAnalysis.set(input.symbol, output);
  
  return output;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function createEmptyOutput(quality: DataQuality): TapeAnalysisOutput {
  return {
    quality: { ...quality, status: "MISSING" as DataStatus },
    cvd1m: 0,
    cvd5m: 0,
    cvd15m: 0,
    slope1m: 0,
    slope5m: 0,
    aggressionRatio: 0,
    priceCvdDivergence: false,
    divergenceType: "NONE",
    absorptionZones: [],
    exhaustionFlag: false,
    exhaustionScore: 0,
  };
}

function updateCVDHistory(symbol: string, cvd: number): void {
  const history = state.cvdHistory.get(symbol) || [];
  history.push({ ts: Date.now(), cvd });
  
  // Trim to size
  while (history.length > CVD_HISTORY_SIZE) {
    history.shift();
  }
  
  state.cvdHistory.set(symbol, history);
}

function calculateCVDSlope(symbol: string, windowMs: number): number {
  const history = state.cvdHistory.get(symbol) || [];
  if (history.length < 2) return 0;
  
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Find oldest point in window
  const inWindow = history.filter(h => h.ts >= windowStart);
  if (inWindow.length < 2) return 0;
  
  const oldest = inWindow[0];
  const newest = inWindow[inWindow.length - 1];
  
  const timeDeltaSec = (newest.ts - oldest.ts) / 1000;
  if (timeDeltaSec === 0) return 0;
  
  return (newest.cvd - oldest.cvd) / timeDeltaSec;
}

function calculateAggressionRatio(
  trades: Array<{ qty: number; isBuyerMaker: boolean }>
): number {
  if (trades.length === 0) return 0;
  
  let buyVolume = 0;
  let sellVolume = 0;
  
  for (const trade of trades) {
    const sign = classifyTradeSign(trade.isBuyerMaker);
    if (sign > 0) {
      buyVolume += trade.qty;
    } else {
      sellVolume += trade.qty;
    }
  }
  
  const total = buyVolume + sellVolume;
  if (total === 0) return 0;
  
  return (buyVolume - sellVolume) / total;
}

// Price history for divergence detection
const priceHistory: Map<string, Array<{ ts: number; price: number }>> = new Map();

function detectDivergence(
  symbol: string,
  currentPrice: number,
  currentCVD: number
): { divergence: boolean; divergenceType: "BULLISH" | "BEARISH" | "NONE" } {
  // Update price history
  const history = priceHistory.get(symbol) || [];
  history.push({ ts: Date.now(), price: currentPrice });
  
  // Keep last 5 minutes
  const cutoff = Date.now() - 5 * 60 * 1000;
  const filtered = history.filter(h => h.ts >= cutoff);
  priceHistory.set(symbol, filtered);
  
  if (filtered.length < 10) {
    return { divergence: false, divergenceType: "NONE" };
  }
  
  // Calculate price change
  const oldestPrice = filtered[0].price;
  const priceChange = (currentPrice - oldestPrice) / oldestPrice;
  
  // Get CVD change from history
  const cvdHistory = state.cvdHistory.get(symbol) || [];
  if (cvdHistory.length < 10) {
    return { divergence: false, divergenceType: "NONE" };
  }
  
  const oldestCVD = cvdHistory[0].cvd;
  const cvdChange = currentCVD - oldestCVD;
  
  // Divergence: price and CVD moving in opposite directions
  const priceUp = priceChange > 0.001;  // 0.1% threshold
  const priceDown = priceChange < -0.001;
  const cvdUp = cvdChange > 0;
  const cvdDown = cvdChange < 0;
  
  if (priceUp && cvdDown) {
    // Price up but selling pressure = bearish divergence
    return { divergence: true, divergenceType: "BEARISH" };
  }
  
  if (priceDown && cvdUp) {
    // Price down but buying pressure = bullish divergence
    return { divergence: true, divergenceType: "BULLISH" };
  }
  
  return { divergence: false, divergenceType: "NONE" };
}

// =============================================================================
// UTILITY EXPORTS
// =============================================================================

export function getLastTapeAnalysis(symbol: string): TapeAnalysisOutput | null {
  return state.lastAnalysis.get(symbol) || null;
}

export function clearTapeState(symbol?: string): void {
  if (symbol) {
    state.tradeHistory.delete(symbol);
    state.cvdHistory.delete(symbol);
    state.rollingVolumeP90.delete(symbol);
    state.lastAnalysis.delete(symbol);
    priceHistory.delete(symbol);
  } else {
    state.tradeHistory.clear();
    state.cvdHistory.clear();
    state.rollingVolumeP90.clear();
    state.lastAnalysis.clear();
    priceHistory.clear();
  }
}

export function getTradeCount(symbol: string): number {
  return state.tradeHistory.get(symbol)?.length || 0;
}
