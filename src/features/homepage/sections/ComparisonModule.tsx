'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';

const rows = [
  { asset: 'asset_forex', driver: 'driver_spread', cost: '0.6 – 1.2 pip' },
  { asset: 'asset_indices', driver: 'driver_funding', cost: '0.8 – 2.5 pt/die' },
  { asset: 'asset_equities', driver: 'driver_commission', cost: '0.05 – 0.15%' },
  { asset: 'asset_commodities', driver: 'driver_rollover', cost: '3 – 12 USD / contratto' },
  { asset: 'asset_crypto', driver: 'driver_weekend', cost: '0.3 – 1.5%' },
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
              {rows.map(row => (
                <tr key={row.asset} className="border-t border-border/60">
                  <td className="px-4 py-3 font-medium text-foreground">{t(row.asset)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t(row.driver)}</td>
                  <td className="px-4 py-3 tabular-nums text-muted-foreground">{row.cost}</td>
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
