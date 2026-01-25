/**
 * Security Headers for Enhanced Protection
 * Implements OWASP security best practices + CSP with nonces (2026)
 */

export type SecurityHeaders = {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
  'X-Nonce'?: string;
};

/**
 * Generate security headers with CSP nonces (2026)
 * 
 * Based on tier-1 research:
 * - Next.js official docs (CSP guide)
 * - OWASP security best practices
 * - XSS protection via nonces
 */
export function getSecurityHeaders(isDevelopment = false, nonce?: string): SecurityHeaders {
  // CSP with nonces for XSS protection
  const cspDirectives = [
    'default-src \'self\'',
    // Script CSP with nonce (2026 best practice)
    nonce
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://accounts.google.com https://apis.google.com ${isDevelopment ? '\'unsafe-eval\'' : ''}`
      : `script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com ${isDevelopment ? '\'unsafe-eval\'' : ''}`,
    // Style CSP with nonce
    nonce
      ? `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`
      : 'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
    'font-src \'self\' data: https://fonts.gstatic.com',
    'img-src \'self\' data: https: blob:',
    'connect-src \'self\' https://*.supabase.co https://accounts.google.com https://api.github.com https://vitals.vercel-insights.com',
    'frame-src \'self\' https://accounts.google.com',
    'object-src \'none\'',
    'base-uri \'self\'',
    'form-action \'self\'',
    'frame-ancestors \'none\'',
    isDevelopment ? '' : 'upgrade-insecure-requests',
  ].filter(Boolean).join('; ');

  const headers: SecurityHeaders = {
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
  };

  // Add nonce header for Next.js to extract
  if (nonce) {
    headers['X-Nonce'] = nonce;
  }

  return headers;
}

/**
 * Apply security headers to a Response (with optional nonce)
 */
export function applySecurityHeaders(
  response: Response,
  isDevelopment = false,
  nonce?: string,
): Response {
  const headers = getSecurityHeaders(isDevelopment, nonce);

  // Create new headers object with existing headers + security headers
  const newHeaders = new Headers(response.headers);

  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      newHeaders.set(key, value);
    }
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
  isDevelopment = false,
  nonce?: string,
): Response {
  const response = new Response(body, init);
  return applySecurityHeaders(response, isDevelopment, nonce);
}
