/**
 * API Rate Limiting Middleware (2026)
 * 
 * Wraps API routes with rate limiting protection
 * Based on tier-1 research: OWASP, Next.js best practices
 */

import { NextResponse } from 'next/server';

import { getClientIp, rateLimit, RateLimitPresets } from './rate-limit';

export type ApiHandler = (request: Request) => Promise<Response>;

export interface RateLimitOptions {
  limit?: number;
  window?: string;
  identifier?: (request: Request) => string;
}

/**
 * Wrap API route with rate limiting
 * 
 * @example
 * ```typescript
 * export const POST = withRateLimit(
 *   async (request) => {
 *     // Your API logic
 *     return Response.json({ success: true });
 *   },
 *   { limit: 10, window: '1 m' }
 * );
 * ```
 */
export function withRateLimit(
  handler: ApiHandler,
  options: RateLimitOptions = {},
): ApiHandler {
  return async (request: Request) => {
    // Get identifier (IP by default, or custom)
    const identifier = options.identifier
      ? options.identifier(request)
      : getClientIp(request);
    
    // Apply rate limit
    const result = await rateLimit(identifier, {
      limit: options.limit || RateLimitPresets.api.limit,
      window: options.window || RateLimitPresets.api.window,
    });
    
    // If rate limit exceeded, return 429
    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Please try again later',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(options.limit || RateLimitPresets.api.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
            'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
          },
        },
      );
    }
    
    // Call handler
    const response = await handler(request);
    
    // Add rate limit headers to response
    const headers = new Headers(response.headers);
    headers.set('X-RateLimit-Limit', String(options.limit || RateLimitPresets.api.limit));
    headers.set('X-RateLimit-Remaining', String(result.remaining));
    headers.set('X-RateLimit-Reset', String(result.reset));
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  };
}

/**
 * Preset rate limiters for common use cases
 */
export const withAuthRateLimit = (handler: ApiHandler) =>
  withRateLimit(handler, RateLimitPresets.auth);

export const withApiRateLimit = (handler: ApiHandler) =>
  withRateLimit(handler, RateLimitPresets.api);

export const withPublicRateLimit = (handler: ApiHandler) =>
  withRateLimit(handler, RateLimitPresets.public);
