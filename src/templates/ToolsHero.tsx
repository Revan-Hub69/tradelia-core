'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/**
 * ToolsHero - Finance 2026 style hero
 * Identity + immediate access to tools (no marketing fluff)
 */
export const ToolsHero = () => {
  const t = useTranslations('Tools') as (key: string) => string;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/50 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        {/* Identity - Finance style, not marketing */}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {t('hero_title')}
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
          {t('hero_subtitle')}
        </p>

        {/* Immediate access to tools - 3 CTAs with hierarchy */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {/* Primary - Net Return (main tool) */}
          <Button asChild size="lg" className="h-12 px-6 text-base sm:h-14 sm:px-8">
            <Link href="#net-return">{t('cta_primary')}</Link>
          </Button>

          {/* Secondary - Exposure */}
          <Button asChild variant="outline" size="default" className="h-11 px-5">
            <Link href="#exposure">{t('cta_secondary')}</Link>
          </Button>

          {/* Tertiary - Flow */}
          <Button asChild variant="ghost" size="default" className="h-11 px-5 text-muted-foreground">
            <Link href="#flow">{t('cta_tertiary')}</Link>
          </Button>
        </div>

        {/* Trust - minimal, no signup friction */}
        <p className="mt-6 text-sm text-muted-foreground/80">
          {t('trust')}
        </p>
      </div>
    </section>
  );
};