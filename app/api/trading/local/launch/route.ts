import { spawn } from "child_process";

import { NextResponse } from "next/server";

import { isTradingEnabled } from "@/lib/trading/trading-enabled";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LaunchBody = {
  target?: unknown;
};

const TARGETS = ["ws-daemon"] as const;
type Target = (typeof TARGETS)[number];

function isAllowedHost(host: string | null) {
  if (!host) return false;
  const lower = host.toLowerCase();
  return lower.startsWith("localhost:") || lower.startsWith("127.0.0.1:") || lower === "localhost" || lower === "127.0.0.1";
}

export async function POST(request: Request) {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });
  if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "Not available in production." }, { status: 404 });
  if (!isAllowedHost(request.headers.get("host"))) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  let body: LaunchBody;
  try {
    body = (await request.json()) as LaunchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const target = typeof body.target === "string" ? body.target : "";
  if (!TARGETS.includes(target as Target)) {
    return NextResponse.json({ error: `Invalid target. Allowed: ${TARGETS.join(", ")}` }, { status: 400 });
  }

  if (process.platform !== "win32") {
    return NextResponse.json({ error: "This launcher is currently supported only on Windows." }, { status: 501 });
  }

  if (target === "ws-daemon") {
    const ok = await tryLaunchWsDaemon();
    return NextResponse.json(ok, { status: 200 });
  }

  return NextResponse.json({ error: "Unhandled target." }, { status: 400 });
}

async function tryLaunchWsDaemon() {
  const snapshotUrl = "http://127.0.0.1:8787/ws/snapshot";
  try {
    const res = await fetch(snapshotUrl, { cache: "no-store" });
    if (res.ok) {
      return { ok: true, started: false, message: "WS daemon già attivo (porta 8787)." };
    }
  } catch {
    // ignore
  }

  const child = spawn(
    "cmd.exe",
    ["/c", "start", "Tradelia WS Daemon", "cmd", "/k", "npm", "run", "ws:daemon"],
    {
      cwd: process.cwd(),
      detached: true,
      stdio: "ignore",
      windowsHide: false,
    },
  );

  child.unref();
  return { ok: true, started: true, message: "Avviato WS daemon in una nuova finestra CMD." };
}

