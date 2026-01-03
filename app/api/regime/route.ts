import { NextResponse } from "next/server";

import { classifyRegime, type OhlcvCandle, type Regime } from "@/lib/market/regime";

type RegimeRequestBody = {
  candles: unknown;
  previousRegime?: unknown;
};

export async function POST(request: Request) {
  let body: RegimeRequestBody;
  try {
    body = (await request.json()) as RegimeRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedCandles = parseCandles(body.candles);
  if (!parsedCandles.ok) {
    return NextResponse.json({ error: parsedCandles.error }, { status: 400 });
  }

  const previousRegime = parsePreviousRegime(body.previousRegime);
  if (!previousRegime.ok) {
    return NextResponse.json({ error: previousRegime.error }, { status: 400 });
  }

  try {
    const output = classifyRegime({
      candles: parsedCandles.value,
      previousRegime: previousRegime.value,
    });
    return NextResponse.json(output, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

function parsePreviousRegime(value: unknown): { ok: true; value: Regime | undefined } | { ok: false; error: string } {
  if (value === undefined || value === null) return { ok: true, value: undefined };
  if (value === "TREND" || value === "RANGE" || value === "NO_TRADE") return { ok: true, value };
  return { ok: false, error: "previousRegime must be one of TREND, RANGE, NO_TRADE." };
}

function parseCandles(value: unknown): { ok: true; value: OhlcvCandle[] } | { ok: false; error: string } {
  if (!Array.isArray(value)) {
    return { ok: false, error: "candles must be an array." };
  }

  const candles: OhlcvCandle[] = [];
  for (const entry of value) {
    const candle = parseCandle(entry);
    if (!candle) {
      return {
        ok: false,
        error:
          "Invalid candle. Expected {time,open,high,low,close[,volume]} or [time,open,high,low,close[,volume]].",
      };
    }
    candles.push(candle);
  }

  return { ok: true, value: candles };
}

function parseCandle(value: unknown): OhlcvCandle | null {
  if (Array.isArray(value)) {
    if (value.length < 5) return null;
    const time = toNumber(value[0]);
    const open = toNumber(value[1]);
    const high = toNumber(value[2]);
    const low = toNumber(value[3]);
    const close = toNumber(value[4]);
    const volume = value.length > 5 ? toNumber(value[5]) : undefined;

    if (time === null || open === null || high === null || low === null || close === null) return null;
    if (volume === null) return null;
    return volume === undefined ? { time, open, high, low, close } : { time, open, high, low, close, volume };
  }

  if (!isPlainObject(value)) return null;
  const obj = value as Record<string, unknown>;

  const time = toNumber(obj.time ?? obj.t ?? obj.timestamp);
  const open = toNumber(obj.open ?? obj.o);
  const high = toNumber(obj.high ?? obj.h);
  const low = toNumber(obj.low ?? obj.l);
  const close = toNumber(obj.close ?? obj.c);
  const volume = obj.volume ?? obj.v;

  if (time === null || open === null || high === null || low === null || close === null) return null;
  const parsedVolume = volume === undefined ? undefined : toNumber(volume);
  if (parsedVolume === null) return null;
  return parsedVolume === undefined
    ? { time, open, high, low, close }
    : { time, open, high, low, close, volume: parsedVolume };
}

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
