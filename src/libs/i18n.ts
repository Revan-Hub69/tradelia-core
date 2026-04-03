import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

import { AllLocales } from '@/utils/AppConfig';

const namespaceAliases: Record<string, string> = {
  common: 'Common',
  'dashboard-settings': 'DashboardSettings',
  contact: 'Contact',
  Challenges: 'Challenges',
  'my-challenges': 'MyChallenges',
  signals: 'Signals',
};

const loadMessageNamespaces = (locale: string) => {
  const localeDir = join(process.cwd(), 'messages', locale);

  return readdirSync(localeDir)
    .filter(file => file.endsWith('.json'))
    .reduce<Record<string, unknown>>((acc, file) => {
      const rawNamespace = file.replace(/\.json$/u, '');
      const namespace = namespaceAliases[rawNamespace] ?? rawNamespace;
      const filePath = join(localeDir, file);
      acc[namespace] = JSON.parse(readFileSync(filePath, 'utf-8'));
      return acc;
    }, {});
};

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !AllLocales.includes(locale)) {
    notFound();
  }

  return {
    locale,
    messages: {
      ...(await import(`../locales/${locale}.json`)).default,
      ...loadMessageNamespaces(locale),
    },
  };
});
