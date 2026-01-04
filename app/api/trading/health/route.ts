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

export async function GET() {
  const binance = await ping("https://api.binance.com/api/v3/ping");
  const groq = Boolean(process.env.GROQ_API_KEY);

  return NextResponse.json({
    ts: Date.now(),
    services: {
      binance_rest: binance,
      groq_env: { ok: groq },
    },
  });
}