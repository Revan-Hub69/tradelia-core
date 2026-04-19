'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles, Trophy } from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { BrokerResult } from '../../state/useSimulatorState';
import { formatEUR, formatEURWhole } from '../../utils/format';
import { TIER_LABELS, TIER_STYLES } from '../../data/tiers';
import { AnimatedCounter } from './AnimatedCounter';
import { CostBreakdownBar } from './CostBreakdownBar';

type WinnerHeroProps = {
  broker: BrokerResult;
  onOpenDetailAction: () => void;
};

function primaryRegulator(regulator: string): string {
  const parts = regulator.split('·');
  return (parts[0] || regulator).trim();
}

/**
 * Card hero del broker vincente: gradient, counter animato, CTA dominante.
 * Posizionata in cima alla lista risultati.
 */
export function WinnerHero({ broker, onOpenDetailAction }: WinnerHeroProps) {
  const segments = [
    {
      key: 'spread',
      label: 'Spread',
      value: broker.breakdown.spreadPerMonth,
      colorClass: 'bg-primary',
    },
    {
      key: 'commission',
      label: 'Commissioni',
      value: broker.breakdown.commissionPerMonth,
      colorClass: 'bg-accent',
    },
    {
      key: 'swap',
      label: 'Swap',
      value: broker.breakdown.swapPerMonth,
      colorClass: 'bg-amber-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-primary/30 shadow-lg shadow-primary/10',
        'bg-gradient-to-br from-primary/10 via-card to-card',
      )}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/20 blur-3xl" />

      {/* Badge flottante */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
        <Sparkles className="size-3" />
        Best Value
      </div>

      <div className="relative space-y-4 p-5 pt-14">
        {/* Header broker */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {broker.brokerName}
            </p>
            <h3 className="mt-0.5 truncate text-xl font-bold leading-tight text-foreground">
              {broker.accountName}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  TIER_STYLES[broker.tier],
                )}
              >
                {TIER_LABELS[broker.tier]}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3" />
                {primaryRegulator(broker.regulator)}
              </span>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                Min
                {' '}
                {formatEURWhole(broker.minDepositEur)}
              </span>
            </div>
          </div>

          {/* Trophy rank */}
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30">
            <Trophy className="size-5" />
          </div>
        </div>

        {/* Prezzo gigante */}
        <div className="flex items-end justify-between gap-4 border-y border-border/40 py-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Costo mensile
            </p>
            <AnimatedCounter
              value={broker.costPerMonth}
              duration={1.1}
              formatAction={v => formatEUR(v)}
              className="block text-[34px] font-bold leading-none tracking-tight text-primary"
            />
            <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">
              ≈
              {' '}
              <AnimatedCounter
                value={broker.costPerTrade}
                duration={1.1}
                formatAction={v => formatEUR(v)}
              />
              {' '}
              per trade
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Score
            </p>
            <AnimatedCounter
              value={broker.score}
              duration={1.1}
              className="block text-2xl font-bold tabular-nums text-foreground"
              formatAction={v => `${Math.round(v)}`}
            />
            <p className="text-[11px] text-muted-foreground">/100</p>
          </div>
        </div>

        {/* Breakdown visivo */}
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Composizione costo
          </p>
          <CostBreakdownBar segments={segments} height={10} />
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onOpenDetailAction}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          Vedi scheda completa
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.div>
  );
}
