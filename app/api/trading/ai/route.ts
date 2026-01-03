import { NextResponse } from "next/server";

import { isTradingEnabled } from "@/lib/trading/trading-enabled";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TradingAiRequestBody = {
  goal?: unknown;
  packet?: unknown;
};

export async function POST(request: Request) {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });

  let body: TradingAiRequestBody;
  try {
    body = (await request.json()) as TradingAiRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const goal = typeof body.goal === "string" && body.goal.trim().length > 0 ? body.goal.trim() : undefined;
  const packet = body.packet;
  if (!isPlainObject(packet)) {
    return NextResponse.json({ error: "packet must be an object." }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GROQ_API_KEY." }, { status: 500 });
  }

  const model = process.env.GROQ_MODEL ?? "llama3-70b-8192";

  const system = [
    "Sei un assistente operativo per Brick 1-2 (regime + universe) in un sistema di trading intraday crypto.",
    "NON puoi calcolare indicatori: usa solo i dati passati nel packet.",
    "NON puoi inventare simboli, prezzi o metriche mancanti.",
    "Se i dati sono insufficienti o WS/REST sono stale: inserisci guardrails conservativi.",
    "Rispondi SOLO in JSON valido, senza markdown e senza testo extra.",
    "",
    "Schema JSON richiesto:",
    "{",
    '  "brief": string[],',
    '  "guardrails": {',
    '    "noMarketOrders": boolean,',
    '    "avoidBreakouts": boolean,',
    '    "maxSimultaneousCharts": number,',
    '    "limitOnlySymbols": string[],',
    '    "notes": string[]',
    "  },",
    '  "why": { [symbol: string]: string[] },',
    '  "warnings": string[]',
    "}",
    "",
    "Regole:",
    "- brief: max 10 righe, operative.",
    "- why: includi solo simboli presenti nei top (universe.long/universe.short).",
    "- Motiva usando reason codes (blocks/warnings/info) e score (tradeability/regimeMatch/total) se disponibili.",
    "- Se il regime è TRANSITION o stress è alto: evita aggressività (guardrails più stretti).",
  ].join("\n");

  const userPayload = {
    goal:
      goal ??
      "Genera un brief operativo e guardrails per decidere su quali coin concentrarsi (long/short) usando il Universe TopN.",
    packet,
  };

  try {
    const completion = await groqChatCompletion({
      apiKey,
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Groq response missing content." }, { status: 502 });
    }

    const parsed = safeJsonParse(content);
    return NextResponse.json(
      {
        model: completion.model,
        id: completion.id,
        created: completion.created,
        usage: completion.usage,
        output: parsed ?? { raw: content },
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

async function groqChatCompletion({
  apiKey,
  model,
  messages,
}: {
  apiKey: string;
  model: string;
  messages: { role: "system" | "user" | "assistant"; content: string }[];
}) {
  const baseUrlRaw = process.env.GROQ_BASE_URL ?? "https://api.groq.com/openai/v1/";
  const baseUrl = baseUrlRaw.endsWith("/") ? baseUrlRaw : `${baseUrlRaw}/`;
  const url = new URL("chat/completions", baseUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(url, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 800,
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
  } finally {
    clearTimeout(timeout);
  }
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

