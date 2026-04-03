'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/scroll-animations';

/**
 * SocialProof — Differentiation through comparison
 * SOTA 2026: replaces the 6-pillar multi-color grid (AI anti-pattern) with:
 *   1. A "Most tools vs Tradelia" comparison table — 2 columns, 3 rows
 *   2. A single quantitative stat block for credibility
 *   3. A clean CTA — no testimonial cards, no star ratings
 * All colors: primary only + neutrals. Zero extra hues.
 */
export const SocialProof = () => {
  const t = useTranslations('SocialProof') as (key: string) => string;

  const rows = [
    { dimension: t('row1_dim'), others: t('row1_others'), tradelia: t('row1_tradelia') },
    { dimension: t('row2_dim'), others: t('row2_others'), tradelia: t('row2_tradelia') },
    { dimension: t('row3_dim'), others: t('row3_others'), tradelia: t('row3_tradelia') },
  ];

  return (
    <section
      id="signals"
      className="border-t border-border/40 px-4 py-16 sm:px-6 md:py-20 xl:py-24"
    >
      <div className="mx-auto max-w-4xl">

        {/* Eyebrow */}
        <FadeIn>
          <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60">
            {t('eyebrow')}
          </p>
          <h2 className="mb-10 max-w-lg text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
            {t('section_title')}
          </h2>
        </FadeIn>

        {/* Comparison table */}
        <FadeIn delay={100}>
          <div className="overflow-x-auto rounded-lg border border-border/40">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    {t('col_dimension')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    {t('col_others')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-primary/80">
                    {t('col_tradelia')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row.dimension}
                    className={`border-b border-border/25 ${
                      i === rows.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-4 py-4 text-xs font-medium text-muted-foreground/70 sm:text-sm">
                      {row.dimension}
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground/50 sm:text-sm">
                      {row.others}
                    </td>
                    <td className="px-4 py-4 text-xs font-semibold text-foreground sm:text-sm">
                      {row.tradelia}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        {/* Quantitative stat */}
        <FadeIn delay={200}>
          <div className="mt-10 border-l-0 border-t border-border/30 pt-8">
            <p className="mb-1 font-mono text-xs text-muted-foreground/50">
              {t('stat_label')}
            </p>
            <p className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('stat_value')}
            </p>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {t('stat_desc')}
            </p>
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={300}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/tool">{t('cta_primary')}</Link>
            </Button>
            <Button asChild variant="outline" size="default" className="h-11 px-5 text-sm">
              <Link href="#faq">{t('cta_secondary')}</Link>
            </Button>
          </div>
        </FadeIn>

      </div>
    </section>
  );
};
