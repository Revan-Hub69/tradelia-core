'use client';

import { useTranslations } from 'next-intl';
import React from 'react';

import { BackToSimulator } from '@/components/ui/BackToSimulator';
import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

/**
 * Icone inline SVG per ogni step — minimal, monocromatiche.
 * Non usiamo icone in cerchi colorati (anti-pattern 2024).
 */
const stepIcons = [
  // Step 01 — analisi / grafico
  <svg key="01" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
  // Step 02 — algoritmo / ingranaggio
  <svg key="02" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
  </svg>,
  // Step 03 — risultato / checkmark
  <svg key="03" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>,
];

const steps = [
  { num: '01', tagKey: 'step1_tag', titleKey: 'step1_title', descKey: 'step1_desc', icon: stepIcons[0] },
  { num: '02', tagKey: 'step2_tag', titleKey: 'step2_title', descKey: 'step2_desc', icon: stepIcons[1] },
  { num: '03', tagKey: 'step3_tag', titleKey: 'step3_title', descKey: 'step3_desc', icon: stepIcons[2] },
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
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/75">
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

        {/*
          GRIGLIA: sempre 3 colonne da md in su.
          - mobile: 1 colonna, gap-4
          - md (768px): 3 colonne, gap-5
          - xl+: gap-6
          StaggerChildren wrappa ogni figlio diretto — dev'essere dentro la grid.
        */}
        <StaggerChildren staggerDelay={90}>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 xl:gap-6">
            {steps.map(step => (
              <article
                key={step.num}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border/80 hover:shadow-[0_16px_48px_-24px_hsl(var(--foreground)/0.12)]"
              >
                {/* Accent bar top — thin, usa primary */}
                <span
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  aria-hidden="true"
                />

                <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
                  {/* Header: step num + icon */}
                  <div className="flex items-center justify-between">
                    {/* Tag / step label */}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-background/60 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {t(step.tagKey)}
                    </span>

                    {/* Icon — colore muted, si scurisce su hover della card */}
                    <span className="text-muted-foreground/50 transition-colors duration-200 group-hover:text-primary/70">
                      {step.icon}
                    </span>
                  </div>

                  {/* Step number — watermark discreto */}
                  <span className="pointer-events-none font-mono text-5xl font-bold leading-none tracking-tighter text-foreground/[0.04]">
                    {step.num}
                  </span>

                  {/* Content */}
                  <div className="mt-auto flex flex-col gap-3">
                    <h3
                      className="text-base font-semibold leading-snug tracking-tight sm:text-lg"
                      style={{ textWrap: 'balance' } as React.CSSProperties}
                    >
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </StaggerChildren>

        <BackToSimulator />
      </SectionContainer>
    </section>
  );
};
