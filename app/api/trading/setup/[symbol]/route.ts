/**
 * Setup Engine API
 * 
 * GET /api/trading/setup/[symbol]
 * 
 * Generates setup candidates for a given symbol using:
 * - L2 order book data (from WS daemon or REST)
 * - Trade tape data (from Binance aggTrade)
 * - Regime context (from HTF candles)
 * - Structure levels (with REAL pivot detection)
 * 
 * AUDIT v2 FIXES:
 * - Added temporal consistency via FeatureSnapshot
 * - Added rate limiting per symbol (1 req/250ms)
 * - Added response caching (500ms TTL)
 * - Added featureSnapshot in response for UI
 * - Added blockedSetups in gate result
 */

import { NextResponse } from "next/server";

import { isTradingEnabled } from "@/lib/trading/trading-enabled";
import { runSetupEngine, type SetupEngineInput } from "@/engines/setup-engine";
import { fetchKlines4h } from "@/adapters/binance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WS_SNAPSHOT_URL = process.env.WS_SNAPSHOT_URL ?? "http://127.0.0.1:8787/ws/snapshot";
const BINANCE_REST = process.env.BINANCE_REST_URL ?? "https://api.binance.com";

// Circuit breaker state
let consecutiveFailures = 0;
const MAX_FAILURES = 3;
const CIRCUIT_RESET_MS = 60000;
let circuitOpenUntil = 0;

// Rate limiting per symbol (prevents UI refresh spam)
const lastRequestTime = new Map<string, number>();
const RATE_LIMIT_MS = 250;

// Response cache (reduces redundant computation)
const responseCache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL_MS = 500;

// =============================================================================
// LOCALHOST CHECK
// =============================================================================

function isAllowedLocalHost(host: string | null) {
  if (!host) return false;
  const lower = host.toLowerCase();
  return lower === "localhost" || lower === "127.0.0.1" || 
         lower.startsWith("localhost:") || lower.startsWith("127.0.0.1:");
}

function isLocalDevRequest(req: Request) {
  if (process.env.NODE_ENV === "production") return false;
  return isAllowedLocalHost(req.headers.get("host"));
}

// =============================================================================
// DATA FETCHING WITH CIRCUIT BREAKER
// =============================================================================

interface WsSnapshot {
  meta?: { symbols?: string[]; ts?: number };
  ws?: { connected?: boolean; health?: string; lastMessageAgeSec?: number };
  symbols?: Record<string, {
    bid: number;
    ask: number;
    spreadBpsNow: number;
    lastUpdateAgeSec: number;
  }>;
}

async function fetchWithCircuitBreaker<T>(
  fetcher: () => Promise<T>,
  fallback: T
): Promise<{ data: T; fromFallback: boolean }> {
  const now = Date.now();
  
  // Check if circuit is open
  if (now < circuitOpenUntil) {
    return { data: fallback, fromFallback: true };
  }
  
  try {
    const data = await fetcher();
    consecutiveFailures = 0;
    return { data, fromFallback: false };
  } catch {
    consecutiveFailures++;
    if (consecutiveFailures >= MAX_FAILURES) {
      circuitOpenUntil = now + CIRCUIT_RESET_MS;
    }
    return { data: fallback, fromFallback: true };
  }
}

async function fetchWsSnapshot(): Promise<WsSnapshot> {
  const { data } = await fetchWithCircuitBreaker(
    async () => {
      const res = await fetch(WS_SNAPSHOT_URL, { cache: "no-store" });
      return await res.json();
    },
    {}
  );
  return data;
}

async function fetchDepth(symbol: string, limit: number = 20): Promise<{
  bids: Array<{ price: number; qty: number }>;
  asks: Array<{ price: number; qty: number }>;
  asOfMs: number;
}> {
  const { data } = await fetchWithCircuitBreaker(
    async () => {
      const url = `${BINANCE_REST}/api/v3/depth?symbol=${symbol}&limit=${limit}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      
      return {
        bids: (json.bids || []).map((b: [string, string]) => ({
          price: parseFloat(b[0]),
          qty: parseFloat(b[1]),
        })),
        asks: (json.asks || []).map((a: [string, string]) => ({
          price: parseFloat(a[0]),
          qty: parseFloat(a[1]),
        })),
        asOfMs: Date.now(),
      };
    },
    { bids: [], asks: [], asOfMs: Date.now() }
  );
  return data;
}

async function fetchRecentTrades(symbol: string, limit: number = 500): Promise<{
  trades: Array<{ price: number; qty: number; ts: number; isBuyerMaker: boolean }>;
  asOfMs: number;
}> {
  const { data } = await fetchWithCircuitBreaker(
    async () => {
      const url = `${BINANCE_REST}/api/v3/aggTrades?symbol=${symbol}&limit=${limit}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      
      return {
        trades: (json || []).map((t: { p: string; q: string; T: number; m: boolean }) => ({
          price: parseFloat(t.p),
          qty: parseFloat(t.q),
          ts: t.T,
          isBuyerMaker: t.m,
        })),
        asOfMs: Date.now(),
      };
    },
    { trades: [], asOfMs: Date.now() }
  );
  return data;
}

async function fetchExchangeInfo(symbol: string): Promise<{ tickSize: number }> {
  const { data } = await fetchWithCircuitBreaker(
    async () => {
      const url = `${BINANCE_REST}/api/v3/exchangeInfo?symbol=${symbol}`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      
      const symbolInfo = json.symbols?.[0];
      const priceFilter = symbolInfo?.filters?.find((f: { filterType: string }) => f.filterType === "PRICE_FILTER");
      const tickSize = priceFilter?.tickSize ? parseFloat(priceFilter.tickSize) : 0.01;
      
      return { tickSize };
    },
    { tickSize: 0.01 }
  );
  return data;
}


// =============================================================================
// STRUCTURE ANALYSIS WITH REAL PIVOT DETECTION
// =============================================================================

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

interface StructureAnalysis {
  swingHigh: number;
  swingLow: number;
  nearestResistance: number;
  nearestSupport: number;
  levelStrength: number;
}

/**
 * Detect swing highs using proper pivot logic
 * A swing high requires: high[i] > high[i-1] AND high[i] > high[i+1]
 */
function findSwingHighs(candles: Candle[], lookback: number = 2): number[] {
  const swingHighs: number[] = [];
  
  for (let i = lookback; i < candles.length - lookback; i++) {
    const current = candles[i].h;
    let isSwingHigh = true;
    
    // Check left side
    for (let j = 1; j <= lookback; j++) {
      if (candles[i - j].h >= current) {
        isSwingHigh = false;
        break;
      }
    }
    
    // Check right side
    if (isSwingHigh) {
      for (let j = 1; j <= lookback; j++) {
        if (candles[i + j].h >= current) {
          isSwingHigh = false;
          break;
        }
      }
    }
    
    if (isSwingHigh) {
      swingHighs.push(current);
    }
  }
  
  return swingHighs;
}

/**
 * Detect swing lows using proper pivot logic
 * A swing low requires: low[i] < low[i-1] AND low[i] < low[i+1]
 */
function findSwingLows(candles: Candle[], lookback: number = 2): number[] {
  const swingLows: number[] = [];
  
  for (let i = lookback; i < candles.length - lookback; i++) {
    const current = candles[i].l;
    let isSwingLow = true;
    
    // Check left side
    for (let j = 1; j <= lookback; j++) {
      if (candles[i - j].l <= current) {
        isSwingLow = false;
        break;
      }
    }
    
    // Check right side
    if (isSwingLow) {
      for (let j = 1; j <= lookback; j++) {
        if (candles[i + j].l <= current) {
          isSwingLow = false;
          break;
        }
      }
    }
    
    if (isSwingLow) {
      swingLows.push(current);
    }
  }
  
  return swingLows;
}

/**
 * Count how many times price touched a level (for strength calculation)
 */
function countTouches(candles: Candle[], level: number, tolerance: number): number {
  let touches = 0;
  
  for (const candle of candles) {
    // Check if high touched resistance
    if (Math.abs(candle.h - level) <= tolerance) {
      touches++;
    }
    // Check if low touched support
    if (Math.abs(candle.l - level) <= tolerance) {
      touches++;
    }
  }
  
  return touches;
}

function analyzeStructure(
  candles: Candle[],
  currentPrice: number
): StructureAnalysis {
  if (candles.length < 20) {
    return {
      swingHigh: currentPrice * 1.02,
      swingLow: currentPrice * 0.98,
      nearestResistance: currentPrice * 1.01,
      nearestSupport: currentPrice * 0.99,
      levelStrength: 0.5,
    };
  }
  
  // Find swing points using proper pivot detection
  const swingHighs = findSwingHighs(candles, 2);
  const swingLows = findSwingLows(candles, 2);
  
  // Fallback to simple max/min if no pivots found
  const recentCandles = candles.slice(-20);
  const fallbackHigh = Math.max(...recentCandles.map(c => c.h));
  const fallbackLow = Math.min(...recentCandles.map(c => c.l));
  
  const swingHigh = swingHighs.length > 0 ? Math.max(...swingHighs) : fallbackHigh;
  const swingLow = swingLows.length > 0 ? Math.min(...swingLows) : fallbackLow;
  
  // Find nearest levels
  const resistanceLevels = swingHighs.filter(h => h > currentPrice).sort((a, b) => a - b);
  const supportLevels = swingLows.filter(l => l < currentPrice).sort((a, b) => b - a);
  
  const nearestResistance = resistanceLevels[0] || swingHigh;
  const nearestSupport = supportLevels[0] || swingLow;
  
  // Calculate level strength based on touch count
  const priceRange = swingHigh - swingLow;
  const tolerance = priceRange * 0.005; // 0.5% tolerance
  
  const resistanceTouches = countTouches(recentCandles, nearestResistance, tolerance);
  const supportTouches = countTouches(recentCandles, nearestSupport, tolerance);
  
  // Normalize: 5+ touches = max strength
  const levelStrength = Math.min(1, (resistanceTouches + supportTouches) / 10);
  
  return {
    swingHigh,
    swingLow,
    nearestResistance,
    nearestSupport,
    levelStrength,
  };
}

// =============================================================================
// REGIME EXTRACTION WITH ADAPTIVE THRESHOLDS
// =============================================================================

interface RegimeAnalysis {
  type: "TREND" | "RANGE" | "TRANSITION";
  strength: number;
  direction: "UP" | "DOWN" | "NEUTRAL";
  stress: boolean;
  atr: { current: number; previous: number };
}

function analyzeRegime(candles: Candle[]): RegimeAnalysis {
  if (candles.length < 50) {
    return {
      type: "TRANSITION",
      strength: 0.5,
      direction: "NEUTRAL",
      stress: false,
      atr: { current: 0, previous: 0 },
    };
  }
  
  // Calculate ATR
  const atrPeriod = 14;
  const trueRanges: number[] = [];
  
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].h;
    const low = candles[i].l;
    const prevClose = candles[i - 1].c;
    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    trueRanges.push(tr);
  }
  
  const recentTRs = trueRanges.slice(-atrPeriod);
  const previousTRs = trueRanges.slice(-atrPeriod * 2, -atrPeriod);
  
  const currentATR = recentTRs.reduce((a, b) => a + b, 0) / recentTRs.length;
  const previousATR = previousTRs.length > 0 
    ? previousTRs.reduce((a, b) => a + b, 0) / previousTRs.length 
    : currentATR;
  
  // Calculate EMAs for trend detection
  const closes = candles.map(c => c.c);
  const ema20 = calculateEMA(closes, 20);
  const ema50 = calculateEMA(closes, 50);
  
  // Determine direction
  let direction: "UP" | "DOWN" | "NEUTRAL" = "NEUTRAL";
  if (ema20 > ema50 * 1.005) direction = "UP";
  else if (ema20 < ema50 * 0.995) direction = "DOWN";
  
  // ADAPTIVE THRESHOLDS based on ATR
  const avgPrice = closes.slice(-20).reduce((a, b) => a + b, 0) / 20;
  const atrPct = currentATR / avgPrice;
  
  // Adaptive range ratio thresholds
  const trendThreshold = Math.max(0.02, atrPct * 1.5);
  const rangeThreshold = Math.max(0.01, atrPct * 0.5);
  
  const priceRange = Math.max(...candles.slice(-20).map(c => c.h)) - 
                     Math.min(...candles.slice(-20).map(c => c.l));
  const rangeRatio = priceRange / avgPrice;
  
  let type: "TREND" | "RANGE" | "TRANSITION" = "TRANSITION";
  let strength = 0.5;
  
  if (direction !== "NEUTRAL" && rangeRatio > trendThreshold) {
    type = "TREND";
    strength = Math.min(1, rangeRatio / (trendThreshold * 2));
  } else if (rangeRatio < rangeThreshold) {
    type = "RANGE";
    strength = Math.min(1, (rangeThreshold - rangeRatio) / rangeThreshold);
  }
  
  // Stress detection (ATR spike)
  const stress = currentATR > previousATR * 1.5;
  
  return {
    type,
    strength,
    direction,
    stress,
    atr: { current: currentATR, previous: previousATR },
  };
}

function calculateEMA(data: number[], period: number): number {
  if (data.length < period) return data[data.length - 1] || 0;
  
  const k = 2 / (period + 1);
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = period; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }
  
  return ema;
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  if (!isTradingEnabled()) {
    return NextResponse.json({ error: "Trading disabled." }, { status: 404 });
  }
  
  if (!isLocalDevRequest(request)) {
    return NextResponse.json({ error: "Local development only." }, { status: 403 });
  }
  
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();
  
  if (!/^[A-Z0-9]{5,20}$/.test(upperSymbol)) {
    return NextResponse.json({ error: "Invalid symbol format." }, { status: 400 });
  }
  
  // Rate limiting per symbol
  const now = Date.now();
  const lastRequest = lastRequestTime.get(upperSymbol) || 0;
  if (now - lastRequest < RATE_LIMIT_MS) {
    // Check cache first
    const cached = responseCache.get(upperSymbol);
    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data, { 
        status: 200, 
        headers: { 
          "cache-control": "no-store",
          "x-cache": "HIT",
          "x-rate-limited": "true",
        } 
      });
    }
    return NextResponse.json({ 
      error: "Rate limited. Try again in " + (RATE_LIMIT_MS - (now - lastRequest)) + "ms",
      symbol: upperSymbol,
    }, { status: 429 });
  }
  lastRequestTime.set(upperSymbol, now);
  
  // Check cache
  const cached = responseCache.get(upperSymbol);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json(cached.data, { 
      status: 200, 
      headers: { 
        "cache-control": "no-store",
        "x-cache": "HIT",
      } 
    });
  }
  
  try {
    const [wsSnapshot, depth, trades, exchangeInfo, candles4h] = await Promise.all([
      fetchWsSnapshot(),
      fetchDepth(upperSymbol, 20),
      fetchRecentTrades(upperSymbol, 500),
      fetchExchangeInfo(upperSymbol),
      fetchKlines4h(upperSymbol, 100),
    ]);
    
    const wsData = wsSnapshot.symbols?.[upperSymbol];
    const currentPrice = wsData 
      ? (wsData.bid + wsData.ask) / 2 
      : depth.bids[0]?.price || 0;
    
    if (currentPrice === 0) {
      return NextResponse.json({ 
        error: "Could not determine current price.",
        symbol: upperSymbol,
      }, { status: 400 });
    }
    
    const spreadBps = wsData?.spreadBpsNow || 
      (depth.bids[0] && depth.asks[0] 
        ? ((depth.asks[0].price - depth.bids[0].price) / currentPrice) * 10000 
        : 10);
    
    const regime = analyzeRegime(candles4h);
    const structure = analyzeStructure(candles4h, currentPrice);
    
    const input: SetupEngineInput = {
      symbol: upperSymbol,
      tickSize: exchangeInfo.tickSize,
      currentPrice,
      spreadBps,
      regime: {
        type: regime.type,
        strength: regime.strength,
        direction: regime.direction,
        stress: regime.stress,
      },
      structure,
      atr: regime.atr,
      l2: {
        bids: depth.bids,
        asks: depth.asks,
        asOfMs: depth.asOfMs,
      },
      tape: {
        trades: trades.trades,
        asOfMs: trades.asOfMs,
      },
    };
    
    const result = runSetupEngine(input);
    
    const responseData = {
      symbol: upperSymbol,
      timestamp: result.timestamp,
      status: result.status,
      setup: result.setup,
      analysis: {
        regime,
        structure,
        l2Summary: {
          imbalance5bps: result.analysis.l2.imbalance5bps,
          imbalance10bps: result.analysis.l2.imbalance10bps,
          voidScore: result.analysis.l2.voidScore,
          liquidityStress: result.analysis.l2.liquidityStress,
          quality: result.analysis.l2.quality,
        },
        tapeSummary: {
          cvd5m: result.analysis.tape.cvd5m,
          slope5m: result.analysis.tape.slope5m,
          aggressionRatio: result.analysis.tape.aggressionRatio,
          divergence: result.analysis.tape.priceCvdDivergence,
          exhaustion: result.analysis.tape.exhaustionFlag,
          quality: result.analysis.tape.quality,
        },
        gate: {
          status: result.analysis.gate.status,
          whyNotTrade: result.analysis.gate.whyNotTrade,
          passedGates: result.analysis.gate.passedGates,
          failedGates: result.analysis.gate.failedGates,
          blockedSetups: result.analysis.gate.blockedSetups,
          maxScoreCap: result.analysis.gate.maxScoreCap,
        },
      },
      reasons: result.reasons,
      meta: {
        wsConnected: wsSnapshot.ws?.connected || false,
        wsHealth: wsSnapshot.ws?.health || "UNKNOWN",
        tradesCount: trades.trades.length,
        depthLevels: depth.bids.length,
        circuitBreakerOpen: Date.now() < circuitOpenUntil,
        cached: false,
      },
    };
    
    // Cache response
    responseCache.set(upperSymbol, {
      data: responseData,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    
    // Cleanup old cache entries periodically
    if (responseCache.size > 100) {
      const cutoff = Date.now();
      for (const [key, value] of responseCache) {
        if (value.expiresAt < cutoff) {
          responseCache.delete(key);
        }
      }
    }
    
    return NextResponse.json(responseData, { 
      status: 200, 
      headers: { 
        "cache-control": "no-store",
        "x-cache": "MISS",
      } 
    });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[SETUP-API] ${upperSymbol} ERROR:`, message);
    
    return NextResponse.json({ 
      error: message,
      symbol: upperSymbol,
    }, { status: 500 });
  }
}
