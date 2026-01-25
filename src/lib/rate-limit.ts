/**
 * Rate Limiting Utility (2026)
 * 
 * Multi-layer rate limiting:
 * 1. Edge Middleware (fast, global)
 * 2. API Routes (granular, per-endpoint)
 * 3. Database (backup, persistent)
 * 
 * Based on tier-1 research: OWASP, Upstash
 */

// Simple in-memory rate limiter (fallback if Redis not available)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  limit: number; // Max requests
  window: string; // Time window (e.g., '1 m', '10 s')
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Parse time window string to milliseconds
 */
function parseWindow(window: string): number {
  const match = window.match(/^(\d+)\s*([smh])$/);
  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid window format: ${window}`);
  }
  
  const value = Number.parseInt(match[1], 10);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    default: throw new Error(`Invalid time unit: ${unit}`);
  }
}

/**
 * Rate limit a request
 * 
 * @param identifier - Unique identifier (IP, user ID, etc)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export async function rateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const windowMs = parseWindow(config.window);
  const now = Date.now();
  const resetTime = now + windowMs;
  
  // Get or create entry
  let entry = rateLimitStore.get(identifier);
  
  if (!entry || entry.resetTime < now) {
    // Create new entry
    entry = {
      count: 1,
      resetTime,
    };
    rateLimitStore.set(identifier, entry);
    
    return {
      success: true,
      remaining: config.limit - 1,
      reset: resetTime,
    };
  }
  
  // Check if limit exceeded
  if (entry.count >= config.limit) {
    return {
      success: false,
      remaining: 0,
      reset: entry.resetTime,
    };
  }
  
  // Increment count
  entry.count++;
  
  return {
    success: true,
    remaining: config.limit - entry.count,
    reset: entry.resetTime,
  };
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  // Try various headers (Vercel, Cloudflare, etc)
  const headers = request.headers;
  
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || headers.get('x-real-ip')
    || headers.get('cf-connecting-ip')
    || '127.0.0.1'
  );
}

/**
 * Rate limit presets for common use cases
 */
export const RateLimitPresets = {
  // Authentication endpoints (strict)
  auth: {
    limit: 5,
    window: '1 m', // 5 attempts per minute
  },
  
  // API endpoints (moderate)
  api: {
    limit: 60,
    window: '1 m', // 60 requests per minute
  },
  
  // Public endpoints (lenient)
  public: {
    limit: 100,
    window: '1 m', // 100 requests per minute
  },
  
  // Global (very lenient)
  global: {
    limit: 10,
    window: '10 s', // 10 requests per 10 seconds
  },
} as const;
