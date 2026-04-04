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
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 sm:tracking-[0.24em]">
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
                  <th className="w-20 px-4 py-4 text-center text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground/60 sm:px-6">
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
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                        <Check className="size-3.5" />
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center sm:px-6">
                      {row.others ? (
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted/30 text-muted-foreground/40">
                          <Check className="size-3.5" />
                        </span>
                      ) : (
                        <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted/30 text-muted-foreground/40">
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
