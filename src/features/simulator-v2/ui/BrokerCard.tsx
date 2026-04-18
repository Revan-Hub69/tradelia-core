'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  Clock,
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
import { TIER_LABELS, TIER_STYLES, TIER_TOOLTIPS } from '../data/tiers';
import type { BrokerResult } from '../state/useSimulatorState';
import { formatEUR, formatEURWhole, formatInt, formatNum2 } from '../utils/format';
import { getFlashOnChange, TRANSITION } from './motion';

function primaryRegulator(regulator: string): string {
  const parts = regulator.split('·');
  return (parts[0] || regulator).trim();
}

type BrokerCardProps = {
  broker: BrokerResult;
  isOpen: boolean;
  onToggleAction: () => void;
  onOpenDetailAction: () => void;
  lotSize: number;
  tradesPerMonth: number;
  locked?: boolean;
};

export function BrokerCard({
  broker,
  isOpen,
  onToggleAction,
  onOpenDetailAction,
  lotSize,
  tradesPerMonth,
  locked = false,
}: BrokerCardProps) {
  const isWinner = broker.isWinner && !locked;

  return (
    <div
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
        onClick={locked ? undefined : onToggleAction}
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

        {/* Info — gerarchia: broker/conto a sx, prezzo dominante a dx */}
        <div className="flex min-w-0 flex-1 items-start gap-3">
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
                <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Best
                </span>
              )}
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3" />
                {primaryRegulator(broker.regulator)}
              </span>
              <span className="text-muted-foreground/70">·</span>
              <span className="tabular-nums">
                {`Min ${formatEURWhole(broker.minDepositEur)}`}
              </span>
            </div>
          </div>

          {/* Prezzo dominante a destra — flash breve quando il valore ricomputa */}
          <div className="flex shrink-0 flex-col items-end text-right">
            <motion.span
              key={broker.costPerMonth}
              {...getFlashOnChange()}
              className={cn(
                'rounded px-1 font-bold tabular-nums leading-none tracking-tight',
                isWinner ? 'text-[22px] text-primary' : 'text-[20px] text-foreground',
              )}
            >
              {formatEUR(broker.costPerMonth)}
            </motion.span>
            <span className="mt-0.5 text-[11px] font-medium text-muted-foreground">
              /mese
            </span>
            {!isWinner && broker.deltaVsBestMonth > 0 && !locked && (
              <span className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                +
                {formatEUR(broker.deltaVsBestMonth)}
                {' '}
                vs best
              </span>
            )}
          </div>
        </div>

        {/* Chevron */}
        {!locked && (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={TRANSITION.standard}
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
            transition={TRANSITION.enter}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-border/40 p-4">
              <ExpandedContent
                broker={broker}
                lotSize={lotSize}
                tradesPerMonth={tradesPerMonth}
                onOpenDetailAction={onOpenDetailAction}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────

type ExpandedContentProps = {
  broker: BrokerResult;
  lotSize: number;
  tradesPerMonth: number;
  onOpenDetailAction: () => void;
};

function ExpandedContent({ broker, lotSize, tradesPerMonth, onOpenDetailAction }: ExpandedContentProps) {
  const account = BROKER_ACCOUNTS.find(a => a.id === broker.id);
  const qual = account ? getBrokerQualitative(account) : null;

  const isMultiday = broker.breakdown.swapPerMonth > 0;
  const total = broker.breakdown.spreadPerMonth + broker.breakdown.commissionPerMonth + broker.breakdown.swapPerMonth;
  const spreadPct = total > 0 ? (broker.breakdown.spreadPerMonth / total) * 100 : 100;
  const commissionPct = total > 0 ? (broker.breakdown.commissionPerMonth / total) * 100 : 0;
  const swapPct = total > 0 ? (broker.breakdown.swapPerMonth / total) * 100 : 0;

  return (
    <>
      {/* Header gerarchico: il soggetto è il CONTO, non il broker */}
      <div className="-mx-1 -mt-1 border-b border-border/40 pb-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {broker.brokerName}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <h4 className="text-lg font-bold leading-tight text-foreground">
            {broker.accountName}
          </h4>
          <TierBadge tier={broker.tier} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          Conto specifico
          {' '}
          {broker.brokerName}
          {' '}
          analizzato
          {broker.isWinner && (
            <>
              {' · '}
              <span className="font-semibold text-primary">BEST VALUE</span>
            </>
          )}
        </p>
      </div>

      {/* Numeri chiave */}
      <div className="grid grid-cols-3 gap-2">
        <MetricTile label="Costo/mese" value={formatEUR(broker.costPerMonth)} primary />
        <MetricTile label="Costo/trade" value={formatEUR(broker.costPerTrade)} />
        <MetricTile label="Trade/mese" value={formatInt(tradesPerMonth)} />
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
            detail={`${formatNum2(broker.spreadEurUsdPip)} pip × ${formatNum2(lotSize)} lot × ${formatInt(tradesPerMonth)} trade`}
            color="bg-primary"
          />
          <CostRow
            label="Commissioni"
            amount={broker.breakdown.commissionPerMonth}
            pct={commissionPct}
            detail={broker.commissionPerLotEur > 0
              ? `${formatEUR(broker.commissionPerLotEur)}/lot × ${formatNum2(lotSize)} lot × ${formatInt(tradesPerMonth)} trade`
              : 'Nessuna commissione · solo spread'}
            color="bg-accent"
          />
          {isMultiday && (
            <CostRow
              label="Swap markup"
              amount={broker.breakdown.swapPerMonth}
              pct={swapPct}
              detail={`+${formatEUR(broker.breakdown.swapMarkupPerLotNight)}/lot/notte × ${formatNum2(lotSize)} lot × esposizione`}
              color="bg-amber-500"
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
                value={`+${formatEUR(qual.swapMarkupPerLotEur)}/lot/notte`}
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

      {/* CTA: solo scheda completa del conto specifico */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onOpenDetailAction}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-muted"
        >
          <FileText className="size-3.5" />
          Scheda completa conto specifico
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
        'cursor-help rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
        TIER_STYLES[tier],
      )}
      title={TIER_TOOLTIPS[tier]}
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
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <motion.p
        key={value}
        {...getFlashOnChange()}
        className={cn('mt-0.5 rounded px-1 text-lg font-bold tabular-nums tracking-tight', primary ? 'text-primary' : 'text-foreground')}
      >
        {value}
      </motion.p>
    </div>
  );
}

function CostRow({
  label,
  amount,
  pct,
  detail,
  color,
}: {
  label: string;
  amount: number;
  pct: number;
  detail: string;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {formatEUR(amount)}
          <span className="ml-1 font-normal text-muted-foreground">
            (
            {pct.toFixed(0)}
            %)
          </span>
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted/50">
        <div
          className={cn('h-full rounded-full transition-all', color)}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{detail}</p>
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
          <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-2">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-xs font-medium text-foreground" title={value}>
        {value}
      </p>
    </div>
  );
}
