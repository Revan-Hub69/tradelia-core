/**
 * i18n Routing Configuration - Tradelia 2026
 * 
 * Configurazione routing internazionalizzazione solo per dashboard.
 * Marketing rimane Italian-only per mantenere bundle leggero.
 */

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Locales supportate (IT come default, EN come secondaria)
  locales: ['it', 'en'],
  defaultLocale: 'it',
  
  // Pathnames localizzati per dashboard
  pathnames: {
    '/dashboard': {
      it: '/dashboard',
      en: '/dashboard'
    },
    '/dashboard/settings': {
      it: '/dashboard/impostazioni',
      en: '/dashboard/settings'
    },
    '/dashboard/profile': {
      it: '/dashboard/profilo',
      en: '/dashboard/profile'
    }
  }
});

export type Locale = (typeof routing.locales)[number];