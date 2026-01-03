import { NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/trading/admin-guard";
import { readSymbolsConfig, writeSymbolsConfig } from "@/lib/trading/config-io";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdminApiSession();
  if ("response" in guard) return guard.response;

  try {
    return NextResponse.json(readSymbolsConfig(), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to read symbols config.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const guard = await requireAdminApiSession();
  if ("response" in guard) return guard.response;

  let body: unknown;
  try {
    body = (await request.json()) as unknown;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const saved = writeSymbolsConfig(body);
    return NextResponse.json(saved, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to write symbols config.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
