'use client';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Clock,
  ExternalLink,
  Gauge,
  Handshake,
  Info,
  Layers,
  Percent,
  Repeat,
  ShieldAlert,
  Trophy,
  Wallet,
  X,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { AssetId } from '../../data/assets';
import { BROKER_ACCOUNTS, getBrokerQualitative } from '../../data/brokers';
import { TIER_LABELS, TIER_STYLES, TIER_TOOLTIPS } from '../../data/tiers';
import type { BrokerResult } from '../../state/useSimulatorState';
import { formatEUR, formatEURWhole, formatInt, formatNum2 } from '../../utils/format';
import { AnimatedCounter } from './AnimatedCounter';
import { BlockExecution } from './BlockExecution';
import { BlockMultiAsset } from './BlockMultiAsset';
import { BlockSafety } from './BlockSafety';
import { CostBreakdownBar } from './CostBreakdownBar';

type ResultsDetailProps = {
  broker: BrokerResult;
  capital: number;
  lotSize: number;
  tradesPerMonth: number;
  exposureDaysPerMonth: number;
  assetId: AssetId;
  /** Simbolo coppia forex, se asset = forex */
  pairSymbol?: string;
  onBackAction: () => void;
  onCloseAction?: () => void;
};

const ASSET_LABELS: Record<AssetId, string> = {
  forex: 'Forex',
  indices: 'Indici',
  commodities: 'Materie prime',
  crypto: 'Crypto',
  equities: 'Azioni',
};

/**
 * Scheda conto focalizzata sull'operatività specifica dell'utente.
 * Ogni numero è esplicitamente etichettato con il contesto di input.
 */
export function ResultsDetail({
  broker,
  capital,
  lotSize,
  tradesPerMonth,
  exposureDaysPerMonth,
  assetId,
  pairSymbol,
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

      {/* Your Setup strip — contesto operativo sempre visibile.
          Tutti i numeri nella scheda si riferiscono a QUESTO setup. */}
      <div className="flex-shrink-0 border-b border-border/40 bg-muted/20 px-4 py-2 sm:px-5">
        <div className="flex items-center gap-2 overflow-x-auto">
          <p className="flex-shrink-0 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Il tuo setup
          </p>
          <span className="text-muted-foreground/40">·</span>
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs tabular-nums">
            <SetupPill icon={Layers} value={pairSymbol ?? ASSET_LABELS[assetId]} strong />
            <span className="text-muted-foreground/40">·</span>
            <SetupPill icon={Wallet} value={formatEURWhole(capital)} />
            <span className="text-muted-foreground/40">·</span>
            <SetupPill icon={Gauge} value={`${formatNum2(lotSize)} lot`} />
            <span className="text-muted-foreground/40">·</span>
            <SetupPill icon={Repeat} value={`${formatInt(tradesPerMonth)}/mese`} />
            {exposureDaysPerMonth > 0 && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <SetupPill icon={CalendarClock} value={`${exposureDaysPerMonth} gg`} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-6 sm:p-5">
        {/* Banner ineligibility — se il broker non è adatto al setup scelto */}
        {!broker.isEligible && broker.ineligibilityReasons.length > 0 && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-500" />
            <div className="flex-1 text-xs">
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                Questo conto non è compatibile con il tuo setup
              </p>
              <ul className="mt-1 space-y-0.5 text-amber-700/90 dark:text-amber-400/90">
                {broker.ineligibilityReasons.includes('capital-below-min-deposit') && (
                  <li>
                    • Capitale richiesto:
                    {' '}
                    <strong>{formatEURWhole(broker.minDepositEur)}</strong>
                    {' '}
                    (tuo:
                    {' '}
                    {formatEURWhole(capital)}
                    )
                  </li>
                )}
                {broker.ineligibilityReasons.includes('lot-below-min-lot') && (
                  <li>
                    • Lotto minimo:
                    {' '}
                    <strong>{broker.minLotSize}</strong>
                    {' '}
                    (tuo:
                    {' '}
                    {formatNum2(lotSize)}
                    ). I costi qui sotto sono calcolati al lotto minimo
                    {' '}
                    <strong>{broker.minLotSize}</strong>
                    , non al tuo.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

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
                {esmaLossRatePct !== undefined && (
                  <button
                    type="button"
                    onClick={() => {
                      document.getElementById('esma-disclaimer')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="flex items-center gap-1 rounded-full border border-border/60 bg-background px-2 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    title="Leggi il disclaimer ESMA"
                  >
                    <ShieldAlert className="size-2.5" />
                    {esmaLossRatePct.toFixed(0)}
                    % perde
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Metriche chiave — riferite esplicitamente all'asset selezionato */}
          <div className="relative mt-4 border-t border-border/40 pt-3">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Risultato su
              {' '}
              <span className="font-bold text-foreground">
                {pairSymbol ?? ASSET_LABELS[assetId]}
              </span>
            </p>
            <div className="grid grid-cols-3 gap-2">
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
                className="block text-lg font-bold tabular-nums leading-none tracking-tight text-foreground"
              />
            </MetricBox>
            <MetricBox label="Score">
              <AnimatedCounter
                value={broker.score}
                formatAction={v => `${Math.round(v)}`}
                className="block text-lg font-bold tabular-nums leading-none tracking-tight text-foreground"
              />
            </MetricBox>
            </div>
          </div>
        </div>

        {/* Breakdown dettagliato */}
        <section className="space-y-3">
          <h2 className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Percent className="size-3" />
            <span>Costi per</span>
            <span className="font-bold text-foreground">
              {pairSymbol ?? ASSET_LABELS[assetId]}
            </span>
            <span className="text-muted-foreground/60 normal-case tracking-normal">
              · setup sopra
            </span>
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

        {/* Blocco 1B — Info operative non nel calcolo */}
        {(account?.accountFees || qual) && (
          <section className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <h2 className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Info className="size-3" />
              Info operative (fuori calcolo)
            </h2>
            <div className="space-y-1.5 text-xs">
              {!isMultiday && qual && (
                <QualRow
                  icon={Clock}
                  label="Swap markup se overnight"
                  value={`+${formatEUR(qual.swapMarkupPerLotEur)}/lot/notte`}
                />
              )}
              {account?.accountFees?.tripleSwapDay && (
                <QualRow
                  icon={Clock}
                  label="Triple swap day"
                  value={account.accountFees.tripleSwapDay === 'wednesday' ? 'Mercoledì' : 'Venerdì'}
                />
              )}
              {account?.accountFees?.fxConversionPct !== undefined && (
                <QualRow
                  icon={Percent}
                  label="Conversione valuta"
                  value={`${(account.accountFees.fxConversionPct * 100).toFixed(2)}% su notional (se conto ≠ valuta strumento)`}
                />
              )}
              {account?.accountFees?.inactivityFeeEurPerMonth !== undefined && account.accountFees.inactivityFeeEurPerMonth > 0 && (
                <QualRow
                  icon={Wallet}
                  label="Fee inattività"
                  value={`€${account.accountFees.inactivityFeeEurPerMonth}/mese dopo ${account.accountFees.inactivityAfterMonths ?? '?'} mesi`}
                />
              )}
              {account?.accountFees?.minCommissionPerOrderEur !== undefined && (
                <QualRow
                  icon={Percent}
                  label="Commissione minima"
                  value={`${formatEUR(account.accountFees.minCommissionPerOrderEur)}/ordine`}
                />
              )}
              {qual && (
                <QualRow
                  icon={Wallet}
                  label="Depositi & prelievi"
                  value={qual.depositNote}
                />
              )}
            </div>
          </section>
        )}

        {/* Blocco 3 — Stesso setup su altri strumenti */}
        {account && (
          <BlockMultiAsset
            account={account}
            ctx={{ lotSize, tradesPerMonth, exposureDaysPerMonth }}
          />
        )}

        {/* Blocco 2 — Qualità esecuzione */}
        {account && <BlockExecution account={account} />}

        {/* Blocco 4 — Sicurezza e compliance */}
        {account && <BlockSafety account={account} />}

        {/* Final CTA Card — inline, non sticky. Pattern "momento decisionale":
            disclaimer ESMA integrale + affiliate + CTA insieme a fine scroll.
            Compliance garantita (utente deve scrollare per arrivare alla CTA). */}
        <section
          className={cn(
            'relative overflow-hidden rounded-2xl border p-4 sm:p-5',
            broker.isWinner
              ? 'border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card'
              : 'border-border/60 bg-card/60',
          )}
        >
          {/* ESMA/CONSOB disclaimer integrale — ancor di scroll dalla risk pill */}
          {esmaLossRatePct !== undefined && (
            <div
              id="esma-disclaimer"
              className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5"
            >
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                I CFD sono strumenti complessi che presentano un elevato rischio di perdere rapidamente denaro a causa della leva finanziaria.
                {' '}
                <strong className="font-semibold text-foreground">
                  Il
                  {' '}
                  <span className="tabular-nums">
                    {esmaLossRatePct.toFixed(2)}
                    %
                  </span>
                  {' '}
                  dei conti degli investitori retail perde denaro nel trading di CFD con
                  {' '}
                  {broker.brokerName}
                </strong>
                . Dovresti assicurarti di avere ben compreso come funzionano i CFD e se puoi permetterti di assumerti l'alto rischio di perdere i tuoi soldi.
              </p>
            </div>
          )}

          {/* Affiliate disclosure inline compatto */}
          {isAffiliate && (
            <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Handshake className="mt-0.5 size-3 shrink-0" />
              <span>
                Potremmo ricevere una commissione se apri un conto tramite questo link. Non influenza il ranking né i costi calcolati, basati sui parametri pubblici del broker e rilevazioni autonome.
              </span>
            </p>
          )}

          {/* CTA */}
          <div className="mt-3.5">
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
        </section>
      </div>
    </motion.div>
  );
}

// ── Subcomponents ─────────────────────────────────────────────

function SetupPill({
  icon: Icon,
  value,
  strong = false,
}: {
  icon: React.ElementType;
  value: string;
  strong?: boolean;
}) {
  return (
    <span className="flex items-center gap-1">
      <Icon className="size-3 text-muted-foreground" />
      <span className={cn(strong ? 'font-semibold text-foreground' : 'text-foreground')}>
        {value}
      </span>
    </span>
  );
}

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
