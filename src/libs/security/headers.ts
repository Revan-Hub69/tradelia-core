/**
 * Security Headers for Enhanced Protection
 * Implements OWASP security best practices + domain-based CSP (2026)
 *
 * NOTE: Nonce-based CSP removed due to Next.js 15 incompatibility.
 * See: docs/research/CSP_NONCE_NEXTJS15_TIER1_2026.md
 *
 * Reasoning:
 * - 'unsafe-inline' is IGNORED when nonce is present (CSP Level 3 spec)
 * - Next.js dynamic chunks don't inherit nonces (framework limitation)
 * - Framer Motion inline styles blocked (no nonce support for style attributes)
 * - Production app was completely broken (scripts not loading)
 *
 * Current approach: Domain-based CSP with 'unsafe-inline'
 * Future plan: Migrate to hash-based SRI when Next.js experimental feature is production-ready
 */

export type SecurityHeaders = {
  'Content-Security-Policy': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
};

/**
 * Generate security headers with domain-based CSP (2026)
 *
 * Based on tier-1 research (10+ authoritative sources):
 * - Next.js official docs (CSP guide)
 * - OWASP security best practices
 * - Google CSP strict-dynamic documentation
 * - Production implementation guides
 *
 * Security layers:
 * ✅ Domain restrictions (only trusted CDNs)
 * ✅ HTTPS enforcement
 * ✅ X-Frame-Options (clickjacking protection)
 * ✅ X-Content-Type-Options (MIME sniffing protection)
 * ✅ Strict-Transport-Security (HSTS)
 * ✅ Input validation (Zod schemas)
 * ✅ Rate limiting
 * ✅ Supabase RLS
 *
 * Trade-off: 'unsafe-inline' allows inline scripts (acceptable with input validation + RLS)
 */
export function getSecurityHeaders(isDevelopment = false): SecurityHeaders {
  // Domain-based CSP with 'unsafe-inline' (works with Next.js 15)
  const cspDirectives = [
    'default-src \'self\'',
    // Script CSP: 'unsafe-inline' + domain restrictions
    // Note: 'unsafe-eval' only in development (required for HMR)
    `script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com https://vercel.live ${isDevelopment ? '\'unsafe-eval\'' : ''}`,
    // Style CSP: 'unsafe-inline' for Framer Motion and other CSS-in-JS
    'style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com',
    // Font sources
    'font-src \'self\' data: https://fonts.gstatic.com',
    // Image sources (allow data URIs, HTTPS, and blobs for dynamic images)
    'img-src \'self\' data: https: blob:',
    // Connection sources (API calls, WebSockets, analytics)
    'connect-src \'self\' https://*.supabase.co https://accounts.google.com https://api.github.com https://vitals.vercel-insights.com',
    // Frame sources (OAuth, embeds)
    'frame-src \'self\' https://accounts.google.com',
    // Disable object/embed/applet
    'object-src \'none\'',
    // Restrict base tag
    'base-uri \'self\'',
    // Restrict form submissions
    'form-action \'self\'',
    // Prevent framing (defense in depth with X-Frame-Options)
    'frame-ancestors \'none\'',
    // Upgrade HTTP to HTTPS (production only)
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

  return headers;
}

/**
 * Apply security headers to a Response
 */
export function applySecurityHeaders(
  response: Response,
  isDevelopment = false,
): Response {
  const headers = getSecurityHeaders(isDevelopment);

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
): Response {
  const response = new Response(body, init);
  return applySecurityHeaders(response, isDevelopment);
}
