'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { BackToSimulator } from '@/components/ui/BackToSimulator';
import { FadeIn } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

const pressurePoints = ['chip_spread', 'chip_swap', 'chip_fees'] as const;
const matrixKeys = ['row_1', 'row_2', 'row_3'] as const;

export const ProblemSection = () => {
  const t = useTranslations('Problem') as (key: string) => string;

  return (
    <section
      id="problem"
      className="scroll-mt-32 border-t border-border/40 bg-muted/20 py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 700px' } as React.CSSProperties}
    >
      <SectionContainer size="wide">
        <FadeIn>
          <div className="grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:gap-14 2xl:gap-16">
            <div>
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
                {t('eyebrow')}
              </p>

              <h2
                className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
                style={{ textWrap: 'balance' } as React.CSSProperties}
              >
                {t('title')}
              </h2>

              <div className="mt-6 flex flex-wrap gap-2">
                {pressurePoints.map(key => (
                  <span
                    key={key}
                    className="rounded-full border border-border/60 bg-background px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/70"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                <p>{t('paragraph1')}</p>
                <p>{t('paragraph2')}</p>
              </div>

              <div className="mt-8 max-w-lg rounded-[28px] border border-border/50 bg-background/80 p-5 shadow-[0_16px_40px_-34px_rgba(15,23,42,0.24)]">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
                  {t('card_eyebrow')}
                </p>
                <p className="mt-4 text-lg font-semibold leading-8 tracking-tight text-foreground">
                  {t('quote')}
                </p>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t('card_note')}
                </p>
              </div>
            </div>

            <div className="min-w-0 rounded-[32px] border border-border/60 bg-background p-6 shadow-[0_24px_60px_-42px_rgba(15,23,42,0.38)] sm:p-7 xl:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
                {t('matrix_title')}
              </p>

              <div className="mt-4 space-y-3 md:hidden">
                {matrixKeys.map(key => (
                  <div key={key} className="rounded-[24px] border border-border/50 bg-muted/20 p-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {t('matrix_col_context')}
                    </p>
                    <p className="mt-2 text-sm font-medium leading-6 text-foreground">
                      {t(`${key}_context`)}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-border/40 bg-background px-4 py-3">
                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                        {t('matrix_col_driver')}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
                        {t(`${key}_driver`)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {t(`${key}_pattern`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 hidden overflow-hidden rounded-[24px] border border-border/50 md:block">
                <div className="grid grid-cols-[1.05fr_0.7fr_1.25fr] gap-px bg-border/50">
                  <div className="bg-muted/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t('matrix_col_context')}
                  </div>
                  <div className="bg-muted/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t('matrix_col_driver')}
                  </div>
                  <div className="bg-muted/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {t('matrix_col_pattern')}
                  </div>

                  {matrixKeys.flatMap(key => ([
                    <div key={`${key}-context`} className="bg-background p-4 text-sm font-medium leading-6 text-foreground">
                      {t(`${key}_context`)}
                    </div>,
                    <div key={`${key}-driver`} className="bg-background p-4 font-mono text-[11px] uppercase tracking-[0.16em] text-amber-600 dark:text-amber-300">
                      {t(`${key}_driver`)}
                    </div>,
                    <div key={`${key}-pattern`} className="bg-background p-4 text-sm leading-6 text-muted-foreground">
                      {t(`${key}_pattern`)}
                    </div>,
                  ]))}
                </div>
              </div>
            </div>
          </div>

          <BackToSimulator />
        </FadeIn>
      </SectionContainer>
    </section>
  );
};
