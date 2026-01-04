import { NextResponse } from "next/server";

import { getLocalGroqApiKey, getLocalSecretsPath, writeLocalSecrets } from "@/lib/trading/local-secrets";
import { isTradingEnabled } from "@/lib/trading/trading-enabled";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PutBody = {
  groqApiKey?: unknown;
};

function isAllowedLocalHost(host: string | null) {
  if (!host) return false;
  const lower = host.toLowerCase();
  return lower === "localhost" || lower === "127.0.0.1" || lower.startsWith("localhost:") || lower.startsWith("127.0.0.1:");
}

function isAllowedOrigin(origin: string | null) {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return url.hostname === "localhost" || url.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function isLocalDevRequest(req: Request) {
  if (process.env.NODE_ENV === "production") return false;
  const hostOk = isAllowedLocalHost(req.headers.get("host"));
  const originOk = isAllowedOrigin(req.headers.get("origin"));
  const fetchSite = (req.headers.get("sec-fetch-site") ?? "").toLowerCase();
  const sameOrigin = fetchSite === "" || fetchSite === "same-origin";
  return hostOk && originOk && sameOrigin;
}

export async function GET(request: Request) {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });
  if (!isLocalDevRequest(request)) return NextResponse.json({ error: "Not available." }, { status: 404 });

  const key = getLocalGroqApiKey();
  return NextResponse.json(
    { ok: true, secretsPath: getLocalSecretsPath(), hasGroqApiKey: Boolean(key) },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}

export async function PUT(request: Request) {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });
  if (!isLocalDevRequest(request)) return NextResponse.json({ error: "Not available." }, { status: 404 });

  let body: PutBody;
  try {
    body = (await request.json()) as PutBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body.groqApiKey;
  const groqApiKey =
    typeof raw === "string"
      ? raw.trim()
      : raw === null || raw === undefined
        ? ""
        : (() => {
            throw new Error("groqApiKey must be a string.");
          })();

  if (groqApiKey.length > 0 && groqApiKey.length < 20) {
    return NextResponse.json({ error: "groqApiKey too short." }, { status: 400 });
  }

  writeLocalSecrets({ groqApiKey: groqApiKey.length > 0 ? groqApiKey : undefined });

  return NextResponse.json(
    { ok: true, hasGroqApiKey: groqApiKey.length > 0, secretsPath: getLocalSecretsPath() },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}

