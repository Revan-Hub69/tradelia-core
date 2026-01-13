/**
 * Localized App Layout - Tradelia 2026
 * 
 * Layout UNICO per dashboard internazionalizzata.
 * Include: Sidebar (desktop) + BottomNav (mobile) + Header + Performance Monitoring
 * 
 * IMPORTANT: This layout includes <html> and <body> tags to properly set lang attribute
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { QueryProvider } from '@/src/shared/providers/QueryProvider';
import { ThemeProvider } from '@/shared/config/theme-provider';
import { PWAProvider } from '@/components/PWAProvider';
import { DashboardAuthProvider } from '@/src/processes/dashboard-auth';
import { DashboardModalProvider } from '@/contexts/DashboardModalContext';
import { ToastProvider } from '@/src/shared/ui';
import AuthModal from '@/components/AuthModal';
import { PerformanceMonitor } from '@/src/shared/components/PerformanceMonitor';
import { SkipLink } from '@/components/SkipLink';
import { routing, type Locale } from '@/src/i18n/routing';
import '@/app/globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

// Generate static params for supported locales
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Generate metadata for each locale
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isItalian = locale === 'it';
  
  return {
    title: isItalian 
      ? 'Tradelia Dashboard - Strumenti di Trading Verificati'
      : 'Tradelia Dashboard - Verified Trading Tools',
    description: isItalian
      ? 'Dashboard dinamica che evita gli errori nel mondo crypto. Verifica la coerenza dei tuoi strumenti di trading.'
      : 'Dynamic dashboard that prevents errors in the crypto world. Verify the consistency of your trading tools.',
    alternates: {
      languages: {
        'it': '/it/dashboard',
        'en': '/en/dashboard',
        'x-default': '/it/dashboard'
      }
    },
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    }
  };
}

interface LocalizedAppLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocalizedAppLayout({
  children,
  params
}: LocalizedAppLayoutProps) {
  const { locale: rawLocale } = await params;
  
  // Validate locale
  const locale: Locale = routing.locales.includes(rawLocale as Locale) 
    ? (rawLocale as Locale)
    : routing.defaultLocale;

  // Load messages for the locale
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} dir="ltr" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen bg-background text-foreground`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <ThemeProvider>
              <PWAProvider>
                <DashboardModalProvider>
                  <ToastProvider>
                    <DashboardAuthProvider locale={locale}>
                      <SkipLink />
                      <div className="min-h-screen bg-background">
                        {children}
                      </div>
                      <AuthModal />
                      <PerformanceMonitor />
                      <SpeedInsights />
                    </DashboardAuthProvider>
                  </ToastProvider>
                </DashboardModalProvider>
              </PWAProvider>
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}