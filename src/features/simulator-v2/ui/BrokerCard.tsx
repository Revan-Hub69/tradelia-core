'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
  ExternalLink,
  FileText,
  Info,
  Lock,
  Percent,
  ShieldCheck,
  Trophy,
  Wallet,
  Zap,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { BrokerTier } from '../data/brokers';
import { BROKER_ACCOUNTS, getBrokerQualitative } from '../data/brokers';
import type { BrokerResult } from '../state/useSimulatorState';

const TIER_LABELS: Record<BrokerTier, string> = {
  cent: 'Cent',
  starter: 'Starter',
  standard: 'Standard',
  ecn: 'ECN',
  pro: 'Pro',
};

function primaryRegulator(regulator: string): string {
  const parts = regulator.split('·');
  return (parts[0] || regulator).trim();
}

const TIER_STYLES: Record<BrokerTier, string> = {
  cent: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  starter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  standard: 'bg-primary/10 text-primary border-primary/20',
  ecn: 'bg-accent/10 text-accent border-accent/20',
  pro: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

type BrokerCardProps = {
  broker: BrokerResult;
  isOpen: boolean;
  onToggle: () => void;
  onOpenDetail: () => void;
  lotSize: number;
  tradesPerMonth: number;
  locked?: boolean;
};

export function BrokerCard({
  broker,
  isOpen,
  onToggle,
  onOpenDetail,
  lotSize,
  tradesPerMonth,
  locked = false,
}: BrokerCardProps) {
  const isWinner = broker.isWinner && !locked;

  return (
    <motion.div
      layout
      className={cn(
        'overflow-hidden rounded-2xl border transition-colors',
        isWinner
          ? 'border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card shadow-lg shadow-primary/5'
          : locked
            ? 'border-border/40 bg-muted/20 opacity-70'
            : 'border-border/60 bg-card/60',
        isOpen && !locked && 'border-primary/40 shadow-sm',
      )}
    >
      {/* HEADER / CLOSED STATE */}
      <button
        type="button"
        onClick={locked ? undefined : onToggle}
        disabled={locked}
        className={cn(
          'flex w-full items-center gap-3 p-4 text-left',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          !locked && 'hover:bg-muted/30',
        )}
        aria-expanded={isOpen}
      >
        {/* Rank or Trophy or Lock */}
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
            locked
              ? 'bg-muted text-muted-foreground'
              : isWinner
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground',
          )}
        >
          {locked ? <Lock className="size-3.5" /> : isWinner ? <Trophy className="size-4" /> : broker.rank}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {broker.brokerName}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {broker.accountName}
            </span>
            <TierBadge tier={broker.tier} />
            {isWinner && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                Best
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              €
              {broker.costPerMonth}
              <span className="font-normal text-muted-foreground">/mese</span>
            </span>
            {!isWinner && broker.deltaVsBestMonth > 0 && !locked && (
              <span className="text-muted-foreground">
                · +€
                {broker.deltaVsBestMonth.toFixed(2)}
                {' '}
                vs best
              </span>
            )}
            <span className="text-muted-foreground/70">·</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <ShieldCheck className="size-3" />
              {primaryRegulator(broker.regulator)}
            </span>
            <span className="text-muted-foreground/70">·</span>
            <span className="text-muted-foreground">
              Min €
              {broker.minDepositEur}
            </span>
          </div>
        </div>

        {/* Chevron */}
        {!locked && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="shrink-0 text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </motion.div>
        )}
      </button>

      {/* EXPANDED STATE */}
      <AnimatePresence initial={false}>
        {isOpen && !locked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border/40 p-4">
              <ExpandedContent
                broker={broker}
                lotSize={lotSize}
                tradesPerMonth={tradesPerMonth}
                onOpenDetail={onOpenDetail}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────

type ExpandedContentProps = {
  broker: BrokerResult;
  lotSize: number;
  tradesPerMonth: number;
  onOpenDetail: () => void;
};

function ExpandedContent({ broker, lotSize, tradesPerMonth, onOpenDetail }: ExpandedContentProps) {
  const account = BROKER_ACCOUNTS.find(a => a.id === broker.id);
  const qual = account ? getBrokerQualitative(account) : null;

  const isMultiday = broker.breakdown.swapPerTrade !== 0;
  const swapIsIncome = broker.breakdown.swapPerMonth < 0;
  // Per le barre percentuali usiamo magnitudo (il visual è la quota di ogni voce sul totale lordo).
  const grossTotal = broker.breakdown.spreadPerMonth
    + broker.breakdown.commissionPerMonth
    + Math.abs(broker.breakdown.swapPerMonth);
  const spreadPct = grossTotal > 0 ? (broker.breakdown.spreadPerMonth / grossTotal) * 100 : 100;
  const commissionPct = grossTotal > 0 ? (broker.breakdown.commissionPerMonth / grossTotal) * 100 : 0;
  const swapPct = grossTotal > 0 ? (Math.abs(broker.breakdown.swapPerMonth) / grossTotal) * 100 : 0;

  return (
    <>
      {/* Numeri chiave */}
      <div className="grid grid-cols-3 gap-2">
        <MetricTile label="Costo/mese" value={`€${broker.costPerMonth}`} primary />
        <MetricTile label="Costo/trade" value={`€${broker.costPerTrade}`} />
        <MetricTile label="Trade/mese" value={String(tradesPerMonth)} />
      </div>

      {/* Breakdown costi calcolati */}
      <div>
        <h5 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Percent className="size-3" />
          Costi inclusi nel calcolo
        </h5>

        <div className="space-y-2">
          <CostRow
            label="Spread"
            amount={broker.breakdown.spreadPerMonth}
            pct={spreadPct}
            detail={`${broker.spreadEurUsdPip} pip × ${lotSize} lot × ${tradesPerMonth} trade`}
            color="bg-primary"
          />
          <CostRow
            label="Commissioni"
            amount={broker.breakdown.commissionPerMonth}
            pct={commissionPct}
            detail={broker.commissionPerLotEur > 0
              ? `€${broker.commissionPerLotEur}/lot × ${lotSize} lot × ${tradesPerMonth} trade`
              : 'Nessuna commissione · solo spread'}
            color="bg-accent"
          />
          {isMultiday && (
            <CostRow
              label={swapIsIncome ? 'Swap overnight (entrata)' : 'Swap overnight'}
              amount={broker.breakdown.swapPerMonth}
              pct={swapPct}
              detail={`€${broker.breakdown.swapCostPerLotNight}/lot/notte · interbank + markup`}
              color={swapIsIncome ? 'bg-emerald-500' : 'bg-amber-500'}
              negative={swapIsIncome}
            />
          )}
        </div>
      </div>

      {/* Non incluso — trasparenza */}
      {qual && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <h5 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500">
            <Info className="size-3" />
            Non incluso nel calcolo (stime indicative)
          </h5>
          <div className="space-y-1.5 text-xs">
            {!isMultiday && qual && (
              <QualRow
                icon={Clock}
                label="Swap markup broker"
                value={`+€${qual.swapMarkupPerLotEur}/lot/notte`}
                hint="Sommato al rate interbank per coppia · switcha in alto per includerlo"
              />
            )}
            <QualRow
              icon={Zap}
              label="Esecuzione media"
              value={`~${qual.avgExecutionMs} ms`}
              hint="Latenza round-trip indicativa · peggiora in high volatility"
            />
            <QualRow
              icon={Wallet}
              label="Depositi & prelievi"
              value={qual.depositNote}
            />
          </div>
        </div>
      )}

      {/* Specifiche chiave */}
      {qual && (
        <div>
          <h5 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Specifiche
          </h5>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <SpecItem label="Regolatori" value={broker.regulator} />
            <SpecItem label="Leva max (ESMA)" value={`${qual.maxLeverageRetail}:1`} />
            <SpecItem label="Piattaforme" value={qual.platforms.join(' · ')} />
            <SpecItem label="Lotto minimo" value={`${account?.minLotSize ?? 0.01}`} />
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-2 pt-1 sm:flex-row">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:shadow-primary/20"
        >
          Apri conto
          {' '}
          {broker.brokerName}
          <ExternalLink className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onOpenDetail}
          className="flex items-center justify-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-border hover:bg-muted"
        >
          <FileText className="size-3.5" />
          Scheda completa
        </button>
      </div>
    </>
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

function MetricTile({ label, value, primary }: { label: string; value: string; primary?: boolean }) {
  return (
    <div className={cn(
      'rounded-xl border p-2.5',
      primary ? 'border-primary/30 bg-primary/5' : 'border-border/60 bg-card/60',
    )}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-0.5 text-lg font-bold', primary ? 'text-primary' : 'text-foreground')}>
        {value}
      </p>
    </div>
  );
}

function CostRow({
  label,
  amount,
  pct,
  detail,
  color,
  negative,
}: {
  label: string;
  amount: number;
  pct: number;
  detail: string;
  color: string;
  negative?: boolean;
}) {
  const displayAmount = Math.abs(amount).toFixed(2);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className={cn('text-xs font-semibold', negative ? 'text-emerald-500' : 'text-foreground')}>
          {negative ? '−' : ''}
          €
          {displayAmount}
          <span className="ml-1 font-normal text-muted-foreground">
            (
            {Math.abs(pct).toFixed(0)}
            %)
          </span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${Math.max(2, Math.abs(pct))}%` }}
        />
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">{detail}</p>
    </div>
  );
}

function QualRow({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3 shrink-0 text-amber-600 dark:text-amber-500" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-medium text-foreground">{value}</span>
        </div>
        {hint && (
          <p className="text-[10px] text-muted-foreground/70">{hint}</p>
        )}
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-2">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-xs font-medium text-foreground" title={value}>
        {value}
      </p>
    </div>
  );
}
