'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';

const rows = [
  { instrument: 'instrument_etf', efficiency: 'efficiency_alta' },
  { instrument: 'instrument_futures', efficiency: 'efficiency_mediaalta' },
  { instrument: 'instrument_cfd', efficiency: 'efficiency_media' },
] as const;

export const ComparisonModule = () => {
  const t = useTranslations('Comparison') as (key: string) => string;

  return (
    <section className="border-b border-border/50 bg-background py-16 lg:py-20">
      <SectionContainer>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">{t('section_eyebrow')}</p>
        <h2 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">{t('section_title')}</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground">{t('section_intro')}</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t('col_instrument')}</th>
                <th className="px-4 py-3 font-medium">{t('col_efficiency')}</th>
                <th className="px-4 py-3 font-medium">{t('col_cost')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.instrument} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium text-foreground">{t(row.instrument)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t(row.efficiency)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{`${(idx + 1) * 0.18}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">{t('table_note')}</p>
      </SectionContainer>
    </section>
  );
};
