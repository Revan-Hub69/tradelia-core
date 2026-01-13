import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { logger } from './lib/logger';
import { recordApiRequest } from './lib/monitoring';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always'
});

/**
 * Rate limiter for auth routes
 * Limit: 5 requests per minute per IP + route + user-agent hash
 * Requirements: 2.1
 */
let ratelimit: Ratelimit | null = null;

// Initialize rate limiter only if Redis credentials are available
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    prefix: 'tradelia:ratelimit',
  });
}

/**
 * Auth routes that should be rate limited
 */
const AUTH_ROUTES = [
  '/auth/login',
  '/auth/callback',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/api/auth',
];

/**
 * Check if the current path is an auth route that should be rate limited
 */
function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Generate a hash from user-agent for rate limiting key
 */
function hashUserAgent(userAgent: string | null): string {
  if (!userAgent) return 'unknown';
  // Simple hash for user-agent
  let hash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    const char = userAgent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Apply rate limiting to auth routes
 * Returns 429 if rate limit exceeded
 */
async function applyRateLimit(request: NextRequest): Promise<NextResponse | null> {
  if (!ratelimit) {
    // Rate limiting disabled if Redis not configured
    return null;
  }

  const { pathname } = request.nextUrl;
  
  if (!isAuthRoute(pathname)) {
    return null;
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown';
  const userAgent = request.headers.get('user-agent');
  const uaHash = hashUserAgent(userAgent);
  
  // Rate limit key: IP + route + user-agent hash
  const key = `${ip}:${pathname}:${uaHash}`;
  
  const { success, limit, reset, remaining } = await ratelimit.limit(key);
  
  if (!success) {
    logger.warn('Rate limit exceeded', {
      ip,
      pathname,
      limit,
      reset,
    });
    
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }
  
  return null;
}

/**
 * Content Security Policy - Report-Only mode for monitoring
 * The actual CSP is defined in next.config.mjs headers (single source of truth)
 * This Report-Only version catches violations without blocking
 * Requirements: 3.1, 3.2
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // NO unsafe-eval - monitor violations
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "report-uri /api/security/csp-report",
].join('; ');

/**
 * Adds security headers to the response
 * CSP is in Report-Only mode for monitoring (actual CSP in next.config.mjs)
 */
function addSecurityHeaders(response: NextResponse): void {
  // CSP Report-Only for monitoring violations (REQ 3.1, 3.2)
  response.headers.set('Content-Security-Policy-Report-Only', CSP_REPORT_ONLY);
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const traceId = generateTraceId();
  const { pathname } = request.nextUrl;
  
  // Apply rate limiting to auth routes (REQ 2.1)
  const rateLimitResponse = await applyRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }
  
  // Set trace ID in logger context
  logger.setContext({ 
    traceId,
    component: 'middleware',
    action: 'request_processing'
  });
  
  // Log incoming request
  logger.info('Incoming request', {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  });

  // Skip i18n for marketing routes and static files (keep Italian-only)
  if (
    pathname === '/' || 
    pathname.startsWith('/auth') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/sw.js') ||
    pathname.startsWith('/manifest') ||
    pathname.endsWith('.webmanifest') ||
    pathname === '/dashboard' // Let dashboard redirect handle itself
  ) {
    // Add trace ID to request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-trace-id', traceId);
    
    // Create response
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    
    // Add trace ID to response headers
    response.headers.set('x-trace-id', traceId);
    response.headers.set('x-request-id', traceId);
    
    // Add security headers (CSP in Report-Only mode)
    addSecurityHeaders(response);
    
    // Record metrics and log
    const duration = Date.now() - startTime;
    
    if (request.nextUrl.pathname.startsWith('/api/')) {
      recordApiRequest(
        request.method,
        request.nextUrl.pathname,
        response.status,
        duration
      );
    }
    
    logger.performance('Request processed', startTime, {
      method: request.method,
      url: request.url,
      status: response.status
    });
    
    return response;
  }

  // Apply i18n middleware for all localized routes
  const response = intlMiddleware(request);
  
  // Add trace ID to i18n response
  response.headers.set('x-trace-id', traceId);
  response.headers.set('x-request-id', traceId);
  
  // Add security headers (CSP in Report-Only mode)
  addSecurityHeaders(response);
  
  // Log i18n request
  const _duration = Date.now() - startTime;
  logger.performance('i18n request processed', startTime, {
    method: request.method,
    url: request.url
  });
  
  return response;
}

function generateTraceId(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
  
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - manifest files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|manifest|.*\\.webmanifest).*)',
    '/',
    '/(it|en)/:path*'
  ],
};
