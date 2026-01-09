/**
 * Locale Switcher Feature Types - Tradelia 2026
 */

export type SupportedLocale = 'it' | 'en';

export interface LocaleConfig {
  supportedLocales: SupportedLocale[];
  defaultLocale: SupportedLocale;
  fallbackLocale: SupportedLocale;
  persistPreference: boolean;
}

export interface LocaleState {
  currentLocale: SupportedLocale;
  isLoading: boolean;
  error?: string;
}

export interface LocaleMetadata {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  rtl: boolean;
}