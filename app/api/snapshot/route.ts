import { NextResponse } from "next/server";

import { computeRegime4h, type Regime4h, type Regime4hOutput } from "@/engines/regime4h";
import type { Candle } from "@/adapters/binance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = ["fra1"];

type SnapshotResponse = {
  source: "binance";
  symbol: string;
  interval: string;
  limit: number;
  asOf: number;
  candles: Candle[];
  regime: Regime4hOutput;
};

const BINANCE_BASE_URL = process.env.BINANCE_BASE_URL ?? "https://api.binance.com";
const DEFAULT_SYMBOL = "BTCUSDT";
const DEFAULT_INTERVAL = "4h";
const DEFAULT_LIMIT = 300;
const MAX_LIMIT = 1000;

const ALLOWED_INTERVALS = new Set([
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const symbol = sanitizeSymbol(searchParams.get("symbol") ?? DEFAULT_SYMBOL);
  if (!symbol) {
    return NextResponse.json({ error: "symbol is invalid." }, { status: 400 });
  }

  const interval = searchParams.get("interval") ?? DEFAULT_INTERVAL;
  if (!ALLOWED_INTERVALS.has(interval)) {
    return NextResponse.json({ error: "interval is invalid." }, { status: 400 });
  }

  const limit = parseLimit(searchParams.get("limit"));
  if (!limit.ok) {
    return NextResponse.json({ error: limit.error }, { status: 400 });
  }

  const previousRegime = parsePreviousRegime(searchParams.get("previousRegime"));
  if (!previousRegime.ok) {
    return NextResponse.json({ error: previousRegime.error }, { status: 400 });
  }

  try {
    const candles = await fetchBinanceKlines({ symbol, interval, limit: limit.value });
    const regime = computeRegime4h({ candles4h: candles, previousRegime: previousRegime.value });

    const response: SnapshotResponse = {
      source: "binance",
      symbol,
      interval,
      limit: candles.length,
      asOf: Date.now(),
      candles,
      regime,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

async function fetchBinanceKlines({
  symbol,
  interval,
  limit,
}: {
  symbol: string;
  interval: string;
  limit: number;
}): Promise<Candle[]> {
  const base = normalizeBinanceBaseUrl(BINANCE_BASE_URL);
  const url = new URL("/api/v3/klines", base);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TradeliaBot/1.0; +https://tradelia.org)",
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Binance klines error (${res.status}): ${text || res.statusText}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) {
    throw new Error("Binance response is not an array.");
  }

  const candles: Candle[] = [];
  for (const entry of data) {
    if (!Array.isArray(entry) || entry.length < 6) {
      throw new Error("Binance kline has an invalid shape.");
    }

    const t = toFiniteNumber(entry[0]);
    const o = toFiniteNumber(entry[1]);
    const h = toFiniteNumber(entry[2]);
    const l = toFiniteNumber(entry[3]);
    const c = toFiniteNumber(entry[4]);
    const v = toFiniteNumber(entry[5]);

    if (t === null || o === null || h === null || l === null || c === null || v === null) {
      throw new Error("Binance kline contains invalid number values.");
    }

    candles.push({ t, o, h, l, c, v });
  }

  return candles;
}

function normalizeBinanceBaseUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return "https://api.binance.com";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function parsePreviousRegime(
  value: string | null,
): { ok: true; value: Regime4h | undefined } | { ok: false; error: string } {
  if (!value) return { ok: true, value: undefined };
  if (value === "TREND" || value === "RANGE" || value === "TRANSITION") return { ok: true, value };
  return { ok: false, error: "previousRegime must be one of TREND, RANGE, TRANSITION." };
}

function parseLimit(value: string | null): { ok: true; value: number } | { ok: false; error: string } {
  if (value === null || value.trim() === "") return { ok: true, value: DEFAULT_LIMIT };
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return { ok: false, error: "limit must be a number." };
  const rounded = Math.floor(parsed);
  if (rounded <= 0) return { ok: false, error: "limit must be > 0." };
  if (rounded > MAX_LIMIT) return { ok: false, error: `limit must be <= ${MAX_LIMIT}.` };
  return { ok: true, value: rounded };
}

function sanitizeSymbol(value: string) {
  const upper = value.trim().toUpperCase();
  if (!/^[A-Z0-9]{5,20}$/.test(upper)) return null;
  return upper;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}
