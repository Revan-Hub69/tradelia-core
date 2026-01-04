import { NextResponse } from "next/server";

import { getLocalGroqApiKey } from "@/lib/trading/local-secrets";
import { isTradingEnabled } from "@/lib/trading/trading-enabled";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NasaAiRequestBody = {
  mode: "BRICK1_ONLY" | "BRICK2_ONLY" | "BRICK1_PLUS_BRICK2";
  input: unknown;
};

function mapDeprecatedGroqModel(model: string) {
  if (model === "llama3-70b-8192") return "llama-3.1-70b-versatile";
  if (model === "llama3-8b-8192") return "llama-3.1-8b-instant";
  if (model === "llama-3.1-70b-versatile") return "llama-3.3-70b-versatile";
  return model;
}

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
  const origin = req.headers.get("origin");
  const originOk = origin === null || origin === "" ? true : isAllowedOrigin(origin);
  const fetchSite = (req.headers.get("sec-fetch-site") ?? "").toLowerCase();
  const sameOrigin = fetchSite === "" || fetchSite === "same-origin";
  return hostOk && originOk && sameOrigin;
}

export async function POST(request: Request) {
  if (!isTradingEnabled()) return NextResponse.json({ error: "Trading disabled." }, { status: 404 });

  let body: NasaAiRequestBody;
  try {
    body = (await request.json()) as NasaAiRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { mode, input } = body;
  
  if (!mode || !["BRICK1_ONLY", "BRICK2_ONLY", "BRICK1_PLUS_BRICK2"].includes(mode)) {
    return NextResponse.json({ error: "Invalid mode. Must be BRICK1_ONLY, BRICK2_ONLY, or BRICK1_PLUS_BRICK2." }, { status: 400 });
  }

  if (!input || typeof input !== "object") {
    return NextResponse.json({ error: "Input must be a valid object." }, { status: 400 });
  }

  const localKey = isLocalDevRequest(request) ? getLocalGroqApiKey() : undefined;
  const apiKey = localKey ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GROQ_API_KEY." }, { status: 500 });
  }

  const rawModel = typeof process.env.GROQ_MODEL === "string" ? process.env.GROQ_MODEL.trim() : "";
  const requestedModel = rawModel.length > 0 ? rawModel : "llama-3.3-70b-versatile";
  const model = mapDeprecatedGroqModel(requestedModel);

  // NASA-Grade System Prompt
  const systemPrompt = [
    "You are Tradelia Desk Analyst (internal). You must be deterministic, concise, and auditable.",
    "",
    "RULES:",
    "- Output MUST be valid JSON only (no markdown, no extra text).",
    "- Do not invent data. If an input is missing, return \"NEEDS_DATA\" with a list of required fields.",
    "- Never change the schema. Never rename keys.",
    "- Prefer numeric thresholds, discrete states, and short bullet rationales.",
    "- Provide a confidence score 0–100 and a strict \"GO/NO_GO\" decision.",
    "- Use only the provided inputs. No web browsing. No external assumptions.",
    "- Every claim must reference an input field path in \"evidence\".",
    "- If contradictions exist, set state to \"REVIEW\" and explain conflicts.",
  ].join("\n");

  // NASA-Grade User Prompt Template
  const userPrompt = [
    `TASK MODE: ${mode}`,
    "Allowed modes:",
    "- BRICK1_ONLY",
    "- BRICK2_ONLY", 
    "- BRICK1_PLUS_BRICK2",
    "",
    "You will receive a single JSON object as input named INPUT. You must return a single JSON object named OUTPUT using the schema below.",
    "",
    `INPUT: ${JSON.stringify(input)}`,
    "",
    "OUTPUT SCHEMA (must match exactly):",
    JSON.stringify({
      "meta": {
        "mode": "BRICK1_ONLY|BRICK2_ONLY|BRICK1_PLUS_BRICK2",
        "engine": { "name": "groq-analyst", "version": "1.0.0" },
        "ts": 0,
        "input_hash": "",
        "notes": ""
      },
      "status": {
        "state": "ACTIVE|REVIEW|HOLD|NEEDS_DATA",
        "go_no_go": "GO|NO_GO",
        "confidence": 0,
        "blocking_reasons": []
      },
      "brick1": {
        "market_state": {
          "regime": "TREND|RANGE|TRANSITION",
          "vol_state": "LOW|NORMAL|HIGH|EXTREME",
          "liquidity_state": "GOOD|THIN|DETERIORATING",
          "stress_flag": false,
          "timeframe_anchor": "4h",
          "risk_window_days": [0,0]
        },
        "policy": {
          "allowed_playbooks": [],
          "blocked_playbooks": [],
          "max_risk_r": 0,
          "notes": []
        },
        "evidence": []
      },
      "brick2": {
        "universe": {
          "asof_ts": 0,
          "top": [
            {
              "symbol": "",
              "category": "A_TREND_CLEAN|B_VOL_EXPANSION|C_MEAN_REVERT|D_AVOID",
              "score": 0,
              "tradability": {
                "spread_bps": 0,
                "atr_pct": 0,
                "liquidity_grade": "A|B|C|D"
              },
              "why": [],
              "evidence": []
            }
          ],
          "avoid": [
            { "symbol": "", "why": [], "evidence": [] }
          ]
        },
        "evidence": []
      },
      "brick1_plus_brick2": {
        "filtered_top": [
          {
            "symbol": "",
            "action": "FOCUS|WATCH|IGNORE",
            "playbook": "",
            "reason": [],
            "evidence": []
          }
        ],
        "evidence": []
      },
      "audit": {
        "input_coverage_pct": 0,
        "assumptions": [],
        "conflicts": [],
        "sanity_checks": [
          { "name": "", "pass": false, "detail": "" }
        ]
      }
    }, null, 2),
    "",
    "RULES:",
    "1) If mode is BRICK1_ONLY: fill brick1; set brick2 and brick1_plus_brick2 empty but valid.",
    "2) If mode is BRICK2_ONLY: fill brick2; do NOT infer macro regime; set brick1 market_state to NEEDS_DATA-like defaults and set state REVIEW if missing.",
    "3) If mode is BRICK1_PLUS_BRICK2: you must apply brick1.policy to brick2.universe to create filtered_top.",
    "4) evidence entries must be INPUT field paths (e.g., \"INPUT.market.anchor.regime4h.metrics.atr14\").",
    "5) Provide at least 6 sanity_checks: timestamp monotonicity, spread sanity, atr sanity, missing fields, contradictions, extreme volatility guard.",
  ].join("\n");

  try {
    const completion = await groqChatCompletion({
      apiKey,
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Groq response missing content." }, { status: 502 });
    }

    const parsed = safeJsonParse(content);
    if (!parsed) {
      return NextResponse.json({ 
        error: "Invalid JSON response from AI", 
        raw_content: content.substring(0, 500) 
      }, { status: 502 });
    }

    return NextResponse.json({
      keySource: localKey ? "local-file" : "env",
      requestedModel,
      model: completion.model,
      id: completion.id,
      created: completion.created,
      usage: completion.usage,
      mode,
      output: parsed,
    }, { status: 200 });

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
  const timeout = setTimeout(() => controller.abort(), 45_000); // Longer timeout for complex analysis

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
        temperature: 0.0, // NASA-grade determinism
        max_tokens: 2000,  // More tokens for structured output
        top_p: 0.1,        // Low randomness
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