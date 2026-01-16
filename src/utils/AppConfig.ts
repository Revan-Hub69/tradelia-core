import type { LocalePrefix } from 'node_modules/next-intl/dist/types/src/routing/types';

const localePrefix: LocalePrefix = 'as-needed';

/**
 * Tradelia App Configuration
 * 
 * Piattaforma di educazione crypto seria.
 * Non hype, non FOMO - solo conoscenza strutturata.
 */
export const AppConfig = {
  name: 'Tradelia',
  tagline: 'Impara le crypto. Sul serio.',
  description: 'Piattaforma di educazione crypto basata su percorsi strutturati, gamification intelligente e approccio scientifico.',
  
  // Localization
  locales: [
    { id: 'it', name: 'Italiano' },
    { id: 'en', name: 'English' },
  ],
  defaultLocale: 'it',
  localePrefix,
  
  // Brand
  brand: {
    primaryColor: '#1D4ED8', // Deep Blue
    accentColor: '#059669',  // Emerald
  },
  
  // Social (da aggiornare)
  social: {
    twitter: '',
    github: '',
    discord: '',
  },
  
  // Legal
  legal: {
    companyName: 'Tradelia',
    email: 'info@tradelia.org',
  },
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);

/**
 * Learning Path Difficulty Levels
 */
export const DIFFICULTY = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export type Difficulty = typeof DIFFICULTY[keyof typeof DIFFICULTY];

/**
 * XP Thresholds per Level
 * Progressione logaritmica - più difficile salire di livello
 */
export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 3500,
  8: 5500,
  9: 8000,
  10: 12000,
};

/**
 * Level Names - Progressione educativa
 */
export const LEVEL_NAMES: Record<number, { it: string; en: string }> = {
  1: { it: 'Curioso', en: 'Curious' },
  2: { it: 'Esploratore', en: 'Explorer' },
  3: { it: 'Studente', en: 'Student' },
  4: { it: 'Praticante', en: 'Practitioner' },
  5: { it: 'Competente', en: 'Competent' },
  6: { it: 'Esperto', en: 'Expert' },
  7: { it: 'Maestro', en: 'Master' },
  8: { it: 'Mentore', en: 'Mentor' },
  9: { it: 'Saggio', en: 'Sage' },
  10: { it: 'Illuminato', en: 'Enlightened' },
};
