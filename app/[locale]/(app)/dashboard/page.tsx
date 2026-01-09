/**
 * Tradelia Dashboard Home - Localized Page
 * 
 * Hub centrale dei 4 journey seguendo i principi Tradelia 2026:
 * - Chiarezza > Persuasione
 * - Verificabilità > Opinione  
 * - Neutralità > Bias
 */

import { setRequestLocale } from 'next-intl/server';
import { DashboardHome } from './DashboardHome';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  return <DashboardHome />;
}