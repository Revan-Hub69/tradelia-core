// lib/locale-preference.ts - Bridge Mode sync utility
export type Locale = 'it' | 'en';

/**
 * Persists locale preference to both localStorage and cookie
 * for Bridge Mode sync between marketing/auth and dashboard
 */
export function persistLocale(locale: Locale): void {
  // localStorage for marketing/auth (LanguageProvider)
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradelia-language', locale);
    }
  } catch (e) {
    console.warn('localStorage not available:', e);
  }
  
  // Cookie for dashboard (next-intl)
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax`;
  }
}

/**
 * Reads locale from cookie (SSR-safe) or localStorage (client)
 */
export function getLocale(): Locale {
  // Try cookie first (works in SSR)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/NEXT_LOCALE=(\w+)/);
    if (match && (match[1] === 'it' || match[1] === 'en')) {
      return match[1] as Locale;
    }
  }
  
  // Fallback to localStorage
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tradelia-language');
      if (saved === 'it' || saved === 'en') return saved;
    }
  } catch (_e) {
    // Ignore
  }
  
  // Browser detection fallback
  if (typeof navigator !== 'undefined') {
    return navigator.language.startsWith('en') ? 'en' : 'it';
  }
  
  return 'it';
}
