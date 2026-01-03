import fs from "fs";
import path from "path";

import { NextResponse } from "next/server";

import { fetchBookTickers, fetchKlines4h, fetchMarketRules, fetchTickers24h } from "@/adapters/binance";
import { computeRegime4h, type Regime4h, type Regime4hOutput } from "@/engines/regime4h";
import { requireAdminApiSession } from "@/lib/trading/admin-guard";
import { readRegimeConfig, readScreenerConfig, readSymbolsConfig } from "@/lib/trading/config-io";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PersistedState = {
  previousRegime?: Regime4h;
  previousRegimes?: Record<string, Regime4h>;
};

type ScanOk = {
  symbol: string;
  ok: true;
  regime: Regime4h;
  stress: boolean;
  keptPrevious: boolean;
  metrics: Regime4hOutput["metrics"];
  allowedSetups: string[];
  forbiddenSetups: string[];
  reasonCode: string;
  market: unknown;
  book: { bid: number; ask: number; spreadBps: number | null } | null;
  ticker24h: unknown;
  eligibility: { eligible: boolean; blocks: string[]; warnings: string[] };
};

type ScanError = { symbol: string; ok: false; error: string };

export async function GET(request: Request) {
  const guard = await requireAdminApiSession();
  if ("response" in guard) return guard.response;

  const { searchParams } = new URL(request.url);
  const limitParsed = parseLimit(searchParams.get("limit"));
  if (!limitParsed.ok) return NextResponse.json({ error: limitParsed.error }, { status: 400 });

  const concurrencyParsed = parseConcurrency(searchParams.get("concurrency"));
  if (!concurrencyParsed.ok) return NextResponse.json({ error: concurrencyParsed.error }, { status: 400 });

  try {
    const symbolsConfig = readSymbolsConfig();
    const screenerConfig = readScreenerConfig();
    const regimeConfig = readRegimeConfig();

    const statePath = path.join(process.cwd(), "state.json");
    const state = readState(statePath);
    const previousRegimes: Record<string, Regime4h> = { ...(state.previousRegimes ?? {}) };

    const [marketRules, bookTickers, tickers24h] = await Promise.all([
      fetchMarketRules(symbolsConfig.symbols),
      fetchBookTickers(symbolsConfig.symbols),
      fetchTickers24h(symbolsConfig.symbols),
    ]);

    const results = await mapWithConcurrency(symbolsConfig.symbols, concurrencyParsed.value, async (symbol) => {
      const previous = previousRegimes[symbol];
      try {
        const candles4h = await fetchKlines4h(symbol, limitParsed.value);
        const output = computeRegime4h({ candles4h, previousRegime: previous, config: regimeConfig });
        previousRegimes[symbol] = output.regime;

        const market = marketRules[symbol] ?? null;
        const book = bookTickers[symbol] ?? null;
        const ticker = tickers24h[symbol] ?? null;

        const blocks: string[] = [];
        const warnings: string[] = [];

        if (market) {
          if (isPlainObject(market) && typeof market.status === "string" && market.status !== "TRADING") {
            blocks.push(`status_${market.status.toLowerCase()}`);
          }
        } else {
          blocks.push("market_rules_missing");
        }

        let spreadBps: number | null = null;
        if (book && isPlainObject(book) && typeof book.bidPrice === "number" && typeof book.askPrice === "number") {
          const bid = book.bidPrice;
          const ask = book.askPrice;
          const mid = (bid + ask) / 2;
          if (mid > 0 && ask >= bid) {
            spreadBps = ((ask - bid) / mid) * 10000;
          } else {
            blocks.push("book_invalid");
          }
        } else {
          blocks.push("book_missing");
        }

        if (spreadBps !== null && spreadBps > screenerConfig.filters.maxSpreadBps) {
          blocks.push("spread_too_wide");
        }

        if (ticker && isPlainObject(ticker) && typeof ticker.quoteVolume === "number") {
          if (ticker.quoteVolume < screenerConfig.filters.minQuoteVolume24h) blocks.push("quote_volume_low");
        } else {
          blocks.push("ticker24h_missing");
        }

        if (screenerConfig.filters.excludeTransition && output.regime === "TRANSITION") blocks.push("regime_transition");

        if (output.stress) {
          if (screenerConfig.filters.excludeStress) blocks.push("stress");
          else warnings.push("stress");
        }

        const eligible = blocks.length === 0;

        const normalizedBook =
          book && isPlainObject(book) && typeof book.bidPrice === "number" && typeof book.askPrice === "number"
            ? { bid: book.bidPrice, ask: book.askPrice, spreadBps }
            : null;

        const okResult: ScanOk = {
          symbol,
          ok: true,
          ...output,
          market,
          book: normalizedBook,
          ticker24h: ticker,
          eligibility: { eligible, blocks, warnings },
        };

        return okResult;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const errResult: ScanError = { symbol, ok: false, error: message };
        return errResult;
      }
    });

    writeState(statePath, { ...state, previousRegimes });

    const sorted = [...results].sort((a, b) => compareResults(a, b));
    return NextResponse.json({ asOf: Date.now(), results: sorted }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to run screener.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function compareResults(a: ScanOk | ScanError, b: ScanOk | ScanError) {
  const aKey = buildSortKey(a);
  const bKey = buildSortKey(b);
  for (let index = 0; index < Math.max(aKey.length, bKey.length); index += 1) {
    const left = aKey[index] ?? 0;
    const right = bKey[index] ?? 0;
    if (left < right) return -1;
    if (left > right) return 1;
  }
  return 0;
}

function buildSortKey(result: ScanOk | ScanError) {
  if (!result.ok) return [900];

  const eligible = result.eligibility.eligible ? 0 : 1;
  const regime = result.regime === "TREND" ? 0 : result.regime === "RANGE" ? 1 : result.regime === "TRANSITION" ? 2 : 9;
  const stress = result.stress ? 1 : 0;
  const spreadBps = typeof result.book?.spreadBps === "number" && Number.isFinite(result.book.spreadBps) ? result.book.spreadBps : 9999;
  const quoteVolume =
    isPlainObject(result.ticker24h) && typeof result.ticker24h.quoteVolume === "number" && Number.isFinite(result.ticker24h.quoteVolume)
      ? result.ticker24h.quoteVolume
      : 0;

  return [eligible, regime, stress, spreadBps, -quoteVolume];
}

function parseLimit(value: string | null): { ok: true; value: number } | { ok: false; error: string } {
  if (value === null || value.trim() === "") return { ok: true, value: 300 };
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return { ok: false, error: "limit must be a number." };
  const rounded = Math.floor(parsed);
  if (rounded <= 0) return { ok: false, error: "limit must be > 0." };
  if (rounded > 1000) return { ok: false, error: "limit must be <= 1000." };
  return { ok: true, value: rounded };
}

function parseConcurrency(value: string | null): { ok: true; value: number } | { ok: false; error: string } {
  if (value === null || value.trim() === "") return { ok: true, value: 3 };
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return { ok: false, error: "concurrency must be a number." };
  const rounded = Math.floor(parsed);
  if (rounded <= 0 || rounded > 10) return { ok: false, error: "concurrency must be in 1..10." };
  return { ok: true, value: rounded };
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
        if (value === "TREND" || value === "RANGE" || value === "TRANSITION") {
          mapped[key] = value;
        }
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

function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
