'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { FadeIn } from '@/components/ui/scroll-animations';

export const BenefitsOverview = () => {
  const t = useTranslations('BenefitsOverview') as (key: string) => string;

  return (
    <section
      id="why"
      className="border-t border-border/40 px-4 py-16 sm:px-6 md:py-20 xl:py-24"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' } as React.CSSProperties}
    >
      <div className="mx-auto max-w-4xl">

        <FadeIn>
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            {t('eyebrow')}
          </p>
          <h2
            className="mb-10 max-w-lg text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {t('section_title')}
          </h2>
        </FadeIn>

        <div className="grid gap-px border border-border/30 bg-border/30 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">

          <FadeIn className="bg-background p-8 sm:col-span-2 lg:col-span-1">
            <p className="mb-2 font-mono text-xs text-muted-foreground/50">
              {t('primary_label')}
            </p>
            <p className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t('primary_stat')}
            </p>
            <p className="mb-3 text-base font-semibold">
              {t('primary_title')}
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('primary_desc')}
            </p>
          </FadeIn>

          <FadeIn delay={100} className="bg-background p-6 sm:p-8">
            <p className="mb-1 font-mono text-xs text-muted-foreground/50">
              {t('b2_label')}
            </p>
            <p className="mb-3 text-2xl font-bold tracking-tight">
              {t('b2_stat')}
            </p>
            <p className="mb-2 text-sm font-semibold">
              {t('b2_title')}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t('b2_desc')}
            </p>
          </FadeIn>

          <FadeIn delay={200} className="bg-background p-6 sm:p-8">
            <p className="mb-1 font-mono text-xs text-muted-foreground/50">
              {t('b3_label')}
            </p>
            <p className="mb-3 text-2xl font-bold tracking-tight">
              {t('b3_stat')}
            </p>
            <p className="mb-2 text-sm font-semibold">
              {t('b3_title')}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {t('b3_desc')}
            </p>
          </FadeIn>

        </div>

        <FadeIn delay={300}>
          <p className="mt-8 text-sm font-medium text-muted-foreground/70">
            {t('contrast_line')}
          </p>
        </FadeIn>

      </div>
    </section>
  );
};
