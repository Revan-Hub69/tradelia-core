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
const DEFAULT_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; TradeliaLocal/1.0; +https://tradelia.org)",
  Accept: "application/json",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
} satisfies HeadersInit;

export type BookTicker = {
  symbol: string;
  bidPrice: number;
  bidQty: number;
  askPrice: number;
  askQty: number;
};

export type Ticker24h = {
  symbol: string;
  lastPrice: number;
  volume: number;
  quoteVolume: number;
  priceChangePercent: number;
};

export type MarketRules = {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
  tickSize: number;
  stepSize: number;
  minQty: number;
  minNotional: number;
};

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

  const data = await fetchBinanceJson(url, "klines");
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

export async function fetchBookTickers(symbols: string[]): Promise<Record<string, BookTicker>> {
  const normalizedSymbols = normalizeSymbolsList(symbols);
  const out: Record<string, BookTicker> = {};
  if (normalizedSymbols.length === 0) return out;

  for (const group of chunkArray(normalizedSymbols, 100)) {
    const url = new URL("/api/v3/ticker/bookTicker", BINANCE_BASE_URL);
    url.searchParams.set("symbols", JSON.stringify(group));

    const data = await fetchBinanceJson(url, "bookTicker");
    if (!Array.isArray(data)) throw new Error("Binance bookTicker response is not an array.");

    for (const entry of data) {
      if (!entry || typeof entry !== "object") continue;
      const obj = entry as Record<string, unknown>;
      const symbol = typeof obj.symbol === "string" ? obj.symbol : null;
      const bidPrice = toFiniteNumber(obj.bidPrice);
      const bidQty = toFiniteNumber(obj.bidQty);
      const askPrice = toFiniteNumber(obj.askPrice);
      const askQty = toFiniteNumber(obj.askQty);
      if (!symbol || bidPrice === null || bidQty === null || askPrice === null || askQty === null) continue;
      out[symbol] = { symbol, bidPrice, bidQty, askPrice, askQty };
    }
  }

  return out;
}

export async function fetchTickers24h(symbols: string[]): Promise<Record<string, Ticker24h>> {
  const normalizedSymbols = normalizeSymbolsList(symbols);
  const out: Record<string, Ticker24h> = {};
  if (normalizedSymbols.length === 0) return out;

  for (const group of chunkArray(normalizedSymbols, 100)) {
    const url = new URL("/api/v3/ticker/24hr", BINANCE_BASE_URL);
    url.searchParams.set("symbols", JSON.stringify(group));

    const data = await fetchBinanceJson(url, "ticker24hr");
    if (!Array.isArray(data)) throw new Error("Binance ticker24hr response is not an array.");

    for (const entry of data) {
      if (!entry || typeof entry !== "object") continue;
      const obj = entry as Record<string, unknown>;
      const symbol = typeof obj.symbol === "string" ? obj.symbol : null;
      const lastPrice = toFiniteNumber(obj.lastPrice);
      const volume = toFiniteNumber(obj.volume);
      const quoteVolume = toFiniteNumber(obj.quoteVolume);
      const priceChangePercent = toFiniteNumber(obj.priceChangePercent);
      if (!symbol || lastPrice === null || volume === null || quoteVolume === null || priceChangePercent === null) continue;
      out[symbol] = { symbol, lastPrice, volume, quoteVolume, priceChangePercent };
    }
  }

  return out;
}

export async function fetchMarketRules(symbols: string[]): Promise<Record<string, MarketRules>> {
  const normalizedSymbols = normalizeSymbolsList(symbols);
  const out: Record<string, MarketRules> = {};
  if (normalizedSymbols.length === 0) return out;

  for (const group of chunkArray(normalizedSymbols, 50)) {
    const url = new URL("/api/v3/exchangeInfo", BINANCE_BASE_URL);
    url.searchParams.set("symbols", JSON.stringify(group));

    const data = await fetchBinanceJson(url, "exchangeInfo");
    if (!data || typeof data !== "object") throw new Error("Binance exchangeInfo response is not an object.");
    const symbolsList = (data as Record<string, unknown>).symbols;
    if (!Array.isArray(symbolsList)) throw new Error("Binance exchangeInfo response missing symbols.");

    for (const entry of symbolsList) {
      if (!entry || typeof entry !== "object") continue;
      const obj = entry as Record<string, unknown>;
      const symbol = typeof obj.symbol === "string" ? obj.symbol : null;
      const status = typeof obj.status === "string" ? obj.status : "UNKNOWN";
      const baseAsset = typeof obj.baseAsset === "string" ? obj.baseAsset : "";
      const quoteAsset = typeof obj.quoteAsset === "string" ? obj.quoteAsset : "";
      const filters = obj.filters;
      if (!symbol || !Array.isArray(filters)) continue;

      const priceFilter = filters.find((f) => isPlainObject(f) && f.filterType === "PRICE_FILTER");
      const lotSizeFilter = filters.find((f) => isPlainObject(f) && f.filterType === "LOT_SIZE");
      const notionalFilter =
        filters.find((f) => isPlainObject(f) && f.filterType === "MIN_NOTIONAL") ||
        filters.find((f) => isPlainObject(f) && f.filterType === "NOTIONAL");

      const tickSize = priceFilter ? toFiniteNumber(priceFilter.tickSize) : null;
      const stepSize = lotSizeFilter ? toFiniteNumber(lotSizeFilter.stepSize) : null;
      const minQty = lotSizeFilter ? toFiniteNumber(lotSizeFilter.minQty) : null;
      const minNotional = notionalFilter ? toFiniteNumber(notionalFilter.minNotional) : null;

      if (tickSize === null || stepSize === null || minQty === null || minNotional === null) continue;

      out[symbol] = {
        symbol,
        status,
        baseAsset,
        quoteAsset,
        tickSize,
        stepSize,
        minQty,
        minNotional,
      };
    }
  }

  return out;
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

async function fetchBinanceJson(url: URL, label: string) {
  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: DEFAULT_HEADERS,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Binance ${label} error (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as unknown;
}

function normalizeSymbolsList(symbols: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const symbol of symbols) {
    const normalized = symbol.trim().toUpperCase();
    if (!normalized) continue;
    if (!/^[A-Z0-9]{5,20}$/.test(normalized)) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

function chunkArray<T>(values: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
