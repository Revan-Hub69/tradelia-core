import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { AllLocales } from '@/utils/AppConfig';

// Using internationalization in Server Components
export default getRequestConfig(async ({ requestLocale }) => {
  // This is the new API that replaces the deprecated `locale` parameter
  const locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !AllLocales.includes(locale)) {
    notFound();
  }

  // Load main messages (includes Dashboard, Learning, etc.)
  const mainMessages = (await import(`../locales/${locale}.json`)).default;
  
  // Load additional namespace messages
  const commonMessages = (await import(`../../messages/${locale}/common.json`)).default;
  const dashboardSettingsMessages = (await import(`../../messages/${locale}/dashboard-settings.json`)).default;
  const contactMessages = (await import(`../../messages/${locale}/contact.json`)).default;

  return {
    locale,
    messages: {
      ...mainMessages,
      Common: commonMessages,
      DashboardSettings: dashboardSettingsMessages,
      Contact: contactMessages,
    },
  };
});
