// ============================================================
// InstrumentRankingTable
// Renders out.rankingTable[] — one section per instrument type,
// each with a sorted broker table.
//
// Usage:
//   import { InstrumentRankingTable } from '@/features/simulator/components/InstrumentRankingTable';
//   <InstrumentRankingTable data={out.rankingTable} suggestETF={out.suggestCurrencyETF} />
// ============================================================

import React, { useState } from 'react';
import type { InstrumentRanking, BrokerRow } from '@/lib/simulator/recommend';
import { BrokerRowItem } from './BrokerRowItem';

// ── Props ───────────────────────────────────────────────────────────────────

export interface InstrumentRankingTableProps {
  /** Array from RecommendOutput.rankingTable — empty categories already filtered */
  data:        InstrumentRanking[];
  /** Show currency ETF redirect banner */
  suggestETF?: boolean;
  /** Highlight a specific broker row (e.g. user's current broker) */
  highlightBrokerId?: string;
  className?: string;
}

// ── Currency ETF Banner ──────────────────────────────────────────────────────

function CurrencyETFBanner() {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
      <span className="font-semibold">Profilo non adatto al trading con leva.</span>{' '}
      Considera un <strong>ETF valutario</strong> (es. FXE, EUSA) per esposizione forex senza leva.
    </div>
  );
}

// ── Category header label style ──────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  CFD_ECN:  'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  CFD_DD:   'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  SPOT_FX:  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  FUTURES:  'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  OTHER:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

// ── InstrumentSection ────────────────────────────────────────────────────────

interface InstrumentSectionProps {
  ranking:           InstrumentRanking;
  highlightBrokerId?: string;
  defaultExpanded:   boolean;
}

function InstrumentSection({ ranking, highlightBrokerId, defaultExpanded }: InstrumentSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const colorClass = CATEGORY_COLORS[ranking.category] ?? CATEGORY_COLORS.OTHER;

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(p => !p)}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
            {ranking.categoryLabel}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {ranking.brokers.length} broker{ranking.brokers.length !== 1 ? 's' : ''}
          </span>
          {ranking.cheapest && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              — da{' '}
              <strong className="text-gray-900 dark:text-gray-100">
                {formatEUR(ranking.cheapest.monthlyCostEUR)}
              </strong>
              /mese
            </span>
          )}
        </div>
        {/* Chevron */}
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Table */}
      {expanded && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Broker / Conto</th>
                <th className="px-4 py-2 text-right">Costo/mese</th>
                <th className="px-4 py-2 text-right">Spread</th>
                <th className="px-4 py-2 text-right">Comm.</th>
                <th className="px-4 py-2 text-right">Overnight</th>
                <th className="px-4 py-2 text-right">bps/trade</th>
                <th className="px-4 py-2 text-center">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {ranking.brokers.map(row => (
                <BrokerRowItem
                  key={row.raw.id}
                  row={row}
                  isHighlighted={row.brokerId === highlightBrokerId}
                  isCheapest={row.rank === 1}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function formatEUR(n: number): string {
  return new Intl.NumberFormat('it-IT', {
    style:                 'currency',
    currency:              'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatBps(n: number): string {
  return `${n.toFixed(1)} bps`;
}

// ── Main Component ───────────────────────────────────────────────────────────

export function InstrumentRankingTable({
  data,
  suggestETF = false,
  highlightBrokerId,
  className = '',
}: InstrumentRankingTableProps) {
  if (data.length === 0) {
    return (
      <div className={`flex flex-col items-center py-16 text-center text-gray-400 ${className}`}>
        <svg className="mb-3 h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm">Nessun broker accessibile per il profilo inserito.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {suggestETF && <CurrencyETFBanner />}
      {data.map((ranking, i) => (
        <InstrumentSection
          key={ranking.category}
          ranking={ranking}
          highlightBrokerId={highlightBrokerId}
          defaultExpanded={i === 0} // prima categoria aperta di default
        />
      ))}
    </div>
  );
}
