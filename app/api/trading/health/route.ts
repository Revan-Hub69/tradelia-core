import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ping(url: string, timeoutMs = 2500) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  const t0 = Date.now();
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    return { ok: res.ok, status: res.status, ms: Date.now() - t0 };
  } catch (_e) {
    return { ok: false, status: 0, ms: Date.now() - t0, error: "fetch_failed" };
  } finally {
    clearTimeout(t);
  }
}

async function checkWebSocket(url: string, timeoutMs = 3000): Promise<{ ok: boolean; ms: number; error?: string }> {
  const t0 = Date.now();
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ ok: false, ms: Date.now() - t0, error: "timeout" });
    }, timeoutMs);

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        ws.close();
        clearTimeout(timeout);
        resolve({ ok: true, ms: Date.now() - t0 });
      };
      
      ws.onerror = () => {
        clearTimeout(timeout);
        resolve({ ok: false, ms: Date.now() - t0, error: "connection_failed" });
      };
      
      ws.onclose = (event) => {
        if (event.code !== 1000) { // Not normal closure
          clearTimeout(timeout);
          resolve({ ok: false, ms: Date.now() - t0, error: "abnormal_close" });
        }
      };
    } catch (_e) {
      clearTimeout(timeout);
      resolve({ ok: false, ms: Date.now() - t0, error: "websocket_error" });
    }
  });
}

export async function GET() {
  const binance = await ping("https://api.binance.com/api/v3/ping");
  const binanceWs = await checkWebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");
  const groq = Boolean(process.env.GROQ_API_KEY);

  return NextResponse.json({
    ts: Date.now(),
    services: {
      binance_rest: binance,
      binance_ws: binanceWs,
      groq_env: { ok: groq },
    },
  });
}