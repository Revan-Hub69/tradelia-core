import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { applySecurityHeaders } from './lib/security/headers';
import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

export default async function middleware(request: NextRequest) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  const response = intlMiddleware(request);

  return applySecurityHeaders(response, isDevelopment);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|icon.svg|manifest.json|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.ico$|monitoring).*)',
    '/',
  ],
};
