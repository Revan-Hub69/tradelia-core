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

  // Simplified NASA-Grade User Prompt
  const userPrompt = `TASK MODE: ${mode}

INPUT DATA: ${JSON.stringify(input)}

Analyze the input data and return ONLY a valid JSON response with this structure:

{
  "meta": {
    "mode": "${mode}",
    "engine": {"name": "groq-analyst", "version": "1.0.0"},
    "ts": ${Date.now()},
    "notes": ""
  },
  "status": {
    "state": "ACTIVE",
    "go_no_go": "GO", 
    "confidence": 85,
    "blocking_reasons": []
  },
  "brick1": ${mode.includes("BRICK1") ? `{
    "market_state": {
      "regime": "TREND",
      "vol_state": "NORMAL", 
      "liquidity_state": "GOOD",
      "stress_flag": false,
      "timeframe_anchor": "4h",
      "risk_window_days": [0, 7]
    },
    "policy": {
      "allowed_playbooks": ["trend_following"],
      "blocked_playbooks": [],
      "max_risk_r": 1.0,
      "notes": ["Market analysis complete"]
    },
    "evidence": ["INPUT.market"]
  }` : "null"},
  "brick2": ${mode.includes("BRICK2") ? `{
    "universe": {
      "asof_ts": ${Date.now()},
      "top": [
        {
          "symbol": "BTCUSDT",
          "category": "A_TREND_CLEAN",
          "score": 85,
          "tradability": {
            "spread_bps": 2.5,
            "atr_pct": 3.2,
            "liquidity_grade": "A"
          },
          "why": ["Strong trend", "Good liquidity"],
          "evidence": ["INPUT.universe"]
        }
      ],
      "avoid": []
    },
    "evidence": ["INPUT.universe"]
  }` : "null"},
  "brick1_plus_brick2": ${mode === "BRICK1_PLUS_BRICK2" ? `{
    "filtered_top": [
      {
        "symbol": "BTCUSDT", 
        "action": "FOCUS",
        "playbook": "trend_following",
        "reason": ["Regime allows trend plays"],
        "evidence": ["brick1.policy", "brick2.universe"]
      }
    ],
    "evidence": ["brick1", "brick2"]
  }` : "null"},
  "audit": {
    "input_coverage_pct": 90,
    "assumptions": ["Market data processed"],
    "conflicts": [],
    "sanity_checks": [
      {"name": "timestamp_valid", "pass": true, "detail": "OK"},
      {"name": "data_complete", "pass": true, "detail": "OK"}
    ]
  }
}

Return ONLY the JSON object. No markdown, no explanations.`;

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
    // Remove markdown code blocks if present
    let cleanValue = value.trim();
    if (cleanValue.startsWith('```json')) {
      cleanValue = cleanValue.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanValue.startsWith('```')) {
      cleanValue = cleanValue.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    return JSON.parse(cleanValue);
  } catch {
    return null;
  }
}