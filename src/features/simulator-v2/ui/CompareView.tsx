'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronLeft,
  Lock,
  ShieldCheck,
  TrendingDown,
  Trophy,
  X,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { BrokerTier } from '../data/brokers';
import type { BrokerResult } from '../state/useSimulatorState';

type CompareViewProps = {
  results: BrokerResult[];
  onSelectBroker: (brokerId: string) => void;
  onBack: () => void;
  onClose: () => void;
};

const TIER_LABELS: Record<BrokerTier, string> = {
  cent: 'Cent',
  starter: 'Starter',
  standard: 'Standard',
  ecn: 'ECN',
  pro: 'Pro',
};

const TIER_STYLES: Record<BrokerTier, string> = {
  cent: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  starter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  standard: 'bg-primary/10 text-primary border-primary/20',
  ecn: 'bg-accent/10 text-accent border-accent/20',
  pro: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export function CompareView({
  results,
  onSelectBroker,
  onBack,
  onClose,
}: CompareViewProps) {
  const eligible = results.filter(r => r.isEligible);
  const ineligible = results.filter(r => !r.isEligible);
  const winner = eligible[0];
  const others = eligible.slice(1);

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Indietro"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="text-center">
          <h2 className="text-sm font-semibold text-foreground">Risultati</h2>
          <p className="text-[11px] text-muted-foreground">
            {eligible.length}
            {' '}
            eleggibili ·
            {' '}
            {ineligible.length}
            {' '}
            fuori tier
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Chiudi"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* Winner */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-card p-5 shadow-lg shadow-primary/10"
          >
            <div className="absolute -right-20 -top-20 size-40 rounded-full bg-primary/20 blur-3xl" />

            <div className="relative">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                  <Trophy className="size-3.5" />
                  Miglior scelta
                </span>
                <TierBadge tier={winner.tier} />
              </div>

              <h3 className="text-xl font-bold text-foreground">
                {winner.brokerName}
                {' '}
                <span className="text-muted-foreground">·</span>
                {' '}
                <span className="text-muted-foreground">{winner.accountName}</span>
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="size-3" />
                {winner.regulator}
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-primary">
                  €
                  {winner.costPerMonth}
                </span>
                <span className="text-sm text-muted-foreground">/mese</span>
              </div>

              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingDown className="size-3.5" />
                <span>
                  €
                  {winner.costPerTrade}
                  {' '}
                  a trade
                </span>
                <span className="text-muted-foreground/50">·</span>
                <span>
                  Min deposito €
                  {winner.minDepositEur}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectBroker(winner.id)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
              >
                Vedi dettaglio
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Other eligible */}
        {others.length > 0 && (
          <div className="space-y-2">
            <h4 className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Altri broker eleggibili
            </h4>

            {others.map((broker, idx) => (
              <BrokerRow
                key={broker.id}
                broker={broker}
                idx={idx}
                onClick={() => onSelectBroker(broker.id)}
              />
            ))}
          </div>
        )}

        {/* Ineligible */}
        {ineligible.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Lock className="size-3 text-muted-foreground" />
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Fuori tier · deposito minimo più alto del tuo capitale
              </h4>
            </div>

            {ineligible.map((broker, idx) => (
              <BrokerRow
                key={broker.id}
                broker={broker}
                idx={idx}
                onClick={() => onSelectBroker(broker.id)}
                locked
              />
            ))}
          </div>
        )}

        {/* Footer note */}
        <p className="px-2 text-center text-[11px] leading-5 text-muted-foreground/70">
          Costi calcolati su spread e commissioni tipiche dichiarate dai
          broker. Non include funding overnight, slippage e fee di deposito.
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: BrokerTier }) {
  return (
    <span
      className={cn(
        'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
        TIER_STYLES[tier],
      )}
    >
      {TIER_LABELS[tier]}
    </span>
  );
}

type BrokerRowProps = {
  broker: BrokerResult;
  idx: number;
  onClick: () => void;
  locked?: boolean;
};

function BrokerRow({ broker, idx, onClick, locked = false }: BrokerRowProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.04 }}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        locked
          ? 'border-border/40 bg-muted/30 opacity-60 hover:opacity-80'
          : 'border-border/60 bg-popover/40 hover:border-border hover:bg-popover',
      )}
    >
      {/* Rank / lock */}
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
          locked ? 'bg-muted text-muted-foreground' : 'bg-secondary text-secondary-foreground',
        )}
      >
        {locked ? <Lock className="size-3.5" /> : broker.rank}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {broker.brokerName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {broker.accountName}
          </span>
          <TierBadge tier={broker.tier} />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            €
            {broker.costPerMonth}
            /mese
          </span>
          <span>·</span>
          <span>
            Min €
            {broker.minDepositEur}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
    </motion.button>
  );
}
