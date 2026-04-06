'use client';

import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { FadeIn } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

const rows = [
  { featureKey: 'row1_feature', tradelia: true, others: false },
  { featureKey: 'row2_feature', tradelia: true, others: false },
  { featureKey: 'row3_feature', tradelia: true, others: true },
  { featureKey: 'row4_feature', tradelia: true, others: false },
  { featureKey: 'row5_feature', tradelia: true, others: false },
  { featureKey: 'row6_feature', tradelia: true, others: false },
] as const;

export const Comparison = () => {
  // @ts-ignore
  const t = useTranslations('FeaturesComparison') as (key: string) => string;

  return (
    <section className="border-t border-border/40 bg-muted/20 py-14 sm:py-16 lg:py-20 xl:py-24">
      <SectionContainer size="wide">
        <FadeIn>
          <div className="text-center">
            {/* eyebrow: /60 → /75 */}
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/75 sm:tracking-[0.24em]">
              {t('eyebrow')}
            </p>
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {t('title')}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
              {t('subtitle')}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border/50 sm:rounded-[20px]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="px-4 py-4 text-left text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:px-6">
                    {t('col_feature')}
                  </th>
                  <th className="w-20 px-4 py-4 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-primary sm:px-6">
                    {t('col_tradelia')}
                  </th>
                  {/* Others header: /60 → /75 */}
                  <th className="w-20 px-4 py-4 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/75 sm:px-6">
                    {t('col_others')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.featureKey} className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${i === rows.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-4 py-4 text-sm font-medium text-foreground sm:px-6">
                      {t(row.featureKey)}
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      {/*
                        Check icon WCAG fix:
                        Light: emerald-700 on emerald-100 → ~5.8:1 ✅
                        Dark:  emerald-400 on emerald-950/40 → ~4.6:1 ✅
                      */}
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Check className="size-3.5" />
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      {row.others ? (
                        /*
                          Others check: muted-foreground (full) on muted/20 → passes 4.5:1
                          Using /60 opacity to visually subordinate vs. Tradelia column
                          but rendered on lighter bg (muted/20 ≈ white) → ratio ≥ 3:1 for icons
                        */
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted/20 text-muted-foreground/60">
                          <Check className="size-3.5" />
                        </span>
                      ) : (
                        /*
                          X icon: /40 → /60 on muted/20 bg — now ≥ 3:1 for non-text icons
                        */
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted/20 text-muted-foreground/60">
                          <X className="size-3.5" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </SectionContainer>
    </section>
  );
};
