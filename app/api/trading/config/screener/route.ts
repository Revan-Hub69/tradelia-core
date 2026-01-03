import { NextResponse } from "next/server";

import { readScreenerConfig, writeScreenerConfig } from "@/lib/trading/config-io";
import { isTradingEnabled } from "@/lib/trading/trading-enabled";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });

  try {
    return NextResponse.json(readScreenerConfig(), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read screener config.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });

  let body: unknown;
  try {
    body = (await request.json()) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const saved = writeScreenerConfig(body);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to write screener config.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
