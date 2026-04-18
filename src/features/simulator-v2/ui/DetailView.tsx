'use client';

import {
  AlertTriangle,
  ChevronLeft,
  Clock,
  ExternalLink,
  Info,
  Layers,
  Percent,
  ShieldCheck,
  Trophy,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

import { cn } from '@/utils/Helpers';

import { BROKER_ACCOUNTS, getBrokerQualitative } from '../data/brokers';
import { TIER_LABELS, TIER_STYLES, TIER_TOOLTIPS } from '../data/tiers';
import type { BrokerResult } from '../state/useSimulatorState';
import { formatEUR, formatEURWhole } from '../utils/format';

type DetailViewProps = {
  broker: BrokerResult;
  onBackAction: () => void;
  onCloseAction: () => void;
};

export function DetailView({ broker, onBackAction, onCloseAction }: DetailViewProps) {
  const account = BROKER_ACCOUNTS.find(a => a.id === broker.id);
  const qual = account ? getBrokerQualitative(account) : null;
  const isAffiliate = account?.isAffiliate ?? false;
  const esmaLossRatePct = account?.esmaLossRatePct;
  const signupUrl = account?.signupUrl;

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/80 px-5 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBackAction}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Torna ai risultati
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Scheda broker
          </p>
        </div>

        <button
          type="button"
          onClick={onCloseAction}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Chiudi"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero — gerarchia invertita: il soggetto è il CONTO, non il broker */}
        <div className="border-b border-border/40 bg-gradient-to-br from-primary/5 via-card to-card p-5">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
              {broker.brokerName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {broker.brokerName}
              </p>
              <h1 className="truncate text-2xl font-bold leading-tight text-foreground">
                {broker.accountName}
              </h1>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Conto specifico
                {' '}
                {broker.brokerName}
                {' '}
                analizzato
              </p>
            </div>
            <span
              className={cn(
                'cursor-help rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
                TIER_STYLES[broker.tier],
              )}
              title={TIER_TOOLTIPS[broker.tier]}
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
              value={formatEUR(broker.costPerMonth)}
              primary
            />
            <StatTile
              label="Costo a trade"
              value={formatEUR(broker.costPerTrade)}
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
            {broker.breakdown.swapPerMonth > 0 && (
              <BreakdownRow
                label="Swap markup"
                amount={broker.breakdown.swapPerMonth}
                per={`+€${broker.breakdown.swapMarkupPerLotNight}/lot/notte · markup broker`}
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
                  label="Swap markup broker"
                  value={`+€${qual.swapMarkupPerLotEur}/lot/notte · applicato solo in overnight`}
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
              <SpecCard label="Min deposito" value={formatEURWhole(broker.minDepositEur)} />
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

        {/* CTA block: affiliate disclosure sopra · CTA · ESMA risk warning sotto */}
        <div className="sticky bottom-0 border-t border-border/60 bg-card/95 backdrop-blur-sm">
          {isAffiliate && (
            <div className="flex items-start gap-2 border-b border-border/40 bg-muted/40 px-4 py-2">
              <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
              <p className="text-[11px] leading-4 text-muted-foreground">
                <span className="font-semibold text-foreground/80">Divulgazione affiliato:</span>
                {' '}
                Tradelia potrebbe ricevere una commissione se apri un conto
                {' '}
                {broker.brokerName}
                {' '}
                tramite questo link, senza costi aggiuntivi per te. Il ranking
                non è influenzato da accordi commerciali.
              </p>
            </div>
          )}

          <div className="p-4">
            <a
              href={signupUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
            >
              Apri conto
              {' '}
              {broker.accountName}
              {' · '}
              {broker.brokerName}
              <ExternalLink className="size-4" />
            </a>
          </div>

          {/* ESMA risk warning — specifico del broker se disponibile.
              Red-orange (rose) per distinguere da amber tier badge / "non incluso" box. */}
          <div className="flex items-start gap-2 border-t border-rose-500/20 bg-rose-500/5 px-4 py-2.5">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-rose-600 dark:text-rose-500" />
            <p className="text-[11px] leading-snug text-rose-700 dark:text-rose-400">
              <span className="font-semibold">Avvertenza rischio ESMA · </span>
              {esmaLossRatePct !== undefined
                ? (
                    <>
                      Il
                      {' '}
                      <strong>
                        {esmaLossRatePct.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        %
                      </strong>
                      {' '}
                      dei conti retail di investitori perde denaro facendo trading
                      su CFD con
                      {' '}
                      {broker.brokerName}
                      . Valuta se puoi permetterti di correre il rischio elevato di perdere il tuo denaro.
                    </>
                  )
                : (
                    <>
                      I CFD sono strumenti complessi che comportano un alto rischio
                      di perdere denaro rapidamente a causa della leva.
                    </>
                  )}
            </p>
          </div>
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
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn('mt-1 text-2xl font-bold tabular-nums tracking-tight', primary ? 'text-primary' : 'text-foreground')}>
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
        <span className="text-sm font-semibold tabular-nums text-foreground">
          {formatEUR(amount)}
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
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
