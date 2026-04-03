'use client';

import { useTranslations } from 'next-intl';

/**
 * FrameworkSection - Decision pipeline: Returns → Exposure → Flow
 * No colored icon boxes. Steps connected by directed arrows.
 */
export const FrameworkSection = () => {
  const t = useTranslations('Framework') as (key: string) => string;

  const steps = [
    {
      num: '01',
      label: t('returns_label'),
      desc: t('returns_desc'),
    },
    {
      num: '02',
      label: t('exposure_label'),
      desc: t('exposure_desc'),
    },
    {
      num: '03',
      label: t('flow_label'),
      desc: t('flow_desc'),
    },
  ];

  return (
    <section className="border-t border-border/40 py-16">
      <div className="mx-auto max-w-4xl px-4">
        {/* Section label */}
        <p className="mb-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t('eyebrow')}
        </p>
        <h2 className="mb-10 max-w-lg text-xl font-semibold tracking-tight sm:text-2xl">
          {t('title')}
        </h2>

        {/* Pipeline steps — horizontal on md+, stacked on mobile */}
        <div className="flex flex-col gap-0 md:flex-row md:items-start">
          {steps.map((step, i) => (
            <div key={step.num} className="flex md:flex-1">
              {/* Step content */}
              <div className="flex flex-col pb-10 md:pb-0 md:pr-8">
                <span className="mb-3 font-mono text-xs text-muted-foreground/40">{step.num}</span>
                <span className="mb-2 text-sm font-semibold tracking-tight">{step.label}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{step.desc}</span>
              </div>

              {/* Arrow connector (between steps, not after last) */}
              {i < steps.length - 1 && (
                <div className="hidden items-start pt-1 md:flex">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
                    <path d="M0 8 H18 M14 4 L22 8 L14 12" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * MethodologySection - Professional credibility
 * Deterministic models, no testimonials, no promises
 */
export const MethodologySection = () => {
  const t = useTranslations('Methodology') as (key: string) => string;

  return (
    <section className="border-t border-border/40 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <p className="mb-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {t('title')}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['item1', 'item2', 'item3', 'item4'].map((key) => (
            <div key={key} className="flex items-start gap-2.5">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/50" />
              <span className="text-sm leading-relaxed text-muted-foreground">{t(key)}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs italic text-muted-foreground/50">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
};
