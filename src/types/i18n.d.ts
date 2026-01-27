/**
 * Type definitions for next-intl translations
 *
 * This file provides type safety for translation keys across the application.
 * It supports both the legacy monolithic system (src/locales) and the new
 * modular namespace system (messages/).
 */

import 'next-intl';

import type challengesEn from '../../messages/en/Challenges.json';
import type commonEn from '../../messages/en/common.json';
import type contactEn from '../../messages/en/contact.json';
import type dashboardSettingsEn from '../../messages/en/dashboard-settings.json';
// Import actual translation files to infer types
import type enLocale from '../locales/en.json';

// Combine all message types
type Messages = typeof enLocale & {
  Challenges: typeof challengesEn;
  Common: typeof commonEn;
  Contact: typeof contactEn;
  DashboardSettings: typeof dashboardSettingsEn;
};

declare module 'next-intl' {
  type IntlMessages = {} & Messages;
}
