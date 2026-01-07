/**
 * i18n Request Configuration - Tradelia 2026
 */

import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale: Locale = routing.locales.includes(locale as Locale) 
    ? (locale as Locale)
    : routing.defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default as Record<string, unknown>
  };
});