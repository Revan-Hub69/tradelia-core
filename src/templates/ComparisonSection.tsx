'use client';

import { useTranslations } from 'next-intl';

/** Mock comparison data */
const comparisonData = [
  { instrument: 'ETF', broker: 'Broker C', cost: 21, efficiency: 'Alta', rankInstrument: 1, rankBroker: 2, netReturn: 79, costDrag: 21 },
  { instrument: 'CFD', broker: 'Broker B', cost: 57, efficiency: 'Media-alta', rankInstrument: 3, rankBroker: 1, netReturn: 43, costDrag: 57 },
  { instrument: 'Futures', broker: 'Broker A', cost: 25, efficiency: 'Alta', rankInstrument: 2, rankBroker: 1, netReturn: 75, costDrag: 25 },
  { instrument: 'Options', broker: 'Broker D', cost: 49, efficiency: 'Media', rankInstrument: 4, rankBroker: 3, netReturn: 51, costDrag: 49 },
  { instrument: 'Certificates', broker: 'Broker C', cost: 52, efficiency: 'Media', rankInstrument: 5, rankBroker: 2, netReturn: 48, costDrag: 52 },
];

/** Top 3 instruments */
const topInstruments = [
  { rank: 1, label: 'ETF', cost: 21 },
  { rank: 2, label: 'Futures', cost: 25 },
  { rank: 3, label: 'Options', cost: 49 },
];

export const ComparisonSection = () => {
  const t = useTranslations('Comparison') as (key: string) => string;

  return (
    <section className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Section header with step indicator */}
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            3
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
            {t('section_eyebrow')}
          </p>
        </div>

        <h2 className="mb-3 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('section_title')}
        </h2>
        <p className="mb-10 max-w-xl text-sm text-muted-foreground">
          {t('section_intro')}
        </p>

        {/* Stacked bar chart */}
        <div className="mb-10 flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
            {t('chart_stacked_title')}
          </p>
          
          <div className="flex h-40 flex-col justify-end gap-3">
            {comparisonData.map((item) => (
              <div key={item.instrument} className="flex items-center gap-3">
                <span className="w-20 text-xs font-medium">{t(`instrument_${item.instrument.toLowerCase()}`)}</span>
                <div className="flex flex-1 items-center gap-1">
                  {/* Net return (primary color) */}
                  <div
                    className="h-6 rounded-l-sm bg-primary/70"
                    style={{ width: `${item.netReturn}%` }}
                  />
                  {/* Cost drag (red) */}
                  <div
                    className="h-6 rounded-r-sm bg-red-500/60"
                    style={{ width: `${item.costDrag}%` }}
                  />
                </div>
                <span className="w-12 text-right font-mono text-xs">€{item.cost}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-primary/70" />
              {t('chart_legend_net')}
            </div>
            <div className="flex items-center gap-1">
              <span className="h-3 w-3 rounded-sm bg-red-500/60" />
              {t('chart_legend_cost')}
            </div>
          </div>
        </div>

        {/* Line chart - Capital vs Costs */}
        <div className="mb-10 flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
            {t('chart_line_title')}
          </p>
          
          <svg viewBox="0 0 400 120" className="h-28 w-full" aria-hidden="true">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="40"
                y1={110 - y}
                x2="380"
                y2={110 - y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}
            
            {/* X axis labels */}
            <text x="40" y="125" textAnchor="middle" style={{ fontSize: '9px', fill: 'currentColor', opacity: 0.4 }}>€0</text>
            <text x="150" y="125" textAnchor="middle" style={{ fontSize: '9px', fill: 'currentColor', opacity: 0.4 }}>€25k</text>
            <text x="260" y="125" textAnchor="middle" style={{ fontSize: '9px', fill: 'currentColor', opacity: 0.4 }}>€50k</text>
            <text x="380" y="125" textAnchor="middle" style={{ fontSize: '9px', fill: 'currentColor', opacity: 0.4 }}>€100k</text>

            {/* ETF line - lowest cost */}
            <polyline
              points="40,108 150,90 260,72 380,36"
              fill="none"
              stroke="#22C55E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Futures line */}
            <polyline
              points="40,108 150,85 260,62 380,20"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* CFD line - highest cost */}
            <polyline
              points="40,108 150,70 260,32 380,-20"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-0.5 w-4 rounded-full bg-green-500" />
              ETF
            </div>
            <div className="flex items-center gap-1">
              <span className="h-0.5 w-4 rounded-full bg-blue-500" />
              Futures
            </div>
            <div className="flex items-center gap-1">
              <span className="h-0.5 w-4 rounded-full bg-red-500" style={{ strokeDasharray: '4 4' }} />
              CFD
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="mb-10 overflow-x-auto rounded-lg border border-border/50">
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
              {comparisonData.map((row, i) => (
                <tr
                  key={row.instrument}
                  className={`border-b border-border/30 transition-colors hover:bg-muted/20 ${
                    i === comparisonData.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="px-3 py-3 font-semibold">{t(`instrument_${row.instrument.toLowerCase()}`)}</td>
                  <td className="px-3 py-3 text-muted-foreground">{row.broker}</td>
                  <td className="px-3 py-3 text-right font-mono">€{row.cost}</td>
                  <td className="px-3 py-3 text-right">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      row.efficiency === 'Alta'
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                        : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                    }`}>{t(`efficiency_${row.efficiency.toLowerCase().replace('-', '')}`)}</span>
                  </td>
                  <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.rankInstrument}/5</td>
                  <td className="px-3 py-3 text-center font-mono text-muted-foreground">{row.rankBroker}/4</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top N cards */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
            {t('top_instruments_title')}
          </p>
          
          <div className="flex gap-3">
            {topInstruments.map((inst) => (
              <div
                key={inst.rank}
                className="flex flex-1 items-center gap-3 rounded-lg border border-border/50 bg-card p-4"
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                  inst.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                  inst.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                  'bg-orange-600/20 text-orange-600'
                }`}>
                  {inst.rank === 1 ? '🥇' : inst.rank === 2 ? '🥈' : '🥉'}
                </span>
                <div>
                  <p className="font-semibold">{t(`instrument_${inst.label.toLowerCase()}`)}</p>
                  <p className="text-sm text-muted-foreground">€{inst.cost}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground/40">{t('table_note')}</p>
      </div>
    </section>
  );
};