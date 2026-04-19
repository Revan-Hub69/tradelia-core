'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  ExternalLink,
  Handshake,
  Info,
  Percent,
  ShieldAlert,
  Trophy,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

import { BROKER_ACCOUNTS, getBrokerQualitative } from '../../data/brokers';
import { TIER_LABELS, TIER_STYLES, TIER_TOOLTIPS } from '../../data/tiers';
import type { BrokerResult } from '../../state/useSimulatorState';
import { formatEUR, formatEURWhole, formatInt, formatNum2 } from '../../utils/format';
import { AnimatedCounter } from './AnimatedCounter';
import { CostBreakdownBar } from './CostBreakdownBar';

type ResultsDetailProps = {
  broker: BrokerResult;
  lotSize: number;
  tradesPerMonth: number;
  onBackAction: () => void;
  onCloseAction?: () => void;
};

/**
 * Scheda conto compatta: header minimal con back + close, hero, breakdown,
 * specifiche, sticky CTA footer con disclaimer ESMA sempre + affiliate se partner.
 */
export function ResultsDetail({
  broker,
  lotSize,
  tradesPerMonth,
  onBackAction,
  onCloseAction,
}: ResultsDetailProps) {
  const account = BROKER_ACCOUNTS.find(a => a.id === broker.id);
  const qual = account ? getBrokerQualitative(account) : null;
  const signupUrl = account?.signupUrl;
  const esmaLossRatePct = account?.esmaLossRatePct;
  const isAffiliate = account?.isAffiliate ?? false;

  const isMultiday = broker.breakdown.swapPerMonth > 0;
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
      key="detail"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col bg-background"
    >
      {/* Top bar minimal: back + title + close */}
      <div className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-border/60 bg-card/80 px-3 py-2 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBackAction}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ArrowLeft className="size-4" />
          <span>Indietro</span>
        </button>

        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(var(--primary))]" />
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Scheda conto
          </p>
        </div>

        {onCloseAction
          ? (
              <button
                type="button"
                onClick={onCloseAction}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Chiudi"
              >
                <X className="size-4" />
              </button>
            )
          : (
              <div className="w-9" />
            )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-6 sm:p-5">
        {/* Hero compatto */}
        <div
          className={cn(
            'relative overflow-hidden rounded-2xl border p-4 sm:p-5',
            broker.isWinner
              ? 'border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card shadow-lg shadow-primary/10'
              : 'border-border/60 bg-card/80',
          )}
        >
          {broker.isWinner && (
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-primary/20 blur-3xl" />
          )}
          <div className="relative flex items-start gap-3">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold',
                broker.isWinner
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {broker.isWinner ? <Trophy className="size-5" /> : broker.brokerName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {broker.brokerName}
              </p>
              <h1 className="truncate text-xl font-bold leading-tight text-foreground">
                {broker.accountName}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span
                  className={cn(
                    'cursor-help rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                    TIER_STYLES[broker.tier],
                  )}
                  title={TIER_TOOLTIPS[broker.tier]}
                >
                  {TIER_LABELS[broker.tier]}
                </span>
                {broker.isWinner && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Best
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Metriche chiave */}
          <div className="relative mt-4 grid grid-cols-3 gap-2 border-t border-border/40 pt-3">
            <MetricBox label="Costo/mese" primary>
              <AnimatedCounter
                value={broker.costPerMonth}
                formatAction={v => formatEUR(v)}
                className={cn(
                  'block text-lg font-bold leading-none tabular-nums tracking-tight',
                  broker.isWinner ? 'text-primary' : 'text-foreground',
                )}
              />
            </MetricBox>
            <MetricBox label="Costo/trade">
              <AnimatedCounter
                value={broker.costPerTrade}
                formatAction={v => formatEUR(v)}
                className="block text-lg font-bold leading-none tabular-nums tracking-tight text-foreground"
              />
            </MetricBox>
            <MetricBox label="Score">
              <AnimatedCounter
                value={broker.score}
                formatAction={v => `${Math.round(v)}`}
                className="block text-lg font-bold leading-none tabular-nums tracking-tight text-foreground"
              />
            </MetricBox>
          </div>
        </div>

        {/* Breakdown dettagliato */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Percent className="size-3" />
            Costi inclusi nel calcolo
          </h2>
          <CostBreakdownBar segments={segments} height={10} />
          <div className="space-y-2 rounded-xl border border-border/60 bg-card/40 p-3">
            <CostRow
              label="Spread"
              amount={broker.breakdown.spreadPerMonth}
              detail={`${formatNum2(broker.spreadEurUsdPip)} pip × ${formatNum2(lotSize)} lot × ${formatInt(tradesPerMonth)} trade`}
              dotClass="bg-primary"
            />
            <CostRow
              label="Commissioni"
              amount={broker.breakdown.commissionPerMonth}
              detail={broker.commissionPerLotEur > 0
                ? `${formatEUR(broker.commissionPerLotEur)}/lot × ${formatNum2(lotSize)} lot × ${formatInt(tradesPerMonth)} trade`
                : 'Solo spread, nessuna commissione'}
              dotClass="bg-accent"
            />
            {isMultiday && (
              <CostRow
                label="Swap markup"
                amount={broker.breakdown.swapPerMonth}
                detail={`+${formatEUR(broker.breakdown.swapMarkupPerLotNight)}/lot/notte × ${formatNum2(lotSize)} lot × esposizione`}
                dotClass="bg-amber-500"
              />
            )}
          </div>
        </section>

        {/* Non incluso */}
        {qual && (
          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
            <h2 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-500">
              <Info className="size-3" />
              Stime indicative (non nel calcolo)
            </h2>
            <div className="space-y-1.5 text-xs">
              {!isMultiday && (
                <QualRow
                  icon={Clock}
                  label="Swap markup broker"
                  value={`+${formatEUR(qual.swapMarkupPerLotEur)}/lot/notte`}
                />
              )}
              <QualRow
                icon={Zap}
                label="Esecuzione media"
                value={`~${qual.avgExecutionMs} ms`}
              />
              <QualRow
                icon={Wallet}
                label="Depositi & prelievi"
                value={qual.depositNote}
              />
            </div>
          </section>
        )}

        {/* Specifiche conto */}
        {qual && (
          <section>
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Specifiche conto
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <SpecItem label="Regolatori" value={broker.regulator} />
              <SpecItem label="Leva max (ESMA)" value={`${qual.maxLeverageRetail}:1`} />
              <SpecItem label="Piattaforme" value={qual.platforms.join(' · ')} />
              <SpecItem label="Lotto minimo" value={`${account?.minLotSize ?? 0.01}`} />
              <SpecItem label="Deposito minimo" value={formatEURWhole(broker.minDepositEur)} />
            </div>
          </section>
        )}

        {/* Affiliate disclosure — trasparenza prima della CTA */}
        {isAffiliate && (
          <div className="flex items-start gap-2.5 rounded-xl border border-border/40 bg-muted/30 p-3">
            <Handshake className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-foreground">
                Partner Tradelia
              </p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
                Riceviamo una commissione se apri un conto tramite questo link. Questo
                {' '}
                <strong className="font-semibold text-foreground/80">non influenza il ranking</strong>
                {' '}
                né i costi calcolati, basati sui parametri pubblici del broker.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA footer — SOTA 2026: disclaimer ESMA sempre, CTA dominante, safe-area aware */}
      <div className="relative flex-shrink-0 border-t border-border/60 bg-card/95 backdrop-blur-md">
        {/* Gradient accent top */}
        {broker.isWinner && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        )}

        <div className="space-y-2.5 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-5">
          {/* ESMA disclaimer — obbligatorio, sempre visibile, per-broker */}
          {esmaLossRatePct !== undefined && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-2">
              <ShieldAlert className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-500" />
              <p className="text-[10px] leading-[1.35] text-amber-900 dark:text-amber-200">
                <strong className="font-bold tabular-nums">
                  {esmaLossRatePct.toFixed(2)}
                  %
                </strong>
                {' '}
                dei conti retail di
                {' '}
                <strong className="font-semibold">{broker.brokerName}</strong>
                {' '}
                perde denaro con i CFD. Valuta se puoi permetterti questo rischio.
              </p>
            </div>
          )}

          {/* CTA principale */}
          {signupUrl
            ? (
                <a
                  href={signupUrl}
                  target="_blank"
                  rel={isAffiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.99]"
                >
                  <ExternalLink className="size-4" />
                  <span>
                    Vai a
                    {' '}
                    {broker.brokerName}
                  </span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )
            : (
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground"
                >
                  Link di apertura conto non disponibile
                </button>
              )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Subcomponents ─────────────────────────────────────────────

function MetricBox({
  label,
  children,
  primary = false,
}: {
  label: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg p-2',
        primary ? 'bg-primary/5' : 'bg-muted/30',
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function CostRow({
  label,
  amount,
  detail,
  dotClass,
}: {
  label: string;
  amount: number;
  detail: string;
  dotClass: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', dotClass)} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold text-foreground">{label}</span>
          <span className="text-sm font-bold tabular-nums text-foreground">
            {formatEUR(amount)}
          </span>
        </div>
        <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

function QualRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3 shrink-0 text-amber-600 dark:text-amber-500" />
      <div className="flex-1">
        <span className="font-medium text-foreground">{label}</span>
        <span className="mx-1 text-muted-foreground/50">·</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}
