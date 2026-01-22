import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { applySecurityHeaders } from './libs/security/headers';
import { authRateLimiter, emailCheckRateLimiter, getClientIdentifier } from './libs/security/rateLimiter';
import { updateSession } from './libs/supabase/middleware';
import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default async function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Apply rate limiting for auth endpoints
  if (request.nextUrl.pathname.includes('/auth')) {
    const clientId = getClientIdentifier(request);

    // Different rate limits for different actions
    let rateLimiter = authRateLimiter;
    let action: 'email-check' | 'login' | 'signup' | 'oauth' = 'login';

    // Determine action based on request
    if (request.method === 'POST') {
      const url = request.nextUrl.pathname;
      if (url.includes('email-check')) {
        rateLimiter = emailCheckRateLimiter;
        action = 'email-check';
      } else if (url.includes('signup')) {
        action = 'signup';
      } else if (url.includes('oauth')) {
        action = 'oauth';
      }
    }

    const rateLimit = await rateLimiter.checkLimit(clientId, action);

    if (!rateLimit.allowed) {
      // Instead of returning ugly JSON, redirect to auth page with error
      const authUrl = new URL('/auth', request.url);
      authUrl.searchParams.set('error', 'rate_limit');
      authUrl.searchParams.set('resetTime', rateLimit.resetTime.toString());

      const response = Response.redirect(authUrl);
      return applySecurityHeaders(response, isDevelopment);
    }
  }

  // Handle Supabase auth
  const { user } = await updateSession(request);

  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/profile'];

  // Lesson routes that require auth (exclude lesson-0 which is free)
  const isProtectedLesson = request.nextUrl.pathname.includes('/lesson')
    && !request.nextUrl.pathname.includes('/lesson-0')
    && !request.nextUrl.pathname.includes('/lesson-demo');

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.includes(path),
  ) || isProtectedLesson;

  // If accessing protected route without auth, redirect to sign-in
  if (isProtectedPath && !user) {
    const signInUrl = new URL('/auth', request.url);
    signInUrl.searchParams.set('redirect', request.nextUrl.pathname);
    const response = Response.redirect(signInUrl);
    return applySecurityHeaders(response, isDevelopment);
  }

  // Apply internationalization
  const response = intlMiddleware(request);

  // Apply security headers to all responses
  return applySecurityHeaders(response, isDevelopment);
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico, icon.svg, manifest.json and other static assets
    // - sw.js, sw-2026.js and other service worker files
    // - monitoring (health checks)
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json|sw.js|sw-2026.js|sw-custom.js|workbox-.*\\.js|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.ico$|monitoring).*)',
    '/',
  ],
};
