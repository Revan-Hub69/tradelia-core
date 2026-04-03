'use client';

import { useTranslations } from 'next-intl';

const steps = [
  { num: '01', titleKey: 'step1_title', descKey: 'step1_desc' },
  { num: '02', titleKey: 'step2_title', descKey: 'step2_desc' },
  { num: '03', titleKey: 'step3_title', descKey: 'step3_desc' },
];

export const HowItWorks = () => {
  const t = useTranslations('HowItWorks') as (key: string) => string;

  return (
    <section className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
          {t('eyebrow')}
        </p>
        <h2 className="mb-10 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('title')}
        </h2>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col gap-3">
              <span className="font-mono text-2xl font-bold text-primary/30">{s.num}</span>
              <h3 className="text-sm font-semibold leading-snug">{t(s.titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(s.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
