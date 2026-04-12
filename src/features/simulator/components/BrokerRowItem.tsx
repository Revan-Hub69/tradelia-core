// ============================================================
// BrokerRowItem
// Singola riga broker nella tabella per tipo strumento.
// Mostra: rank, nome broker / conto, costo mensile, breakdown
// (spread / commissione / overnight), bps/trade, feasibility.
// ============================================================

import React from 'react';
import type { BrokerRow } from '@/lib/simulator/recommend';
import type { Feasibility } from '@/lib/simulator/engine';
import { formatEUR, formatBps } from './InstrumentRankingTable';

// ── Feasibility pill ─────────────────────────────────────────────────────────

const FEASIBILITY_CONFIG: Record<Feasibility, { label: string; className: string }> = {
  ACCESSIBLE: {
    label:     'Accessibile',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  },
  MARGINAL: {
    label:     'Marginale',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
  },
  INFEASIBLE: {
    label:     'Non accessibile',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
};

function FeasibilityPill({ feasibility }: { feasibility: Feasibility }) {
  const cfg = FEASIBILITY_CONFIG[feasibility] ?? FEASIBILITY_CONFIG.MARGINAL;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

// ── Rank badge ────────────────────────────────────────────────────────────────

function RankBadge({ rank, isCheapest }: { rank: number; isCheapest: boolean }) {
  if (isCheapest) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white">
        {rank}
      </span>
    );
  }
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
      {rank}
    </span>
  );
}

// ── Cost cell: colore in base al rank ────────────────────────────────────────

function CostCell({ monthlyCostEUR, rank }: { monthlyCostEUR: number; rank: number }) {
  const colorClass =
    rank === 1
      ? 'font-semibold text-teal-700 dark:text-teal-400'
      : rank === 2
        ? 'font-medium text-gray-800 dark:text-gray-200'
        : 'text-gray-700 dark:text-gray-300';
  return <span className={colorClass}>{formatEUR(monthlyCostEUR)}</span>;
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface BrokerRowItemProps {
  row:           BrokerRow;
  isCheapest:    boolean;
  isHighlighted: boolean;
}

// ── BrokerRowItem ─────────────────────────────────────────────────────────────

export function BrokerRowItem({ row, isCheapest, isHighlighted }: BrokerRowItemProps) {
  const highlightClass = isHighlighted
    ? 'bg-blue-50 dark:bg-blue-950/30'
    : 'hover:bg-gray-50 dark:hover:bg-gray-800/40';

  return (
    <tr className={`transition-colors ${highlightClass}`}>
      {/* Rank */}
      <td className="px-4 py-3">
        <RankBadge rank={row.rank} isCheapest={isCheapest} />
      </td>

      {/* Broker name + account type */}
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {row.brokerName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {row.accountTypeName}
          </span>
        </div>
      </td>

      {/* Monthly cost */}
      <td className="px-4 py-3 text-right">
        <CostCell monthlyCostEUR={row.monthlyCostEUR} rank={row.rank} />
      </td>

      {/* Spread */}
      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
        {row.breakdown.spreadEUR > 0 ? formatEUR(row.breakdown.spreadEUR) : <span className="text-gray-300">—</span>}
      </td>

      {/* Commission */}
      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
        {row.breakdown.commissionEUR > 0 ? formatEUR(row.breakdown.commissionEUR) : <span className="text-gray-300">—</span>}
      </td>

      {/* Overnight */}
      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
        {row.breakdown.overnightEUR > 0 ? formatEUR(row.breakdown.overnightEUR) : <span className="text-gray-300">—</span>}
      </td>

      {/* bps per singolo trade */}
      <td className="px-4 py-3 text-right font-mono text-xs text-gray-500 dark:text-gray-400">
        {formatBps(row.singleTradeCostBps)}
      </td>

      {/* Feasibility */}
      <td className="px-4 py-3 text-center">
        <FeasibilityPill feasibility={row.feasibility} />
      </td>
    </tr>
  );
}
