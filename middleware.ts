import { NextRequest, NextResponse } from 'next/server';
import { logger } from './lib/logger';
import { recordApiRequest } from './lib/monitoring';

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const traceId = generateTraceId();
  
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
  
  // Add security headers (additional layer)
  response.headers.set('x-request-id', traceId);
  
  // Log response (in a real app, this would be done in the API route)
  const duration = Date.now() - startTime;
  
  // Record metrics for API requests
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
  ],
};