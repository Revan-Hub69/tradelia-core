'use client';

import { useTranslations } from 'next-intl';

const rows = [
  { instrument: 'ETF',     broker: 'Broker C', cost: '€21', efficiency: 'Alta',  rankInstrument: '1/6', rankBroker: '2/5' },
  { instrument: 'CFD',     broker: 'Broker B', cost: '€57', efficiency: 'Media-alta', rankInstrument: '3/6', rankBroker: '1/5' },
  { instrument: 'Futures', broker: 'Broker A', cost: '€25', efficiency: 'Alta',  rankInstrument: '2/6', rankBroker: '1/5' },
  { instrument: 'Options', broker: 'Broker D', cost: '€49', efficiency: 'Media', rankInstrument: '4/6', rankBroker: '3/5' },
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
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">{t('col_instrument')}</th>
                <th className="px-3 py-3 text-left font-medium text-muted-foreground">{t('col_broker')}</th>
                <th className="px-3 py-3 text-right font-medium text-muted-foreground">{t('col_cost')}</th>
                <th className="px-3 py-3 text-right font-medium text-muted-foreground">{t('col_efficiency')}</th>
                <th className="px-3 py-3 text-center font-medium text-muted-foreground">{t('col_rank_instrument')}</th>
                <th className="px-3 py-3 text-center font-medium text-muted-foreground">{t('col_rank_broker')}</th>
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
                  <td className="px-3 py-3 font-semibold">{row.instrument}</td>
                  <td className="px-3 py-3 text-muted-foreground">{row.broker}</td>
                  <td className="px-3 py-3 text-right font-mono">{row.cost}</td>
                  <td className="px-3 py-3 text-right">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.efficiency === 'Alta'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : row.efficiency === 'Media-alta'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    }`}>{row.efficiency}</span>
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.rankInstrument}</td>
                  <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.rankBroker}</td>
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
