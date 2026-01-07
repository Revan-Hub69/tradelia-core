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
    <div className="container mx-auto px-6 py-8">
      <div className="space-y-6">
        {/* Header con language switcher */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('subtitle')}
            </p>
          </div>
          <LocaleSwitcher />
        </div>
        
        <div className="rounded border-2 border-border bg-background p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            {t('welcome')}
          </h2>
          <p className="text-muted-foreground">
            Dashboard internazionalizzata implementata seguendo i principi Tradelia 2026.
            Supporta IT/EN con bundle separation per marketing/dashboard.
          </p>
        </div>
        
        {/* Placeholder per future implementazioni */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded border border-border/50 bg-background p-4">
            <h3 className="font-medium mb-2">Card 1</h3>
            <p className="text-sm text-muted-foreground">
              Contenuto della prima card
            </p>
          </div>
          <div className="rounded border border-border/50 bg-background p-4">
            <h3 className="font-medium mb-2">Card 2</h3>
            <p className="text-sm text-muted-foreground">
              Contenuto della seconda card
            </p>
          </div>
          <div className="rounded border border-border/50 bg-background p-4">
            <h3 className="font-medium mb-2">Card 3</h3>
            <p className="text-sm text-muted-foreground">
              Contenuto della terza card
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}