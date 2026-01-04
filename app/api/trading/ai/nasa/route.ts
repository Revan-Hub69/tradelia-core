import { NextResponse } from "next/server";
import { z } from "zod";

import { getLocalGroqApiKey } from "@/lib/trading/local-secrets";
import { isTradingEnabled } from "@/lib/trading/trading-enabled";
import { groqChatCompletion, parseAIJson, mapGroqModel, type GroqConfig } from "@/lib/ai/groq";
import { auditInput, type AuditResult } from "@/lib/ai/audit";
import { createInputCanon, validateInputCanon } from "@/lib/ai/input-canon";
import type { InputCanon } from "@/lib/ai/input-canon";
import { SYSTEM_PROMPT, getBrick1Prompt, getBrick2Prompt, getBrick1Plus2Prompt } from "@/lib/ai/prompts";

// Evidence schema: array of strings only (NASA-grade: no z.any())
const EvidenceSchema = z.array(z.string()).optional();

// Create mode-specific schemas with strict validation
function createModeSpecificSchema(mode: string) {
  const baseSchema = z.object({
    meta: z.object({
      mode: z.string(),
      engine: z.object({
        name: z.string(),
        version: z.string()
      }),
      ts: z.number(),
      input_hash: z.string().optional(), // Will be overridden server-side
      run_id: z.string().optional() // Will be overridden server-side
    }),
    status: z.object({
      state: z.enum(["ACTIVE", "REVIEW", "HOLD", "NEEDS_DATA"]),
      go_no_go: z.enum(["GO", "NO_GO"]),
      confidence: z.number().min(0).max(100),
      blocking_reasons: z.array(z.string())
    }),
    audit: z.object({
      input_coverage_pct: z.number(),
      assumptions: z.array(z.string()),
      conflicts: z.array(z.string()),
      sanity_checks: z.array(z.object({
        name: z.string(),
        pass: z.boolean(),
        detail: z.string(),
        value: z.number().optional(),
        threshold: z.number().optional()
      })),
      input_hash: z.string().optional(), // Will be overridden server-side
      timestamp: z.number().optional() // Will be overridden server-side
    })
  });

  // Add mode-specific fields with strict evidence validation
  switch (mode) {
    case "BRICK1_ONLY":
      return baseSchema.extend({
        brick1: z.object({
          market_state: z.object({
            regime: z.string(),
            vol_state: z.string(),
            liquidity_state: z.string(),
            stress_flag: z.boolean()
          }).optional(),
          policy: z.object({
            allowed_playbooks: z.array(z.string()),
            blocked_playbooks: z.array(z.string()),
            max_risk_r: z.number(),
            notes: z.array(z.string())
          }).optional(),
          evidence: EvidenceSchema // NASA-grade: strings only
        }).optional(),
        brick2: z.any().optional(),
        brick1_plus_brick2: z.any().optional()
      });
    
    case "BRICK2_ONLY":
      return baseSchema.extend({
        brick1: z.any().optional(),
        brick2: z.object({
          universe: z.object({
            top: z.array(z.object({
              symbol: z.string(),
              category: z.string().optional(),
              score: z.number(),
              why: z.array(z.string()).optional()
            })),
            avoid: z.array(z.object({
              symbol: z.string(),
              why: z.array(z.string()).optional()
            }))
          }).optional(),
          evidence: EvidenceSchema // NASA-grade: strings only
        }).optional(),
        brick1_plus_brick2: z.any().optional()
      });
    
    case "BRICK1_PLUS_BRICK2":
      return baseSchema.extend({
        brick1: z.any().optional(),
        brick2: z.any().optional(),
        brick1_plus_brick2: z.object({
          filtered_top: z.array(z.object({
            symbol: z.string(),
            action: z.enum(["FOCUS", "WATCH", "IGNORE"]),
            playbook: z.string(),
            reason: z.union([z.array(z.string()), z.string()])
          })),
          evidence: EvidenceSchema // NASA-grade: strings only
        }).optional()
      });
    
    default:
      return baseSchema;
  }
}

type NasaAnalysisResult = z.infer<ReturnType<typeof createModeSpecificSchema>>;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type NasaAiRequestBody = {
  mode: "BRICK1_ONLY" | "BRICK2_ONLY" | "BRICK1_PLUS_BRICK2";
  input: unknown;
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
    
    // Step 4: Check if we can proceed (fail-closed)
    const failedChecks = auditResult.sanity_checks.filter(check => !check.pass);
    if (auditResult.input_coverage_pct < 70 || failedChecks.length > 0) {
      return NextResponse.json({
        error: auditResult.input_coverage_pct < 70 ? "Insufficient input coverage" : "Critical sanity checks failed",
        coverage: auditResult.input_coverage_pct,
        failed_checks: failedChecks.map(c => c.name),
        required_coverage: 70,
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

    // Step 7: Call AI with JSON mode (NASA-grade)
    const completion = await groqChatCompletion({
      config,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.0, // NASA-grade determinism
      maxTokens: 2500,
      topP: 0.1,
      responseFormat: { type: "json_object" } // Force JSON mode
    });

    const content = completion.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ 
        error: "Groq response missing content.",
        run_id: runId
      }, { status: 502 });
    }

    // Step 8: Parse and validate AI response with Zod
    const parsed = parseAIJson(content);
    if (!parsed) {
      return NextResponse.json({ 
        error: "Invalid JSON response from AI", 
        raw_content: content.substring(0, 500),
        run_id: runId
      }, { status: 502 });
    }

    // Step 9: Zod validation (NASA-grade schema enforcement)
    let result: NasaAnalysisResult;
    try {
      const schema = createModeSpecificSchema(mode);
      result = schema.parse(parsed);
    } catch (zodError) {
      console.error(`[NASA-AI] ${runId} Zod validation failed:`, zodError);
      return NextResponse.json({
        error: "AI response failed schema validation",
        validation_errors: zodError instanceof z.ZodError ? zodError.issues : "Unknown validation error",
        run_id: runId
      }, { status: 502 });
    }

    // Step 10: Override server-side metadata (NASA-grade audit trail)
    result.meta.run_id = runId;
    result.meta.input_hash = auditResult.input_hash;
    result.audit = auditResult; // Use server-calculated audit, not AI-generated

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