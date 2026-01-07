/**
 * Localized Dashboard Page - Tradelia 2026
 */

import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { LocaleSwitcher } from '@/src/features/locale-switcher/components/LocaleSwitcher';

interface DashboardPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('dashboard');
  
  return (
    <div className="space-y-6">
      {/* Header con language switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
        <LocaleSwitcher />
      </div>
      
      {/* Welcome card */}
      <div className="rounded border-2 border-border bg-background p-5 shadow-sm">
        <h2 className="text-base font-medium text-foreground mb-2">
          {t('welcome')}
        </h2>
        <p className="text-sm text-muted-foreground">
          Dashboard internazionalizzata implementata seguendo i principi Tradelia 2026.
        </p>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="rounded border border-border/50 bg-background p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Errori Comuni</div>
          <div className="text-2xl font-bold text-red-600">73%</div>
          <div className="text-xs text-muted-foreground mt-1">dei trader retail</div>
        </div>
        <div className="rounded border border-border/50 bg-background p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Rischi Attivi</div>
          <div className="text-2xl font-bold text-amber-600">3</div>
          <div className="text-xs text-muted-foreground mt-1">da monitorare</div>
        </div>
        <div className="rounded border border-border/50 bg-background p-4">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Fonti Accademiche</div>
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-xs text-muted-foreground mt-1">peer-reviewed</div>
        </div>
      </div>
    </div>
  );
}