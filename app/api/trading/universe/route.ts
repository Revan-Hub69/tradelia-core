import fs from "fs";
import path from "path";

import { NextResponse } from "next/server";

import { fetchBookTickers, fetchKlines4h, fetchMarketRules, fetchTickers24h, type Candle } from "@/adapters/binance";
import { computeRegime4h, type Regime4h, type Regime4hOutput } from "@/engines/regime4h";
import { readRegimeConfig, readScreenerConfig } from "@/lib/trading/config-io";
import { ReasonCode } from "@/lib/trading/reasonCodes";
import { deriveBias, type MarketBias } from "@/lib/trading/universe/bias";
import { regimeMatchScore, totalScore, tradeabilityScore, wsHealthFromAge, type MarketSide, type WsHealth } from "@/lib/trading/universe/score";
import { isTradingEnabled } from "@/lib/trading/trading-enabled";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WS_SNAPSHOT_URL = process.env.WS_SNAPSHOT_URL ?? "http://127.0.0.1:8787/ws/snapshot";
const ANCHOR_SYMBOL = "BTCUSDT";

const KLINES_LIMIT = 300;
const TOPN_DEFAULT = 20;
const TOPN_MAX = 50;
const CONCURRENCY = 5;
const TTL_MS = 90_000;
const IMPACT_WARN_BPS = 4;
const JITTER_WARN_BPS = 0.5;
const ACTIVITY_LOW_WARN = 20;

type PersistedState = {
  previousRegime?: Regime4h;
  previousRegimes?: Record<string, Regime4h>;
};

type WsSnapshot = {
  meta?: { symbols?: string[]; ts?: number };
  ws?: { connected?: boolean; health?: WsHealth; lastMessageAgeSec?: number; reconnects?: number };
  symbols?: Record<
    string,
    {
      bid: number;
      ask: number;
      spreadBpsNow: number;
      spreadMeanBps60s: number;
      spreadStdBps60s: number;
      msgRate60s: number;
      lastUpdateAgeSec: number;
    }
  >;
};

type CachedRegime = {
  ts: number;
  candles: Candle[];
  regime: Regime4hOutput;
  close: number;
  asOfTs: number;
};

const regimeCache = new Map<string, CachedRegime>();

function inc(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

function parseTopN(value: string | null) {
  if (value === null || value.trim() === "") return TOPN_DEFAULT;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return TOPN_DEFAULT;
  const rounded = Math.floor(parsed);
  return Math.max(1, Math.min(TOPN_MAX, rounded));
}

function sanitizeSymbol(value: string) {
  const upper = value.trim().toUpperCase();
  if (!/^[A-Z0-9]{5,20}$/.test(upper)) return null;
  return upper;
}

function isStablecoinPair(symbol: string) {
  return /^(USDC|FDUSD|TUSD|USDP|DAI|BUSD)USDT$/.test(symbol);
}

function isLeveragedToken(symbol: string) {
  // Binance leveraged tokens often end with UP/DOWN, or include BULL/BEAR.
  // Examples: BTCUPUSDT, BTCDOWNUSDT
  return /^(.*)(UP|DOWN)USDT$/.test(symbol) || /^(.*)(BULL|BEAR)USDT$/.test(symbol);
}

function lastCandleClose(candles: Candle[]) {
  const last = candles.at(-1);
  return last ? last.c : 0;
}

function lastCandleCloseTs(candles: Candle[]) {
  const last = candles.at(-1);
  if (!last) return 0;
  return last.t + 4 * 60 * 60 * 1000;
}

function computeGaps4h(candles: Candle[]) {
  const step = 4 * 60 * 60 * 1000;
  let gaps = 0;
  for (let index = 1; index < candles.length; index += 1) {
    const delta = candles[index].t - candles[index - 1].t;
    if (delta !== step) gaps += 1;
  }
  return gaps;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function computeConfidenceDeterministic(rest: { freshnessSec: number; gaps: number; contiguous: boolean }, staleAfterSec: number) {
  const freshnessPenalty = rest.freshnessSec > staleAfterSec ? 0.2 : 0;
  const gapsPenalty = rest.gaps > 0 ? 0.2 : 0;
  const contBonus = rest.contiguous ? 0.3 : 0;
  return clamp01(0.5 + contBonus - freshnessPenalty - gapsPenalty);
}

function readState(filePath: string): PersistedState {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const obj = parsed as Record<string, unknown>;
    const state: PersistedState = {};

    const prev = obj.previousRegime;
    if (prev === "TREND" || prev === "RANGE" || prev === "TRANSITION") state.previousRegime = prev;

    const prevs = obj.previousRegimes;
    if (prevs && typeof prevs === "object" && !Array.isArray(prevs)) {
      const mapped: Record<string, Regime4h> = {};
      for (const [key, value] of Object.entries(prevs as Record<string, unknown>)) {
        if (value === "TREND" || value === "RANGE" || value === "TRANSITION") mapped[key] = value;
      }
      state.previousRegimes = mapped;
    }

    return state;
  } catch {
    return {};
  }
}

function writeState(filePath: string, state: PersistedState) {
  fs.writeFileSync(filePath, `${JSON.stringify(state, null, 2)}\n`, "utf-8");
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, mapper: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= items.length) return;
      results[index] = await mapper(items[index]);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function getRegimeCached(symbol: string, previousRegime: Regime4h | undefined) {
  const now = Date.now();
  const cached = regimeCache.get(symbol);
  if (cached && now - cached.ts < TTL_MS) return cached;

  const config = readRegimeConfig();
  const candles = await fetchKlines4h(symbol, KLINES_LIMIT);
  const close = lastCandleClose(candles);
  const asOfTs = lastCandleCloseTs(candles);
  const output = computeRegime4h({ candles4h: candles, previousRegime, config });

  const entry: CachedRegime = { ts: now, candles, regime: output, close, asOfTs };
  regimeCache.set(symbol, entry);
  return entry;
}

function atrPct4hFrom(entry: CachedRegime) {
  const close = entry.close;
  const atr = entry.regime.metrics.atr14;
  if (!Number.isFinite(close) || close <= 0 || !Number.isFinite(atr) || atr <= 0) return 0;
  return (atr / close) * 100;
}

export async function GET(request: Request) {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const topN = parseTopN(searchParams.get("topN"));
  const anchor = sanitizeSymbol(searchParams.get("anchor") ?? ANCHOR_SYMBOL) ?? ANCHOR_SYMBOL;

  let wsSnap: WsSnapshot = {};
  try {
    const res = await fetch(WS_SNAPSHOT_URL, { cache: "no-store" });
    wsSnap = (await res.json().catch(() => ({}))) as WsSnapshot;
  } catch {
    wsSnap = {};
  }

  const wsSymbols = Array.isArray(wsSnap.meta?.symbols) ? wsSnap.meta?.symbols ?? [] : [];
  const preBlockedByReason: Record<string, number> = {};
  const symbols = wsSymbols
    .map((s) => sanitizeSymbol(String(s)) ?? "")
    .filter((s) => s.length > 0)
    .slice(0, TOPN_MAX)
    .filter((symbol) => {
      if (!isStablecoinPair(symbol)) return true;
      inc(preBlockedByReason, ReasonCode.STABLECOIN_PAIR);
      return false;
    })
    .filter((symbol) => {
      if (!isLeveragedToken(symbol)) return true;
      inc(preBlockedByReason, ReasonCode.LEVERAGED_TOKEN);
      return false;
    });

  if (symbols.length === 0) {
    const blockedByReason = { ...preBlockedByReason };
    if (Object.keys(blockedByReason).length === 0) {
      blockedByReason[ReasonCode.WS_UNAVAILABLE] = 1;
    }
    const totalBlocked = Object.values(blockedByReason).reduce((a, b) => a + b, 0);
    return NextResponse.json(
      {
        meta: { version: "universe-v1", ts: Date.now(), source: "rest", anchorSymbol: anchor, topN },
        market: { anchor: { symbol: anchor, regime4h: null, bias: "NEUTRAL", confidence: 0 }, quality: { rest: null, ws: null } },
        long: [],
        short: [],
        excludedSummary: { blockedByReason, warnedByReason: {}, totalBlocked, totalWarned: 0 },
      },
      { status: 200, headers: { "cache-control": "no-store" } },
    );
  }

  const statePath = path.join(process.cwd(), "state.json");
  const state = readState(statePath);
  const previousRegimes: Record<string, Regime4h> = { ...(state.previousRegimes ?? {}) };

  const blockedByReason: Record<string, number> = { ...preBlockedByReason };
  const warnedByReason: Record<string, number> = {};

  let anchorEntry: CachedRegime | null = null;
  try {
    const prev = previousRegimes[anchor] ?? state.previousRegime;
    anchorEntry = await getRegimeCached(anchor, prev);
    previousRegimes[anchor] = anchorEntry.regime.regime;
  } catch {
    anchorEntry = null;
  }

  const asOfTs = anchorEntry?.asOfTs ?? 0;
  const staleAfterSec = 6 * 60 * 60;
  const freshnessSec = asOfTs > 0 ? Math.max(0, (Date.now() - asOfTs) / 1000) : 0;
  const gaps = anchorEntry ? computeGaps4h(anchorEntry.candles) : 0;
  const contiguous = gaps === 0;
  const confidence = computeConfidenceDeterministic({ freshnessSec, gaps, contiguous }, staleAfterSec);

  const anchorBias: MarketBias =
    anchorEntry !== null
      ? deriveBias(
          anchorEntry.regime.metrics.ema20,
          anchorEntry.regime.metrics.ema50,
          anchorEntry.regime.metrics.ema200,
          anchorEntry.close,
        )
      : "NEUTRAL";

  const screenerConfig = readScreenerConfig();
  const marketRules = await fetchMarketRules(symbols).catch(() => ({} as Record<string, unknown>));
  const bookTickers = await fetchBookTickers(symbols).catch(() => ({} as Record<string, unknown>));
  const tickers24h = await fetchTickers24h(symbols).catch(() => ({} as Record<string, unknown>));

  const regimeResults = await mapWithConcurrency(symbols, CONCURRENCY, async (symbol) => {
    try {
      const prev = previousRegimes[symbol];
      const entry = await getRegimeCached(symbol, prev);
      previousRegimes[symbol] = entry.regime.regime;
      return { symbol, ok: true as const, entry };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { symbol, ok: false as const, error: message };
    }
  });

  const candidates: Array<any> = [];

  for (const item of regimeResults) {
    if (!item.ok) {
      inc(blockedByReason, ReasonCode.REGIME_OUTPUT_INVALID);
      continue;
    }

    const symbol = item.symbol;
    const entry = item.entry;
    const regime = entry.regime;
    const close = entry.close;
    const atrPct4h = atrPct4hFrom(entry);

    const reasons = { blocks: [] as ReasonCode[], warnings: [] as ReasonCode[], info: [] as ReasonCode[] };

    const wsPerSymbol = wsSnap.symbols?.[symbol];
    const wsHealth = wsPerSymbol ? wsHealthFromAge(wsPerSymbol.lastUpdateAgeSec) : "STALE";
    if (!wsPerSymbol) {
      reasons.warnings.push(ReasonCode.WS_UNAVAILABLE);
      inc(warnedByReason, ReasonCode.WS_UNAVAILABLE);
    } else if (wsHealth === "OK") {
      reasons.info.push(ReasonCode.WS_OK);
    } else if (wsHealth === "DEGRADED") {
      reasons.warnings.push(ReasonCode.WS_DEGRADED);
      inc(warnedByReason, ReasonCode.WS_DEGRADED);
    } else {
      reasons.warnings.push(ReasonCode.WS_STALE);
      inc(warnedByReason, ReasonCode.WS_STALE);
    }

    const ticker = tickers24h[symbol] as any;
    const quoteVolume24h = ticker && typeof ticker.quoteVolume === "number" ? ticker.quoteVolume : null;
    if (quoteVolume24h === null) {
      reasons.warnings.push(ReasonCode.TICKER24H_MISSING);
      inc(warnedByReason, ReasonCode.TICKER24H_MISSING);
    } else if (quoteVolume24h < screenerConfig.filters.minQuoteVolume24h) {
      reasons.blocks.push(ReasonCode.QUOTE_VOLUME_LOW);
      inc(blockedByReason, ReasonCode.QUOTE_VOLUME_LOW);
    }

    const market = marketRules[symbol] as any;
    if (!market) {
      reasons.warnings.push(ReasonCode.MARKET_RULES_MISSING);
      inc(warnedByReason, ReasonCode.MARKET_RULES_MISSING);
    } else if (typeof market.status === "string" && market.status !== "TRADING") {
      reasons.blocks.push(ReasonCode.MARKET_NOT_TRADING);
      inc(blockedByReason, ReasonCode.MARKET_NOT_TRADING);
    }

    let bid = 0;
    let ask = 0;
    let spreadBpsNow = Number.POSITIVE_INFINITY;
    let spreadMeanBps60s = Number.POSITIVE_INFINITY;
    let spreadStdBps60s = 0;
    let msgRate60s = 0;
    let lastUpdateAgeSec = Number.POSITIVE_INFINITY;

    if (wsPerSymbol) {
      bid = wsPerSymbol.bid;
      ask = wsPerSymbol.ask;
      spreadBpsNow = wsPerSymbol.spreadBpsNow;
      spreadMeanBps60s = wsPerSymbol.spreadMeanBps60s;
      spreadStdBps60s = wsPerSymbol.spreadStdBps60s;
      msgRate60s = wsPerSymbol.msgRate60s;
      lastUpdateAgeSec = wsPerSymbol.lastUpdateAgeSec;
    } else {
      const book = bookTickers[symbol] as any;
      if (book && typeof book.bidPrice === "number" && typeof book.askPrice === "number") {
        bid = book.bidPrice;
        ask = book.askPrice;
        const mid = (bid + ask) / 2;
        if (mid > 0 && ask >= bid) {
          const spread = ((ask - bid) / mid) * 10_000;
          spreadBpsNow = spread;
          spreadMeanBps60s = spread;
          spreadStdBps60s = 0;
          reasons.warnings.push(ReasonCode.FALLBACK_REST);
          inc(warnedByReason, ReasonCode.FALLBACK_REST);
        }
      } else {
        reasons.warnings.push(ReasonCode.BOOK_MISSING);
        inc(warnedByReason, ReasonCode.BOOK_MISSING);
      }
    }

    const spreadEff = Math.max(spreadBpsNow, spreadMeanBps60s);
    if (!Number.isFinite(spreadEff)) {
      reasons.blocks.push(ReasonCode.BOOK_MISSING);
      inc(blockedByReason, ReasonCode.BOOK_MISSING);
    } else if (spreadEff >= 25) {
      reasons.blocks.push(ReasonCode.SPREAD_TOO_WIDE);
      inc(blockedByReason, ReasonCode.SPREAD_TOO_WIDE);
    } else if (spreadEff > screenerConfig.filters.maxSpreadBps) {
      reasons.warnings.push(ReasonCode.SPREAD_WIDE);
      inc(warnedByReason, ReasonCode.SPREAD_WIDE);
    } else {
      reasons.info.push(ReasonCode.SPREAD_OK);
    }

    if (atrPct4h <= 0) {
      reasons.warnings.push(ReasonCode.ATR_MISSING);
      inc(warnedByReason, ReasonCode.ATR_MISSING);
    } else if (atrPct4h < 0.6) {
      reasons.info.push(ReasonCode.ATR_TOO_LOW);
    } else if (atrPct4h > 6.0) {
      reasons.info.push(ReasonCode.ATR_TOO_HIGH);
    } else {
      reasons.info.push(ReasonCode.ATR_OK);
    }

    const bias = deriveBias(regime.metrics.ema20, regime.metrics.ema50, regime.metrics.ema200, close);
    reasons.info.push(
      regime.regime === "TREND"
        ? ReasonCode.REGIME_TREND
        : regime.regime === "RANGE"
          ? ReasonCode.REGIME_RANGE
          : ReasonCode.REGIME_TRANSITION,
    );
    reasons.info.push(bias === "BULL" ? ReasonCode.BIAS_BULL : bias === "BEAR" ? ReasonCode.BIAS_BEAR : ReasonCode.BIAS_NEUTRAL);
    if (regime.stress) reasons.info.push(ReasonCode.STRESS_TRUE);

    const tradeability = tradeabilityScore({
      spreadBpsNow,
      spreadMeanBps60s,
      spreadStdBps60s,
      msgRate60s,
      atrPct4h,
      wsHealth,
    });

    if (tradeability.parts.jitterAbsBps >= JITTER_WARN_BPS) {
      reasons.warnings.push(ReasonCode.SPREAD_JITTER_HIGH);
      inc(warnedByReason, ReasonCode.SPREAD_JITTER_HIGH);
    }

    if (tradeability.parts.impactBps >= IMPACT_WARN_BPS) {
      reasons.warnings.push(ReasonCode.IMPACT_HIGH);
      inc(warnedByReason, ReasonCode.IMPACT_HIGH);
    }

    if (msgRate60s > 0 && msgRate60s < ACTIVITY_LOW_WARN) {
      reasons.warnings.push(ReasonCode.ACTIVITY_LOW);
      inc(warnedByReason, ReasonCode.ACTIVITY_LOW);
    }

    const pushSide = (side: MarketSide) => {
      const match = regimeMatchScore(side, regime.regime, bias, regime.stress);
      const total = totalScore(tradeability.score, match);
      const matchReason = side === "LONG" ? ReasonCode.REGIME_MATCH_LONG : ReasonCode.REGIME_MATCH_SHORT;
      if (total <= 0) return;

      const reasonsForSide = {
        blocks: [...reasons.blocks],
        warnings: [...reasons.warnings],
        info: [...reasons.info, matchReason],
      };

      candidates.push({
        symbol,
        side,
        scores: { tradeability: tradeability.score, regimeMatch: match, total },
        htf: {
          price: close,
          atrPct4h,
          regime: regime.regime,
          bias,
          stress: regime.stress,
          trendStrength: regime.metrics.trendStrength,
          rangeRatio: regime.metrics.rangeRatio,
          emaState: regime.metrics.emaState,
        },
        ws: {
          bid,
          ask,
          spreadBpsNow,
          spreadMeanBps60s,
          spreadStdBps60s,
          msgRate60s,
          lastUpdateAgeSec,
        },
        reasons: reasonsForSide,
      });
    };

    if (reasons.blocks.length === 0) {
      if (regime.regime === "TREND" && bias !== "NEUTRAL") {
        pushSide(bias === "BULL" ? "LONG" : "SHORT");
      } else {
        pushSide("LONG");
        pushSide("SHORT");
      }
    }
  }

  writeState(statePath, { ...state, previousRegimes });

  const long = candidates
    .filter((c) => c.side === "LONG")
    .sort((a, b) => b.scores.total - a.scores.total)
    .slice(0, topN);
  const short = candidates
    .filter((c) => c.side === "SHORT")
    .sort((a, b) => b.scores.total - a.scores.total)
    .slice(0, topN);

  const response = {
    meta: {
      version: "universe-v1",
      ts: Date.now(),
      source: wsSnap.ws?.connected ? "rest+ws" : "rest",
      anchorSymbol: anchor,
      topN,
    },
    market: {
      anchor: {
        symbol: anchor,
        regime4h: anchorEntry?.regime ?? null,
        bias: anchorBias,
        confidence,
      },
      quality: {
        rest: { freshnessSec, gaps, contiguous, asOfTs, staleAfterSec },
        ws: {
          available: Boolean(wsSnap.ws?.connected),
          health: wsSnap.ws?.health ?? "STALE",
          lastMessageAgeSec: wsSnap.ws?.lastMessageAgeSec ?? 9999,
          reconnects: wsSnap.ws?.reconnects ?? 0,
        },
      },
    },
    long,
    short,
    excludedSummary: {
      blockedByReason,
      warnedByReason,
      totalBlocked: Object.values(blockedByReason).reduce((a, b) => a + b, 0),
      totalWarned: Object.values(warnedByReason).reduce((a, b) => a + b, 0),
    },
  };

  return NextResponse.json(response, { status: 200, headers: { "cache-control": "no-store" } });
}
