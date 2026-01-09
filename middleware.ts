import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';
import { recordApiRequest } from './lib/monitoring';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

// Create i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always'
});

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const traceId = generateTraceId();
  const { pathname } = request.nextUrl;
  
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
  
  // Log i18n request
  const duration = Date.now() - startTime;
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
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
    '/',
    '/(it|en)/:path*'
  ],
};
