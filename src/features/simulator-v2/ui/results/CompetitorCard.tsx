'use client';

import { motion } from 'framer-motion';
import { ChevronRight, Lock } from 'lucide-react';

import { cn } from '@/utils/Helpers';

import { TIER_LABELS, TIER_STYLES } from '../../data/tiers';
import type { BrokerResult } from '../../state/useSimulatorState';
import { formatEUR, formatEURWhole } from '../../utils/format';
import { CostBreakdownBar } from './CostBreakdownBar';

type CompetitorCardProps = {
  broker: BrokerResult;
  index: number;
  onOpenDetailAction: () => void;
  locked?: boolean;
};

/**
 * Card compatta per broker non-winner. Mostra rank, cost, delta vs best, breakdown mini.
 */
export function CompetitorCard({
  broker,
  index,
  onOpenDetailAction,
  locked = false,
}: CompetitorCardProps) {
  const segments = [
    {
      key: 'spread',
      label: 'Spread',
      value: broker.breakdown.spreadPerMonth,
      colorClass: 'bg-primary/70',
    },
    {
      key: 'commission',
      label: 'Commissioni',
      value: broker.breakdown.commissionPerMonth,
      colorClass: 'bg-accent/70',
    },
    {
      key: 'swap',
      label: 'Swap',
      value: broker.breakdown.swapPerMonth,
      colorClass: 'bg-amber-500/70',
    },
  ];

  return (
    <motion.button
      type="button"
      onClick={locked ? undefined : onOpenDetailAction}
      disabled={locked}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: 0.25 + index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={locked ? undefined : { y: -2 }}
      className={cn(
        'group relative flex w-full flex-col gap-2.5 overflow-hidden rounded-xl border p-3.5 text-left transition-all',
        locked
          ? 'cursor-not-allowed border-border/40 bg-muted/10 opacity-60'
          : 'border-border/60 bg-card/60 hover:border-primary/40 hover:bg-card hover:shadow-md',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      )}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
            locked ? 'bg-muted text-muted-foreground' : 'bg-secondary text-secondary-foreground',
          )}
        >
          {locked ? <Lock className="size-3.5" /> : broker.rank}
        </div>

        {/* Broker info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-sm font-semibold text-foreground">
              {broker.brokerName}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-full border px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider',
                TIER_STYLES[broker.tier],
              )}
            >
              {TIER_LABELS[broker.tier]}
            </span>
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {broker.accountName}
          </p>
        </div>

        {/* Costo + delta */}
        <div className="flex shrink-0 flex-col items-end">
          <span className="text-base font-bold tabular-nums leading-none text-foreground">
            {formatEUR(broker.costPerMonth)}
          </span>
          <span className="mt-0.5 text-[10px] text-muted-foreground">/mese</span>
          {!locked && broker.deltaVsBestMonth > 0 && (
            <span className="mt-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
              +
              {formatEUR(broker.deltaVsBestMonth)}
            </span>
          )}
          {locked && (() => {
            const r = broker.ineligibilityReasons;
            const bits: string[] = [];
            if (r.includes('capital-below-min-deposit')) {
              bits.push(`Min ${formatEURWhole(broker.minDepositEur)}`);
            }
            if (r.includes('lot-below-min-lot')) {
              bits.push(`Lot ≥ ${broker.minLotSize}`);
            }
            if (r.includes('lot-above-max-lot') && broker.maxLotSize !== undefined) {
              bits.push(`Lot ≤ ${broker.maxLotSize}`);
            }
            if (r.includes('capital-insufficient-for-leverage') && broker.marginRequiredEur !== undefined) {
              bits.push(`Margine ${formatEURWhole(broker.marginRequiredEur)}`);
            }
            const label = bits.length > 0 ? bits.join(' · ') : 'Non disponibile';
            return (
              <span
                title={label}
                className="mt-1 max-w-[160px] truncate rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {label}
              </span>
            );
          })()}
        </div>

        {!locked && (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        )}
      </div>

      {/* Mini breakdown bar */}
      {!locked && (
        <CostBreakdownBar segments={segments} showLegend={false} height={4} />
      )}
    </motion.button>
  );
}
