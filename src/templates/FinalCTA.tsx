'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/**
 * Tradelia styled text (matching logo) - unused but kept for reference
 */
// const TradeliaText = () => (
//   <span
//     className="font-bold"
//     style={{
//       background: 'linear-gradient(45deg, #64748B 50%, #1D4ED8 50%)',
//       WebkitBackgroundClip: 'text',
//       WebkitTextFillColor: 'transparent',
//       backgroundClip: 'text',
//     }}
//   >
//     Tradelia
//   </span>
// );

export const FinalCTA = () => {
  const t = useTranslations('FinalCTA' as any) as (key: string) => string;
  
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-muted-foreground">
          {t('subtitle')}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Button asChild size="lg" className="h-12 w-full px-8 text-base sm:h-14 sm:w-auto sm:text-lg">
            <Link href="/lesson-0">{t('cta_button')}</Link>
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 12l2 2 4-4" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('trust1')}
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <circle cx="12" cy="12" r="9" className="stroke-current" strokeWidth="2" />
              <path d="M12 7v5l3 3" className="stroke-current" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {t('trust2')}
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" className="stroke-current" strokeWidth="2" strokeLinecap="round" />
              <path d="M22 4L12 14.01l-3-3" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('trust3')}
          </span>
        </div>
      </div>
    </section>
  );
};
