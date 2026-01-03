import fs from "fs";
import path from "path";

import { fetchKlines4h } from "@/adapters/binance";
import { computeRegime4h, type Regime4h, type RegimeConfig } from "@/engines/regime4h";

type PersistedState = {
  previousRegime?: Regime4h;
  previousRegimes?: Record<string, Regime4h>;
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

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const configPath = path.join(process.cwd(), "config", "regime.json");
  const config = readJsonFile(configPath) as RegimeConfig;

  const statePath = path.join(process.cwd(), "state.json");
  const state = readState(statePath);

  const previousRegimes: Record<string, Regime4h> = { ...(state.previousRegimes ?? {}) };

  const results = await mapWithConcurrency(args.symbols, args.concurrency, async (symbol) => {
    const previous = previousRegimes[symbol];
    try {
      const candles4h = await fetchKlines4h(symbol, args.limit);
      const output = computeRegime4h({ candles4h, previousRegime: previous, config });
      previousRegimes[symbol] = output.regime;
      return {
        symbol,
        ok: true as const,
        ...output,
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

  const sorted = [...results].sort((a, b) => sortKey(a) - sortKey(b));
  process.stdout.write(`${JSON.stringify(sorted, null, 2)}\n`);
}

function sortKey(result: unknown) {
  if (!result || typeof result !== "object") return 999;
  const obj = result as Record<string, unknown>;
  const ok = obj.ok === true;
  if (!ok) return 900;
  const regime = obj.regime;
  if (regime === "TREND") return 0;
  if (regime === "RANGE") return 100;
  return 200;
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

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});

