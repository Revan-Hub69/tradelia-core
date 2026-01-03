import http from "http";
import type { RawData } from "ws";
import WebSocket from "ws";

type WsHealth = "OK" | "DEGRADED" | "STALE";
type SpreadPoint = { ts: number; spreadBps: number };

type SymbolStats = {
  bid: number;
  ask: number;
  spreadBpsNow: number;
  spreadMeanBps60s: number;
  spreadStdBps60s: number;
  msgRate60s: number;
  lastUpdateTs: number;
  connected: boolean;
};

type Snapshot = {
  meta: { ts: number; topN: number; symbols: string[] };
  ws: { connected: boolean; reconnects: number; lastMessageAgeSec: number; health: WsHealth };
  symbols: Record<string, (SymbolStats & { lastUpdateAgeSec: number })>;
};

const PORT = Number(process.env.WS_DAEMON_PORT ?? 8787);
const WINDOW_MS = 60_000;
const TOP_N = Number(process.env.WS_DAEMON_TOP_N ?? 50);
const REFRESH_TOPLIST_MS = 10 * 60_000;
const BINANCE_REST = process.env.BINANCE_REST_URL ?? "https://api.binance.com";
const BINANCE_WS_BASE = process.env.BINANCE_WS_URL ?? "wss://stream.binance.com:9443/stream";

const CORS_ORIGIN = process.env.WS_DAEMON_CORS_ORIGIN ?? "http://localhost:3000";

function now() {
  return Date.now();
}

function meanStd(values: number[]) {
  if (!values.length) return { mean: 0, std: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const v = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / values.length;
  return { mean, std: Math.sqrt(v) };
}

function wsHealth(lastMessageAgeSec: number, connected: boolean): WsHealth {
  if (!connected) return "STALE";
  if (lastMessageAgeSec <= 2) return "OK";
  if (lastMessageAgeSec <= 10) return "DEGRADED";
  return "STALE";
}

class StreamCache {
  private spreads = new Map<string, SpreadPoint[]>();
  private stats = new Map<string, SymbolStats>();

  updateBook(symbol: string, bid: number, ask: number) {
    const ts = now();
    const mid = (bid + ask) / 2;
    const spreadBps = mid > 0 ? ((ask - bid) / mid) * 10_000 : 0;

    let points = this.spreads.get(symbol);
    if (!points) points = [];
    points.push({ ts, spreadBps });

    const cutoff = ts - WINDOW_MS;
    while (points.length && points[0].ts < cutoff) points.shift();
    this.spreads.set(symbol, points);

    const values = points.map((p) => p.spreadBps);
    const { mean, std } = meanStd(values);

    this.stats.set(symbol, {
      bid,
      ask,
      spreadBpsNow: spreadBps,
      spreadMeanBps60s: mean,
      spreadStdBps60s: std,
      msgRate60s: values.length,
      lastUpdateTs: ts,
      connected: true,
    });
  }

  markDisconnected(symbols: string[]) {
    for (const symbol of symbols) {
      const prev = this.stats.get(symbol);
      if (prev) this.stats.set(symbol, { ...prev, connected: false });
    }
  }

  pruneToSymbols(keep: Set<string>) {
    for (const symbol of this.stats.keys()) {
      if (!keep.has(symbol)) {
        this.stats.delete(symbol);
        this.spreads.delete(symbol);
      }
    }
  }

  snapshot(symbols: string[]) {
    const out: Record<string, SymbolStats & { lastUpdateAgeSec: number }> = {};
    const ts = now();
    for (const symbol of symbols) {
      const st = this.stats.get(symbol);
      if (!st) continue;
      out[symbol] = { ...st, lastUpdateAgeSec: Math.max(0, (ts - st.lastUpdateTs) / 1000) };
    }
    return out;
  }
}

const cache = new StreamCache();

let topSymbols: string[] = [];
let socket: WebSocket | null = null;
let socketConnected = false;
let reconnects = 0;
let lastSocketMessageTs = 0;

async function fetchTopNUSDT(): Promise<string[]> {
  const res = await fetch(`${BINANCE_REST}/api/v3/ticker/24hr`, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ticker/24hr HTTP ${res.status}: ${text || res.statusText}`);
  }

  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) throw new Error("ticker/24hr payload is not an array.");

  const ranked = data
    .map((entry) => {
      const obj = entry as Record<string, unknown>;
      const symbol = typeof obj.symbol === "string" ? obj.symbol : "";
      const quoteVolume = typeof obj.quoteVolume === "string" || typeof obj.quoteVolume === "number" ? Number(obj.quoteVolume) : 0;
      return { symbol, quoteVolume };
    })
    .filter((row) => row.symbol.endsWith("USDT") && Number.isFinite(row.quoteVolume) && row.quoteVolume > 0)
    .sort((a, b) => b.quoteVolume - a.quoteVolume)
    .slice(0, Math.max(1, Math.min(TOP_N, 200)))
    .map((row) => row.symbol.toUpperCase());

  const dedup: string[] = [];
  const seen = new Set<string>();
  for (const symbol of ranked) {
    if (!/^[A-Z0-9]{5,20}$/.test(symbol)) continue;
    if (seen.has(symbol)) continue;
    seen.add(symbol);
    dedup.push(symbol);
  }

  return dedup;
}

function buildWsUrl(symbols: string[]) {
  const streams = symbols.map((symbol) => `${symbol.toLowerCase()}@bookTicker`);
  const url = new URL(BINANCE_WS_BASE);
  url.searchParams.set("streams", streams.join("/"));
  return url.toString();
}

function connectWS() {
  if (!topSymbols.length) return;

  const url = buildWsUrl(topSymbols);
  try {
    socket?.removeAllListeners();
    socket?.close();
  } catch {
    // ignore
  }

  socket = new WebSocket(url);

  socket.on("open", () => {
    socketConnected = true;
    lastSocketMessageTs = now();
    console.log(`[WS] connected (${topSymbols.length} symbols)`);
  });

  socket.on("message", (buf: RawData) => {
    lastSocketMessageTs = now();
    try {
      const msg = JSON.parse(buf.toString()) as any;
      const data = msg?.data;
      if (!data?.s || data?.b === undefined || data?.a === undefined) return;

      const symbol = String(data.s).toUpperCase();
      const bid = Number(data.b);
      const ask = Number(data.a);
      if (!Number.isFinite(bid) || !Number.isFinite(ask) || bid <= 0 || ask <= 0 || ask < bid) return;

      cache.updateBook(symbol, bid, ask);
    } catch {
      // ignore
    }
  });

  socket.on("close", () => {
    socketConnected = false;
    reconnects += 1;
    console.log("[WS] closed, reconnecting...");
    cache.markDisconnected(topSymbols);
    setTimeout(connectWS, 1000);
  });

  socket.on("error", (err: Error) => {
    console.error("[WS] error", err);
    try {
      socket?.close();
    } catch {
      // ignore
    }
  });
}

async function refreshTopList() {
  try {
    const list = await fetchTopNUSDT();
    const changed =
      list.length !== topSymbols.length || list.some((symbol, index) => symbol !== topSymbols[index]);

    topSymbols = list;
    cache.pruneToSymbols(new Set(topSymbols));

    if (changed) {
      console.log("[TOP] updated, reconnect WS");
      connectWS();
    } else {
      console.log("[TOP] unchanged");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[TOP] refresh failed:", message);
  }
}

function makeSnapshot(): Snapshot {
  const ts = now();
  const lastMessageAgeSec = lastSocketMessageTs ? Math.max(0, (ts - lastSocketMessageTs) / 1000) : 9999;
  const health = wsHealth(lastMessageAgeSec, socketConnected);

  return {
    meta: { ts, topN: topSymbols.length, symbols: topSymbols },
    ws: { connected: socketConnected, reconnects, lastMessageAgeSec, health },
    symbols: cache.snapshot(topSymbols),
  };
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    res.statusCode = 400;
    return res.end();
  }

  if (req.method === "GET" && req.url.startsWith("/ws/snapshot")) {
    const snap = makeSnapshot();
    const body = `${JSON.stringify(snap)}\n`;
    res.writeHead(200, {
      "content-type": "application/json",
      "cache-control": "no-store",
      "access-control-allow-origin": CORS_ORIGIN,
    });
    return res.end(body);
  }

  res.statusCode = 404;
  return res.end("not found\n");
});

server.listen(PORT, "127.0.0.1", async () => {
  console.log(`[WS-DAEMON] http://127.0.0.1:${PORT}/ws/snapshot`);
  await refreshTopList();
  connectWS();
  setInterval(refreshTopList, REFRESH_TOPLIST_MS);
});
