'use client';

import { useTranslations } from 'next-intl';

const rows = [
  { instrument: 'ETF',     cost: '€18',  efficiency: 'Alta',  drag: '1.2%',  note: 'output_etf_note' },
  { instrument: 'CFD',     cost: '€64',  efficiency: 'Bassa', drag: '4.3%',  note: 'output_cfd_note' },
  { instrument: 'Futures', cost: '€27',  efficiency: 'Alta',  drag: '1.8%',  note: 'output_futures_note' },
  { instrument: 'Options', cost: '€49',  efficiency: 'Media', drag: '3.3%',  note: 'output_options_note' },
];

export const OutputPreview = () => {
  const t = useTranslations('OutputPreview') as (key: string) => string;

  return (
    <section className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
          {t('eyebrow')}
        </p>
        <h2 className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('title')}
        </h2>
        <p className="mb-8 max-w-xl text-sm text-muted-foreground">
          {t('intro')}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('col_instrument')}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t('col_cost')}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t('col_efficiency')}</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">{t('col_drag')}</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t('col_note')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.instrument}
                  className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${
                    i === rows.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-semibold">{row.instrument}</td>
                  <td className="px-4 py-3 text-right font-mono">{row.cost}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.efficiency === 'Alta'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : row.efficiency === 'Media'
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                    }`}>{row.efficiency}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">{row.drag}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t(row.note)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground/40">{t('table_note')}</p>
      </div>
    </section>
  );
};
