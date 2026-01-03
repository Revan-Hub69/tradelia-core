import fs from "fs";
import path from "path";

import { fetchBookTickers, fetchKlines4h, fetchMarketRules, fetchTickers24h } from "@/adapters/binance";
import { computeRegime4h, type Regime4h, type RegimeConfig } from "@/engines/regime4h";

type PersistedState = {
  previousRegime?: Regime4h;
  previousRegimes?: Record<string, Regime4h>;
};

type ScreenerConfig = {
  version: "screener-v1";
  filters: {
    excludeTransition: boolean;
    excludeStress: boolean;
    maxSpreadBps: number;
    minQuoteVolume24h: number;
  };
};

type SymbolFile = {
  version: "symbols-v1";
  symbols: string[];
};

type Args = {
  symbols: string[];
  limit: number;
  concurrency: number;
};

const DEFAULT_SCREENER_CONFIG: ScreenerConfig = {
  version: "screener-v1",
  filters: {
    excludeTransition: true,
    excludeStress: false,
    maxSpreadBps: 12,
    minQuoteVolume24h: 20_000_000,
  },
};

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const configPath = path.join(process.cwd(), "config", "regime.json");
  const config = readJsonFile(configPath) as RegimeConfig;

  const screenerConfigPath = path.join(process.cwd(), "config", "screener.json");
  const screenerConfig = (readOptionalJsonFile(screenerConfigPath) as ScreenerConfig | null) ?? DEFAULT_SCREENER_CONFIG;

  const statePath = path.join(process.cwd(), "state.json");
  const state = readState(statePath);

  const previousRegimes: Record<string, Regime4h> = { ...(state.previousRegimes ?? {}) };

  const [marketRules, bookTickers, tickers24h] = await Promise.all([
    fetchMarketRules(args.symbols),
    fetchBookTickers(args.symbols),
    fetchTickers24h(args.symbols),
  ]);

  const results = await mapWithConcurrency(args.symbols, args.concurrency, async (symbol) => {
    const previous = previousRegimes[symbol];
    try {
      const candles4h = await fetchKlines4h(symbol, args.limit);
      const output = computeRegime4h({ candles4h, previousRegime: previous, config });
      previousRegimes[symbol] = output.regime;

      const market = marketRules[symbol] ?? null;
      const book = bookTickers[symbol] ?? null;
      const ticker = tickers24h[symbol] ?? null;

      const blocks: string[] = [];
      const warnings: string[] = [];

      if (market) {
        if (market.status !== "TRADING") blocks.push(`status_${market.status.toLowerCase()}`);
      } else {
        blocks.push("market_rules_missing");
      }

      let spreadBps: number | null = null;
      if (book) {
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

      if (ticker) {
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

      return {
        symbol,
        ok: true as const,
        ...output,
        market,
        book:
          book && spreadBps !== null
            ? { bid: book.bidPrice, ask: book.askPrice, spreadBps }
            : book
              ? { bid: book.bidPrice, ask: book.askPrice, spreadBps: null }
              : null,
        ticker24h: ticker,
        eligibility: { eligible, blocks, warnings },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { symbol, ok: false as const, error: message };
    }
  });

  writeState(statePath, {
    ...state,
    previousRegimes,
  });

  const sorted = [...results].sort((a, b) => compareResults(a, b));
  process.stdout.write(`${JSON.stringify(sorted, null, 2)}\n`);
}

function compareResults(a: unknown, b: unknown) {
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

function buildSortKey(result: unknown) {
  if (!result || typeof result !== "object") return [999];
  const obj = result as Record<string, unknown>;

  const ok = obj.ok === true;
  if (!ok) return [900];

  const eligible = isPlainObject(obj.eligibility) && obj.eligibility.eligible === true ? 0 : 1;
  const regimeValue = obj.regime;
  const regime =
    regimeValue === "TREND" ? 0 : regimeValue === "RANGE" ? 1 : regimeValue === "TRANSITION" ? 2 : 9;

  const stress = obj.stress === true ? 1 : 0;

  const spreadBps =
    isPlainObject(obj.book) && typeof obj.book.spreadBps === "number" && Number.isFinite(obj.book.spreadBps)
      ? obj.book.spreadBps
      : 9999;

  const quoteVolume =
    isPlainObject(obj.ticker24h) &&
    typeof obj.ticker24h.quoteVolume === "number" &&
    Number.isFinite(obj.ticker24h.quoteVolume)
      ? obj.ticker24h.quoteVolume
      : 0;

  return [eligible, regime, stress, spreadBps, -quoteVolume];
}

function parseArgs(argv: string[]): Args {
  let symbolsArg: string | undefined;
  let symbolsFile: string | undefined;
  let limit = 300;
  let concurrency = 3;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--symbols") {
      symbolsArg = argv[index + 1];
      index += 1;
      continue;
    }
    if (token === "--symbols-file") {
      symbolsFile = argv[index + 1];
      index += 1;
      continue;
    }
    if (token === "--limit") {
      limit = Number(argv[index + 1]);
      index += 1;
      continue;
    }
    if (token === "--concurrency") {
      concurrency = Number(argv[index + 1]);
      index += 1;
      continue;
    }
  }

  const symbols = normalizeSymbols(
    symbolsArg
      ? symbolsArg.split(",")
      : readSymbolsFile(path.resolve(process.cwd(), symbolsFile ?? "config/symbols.json")),
  );

  if (symbols.length === 0) throw new Error("No symbols provided.");
  if (!Number.isFinite(limit) || limit <= 0 || limit > 1000) throw new Error("Invalid --limit (1..1000).");
  if (!Number.isFinite(concurrency) || concurrency <= 0 || concurrency > 10) {
    throw new Error("Invalid --concurrency (1..10).");
  }

  return { symbols, limit: Math.floor(limit), concurrency: Math.floor(concurrency) };
}

function readSymbolsFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as unknown;
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid symbols file.");
  const obj = parsed as Partial<SymbolFile>;
  if (obj.version !== "symbols-v1" || !Array.isArray(obj.symbols)) throw new Error("Invalid symbols file.");
  return obj.symbols;
}

function normalizeSymbols(values: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const sym = value.trim().toUpperCase();
    if (!sym) continue;
    if (!/^[A-Z0-9]{5,20}$/.test(sym)) continue;
    if (seen.has(sym)) continue;
    seen.add(sym);
    out.push(sym);
  }
  return out;
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

function readJsonFile(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as unknown;
}

function readOptionalJsonFile(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return readJsonFile(filePath);
  } catch {
    return null;
  }
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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
