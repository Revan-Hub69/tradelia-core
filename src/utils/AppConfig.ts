const localePrefix = 'as-needed' as const;

/**
 * Tradelia App Configuration
 *
 * ONLY ACTIVE CONFIG - Dead code removed
 */
export const AppConfig = {
  name: 'Tradelia',

  // Localization (USED)
  locales: [
    { id: 'it', name: 'Italiano' },
    { id: 'en', name: 'English' },
  ],
  defaultLocale: 'it',
  localePrefix,
};

export const AllLocales = AppConfig.locales.map(locale => locale.id);
