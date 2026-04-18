'use client';

import {
  ChevronLeft,
  Clock,
  ExternalLink,
  Layers,
  Percent,
  ShieldCheck,
  Trophy,
  Wallet,
  X,
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

const TIER_STYLES: Record<BrokerTier, string> = {
  cent: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  starter: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  standard: 'bg-primary/10 text-primary border-primary/20',
  ecn: 'bg-accent/10 text-accent border-accent/20',
  pro: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

type DetailViewProps = {
  broker: BrokerResult;
  onBack: () => void;
  onClose: () => void;
};

export function DetailView({ broker, onBack, onClose }: DetailViewProps) {
  const account = BROKER_ACCOUNTS.find(a => a.id === broker.id);
  const qual = account ? getBrokerQualitative(account) : null;

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/80 px-5 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Torna ai risultati
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Scheda broker
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Chiudi"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="border-b border-border/40 bg-gradient-to-br from-primary/5 via-card to-card p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground shadow-md shadow-primary/20">
              {broker.brokerName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold text-foreground">
                {broker.brokerName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {broker.accountName}
              </p>
            </div>
            <span
              className={cn(
                'rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                TIER_STYLES[broker.tier],
              )}
            >
              {TIER_LABELS[broker.tier]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {broker.isWinner && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">
                <Trophy className="size-3" />
                Best Choice
              </span>
            )}
            <span className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
              broker.score >= 90
                ? 'bg-primary/15 text-primary'
                : broker.score >= 70
                  ? 'bg-blue-500/15 text-blue-400'
                  : 'bg-amber-500/15 text-amber-500',
            )}
            >
              Score
              {' '}
              {broker.score}
              /100
            </span>
          </div>
        </div>

        {/* Cost Overview */}
        <Section>
          <div className="grid grid-cols-2 gap-3">
            <StatTile
              label="Costo mensile"
              value={`€${broker.costPerMonth}`}
              primary
            />
            <StatTile
              label="Costo a trade"
              value={`€${broker.costPerTrade}`}
            />
          </div>
        </Section>

        {/* Breakdown */}
        <Section title="Breakdown costi calcolati" icon={Percent}>
          <div className="space-y-2">
            <BreakdownRow
              label="Spread"
              amount={broker.breakdown.spreadPerMonth}
              per={`${broker.spreadEurUsdPip} pip EUR/USD`}
              color="bg-primary"
              total={broker.costPerMonth}
            />
            <BreakdownRow
              label="Commissioni"
              amount={broker.breakdown.commissionPerMonth}
              per={broker.commissionPerLotEur > 0
                ? `€${broker.commissionPerLotEur}/lot round-turn`
                : 'Nessuna · solo spread'}
              color="bg-accent"
              total={broker.costPerMonth}
            />
            {broker.breakdown.swapPerMonth > 0 && qual && (
              <BreakdownRow
                label="Swap overnight"
                amount={broker.breakdown.swapPerMonth}
                per={`€${Math.abs(qual.swapLongPerLotEur)}/lot/notte · markup broker`}
                color="bg-amber-500"
                total={broker.costPerMonth}
              />
            )}
          </div>
        </Section>

        {/* Qualitative info */}
        {qual && (
          <Section title="Non incluso nel calcolo" icon={Clock} variant="amber">
            <div className="space-y-2">
              {broker.breakdown.swapPerMonth === 0 && (
                <InfoRow
                  icon={Clock}
                  label="Swap overnight EUR/USD (long)"
                  value={`€${Math.abs(qual.swapLongPerLotEur)}/lot/notte · markup broker`}
                />
              )}
              <InfoRow
                icon={Zap}
                label="Esecuzione media"
                value={`~${qual.avgExecutionMs} ms (round-trip, condizioni normali)`}
              />
              <InfoRow
                icon={Wallet}
                label="Depositi / prelievi"
                value={qual.depositNote}
              />
            </div>
          </Section>
        )}

        {/* Specs */}
        {qual && account && (
          <Section title="Specifiche conto" icon={Layers}>
            <div className="grid grid-cols-2 gap-2">
              <SpecCard label="Min deposito" value={`€${broker.minDepositEur}`} />
              <SpecCard label="Lotto minimo" value={`${account.minLotSize}`} />
              <SpecCard label="Leva max ESMA" value={`${qual.maxLeverageRetail}:1`} />
              <SpecCard label="Piattaforme" value={qual.platforms.join(' · ')} />
            </div>
          </Section>
        )}

        {/* Regulators */}
        <Section title="Regolatori" icon={ShieldCheck}>
          <div className="rounded-xl border border-border/60 bg-card/60 p-3">
            <div className="flex flex-wrap gap-1.5">
              {broker.regulator.split('·').map(r => r.trim()).filter(Boolean).map(r => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary"
                >
                  <ShieldCheck className="size-3" />
                  {r}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Licenze e dati ufficiali verificabili sui siti dei rispettivi enti regolatori.
            </p>
          </div>
        </Section>

        {/* CTA */}
        <div className="sticky bottom-0 border-t border-border/60 bg-card/95 p-4 backdrop-blur-sm">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          >
            Apri conto
            {' '}
            {broker.brokerName}
            <ExternalLink className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────

function Section({
  children,
  title,
  icon: Icon,
  variant,
}: {
  children: React.ReactNode;
  title?: string;
  icon?: React.ElementType;
  variant?: 'amber';
}) {
  return (
    <div className="border-b border-border/30 p-5">
      {title && (
        <h2 className={cn(
          'mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider',
          variant === 'amber' ? 'text-amber-600 dark:text-amber-500' : 'text-muted-foreground',
        )}
        >
          {Icon && <Icon className="size-3" />}
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

function StatTile({
  label,
  value,
  primary,
}: {
  label: string;
  value: string;
  primary?: boolean;
}) {
  return (
    <div className={cn(
      'rounded-xl border p-3',
      primary ? 'border-primary/30 bg-primary/5' : 'border-border/60 bg-card/60',
    )}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold', primary ? 'text-primary' : 'text-foreground')}>
        {value}
      </p>
    </div>
  );
}

function BreakdownRow({
  label,
  amount,
  per,
  color,
  total,
}: {
  label: string;
  amount: number;
  per: string;
  color: string;
  total: number;
}) {
  const pct = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm font-semibold text-foreground">
          €
          {amount.toFixed(2)}
          <span className="ml-1 font-normal text-muted-foreground">
            (
            {pct.toFixed(0)}
            %)
          </span>
        </span>
      </div>
      <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-muted/50">
        <div
          className={cn('h-full rounded-full', color)}
          style={{ width: `${Math.max(2, pct)}%` }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">{per}</p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
