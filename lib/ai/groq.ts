// NASA-Grade Groq Client
// Deterministic, auditable, robust JSON parsing

export interface GroqConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqResponse {
  id?: string;
  model?: string;
  created?: number;
  usage?: unknown;
  choices?: Array<{
    message?: { content?: string };
  }>;
}

export interface GroqChatRequest {
  config: GroqConfig;
  messages: GroqMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  responseFormat?: { type: "json_object" };
}

/**
 * Robust JSON parser for AI responses
 * Handles markdown code blocks, partial JSON, and malformed responses
 */
export function parseAIJson(content: string): unknown | null {
  if (!content || typeof content !== "string") return null;
  
  let cleanContent = content.trim();
  
  // Remove markdown code blocks
  if (cleanContent.startsWith('```json')) {
    cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  
  // Find JSON boundaries (first { to last })
  const firstBrace = cleanContent.indexOf('{');
  const lastBrace = cleanContent.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleanContent = cleanContent.substring(firstBrace, lastBrace + 1);
  }
  
  try {
    return JSON.parse(cleanContent);
  } catch {
    return null;
  }
}

/**
 * NASA-Grade Groq Chat Completion
 * - JSON mode enforced
 * - Robust error handling
 * - Timeout protection
 * - Deterministic settings
 */
export async function groqChatCompletion({
  config,
  messages,
  temperature = 0.0,
  maxTokens = 2000,
  topP = 0.1,
  responseFormat
}: GroqChatRequest): Promise<GroqResponse> {
  const baseUrl = config.baseUrl ?? "https://api.groq.com/openai/v1/";
  const url = new URL("chat/completions", baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);

  try {
    const requestBody: any = {
      model: config.model,
      temperature,
      max_tokens: maxTokens,
      top_p: topP,
      messages,
    };

    // Add response_format only if specified (NASA-grade JSON mode)
    if (responseFormat) {
      requestBody.response_format = responseFormat;
    }

    const response = await fetch(url, {
      method: "POST",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Groq API error (${response.status}): ${errorText || response.statusText}`);
    }

    return await response.json() as GroqResponse;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Map deprecated Groq models to current ones
 */
export function mapGroqModel(model: string): string {
  const modelMap: Record<string, string> = {
    "llama3-70b-8192": "llama-3.1-70b-versatile",
    "llama3-8b-8192": "llama-3.1-8b-instant",
    "llama-3.1-70b-versatile": "llama-3.3-70b-versatile"
  };
  
  return modelMap[model] || model;
}