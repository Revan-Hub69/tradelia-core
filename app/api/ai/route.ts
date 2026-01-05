import { NextResponse } from "next/server";

import type { Regime4h, Regime4hOutput } from "@/engines/regime4h";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AiRequestBody = {
  symbol?: unknown;
  interval?: unknown;
  regime?: unknown;
  goal?: unknown;
  setupTimeframes?: unknown;
};

type AiDecision = {
  regime: Regime4h;
  allowedSetups: string[];
  action: "NO_TRADE" | "ALLOW";
  setup: string | null;
  setupTimeframes: string[];
  reason: string;
  validatorChecklist: string[];
  notes: string[];
};

export async function POST(request: Request) {
  let body: AiRequestBody;
  try {
    body = (await request.json()) as AiRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const symbol = typeof body.symbol === "string" ? body.symbol.trim().toUpperCase() : undefined;
  const interval = typeof body.interval === "string" ? body.interval.trim() : undefined;
  const goal = typeof body.goal === "string" ? body.goal.trim() : undefined;

  const regime = parseRegimeOutput(body.regime);
  if (!regime.ok) {
    return NextResponse.json({ error: regime.error }, { status: 400 });
  }

  const setupTimeframes = parseSetupTimeframes(body.setupTimeframes);
  if (!setupTimeframes.ok) {
    return NextResponse.json({ error: setupTimeframes.error }, { status: 400 });
  }

  const allowedSetups = allowedSetupsForRegime(regime.value.regime);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GROQ_API_KEY." }, { status: 500 });
  }

  const model = process.env.GROQ_MODEL ?? "llama3-70b-8192";

  const system = [
    "Sei un decisore operativo per un sistema di trading, ma non puoi MAI cambiare il regime.",
    "Il regime è deterministico e fa da gate architetturale: decide cosa è ammesso e cosa è vietato.",
    "Non discutere il regime e non provare a ricalcolarlo.",
    "Rispondi SOLO in JSON valido, senza markdown, senza testo extra.",
    "",
    "Schema JSON richiesto:",
    "{",
    '  "regime": "TREND|RANGE|TRANSITION",',
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
    "- Se regime = TRANSITION: action=NO_TRADE, setup=null, allowedSetups=[].",
    "- Se regime = TREND: puoi scegliere SOLO tra allowedSetups.",
    "- Se regime = RANGE: puoi scegliere SOLO tra allowedSetups.",
    "- Mantieni reason breve e meccanica (max 2 frasi).",
  ].join("\n");

  const userPayload = {
    symbol,
    interval,
    goal: goal ?? "Scegli un setup ammesso dal regime e indica i controlli minimi prima di validare un trade.",
    setupTimeframes: setupTimeframes.value,
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
    const output = parsed && isAiDecision(parsed) ? (parsed as AiDecision) : null;

    return NextResponse.json(
      {
        model: completion.model,
        id: completion.id,
        created: completion.created,
        usage: completion.usage,
        output: output ?? { raw: content },
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

function allowedSetupsForRegime(regime: Regime4h): string[] {
  if (regime === "TREND") return ["trend_following", "pullback"];
  if (regime === "RANGE") return ["range_rejection"];
  return [];
}

function parseRegimeOutput(value: unknown): { ok: true; value: Regime4hOutput } | { ok: false; error: string } {
  if (!isPlainObject(value)) return { ok: false, error: "regime must be an object." };
  const regime = (value as Record<string, unknown>).regime;
  if (regime !== "TREND" && regime !== "RANGE" && regime !== "TRANSITION") {
    return { ok: false, error: "regime.regime must be one of TREND, RANGE, TRANSITION." };
  }
  return { ok: true, value: value as Regime4hOutput };
}

function parseSetupTimeframes(
  value: unknown,
): { ok: true; value: string[] } | { ok: false; error: string } {
  if (value === undefined || value === null) return { ok: true, value: ["1h", "15m"] };
  if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string" || entry.trim() === "")) {
    return { ok: false, error: "setupTimeframes must be an array of strings." };
  }
  const normalized = value.map((entry) => entry.trim());
  return { ok: true, value: normalized };
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

function isAiDecision(value: unknown): value is AiDecision {
  if (!isPlainObject(value)) return false;
  if (value.regime !== "TREND" && value.regime !== "RANGE" && value.regime !== "TRANSITION") return false;
  if (!Array.isArray(value.allowedSetups) || value.allowedSetups.some((v) => typeof v !== "string")) return false;
  if (value.action !== "ALLOW" && value.action !== "NO_TRADE") return false;
  if (value.setup !== null && typeof value.setup !== "string") return false;
  if (!Array.isArray(value.setupTimeframes) || value.setupTimeframes.some((v) => typeof v !== "string")) return false;
  if (typeof value.reason !== "string") return false;
  if (!Array.isArray(value.validatorChecklist) || value.validatorChecklist.some((v) => typeof v !== "string")) return false;
  if (!Array.isArray(value.notes) || value.notes.some((v) => typeof v !== "string")) return false;
  return true;
}
