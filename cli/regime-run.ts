import fs from "fs";
import path from "path";

import { fetchKlines4h } from "@/adapters/binance";
import { computeRegime4h, type Regime4h, type RegimeConfig } from "@/engines/regime4h";

type Args = {
  symbol: string;
  limit: number;
};

type PersistedState = {
  previousRegime?: Regime4h;
  previousRegimes?: Record<string, Regime4h>;
};

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const configPath = path.join(process.cwd(), "config", "regime.json");
  const config = readJsonFile(configPath) as RegimeConfig;

  const statePath = path.join(process.cwd(), "state.json");
  const previous = readState(statePath);
  const symbolKey = args.symbol.trim().toUpperCase();
  const previousRegime = previous.previousRegimes?.[symbolKey] ?? previous.previousRegime;

  const candles4h = await fetchKlines4h(args.symbol, args.limit);

  const output = computeRegime4h({
    candles4h,
    previousRegime,
    config,
  });

  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);

  const previousRegimes: Record<string, Regime4h> = { ...(previous.previousRegimes ?? {}) };
  previousRegimes[symbolKey] = output.regime;
  writeState(statePath, { ...previous, previousRegime: output.regime, previousRegimes });
}

function parseArgs(argv: string[]): Args {
  const args: Partial<Args> = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--symbol") {
      args.symbol = argv[index + 1];
      index += 1;
      continue;
    }
    if (token === "--limit") {
      args.limit = Number(argv[index + 1]);
      index += 1;
      continue;
    }
  }

  const symbol = (args.symbol ?? "").trim();
  const limit = args.limit ?? 300;

  if (!symbol) {
    throw new Error("Missing --symbol (e.g. BTCUSDT).");
  }

  if (!Number.isFinite(limit) || limit <= 0 || limit > 1000) {
    throw new Error("Invalid --limit (1..1000).");
  }

  return { symbol, limit };
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

    const previousRegime = obj.previousRegime;
    if (previousRegime === "TREND" || previousRegime === "RANGE" || previousRegime === "TRANSITION") {
      state.previousRegime = previousRegime;
    }

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
