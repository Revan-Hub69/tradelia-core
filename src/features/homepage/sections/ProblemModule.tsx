'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';

const chips = ['chip_spread', 'chip_swap', 'chip_fees'] as const;

export const ProblemModule = () => {
  const t = useTranslations('Problem') as (key: string) => string;

  return (
    <section className="border-b border-border/50 bg-background py-16 lg:py-20">
      <SectionContainer className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t('eyebrow')}</p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">{t('title')}</h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">{t('paragraph1')}</p>
          <p className="mt-4 text-base leading-8 text-muted-foreground">{t('paragraph2')}</p>
        </div>

        <aside className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-foreground">{t('card_eyebrow')}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map(chip => (
              <span key={chip} className="rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground">
                {t(chip)}
              </span>
            ))}
          </div>
          <blockquote className="mt-5 border-l-2 border-primary/40 pl-4 text-sm italic leading-7 text-foreground/90">
            {t('quote')}
          </blockquote>
          <p className="mt-5 text-sm leading-7 text-muted-foreground">{t('card_note')}</p>
        </aside>
      </SectionContainer>
    </section>
  );
};
