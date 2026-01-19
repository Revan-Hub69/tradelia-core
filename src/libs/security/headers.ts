/**
 * Security Headers for Enhanced Protection
 * Implements OWASP security best practices
 */

export interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'X-XSS-Protection': string;
}

/**
 * Generate security headers for different environments
 * 
 * NOTE: 'unsafe-inline' is temporarily required for Next.js inline scripts
 * TODO: Implement nonce-based CSP for enterprise security
 */
export function getSecurityHeaders(isDevelopment = false): SecurityHeaders {
  const cspDirectives = [
    "default-src 'self'",
    // TEMPORARY: 'unsafe-inline' needed for Next.js - replace with nonce in enterprise version
    "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://accounts.google.com https://api.github.com",
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    isDevelopment ? "" : "upgrade-insecure-requests",
  ].filter(Boolean).join('; ');

  return {
    'Content-Security-Policy': cspDirectives,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
    ].join(', '),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
  };
}

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(
  response: Response, 
  isDevelopment = false
): Response {
  const headers = getSecurityHeaders(isDevelopment);
  
  // Create new headers object with existing headers + security headers
  const newHeaders = new Headers(response.headers);
  
  Object.entries(headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  
  // Create new response with security headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * Create a new Response with security headers
 */
export function createSecureResponse(
  body?: BodyInit | null,
  init?: ResponseInit,
  isDevelopment = false
): Response {
  const response = new Response(body, init);
  return applySecurityHeaders(response, isDevelopment);
}