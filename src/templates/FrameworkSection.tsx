'use client';

import { useTranslations } from 'next-intl';

/**
 * FrameworkSection - Shows the mental model: Returns → Exposure → Flow
 * This elevates the product from "tool directory" to "analytical system"
 */
export const FrameworkSection = () => {
  const t = useTranslations('Framework') as (key: string) => string;

  return (
    <section className="border-t border-border/40 bg-gradient-to-b from-background to-background/50 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        {/* Flow visualization - returns to flow */}
        <div className="mt-8 flex items-center justify-center gap-4 sm:gap-8">
          {/* Returns */}
          <div className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
              </svg>
            </div>
            <span className="mt-3 text-sm font-medium text-muted-foreground">
              {t('returns_label')}
            </span>
          </div>

          {/* Arrow 1 */}
          <div className="text-muted-foreground/40">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>

          {/* Exposure */}
          <div className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.5M10.5 2.25H18a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V5.25m18 0A2.25 2.25 0 0018 3.75H5.25A2.25 2.25 0 003 5.25m18 0c.082.467.325.917.713 1.285a2.25 2.25 0 01.35 1.523V10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 10.5v1.295a2.25 2.25 0 01.35-1.523C3.175 9.917 3.082 9.467 3 9" />
              </svg>
            </div>
            <span className="mt-3 text-sm font-medium text-muted-foreground">
              {t('exposure_label')}
            </span>
          </div>

          {/* Arrow 2 */}
          <div className="text-muted-foreground/40">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>

          {/* Flow */}
          <div className="flex flex-col items-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <span className="mt-3 text-sm font-medium text-muted-foreground">
              {t('flow_label')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * MethodologySection - Shows professional credibility
 * No testimonials, just methodology (finance 2026 style)
 */
export const MethodologySection = () => {
  const t = useTranslations('Methodology') as (key: string) => string;

  return (
    <section className="border-t border-border/40 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-6">
          {t('title')}
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {/* Item 1 */}
          <div className="flex items-start gap-3">
            <div className="mt-1 size-1.5 rounded-full bg-primary/40 shrink-0" />
            <span className="text-sm text-muted-foreground/80">{t('item1')}</span>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3">
            <div className="mt-1 size-1.5 rounded-full bg-primary/40 shrink-0" />
            <span className="text-sm text-muted-foreground/80">{t('item2')}</span>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3">
            <div className="mt-1 size-1.5 rounded-full bg-primary/40 shrink-0" />
            <span className="text-sm text-muted-foreground/80">{t('item3')}</span>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-muted-foreground/60 italic">
          {t('disclaimer')}
        </p>
      </div>
    </section>
  );
};