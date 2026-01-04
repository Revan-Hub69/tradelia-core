import { NextResponse } from "next/server";

import { getLocalGroqApiKey } from "@/lib/trading/local-secrets";
import { isTradingEnabled } from "@/lib/trading/trading-enabled";
import { groqChatCompletion, parseAIJson, mapGroqModel, type GroqConfig } from "@/lib/ai/groq";
import { auditInput, type AuditResult } from "@/lib/ai/audit";
import { createInputCanon, validateInputCanon } from "@/lib/ai/input-canon";
import type { InputCanon } from "@/lib/ai/input-canon";
import { SYSTEM_PROMPT, getBrick1Prompt, getBrick2Prompt, getBrick1Plus2Prompt } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NasaAiRequestBody = {
  mode: "BRICK1_ONLY" | "BRICK2_ONLY" | "BRICK1_PLUS_BRICK2";
  input: unknown;
};

type NasaAnalysisResult = {
  meta: {
    mode: string;
    engine: { name: string; version: string };
    ts: number;
    input_hash: string;
    run_id: string;
  };
  status: {
    state: "ACTIVE" | "REVIEW" | "HOLD" | "NEEDS_DATA";
    go_no_go: "GO" | "NO_GO";
    confidence: number;
    blocking_reasons: string[];
  };
  brick1?: any;
  brick2?: any;
  brick1_plus_brick2?: any;
  audit: AuditResult;
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
  const origin = req.headers.get("origin");
  const originOk = origin === null || origin === "" ? true : isAllowedOrigin(origin);
  const fetchSite = (req.headers.get("sec-fetch-site") ?? "").toLowerCase();
  const sameOrigin = fetchSite === "" || fetchSite === "same-origin";
  return hostOk && originOk && sameOrigin;
}

function generateRunId(): string {
  return `run_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
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

  const runId = generateRunId();

  try {
    // Step 1: Canonicalize input
    const inputCanon: InputCanon = createInputCanon(input, mode);
    
    // Step 2: Validate input
    const validationErrors = validateInputCanon(inputCanon, mode);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: "Input validation failed", 
        details: validationErrors,
        run_id: runId
      }, { status: 400 });
    }

    // Step 3: Audit input (deterministic)
    const auditResult: AuditResult = auditInput(inputCanon, mode);
    
    // Step 4: Check if we can proceed
    if (auditResult.input_coverage_pct < 70) {
      return NextResponse.json({
        error: "Insufficient input coverage",
        coverage: auditResult.input_coverage_pct,
        required: 70,
        run_id: runId,
        audit: auditResult
      }, { status: 400 });
    }

    // Step 5: Setup Groq client
    const localKey = isLocalDevRequest(request) ? getLocalGroqApiKey() : undefined;
    const apiKey = localKey ?? process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GROQ_API_KEY." }, { status: 500 });
    }

    const rawModel = typeof process.env.GROQ_MODEL === "string" ? process.env.GROQ_MODEL.trim() : "";
    const requestedModel = rawModel.length > 0 ? rawModel : "llama-3.3-70b-versatile";
    const model = mapGroqModel(requestedModel);

    const config: GroqConfig = {
      apiKey,
      model,
      baseUrl: process.env.GROQ_BASE_URL
    };

    // Step 6: Generate mode-specific prompt
    let userPrompt: string;
    switch (mode) {
      case "BRICK1_ONLY":
        userPrompt = getBrick1Prompt(inputCanon, auditResult);
        break;
      case "BRICK2_ONLY":
        userPrompt = getBrick2Prompt(inputCanon, auditResult);
        break;
      case "BRICK1_PLUS_BRICK2":
        userPrompt = getBrick1Plus2Prompt(inputCanon, auditResult);
        break;
      default:
        throw new Error("Invalid mode");
    }

    // Step 7: Call AI with JSON mode
    const completion = await groqChatCompletion({
      config,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.0, // NASA-grade determinism
      maxTokens: 2500,
      topP: 0.1
    });

    const content = completion.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ 
        error: "Groq response missing content.",
        run_id: runId
      }, { status: 502 });
    }

    // Step 8: Parse AI response
    const parsed = parseAIJson(content);
    if (!parsed) {
      return NextResponse.json({ 
        error: "Invalid JSON response from AI", 
        raw_content: content.substring(0, 500),
        run_id: runId
      }, { status: 502 });
    }

    // Step 9: Validate response structure
    const result = parsed as NasaAnalysisResult;
    if (!result.meta || !result.status || !result.audit) {
      return NextResponse.json({
        error: "Invalid response structure from AI",
        run_id: runId
      }, { status: 502 });
    }

    // Step 10: Add server-side metadata
    result.meta.run_id = runId;
    result.meta.input_hash = auditResult.input_hash;

    // Step 11: Log run (in production, save to database)
    console.log(`[NASA-AI] ${runId} ${mode} coverage=${auditResult.input_coverage_pct}% confidence=${result.status.confidence}% state=${result.status.state}`);

    return NextResponse.json({
      keySource: localKey ? "local-file" : "env",
      requestedModel,
      model: completion.model,
      id: completion.id,
      created: completion.created,
      usage: completion.usage,
      mode,
      run_id: runId,
      input_canon: inputCanon,
      output: result,
    }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    console.error(`[NASA-AI] ${runId} ERROR:`, message);
    
    return NextResponse.json({ 
      error: message,
      run_id: runId
    }, { status: 502 });
  }
}