/**
 * i18n Request Configuration - Tradelia 2026 - MODULAR SYSTEM
 * 
 * Sistema modulare completo per tutte le traduzioni dashboard
 */

import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

async function loadMessages(locale: Locale) {
  // Carica il file principale (homepage e base)
  const mainMessages = (await import(`../../messages/${locale}.json`)).default;
  
  // Carica tutti i moduli dashboard
  const dashboardModules = {
    // Common dashboard translations
    ...((await import(`../../messages/dashboard/common.${locale}.json`)).default),
    
    // Layout and navigation
    ...((await import(`../../messages/dashboard/layout.${locale}.json`)).default),
    
    // Dashboard pages
    ...((await import(`../../messages/dashboard/pages.${locale}.json`)).default),
    
    // Journey-specific translations
    ...((await import(`../../messages/dashboard/journeys.${locale}.json`)).default),
    
    // Emergency intro (existing)
    emergencyIntro: (await import(`../../messages/dashboard/emergency-intro.${locale}.json`)).default.emergencyIntro
  };
  
  // Merge dei messaggi con priorità ai moduli dashboard
  return {
    ...mainMessages,
    ...dashboardModules
  };
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale: Locale = routing.locales.includes(locale as Locale) 
    ? (locale as Locale)
    : routing.defaultLocale;

  return {
    locale: validLocale,
    messages: await loadMessages(validLocale)
  };
});