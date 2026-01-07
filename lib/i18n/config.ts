/**
 * i18n Configuration
 * Defines supported locales and default settings
 */

export const i18nConfig = {
  defaultLocale: 'it' as const,
  locales: ['it', 'en'] as const,
  localeNames: {
    it: 'Italiano',
    en: 'English'
  } as const,
  localeFlags: {
    it: '🇮🇹',
    en: '🇬🇧'
  } as const
};

export type Locale = (typeof i18nConfig.locales)[number];

export function isValidLocale(locale: string): locale is Locale {
  return i18nConfig.locales.includes(locale as Locale);
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  
  return i18nConfig.defaultLocale;
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments[0];
  
  // Remove current locale if present
  if (currentLocale && isValidLocale(currentLocale)) {
    segments.shift();
  }
  
  // Don't add locale prefix for default locale (optional)
  // if (locale === i18nConfig.defaultLocale) {
  //   return '/' + segments.join('/');
  // }
  
  return '/' + locale + (segments.length ? '/' + segments.join('/') : '');
}

// Language detection from browser
export function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') {
    return i18nConfig.defaultLocale;
  }
  
  const browserLang = navigator.language.split('-')[0];
  
  if (browserLang && isValidLocale(browserLang)) {
    return browserLang;
  }
  
  return i18nConfig.defaultLocale;
}
