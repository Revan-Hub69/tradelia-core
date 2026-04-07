import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { ThemeProvider } from 'next-themes';

import { AllLocales } from '@/utils/AppConfig';
import { CookieBanner } from '@/components/CookieBanner';

export function generateStaticParams() {
  return AllLocales.map(locale => ({ locale }));
}

/**
 * Locale Layout - ONLY providers + global overlays, NO html/head/body
 *
 * This is a nested layout that provides i18n context.
 * The root layout (src/app/layout.tsx) handles html/head/body.
 */
export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  unstable_setRequestLocale(params.locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <ThemeProvider>
        {props.children}
        {/* Cookie consent banner — rendered client-side, shows only on first visit */}
        <CookieBanner />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
