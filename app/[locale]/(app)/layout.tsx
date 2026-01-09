/**
 * Localized App Layout - Tradelia 2026
 * 
 * Layout per dashboard internazionalizzata.
 * Marketing rimane Italian-only per bundle leggero.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { QueryProvider } from '@/src/shared/providers/QueryProvider';
import { ThemeProvider } from '@/shared/config/theme-provider';
import { PWAProvider } from '@/components/PWAProvider';
import { DashboardAuthProvider } from '@/src/processes/dashboard-auth';
import { DashboardModalProvider } from '@/contexts/DashboardModalContext';
import AuthModal from '@/components/AuthModal';
import { routing, type Locale } from '@/src/i18n/routing';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

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
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <ThemeProvider>
          <PWAProvider>
            <DashboardModalProvider>
              <DashboardAuthProvider locale={locale}>
                <div className="min-h-screen bg-background antialiased text-foreground font-sans">
                  {children}
                </div>
                <AuthModal />
              </DashboardAuthProvider>
            </DashboardModalProvider>
          </PWAProvider>
        </ThemeProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}