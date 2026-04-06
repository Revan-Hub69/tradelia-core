'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

const steps = [
  { num: '01', tagKey: 'step1_tag', titleKey: 'step1_title', descKey: 'step1_desc' },
  { num: '02', tagKey: 'step2_tag', titleKey: 'step2_title', descKey: 'step2_desc' },
  { num: '03', tagKey: 'step3_tag', titleKey: 'step3_title', descKey: 'step3_desc' },
];

export const HowItWorks = () => {
  const t = useTranslations('HowItWorks') as (key: string) => string;

  return (
    <section
      id="how-it-works"
      className="scroll-mt-32 border-t border-border/40 py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 600px' } as React.CSSProperties}
    >
      <SectionContainer size="wide">
        <FadeIn>
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
            {t('eyebrow')}
          </p>
          <h2
            className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {t('title')}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
            {t('intro')}
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-6">
          <StaggerChildren staggerDelay={90}>
            {steps.map(step => (
              <div
                key={step.num}
                className="relative overflow-hidden rounded-[28px] border border-border/60 bg-card p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.38)] sm:p-7 xl:p-8 transition-shadow duration-300 hover:shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)]"
              >
                <span className="pointer-events-none absolute right-5 top-1 font-mono text-7xl font-semibold text-foreground/[0.05]">
                  {step.num}
                </span>

                <span className="inline-flex rounded-full border border-border/60 bg-background px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t(step.tagKey)}
                </span>

                <h3
                  className="mt-5 max-w-64 text-xl font-semibold leading-snug tracking-tight"
                  style={{ textWrap: 'balance' } as React.CSSProperties}
                >
                  {t(step.titleKey)}
                </h3>

                <p className="mt-4 max-w-72 text-sm leading-7 text-muted-foreground">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </SectionContainer>
    </section>
  );
};
