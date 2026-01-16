import {
  type NextRequest,
  NextResponse,
} from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { updateSession } from './libs/supabase/middleware';
import { AllLocales, AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AllLocales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const protectedRoutes = ['/dashboard', '/onboarding'];

function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(
    route => pathname.includes(route),
  );
}

export default async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Handle protected routes
  if (isProtectedRoute(pathname)) {
    if (!user) {
      // Get locale from path
      const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || AppConfig.defaultLocale;
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Handle auth pages when user is already logged in
  if (pathname.includes('/sign-in') || pathname.includes('/sign-up')) {
    if (user) {
      const locale = pathname.match(/^\/([a-z]{2})\//)?.[1] || AppConfig.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
  }

  // Apply intl middleware
  const intlResponse = intlMiddleware(request);

  // Merge cookies from supabase response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring).*)', '/', '/(api|trpc)(.*)'],
};
