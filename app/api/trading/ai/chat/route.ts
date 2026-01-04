import { NextResponse } from "next/server";

import { getLocalGroqApiKey } from "@/lib/trading/local-secrets";
import { isTradingEnabled } from "@/lib/trading/trading-enabled";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ConversationalAiRequestBody = {
  message: string;
  context?: unknown;
  conversational?: boolean;
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

  let body: ConversationalAiRequestBody;
  try {
    body = (await request.json()) as ConversationalAiRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = typeof body.message === "string" && body.message.trim().length > 0 ? body.message.trim() : undefined;
  if (!message) {
    return NextResponse.json({ error: "message is required." }, { status: 400 });
  }

  const context = body.context;
  const localKey = isLocalDevRequest(request) ? getLocalGroqApiKey() : undefined;
  const apiKey = localKey ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing GROQ_API_KEY." }, { status: 500 });
  }

  const rawModel = typeof process.env.GROQ_MODEL === "string" ? process.env.GROQ_MODEL.trim() : "";
  const requestedModel = rawModel.length > 0 ? rawModel : "llama-3.3-70b-versatile";
  const model = mapDeprecatedGroqModel(requestedModel);

  // Conversational system prompt in Italian
  const system = [
    "Sei un analista finanziario esperto specializzato in criptovalute e trading intraday.",
    "",
    "REGOLE FONDAMENTALI:",
    "- Rispondi SEMPRE e SOLO in italiano conversazionale",
    "- NON usare mai JSON, markdown, o formati strutturati",
    "- Scrivi come se stessi parlando con un trader esperto",
    "- Usa paragrafi brevi e chiari (max 3-4 righe per paragrafo)",
    "- Fornisci insights actionable e concreti",
    "- Se non hai abbastanza dati, dillo chiaramente",
    "- Mantieni un tone professionale ma accessibile",
    "",
    "COSA PUOI FARE:",
    "- Analizzare i dati di mercato forniti",
    "- Spiegare le condizioni di regime (TREND, RANGE, TRANSITION)",
    "- Commentare i livelli di stress del mercato",
    "- Valutare le opportunità long/short",
    "- Dare consigli operativi basati sui dati",
    "",
    "COSA NON PUOI FARE:",
    "- Inventare dati o prezzi non forniti",
    "- Fare previsioni specifiche sui prezzi",
    "- Dare consigli di investimento personalizzati",
    "- Calcolare indicatori tecnici non presenti nei dati",
    "",
    "STILE DI RISPOSTA:",
    "- Inizia con un'osservazione generale sulla situazione",
    "- Spiega i punti chiave in modo semplice",
    "- Concludi con considerazioni operative pratiche",
    "- Usa terminologia tecnica solo quando necessario",
  ].join("\n");

  // Prepare context information
  let contextInfo = "";
  if (context && typeof context === "object") {
    try {
      contextInfo = `\n\nDATI DI MERCATO DISPONIBILI:\n${JSON.stringify(context, null, 2)}`;
    } catch {
      contextInfo = "\n\nDati di mercato forniti ma non leggibili.";
    }
  }

  const userContent = `${message}${contextInfo}`;

  try {
    const completion = await groqChatCompletion({
      apiKey,
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userContent },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Groq response missing content." }, { status: 502 });
    }

    // Return plain text response for conversational interface
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });

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
        temperature: 0.3, // Slightly higher for more natural conversation
        max_tokens: 1000,  // More tokens for detailed explanations
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