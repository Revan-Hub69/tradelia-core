'use client';

import { useTranslations } from 'next-intl';

const points = [
  { titleKey: 'p1_title', descKey: 'p1_desc' },
  { titleKey: 'p2_title', descKey: 'p2_desc' },
  { titleKey: 'p3_title', descKey: 'p3_desc' },
];

export const WhyDifferent = () => {
  const t = useTranslations('WhyDifferent') as (key: string) => string;

  return (
    <section className="border-t border-border/40 bg-muted/20 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
          {t('eyebrow')}
        </p>
        <h2 className="mb-10 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('title')}
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          {points.map((p, i) => (
            <div key={i} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold">{t(p.titleKey)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{t(p.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
