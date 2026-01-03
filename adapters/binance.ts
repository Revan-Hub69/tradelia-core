export type Candle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

const BINANCE_BASE_URL = "https://api.binance.com";
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export async function fetchKlines4h(symbol: string, limit: number): Promise<Candle[]> {
  const normalizedSymbol = symbol.trim().toUpperCase();
  if (!/^[A-Z0-9]{5,20}$/.test(normalizedSymbol)) {
    throw new Error("Invalid symbol.");
  }
  if (!Number.isFinite(limit) || limit <= 0 || limit > 1000) {
    throw new Error("Invalid limit (1..1000).");
  }

  const url = new URL("/api/v3/klines", BINANCE_BASE_URL);
  url.searchParams.set("symbol", normalizedSymbol);
  url.searchParams.set("interval", "4h");
  url.searchParams.set("limit", String(Math.floor(limit)));

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TradeliaLocal/1.0; +https://tradelia.org)",
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

  return normalizeCandles4h(candles);
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function normalizeCandles4h(candles: Candle[]) {
  const sorted = [...candles].sort((a, b) => a.t - b.t);
  const normalized: Candle[] = [];

  for (const candle of sorted) {
    assertCandleShape(candle);
    if (normalized.length > 0 && candle.t === normalized.at(-1)?.t) {
      normalized[normalized.length - 1] = candle;
      continue;
    }
    normalized.push(candle);
  }

  for (let index = 0; index < normalized.length; index += 1) {
    const candle = normalized[index];
    if (candle.t % FOUR_HOURS_MS !== 0) {
      throw new Error("Candle timestamp is not aligned to 4h boundary.");
    }
    if (index === 0) continue;
    const prev = normalized[index - 1];
    const delta = candle.t - prev.t;
    if (delta !== FOUR_HOURS_MS) {
      throw new Error("Candles are not contiguous 4h intervals.");
    }
  }

  return normalized;
}

function assertCandleShape(candle: Candle) {
  if (!Number.isFinite(candle.t) || candle.t <= 0) throw new Error("Invalid candle timestamp.");
  if (!Number.isFinite(candle.o) || candle.o <= 0) throw new Error("Invalid candle open.");
  if (!Number.isFinite(candle.h) || candle.h <= 0) throw new Error("Invalid candle high.");
  if (!Number.isFinite(candle.l) || candle.l <= 0) throw new Error("Invalid candle low.");
  if (!Number.isFinite(candle.c) || candle.c <= 0) throw new Error("Invalid candle close.");
  if (!Number.isFinite(candle.v) || candle.v < 0) throw new Error("Invalid candle volume.");
  if (candle.h < candle.l) throw new Error("Invalid candle: high < low.");
  if (candle.o < candle.l || candle.o > candle.h) throw new Error("Invalid candle: open outside range.");
  if (candle.c < candle.l || candle.c > candle.h) throw new Error("Invalid candle: close outside range.");
}
