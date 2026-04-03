'use client';

import { useTranslations } from 'next-intl';

/**
 * FrameworkSection — Decision pipeline: Returns → Exposure → Flow
 * SOTA 2026: large watermark step numbers, visible arrows (opacity 0.6),
 * mobile vertical connector, instruments tag list, optional broker eyebrow.
 */

interface FrameworkSectionProps {
  broker?: string;
}

const INSTRUMENTS = ['ETF', 'CFD', 'Futures', 'Options', 'Turbo/KO'] as const;

export const FrameworkSection = ({ broker }: FrameworkSectionProps) => {
  const t = useTranslations('Framework') as (key: string) => string;

  const steps = [
    {
      num: '01',
      label: t('returns_label'),
      desc: t('returns_desc'),
      instruments: INSTRUMENTS,
    },
    {
      num: '02',
      label: t('exposure_label'),
      desc: t('exposure_desc'),
      instruments: INSTRUMENTS,
    },
    {
      num: '03',
      label: t('flow_label'),
      desc: t('flow_desc'),
      instruments: null,
    },
  ];

  return (
    <section id="framework" className="border-t border-border/40 py-16 md:py-20 xl:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        {/* Eyebrow */}
        <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          {t('eyebrow')}
          {broker && (
            <span className="ml-2 text-muted-foreground/80">
              · {t('optimized_for')} {broker}
            </span>
          )}
        </p>

        {/* Section title */}
        <h2 className="mb-10 max-w-lg text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
          {t('title')}
        </h2>

        {/* Pipeline — horizontal md+, stacked mobile with vertical connector */}
        <div className="relative flex flex-col gap-0 md:flex-row md:items-start">

          {/* Vertical connector line for mobile */}
          <div
            className="absolute left-4 top-8 h-[calc(100%-2rem)] w-px bg-border/30 md:hidden"
            aria-hidden="true"
          />

          {steps.map((step, i) => (
            <div key={step.num} className="flex md:flex-1">

              {/* Step content */}
              <div className="relative flex flex-col pb-12 pl-10 md:pb-0 md:pl-0 md:pr-8">

                {/* Large watermark number */}
                <span
                  className="pointer-events-none absolute -top-2 left-8 select-none font-mono text-6xl font-bold leading-none text-foreground/[0.04] md:left-0"
                  aria-hidden="true"
                >
                  {step.num}
                </span>

                {/* Mobile dot connector */}
                <span
                  className="absolute left-[calc(1rem-3px)] top-1.5 size-1.5 rounded-full bg-primary/50 md:hidden"
                  aria-hidden="true"
                />

                {/* Step number label */}
                <span className="mb-2 font-mono text-xs text-muted-foreground/40">{step.num}</span>

                {/* Step label */}
                <span className="mb-2 text-sm font-semibold tracking-tight sm:text-base">
                  {step.label}
                </span>

                {/* Step description */}
                <span className="mb-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {step.desc}
                </span>

                {/* Instruments covered */}
                {step.instruments && (
                  <div className="flex flex-wrap gap-1.5">
                    {step.instruments.map((ins) => (
                      <span
                        key={ins}
                        className="rounded-full border border-border/40 px-2 py-0.5 font-mono text-[10px] text-muted-foreground/60"
                      >
                        {ins}
                      </span>
                    ))}
                  </div>
                )}

                {/* Flow signals label for step 3 */}
                {!step.instruments && (
                  <span className="font-mono text-[10px] text-muted-foreground/40">
                    {t('flow_signals_label')}
                  </span>
                )}
              </div>

              {/* Arrow connector — desktop only, visible */}
              {i < steps.length - 1 && (
                <div className="hidden items-start pt-8 md:flex" aria-hidden="true">
                  <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                    <path
                      d="M0 8 H20 M16 3 L25 8 L16 13"
                      stroke="currentColor"
                      strokeOpacity="0.55"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
 * MethodologySection — credibility block
 * Pill/tag layout instead of plain list.
 */
export const MethodologySection = () => {
  const t = useTranslations('Methodology') as (key: string) => string;

  const items = ['item1', 'item2', 'item3', 'item4'];

  return (
    <section className="border-t border-border/40 py-12 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">

        <p className="mb-5 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
          {t('title')}
        </p>

        {/* Pill grid */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {items.map((key) => (
            <span
              key={key}
              className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground sm:text-sm"
            >
              <span className="size-1 shrink-0 rounded-full bg-primary/50" aria-hidden="true" />
              {t(key)}
            </span>
          ))}
        </div>

        {/* Data sources line */}
        <p className="mt-5 text-xs text-muted-foreground/50">
          {t('data_sources')}
        </p>

        <p className="mt-3 text-xs italic text-muted-foreground/40">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
};
