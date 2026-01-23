import '@/styles/global.css';

import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

import { ProductionHydrationLogger } from '@/components/debug/ProductionHydrationLogger';
import { AllLocales } from '@/utils/AppConfig';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export function generateStaticParams() {
  return AllLocales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  unstable_setRequestLocale(params.locale);

  // Using internationalization in Server Components
  const messages = await getMessages();

  // The `suppressHydrationWarning` in <html> is used to prevent hydration errors caused by `next-themes`.
  // Solution provided by the package itself: https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app

  // The `suppressHydrationWarning` attribute in <body> is used to prevent hydration errors caused by Sentry Overlay,
  // which dynamically adds a `style` attribute to the body tag.
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        {/* CRITICAL CSS: Inline header button styles to prevent FOUC */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent any animations/transitions until page is ready */
            .header-icon, .glass-button {
              transition: none !important;
              animation: none !important;
            }
            
            /* Dark mode glass button styles (inline for immediate application) */
            .dark .glass-button {
              background-color: rgba(15, 23, 42, 0.6) !important;
              border: 1px solid rgba(255, 255, 255, 0.1) !important;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 1px 4px rgba(0, 0, 0, 0.1) !important;
              backdrop-filter: blur(12px) saturate(180%) !important;
              -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
            }
            
            /* Light mode glass button styles */
            .glass-button {
              background-color: rgba(255, 255, 255, 0.6) !important;
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05) !important;
              backdrop-filter: blur(12px) saturate(180%) !important;
              -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
            }
          `
        }} />
      </head>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        {/* Production Hydration Logger - Only active in production */}
        {process.env.NODE_ENV === 'production' && <ProductionHydrationLogger />}
        
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 layer-modal focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
        >
          Skip to main content
        </a>

        {/* PRO: Dark mode support for Shadcn UI */}
        <NextIntlClientProvider
          locale={params.locale}
          messages={messages}
        >
          {props.children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
