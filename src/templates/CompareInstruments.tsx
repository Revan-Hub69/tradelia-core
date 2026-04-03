'use client';

import { useTranslations } from 'next-intl';

const instruments = [
  { key: 'etf',     labelKey: 'etf_label',     descKey: 'etf_desc',     costKey: 'etf_cost' },
  { key: 'cfd',     labelKey: 'cfd_label',     descKey: 'cfd_desc',     costKey: 'cfd_cost' },
  { key: 'futures', labelKey: 'futures_label', descKey: 'futures_desc', costKey: 'futures_cost' },
  { key: 'options', labelKey: 'options_label', descKey: 'options_desc', costKey: 'options_cost' },
];

export const CompareInstruments = () => {
  const t = useTranslations('Compare') as (key: string) => string;

  return (
    <section className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
          {t('eyebrow')}
        </p>
        <h2 className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('title')}
        </h2>
        <p className="mb-10 max-w-xl text-sm text-muted-foreground">
          {t('intro')}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {instruments.map((ins) => (
            <div
              key={ins.key}
              className="flex flex-col gap-2 rounded-lg border border-border/50 bg-card p-5 transition-shadow hover:shadow-sm"
            >
              <span className="text-sm font-bold tracking-tight">{t(ins.labelKey)}</span>
              <p className="text-xs leading-relaxed text-muted-foreground">{t(ins.descKey)}</p>
              <span className="mt-auto pt-3 font-mono text-xs text-muted-foreground/50">{t(ins.costKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
