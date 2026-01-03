import fs from "fs";
import path from "path";

import { NextResponse } from "next/server";

import { fetchKlines4h } from "@/adapters/binance";
import { computeRegime4h, type Regime4h } from "@/engines/regime4h";
import { requireAdminApiSession } from "@/lib/trading/admin-guard";
import { readRegimeConfig } from "@/lib/trading/config-io";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PersistedState = {
  previousRegime?: Regime4h;
  previousRegimes?: Record<string, Regime4h>;
};

export async function GET(request: Request) {
  const guard = await requireAdminApiSession();
  if ("response" in guard) return guard.response;

  const { searchParams } = new URL(request.url);
  const symbol = sanitizeSymbol(searchParams.get("symbol") ?? "BTCUSDT");
  if (!symbol) return NextResponse.json({ error: "symbol is invalid." }, { status: 400 });

  const limitParsed = parseLimit(searchParams.get("limit"));
  if (!limitParsed.ok) return NextResponse.json({ error: limitParsed.error }, { status: 400 });

  try {
    const config = readRegimeConfig();

    const statePath = path.join(process.cwd(), "state.json");
    const state = readState(statePath);
    const previousRegime = state.previousRegimes?.[symbol] ?? state.previousRegime;

    const candles4h = await fetchKlines4h(symbol, limitParsed.value);
    const output = computeRegime4h({ candles4h, previousRegime, config });

    const nextPreviousRegimes: Record<string, Regime4h> = { ...(state.previousRegimes ?? {}) };
    nextPreviousRegimes[symbol] = output.regime;
    writeState(statePath, { ...state, previousRegime: output.regime, previousRegimes: nextPreviousRegimes });

    return NextResponse.json(
      {
        source: "binance",
        symbol,
        interval: "4h",
        limit: candles4h.length,
        asOf: Date.now(),
        candles: candles4h,
        regime: output,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to compute regime.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
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

function parseLimit(value: string | null): { ok: true; value: number } | { ok: false; error: string } {
  if (value === null || value.trim() === "") return { ok: true, value: 300 };
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return { ok: false, error: "limit must be a number." };
  const rounded = Math.floor(parsed);
  if (rounded <= 0) return { ok: false, error: "limit must be > 0." };
  if (rounded > 1000) return { ok: false, error: "limit must be <= 1000." };
  return { ok: true, value: rounded };
}

function sanitizeSymbol(value: string) {
  const upper = value.trim().toUpperCase();
  if (!/^[A-Z0-9]{5,20}$/.test(upper)) return null;
  return upper;
}
