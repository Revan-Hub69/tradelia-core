/**
 * Tradelia SuperBig Dashboard - Localized Page
 * 
 * Dashboard enterprise-level seguendo i principi Tradelia 2026:
 * - Chiarezza > Persuasione
 * - Verificabilità > Opinione  
 * - Neutralità > Bias
 * 
 * Integrata con autenticazione reale, gestione profili e configurazioni
 */

import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { DashboardContent } from './DashboardContent';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return <DashboardContent />;
}