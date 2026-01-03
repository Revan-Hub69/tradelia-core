import { classifyRegime, type OhlcvCandle, type Regime } from "./regime";

type Env = {
  GROQ_API_KEY?: string;
  GROQ_MODEL?: string;
  GROQ_BASE_URL?: string;
  ALLOWED_ORIGINS?: string;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return withCors(env, request, new Response(null, { status: 204 }));
    }

    if (request.method === "GET" && url.pathname === "/snapshot") {
      const response = await handleSnapshot(url, request);
      return withCors(env, request, response);
    }

    if (request.method === "POST" && url.pathname === "/ai") {
      const response = await handleAi(request, env);
      return withCors(env, request, response);
    }

    return withCors(env, request, json({ error: "Not found." }, 404));
  },
};

async function handleSnapshot(url: URL, request: Request): Promise<Response> {
  const symbol = sanitizeSymbol(url.searchParams.get("symbol") ?? "BTCUSDT");
  if (!symbol) return json({ error: "symbol is invalid." }, 400);

  const interval = url.searchParams.get("interval") ?? "4h";
  const allowedIntervals = new Set([
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
  if (!allowedIntervals.has(interval)) return json({ error: "interval is invalid." }, 400);

  const limit = parseLimit(url.searchParams.get("limit"));
  if (!limit.ok) return json({ error: limit.error }, 400);

  const previousRegime = parsePreviousRegime(url.searchParams.get("previousRegime"));
  if (!previousRegime.ok) return json({ error: previousRegime.error }, 400);

  const userAgent = request.headers.get("user-agent") ?? "tradelia-worker";

  try {
    const { candles, source, meta } = await fetchCandlesWithFallback({
      symbol,
      interval,
      limit: limit.value,
      userAgent,
    });

    const regime = classifyRegime({ candles, previousRegime: previousRegime.value });

    return json(
      {
        source,
        symbol,
        interval,
        limit: candles.length,
        asOf: Date.now(),
        candles,
        regime,
        meta,
      },
      200,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return json({ error: message }, 400);
  }
}

async function fetchCandlesWithFallback({
  symbol,
  interval,
  limit,
  userAgent,
}: {
  symbol: string;
  interval: string;
  limit: number;
  userAgent: string;
}): Promise<{ candles: OhlcvCandle[]; source: "binance" | "okx" | "coinbase"; meta: Record<string, unknown> }> {
  try {
    const candles = await fetchBinanceKlines({ symbol, interval, limit, userAgent });
    return { candles, source: "binance", meta: { provider: "binance" } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    if (!shouldFallbackFromBinanceError(message)) {
      // Se non è un blocco/restriction tipico, non fare fallback silenzioso.
      throw error;
    }
  }

  try {
    const candles = await fetchOkxCandles({ symbol, interval, limit, userAgent });
    return { candles, source: "okx", meta: { provider: "okx", note: "Fallback (binance blocked)." } };
  } catch (error) {
    const okxMessage = error instanceof Error ? error.message : "Unknown error.";
    // Coinbase is a last resort; it doesn't support 4h.
    try {
      const candles = await fetchCoinbaseCandles({ symbol, interval, limit, userAgent });
      return {
        candles,
        source: "coinbase",
        meta: { provider: "coinbase", note: "Fallback (binance blocked, okx failed).", okxError: okxMessage },
      };
    } catch {
      throw new Error(`All providers failed. okxError: ${okxMessage}`);
    }
  }
}

async function fetchBinanceKlines({
  symbol,
  interval,
  limit,
  userAgent,
}: {
  symbol: string;
  interval: string;
  limit: number;
  userAgent: string;
}): Promise<OhlcvCandle[]> {
  const url = new URL("https://api.binance.com/api/v3/klines");
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", interval);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": userAgent },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Binance klines error (${res.status}): ${text || res.statusText}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) throw new Error("Binance response is not an array.");

  const candles: OhlcvCandle[] = [];
  for (const entry of data) {
    if (!Array.isArray(entry) || entry.length < 6) throw new Error("Binance kline has an invalid shape.");
    const time = toFiniteNumber(entry[0]);
    const open = toFiniteNumber(entry[1]);
    const high = toFiniteNumber(entry[2]);
    const low = toFiniteNumber(entry[3]);
    const close = toFiniteNumber(entry[4]);
    const volume = toFiniteNumber(entry[5]);
    if (time === null || open === null || high === null || low === null || close === null || volume === null) {
      throw new Error("Binance kline contains invalid number values.");
    }
    candles.push({ time, open, high, low, close, volume });
  }

  return candles;
}

function shouldFallbackFromBinanceError(message: string) {
  // Typical blocks when running from datacenter IPs / restricted locations.
  if (message.includes("Binance klines error (451)")) return true;
  if (message.includes("Binance klines error (403)")) return true;
  if (message.includes("Binance klines error (429)")) return true;
  if (message.includes("cloudfront") || message.includes("Request blocked")) return true;
  if (message.includes("Service unavailable from a restricted location")) return true;
  return false;
}

async function fetchOkxCandles({
  symbol,
  interval,
  limit,
  userAgent,
}: {
  symbol: string;
  interval: string;
  limit: number;
  userAgent: string;
}): Promise<OhlcvCandle[]> {
  const instId = mapToOkxInstId(symbol);
  if (!instId) {
    throw new Error("OKX fallback supports only *USDT symbols (e.g., BTCUSDT).");
  }

  const bar = mapToOkxBar(interval);
  if (!bar) {
    throw new Error("OKX fallback does not support this interval.");
  }

  const effectiveLimit = Math.min(limit, 300);
  const url = new URL("https://www.okx.com/api/v5/market/candles");
  url.searchParams.set("instId", instId);
  url.searchParams.set("bar", bar);
  url.searchParams.set("limit", String(effectiveLimit));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": userAgent },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OKX candles error (${res.status}): ${text || res.statusText}`);
  }

  const jsonBody = (await res.json()) as unknown;
  if (!isPlainObject(jsonBody)) throw new Error("OKX response is not an object.");
  const data = (jsonBody as Record<string, unknown>).data;
  if (!Array.isArray(data)) throw new Error("OKX response missing data array.");

  // Each entry: [ ts, o, h, l, c, vol, volCcy?, volCcyQuote?, confirm? ]
  const parsed: OhlcvCandle[] = [];
  for (const entry of data) {
    if (!Array.isArray(entry) || entry.length < 6) throw new Error("OKX candle has an invalid shape.");
    const timeMs = toFiniteNumber(entry[0]);
    const open = toFiniteNumber(entry[1]);
    const high = toFiniteNumber(entry[2]);
    const low = toFiniteNumber(entry[3]);
    const close = toFiniteNumber(entry[4]);
    const volume = toFiniteNumber(entry[5]);
    if (timeMs === null || open === null || high === null || low === null || close === null || volume === null) {
      throw new Error("OKX candle contains invalid number values.");
    }
    parsed.push({ time: timeMs, open, high, low, close, volume });
  }

  // OKX returns newest-first.
  parsed.sort((a, b) => a.time - b.time);
  return parsed;
}

function mapToOkxInstId(symbol: string): string | null {
  if (!symbol.endsWith("USDT")) return null;
  const base = symbol.slice(0, -4);
  if (!base || !/^[A-Z0-9]{2,10}$/.test(base)) return null;
  return `${base}-USDT`;
}

function mapToOkxBar(interval: string): string | null {
  // OKX bars: 1m/3m/5m/15m/30m/1H/2H/4H/6H/12H/1D/2D/3D/1W/1M
  if (interval === "1m") return "1m";
  if (interval === "3m") return "3m";
  if (interval === "5m") return "5m";
  if (interval === "15m") return "15m";
  if (interval === "30m") return "30m";
  if (interval === "1h") return "1H";
  if (interval === "2h") return "2H";
  if (interval === "4h") return "4H";
  if (interval === "6h") return "6H";
  if (interval === "12h") return "12H";
  if (interval === "1d") return "1D";
  if (interval === "3d") return "3D";
  if (interval === "1w") return "1W";
  if (interval === "1M") return "1M";
  return null;
}

async function fetchCoinbaseCandles({
  symbol,
  interval,
  limit,
  userAgent,
}: {
  symbol: string;
  interval: string;
  limit: number;
  userAgent: string;
}): Promise<OhlcvCandle[]> {
  const product = mapToCoinbaseProduct(symbol);
  if (!product) {
    throw new Error("Coinbase fallback supports only BTCUSDT/ETHUSDT/SOLUSDT (mapped to *-USD).");
  }

  const granularity = mapToCoinbaseGranularity(interval);
  if (!granularity) {
    throw new Error("Coinbase fallback supports only 1m/5m/15m/1h/6h/1d.");
  }

  // Coinbase returns max 300 candles per request; keep it simple.
  const effectiveLimit = Math.min(limit, 300);
  const url = new URL(`https://api.exchange.coinbase.com/products/${product}/candles`);
  url.searchParams.set("granularity", String(granularity));

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": userAgent },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Coinbase candles error (${res.status}): ${text || res.statusText}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) throw new Error("Coinbase response is not an array.");

  // Each candle: [ time, low, high, open, close, volume ]
  const parsed: OhlcvCandle[] = [];
  for (const entry of data.slice(0, effectiveLimit)) {
    if (!Array.isArray(entry) || entry.length < 6) throw new Error("Coinbase candle has an invalid shape.");
    const timeSec = toFiniteNumber(entry[0]);
    const low = toFiniteNumber(entry[1]);
    const high = toFiniteNumber(entry[2]);
    const open = toFiniteNumber(entry[3]);
    const close = toFiniteNumber(entry[4]);
    const volume = toFiniteNumber(entry[5]);
    if (timeSec === null || open === null || high === null || low === null || close === null || volume === null) {
      throw new Error("Coinbase candle contains invalid number values.");
    }
    parsed.push({
      time: timeSec * 1000,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  // Coinbase returns newest-first; sort asc for our indicators.
  parsed.sort((a, b) => a.time - b.time);
  return parsed;
}

function mapToCoinbaseProduct(symbol: string): string | null {
  // Best practice: keep fallback minimal and explicit.
  if (symbol === "BTCUSDT") return "BTC-USD";
  if (symbol === "ETHUSDT") return "ETH-USD";
  if (symbol === "SOLUSDT") return "SOL-USD";
  return null;
}

function mapToCoinbaseGranularity(interval: string): number | null {
  if (interval === "1m") return 60;
  if (interval === "5m") return 300;
  if (interval === "15m") return 900;
  if (interval === "1h") return 3600;
  if (interval === "6h") return 21600;
  if (interval === "1d") return 86400;
  return null;
}

async function handleAi(request: Request, env: Env): Promise<Response> {
  const apiKey = env.GROQ_API_KEY;
  if (!apiKey) return json({ error: "Missing GROQ_API_KEY." }, 500);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400);
  }

  if (!isPlainObject(body)) return json({ error: "Body must be an object." }, 400);

  const symbol = typeof body.symbol === "string" ? body.symbol.trim().toUpperCase() : undefined;
  const interval = typeof body.interval === "string" ? body.interval.trim() : undefined;
  const regime = parseRegimeOutput(body.regime);
  if (!regime.ok) return json({ error: regime.error }, 400);

  const allowedSetups = allowedSetupsForRegime(regime.value.regime);

  const model = env.GROQ_MODEL ?? "llama3-70b-8192";

  const system = [
    "Sei un decisore operativo per un sistema di trading, ma non puoi MAI cambiare il regime.",
    "Il regime è deterministico e fa da gate architetturale: decide cosa è ammesso e cosa è vietato.",
    "Non discutere il regime e non provare a ricalcolarlo.",
    "Rispondi SOLO in JSON valido, senza markdown, senza testo extra.",
    "",
    "Schema JSON richiesto:",
    "{",
    '  "regime": "TREND|RANGE|NO_TRADE",',
    '  "allowedSetups": string[],',
    '  "action": "ALLOW|NO_TRADE",',
    '  "setup": string|null,',
    '  "setupTimeframes": string[],',
    '  "reason": string,',
    '  "validatorChecklist": string[],',
    '  "notes": string[]',
    "}",
    "",
    "Regole:",
    "- Se regime = NO_TRADE: action=NO_TRADE, setup=null, allowedSetups=[].",
    "- Se regime = TREND: puoi scegliere SOLO tra allowedSetups.",
    "- Se regime = RANGE: puoi scegliere SOLO tra allowedSetups.",
    "- Mantieni reason breve e meccanica (max 2 frasi).",
  ].join("\n");

  const userPayload = {
    symbol,
    interval,
    regime: regime.value,
    gate: {
      allowedSetups,
      forbiddenSetups:
        regime.value.regime === "TREND"
          ? ["mean_reversion"]
          : regime.value.regime === "RANGE"
            ? ["early_breakout"]
            : ["ALL"],
    },
    goal: "Scegli un setup ammesso dal regime e indica i controlli minimi prima di validare un trade.",
    setupTimeframes: ["1h", "15m"],
  };

  const completion = await groqChatCompletion({
    apiKey,
    baseUrl: env.GROQ_BASE_URL,
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: JSON.stringify(userPayload) },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (typeof content !== "string") return json({ error: "Groq response missing content." }, 502);

  const parsed = safeJsonParse(content);
  const output = parsed && isPlainObject(parsed) ? parsed : { raw: content };

  return json(
    {
      model: completion.model,
      id: completion.id,
      created: completion.created,
      usage: completion.usage,
      output,
    },
    200,
  );
}

async function groqChatCompletion({
  apiKey,
  baseUrl,
  model,
  messages,
}: {
  apiKey: string;
  baseUrl?: string;
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}) {
  const baseUrlRaw = baseUrl ?? "https://api.groq.com/openai/v1/";
  const normalizedBaseUrl = baseUrlRaw.endsWith("/") ? baseUrlRaw : `${baseUrlRaw}/`;
  const url = new URL("chat/completions", normalizedBaseUrl);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 650,
      messages,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Groq error (${res.status}): ${text || res.statusText}`);
  }

  return (await res.json()) as {
    id?: string;
    model?: string;
    created?: number;
    usage?: unknown;
    choices?: Array<{
      message?: { content?: string };
    }>;
  };
}

function allowedSetupsForRegime(regime: Regime): string[] {
  if (regime === "TREND") return ["trend_following", "pullback"];
  if (regime === "RANGE") return ["range_rejection"];
  return [];
}

function parseRegimeOutput(value: unknown): { ok: true; value: { regime: Regime } } | { ok: false; error: string } {
  if (!isPlainObject(value)) return { ok: false, error: "regime must be an object." };
  const regime = (value as Record<string, unknown>).regime;
  if (regime !== "TREND" && regime !== "RANGE" && regime !== "NO_TRADE") {
    return { ok: false, error: "regime.regime must be one of TREND, RANGE, NO_TRADE." };
  }
  return { ok: true, value: value as { regime: Regime } };
}

function parsePreviousRegime(
  value: string | null,
): { ok: true; value: Regime | undefined } | { ok: false; error: string } {
  if (!value) return { ok: true, value: undefined };
  if (value === "TREND" || value === "RANGE" || value === "NO_TRADE") return { ok: true, value };
  return { ok: false, error: "previousRegime must be one of TREND, RANGE, NO_TRADE." };
}

function parseLimit(value: string | null): { ok: true; value: number } | { ok: false; error: string } {
  const DEFAULT_LIMIT = 300;
  const MAX_LIMIT = 1000;
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

function safeJsonParse(value: string): unknown | null {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function withCors(env: Env, request: Request, response: Response) {
  const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const origin = request.headers.get("Origin");
  const corsOrigin = origin && allowed.has(origin) ? origin : "null";

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", corsOrigin);
  headers.set("Vary", "Origin");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");
  headers.set("Access-Control-Max-Age", "86400");

  return new Response(response.body, { status: response.status, headers });
}

function parseAllowedOrigins(value: string | undefined) {
  const raw = value ?? "https://tradelia.org,http://localhost:3000,http://localhost:3001";
  return new Set(
    raw
      .split(",")
      .map((entry) => entry.trim())
      .filter((entry) => entry !== ""),
  );
}
