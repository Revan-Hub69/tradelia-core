export type Candle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

const BINANCE_BASE_URL = "https://api.binance.com";

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

  return candles;
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

