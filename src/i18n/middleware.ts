/**
 * i18n Middleware - Tradelia 2026
 * 
 * Middleware per gestire routing internazionalizzato.
 * Solo per dashboard - marketing rimane Italian-only.
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';

export default createMiddleware({
  // A list of all locales that are supported
  locales: routing.locales,

  // Used when no locale matches
  defaultLocale: routing.defaultLocale,

  // Only internationalize dashboard routes
  pathnames: routing.pathnames,

  // Redirect to default locale for dashboard routes
  localePrefix: 'always'
});
