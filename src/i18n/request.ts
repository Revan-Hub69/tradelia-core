/**
 * i18n Request Configuration - Tradelia 2026
 * 
 * Configurazione per next-intl request handling con supporto modulare
 */

import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

async function loadMessages(locale: Locale) {
  // Carica il file principale
  const mainMessages = (await import(`../../messages/${locale}.json`)).default;
  
  // Carica i moduli dashboard
  const dashboardModules = {
    emergencyIntro: (await import(`../../messages/dashboard/emergency-intro.${locale}.json`)).default.emergencyIntro
  };
  
  // Merge dei messaggi
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