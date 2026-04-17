'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';

const stepKeys = [
  { tag: 'step1_tag', title: 'step1_title', desc: 'step1_desc' },
  { tag: 'step2_tag', title: 'step2_title', desc: 'step2_desc' },
  { tag: 'step3_tag', title: 'step3_title', desc: 'step3_desc' },
] as const;

export const HowItWorksModule = () => {
  const t = useTranslations('HowItWorks') as (key: string) => string;

  return (
    <section className="border-b border-border/50 bg-muted/20 py-16 lg:py-20">
      <SectionContainer>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t('eyebrow')}</p>
        <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">{t('title')}</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{t('intro')}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {stepKeys.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-border/60 bg-background p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{`0${index + 1} · ${t(step.tag)}`}</p>
              <h3 className="mt-3 text-lg font-semibold text-foreground">{t(step.title)}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{t(step.desc)}</p>
            </article>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
};
