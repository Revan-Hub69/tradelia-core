'use client';

import { Check, ExternalLink, Minus, Zap } from 'lucide-react';

import { cn } from '@/utils/Helpers';

import type { BrokerAccount } from '../../data/brokers';

type BlockExecutionProps = {
  account: BrokerAccount;
};

/**
 * Blocco 2 — Qualità esecuzione (dati misurati) + policy operative.
 */
export function BlockExecution({ account }: BlockExecutionProps) {
  const ex = account.execution;
  const pol = account.executionPolicies;
  const features = account.features;

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Zap className="size-3" />
        Qualità esecuzione
      </h2>

      {ex
        ? (
            <div className="grid grid-cols-2 gap-2">
              <ExecItem label="Tipo esecuzione" value={ex.type} strong />
              {ex.serverLocations && ex.serverLocations.length > 0 && (
                <ExecItem label="Server" value={ex.serverLocations.join(' · ')} />
              )}
              {ex.avgExecutionMs && (
                <ExecItem
                  label="Latenza media"
                  value={`~${ex.avgExecutionMs.value} ms`}
                  source={ex.avgExecutionMs.measuredAt}
                />
              )}
              {ex.priceImprovementRate && (
                <ExecItem
                  label="Price improvement"
                  value={`${Math.round(ex.priceImprovementRate.value * 100)}%`}
                  source={ex.priceImprovementRate.measuredAt}
                />
              )}
              {ex.avgSlippagePips && (
                <ExecItem
                  label="Slippage medio"
                  value={`${ex.avgSlippagePips.value > 0 ? '+' : ''}${ex.avgSlippagePips.value.toFixed(2)} pip`}
                  source={ex.avgSlippagePips.measuredAt}
                />
              )}
              {ex.requotePolicy && (
                <ExecItem
                  label="Requote"
                  value={ex.requotePolicy === 'no-requote' ? 'No requote' : ex.requotePolicy === 'requote' ? 'Sì, con conferma' : 'Rifiuto se slippage'}
                />
              )}
            </div>
          )
        : (
            <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Dati di esecuzione non pubblicati dal broker o rilevazione in corso.
              </p>
            </div>
          )}

      {ex?.publishesExecutionStats && ex.executionStatsUrl && (
        <a
          href={ex.executionStatsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          <ExternalLink className="size-3" />
          Statistiche ufficiali del broker (MiFID RTS 28)
        </a>
      )}

      {/* Policies */}
      {(features || pol) && (
        <div className="rounded-xl border border-border/60 bg-card/40 p-3">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Cosa è permesso
          </p>
          <div className="flex flex-wrap gap-1.5">
            {features?.scalpingAllowed !== undefined && (
              <PolicyChip label="Scalping" allowed={features.scalpingAllowed} />
            )}
            {features?.hedgingAllowed !== undefined && (
              <PolicyChip label="Hedging" allowed={features.hedgingAllowed} />
            )}
            {features?.eaAllowed !== undefined && (
              <PolicyChip label="EA / Algo" allowed={features.eaAllowed} />
            )}
            {features?.swapFree !== undefined && features.swapFree && (
              <PolicyChip label="Conto islamico" allowed />
            )}
            {pol?.newsTradingRestrictionMin !== undefined
              ? <PolicyChip label={`News: no ±${pol.newsTradingRestrictionMin}min`} allowed={false} />
              : <PolicyChip label="News trading" allowed />}
            {pol?.vps && (
              <PolicyChip
                label={
                  pol.vps.freeWithDepositEur
                    ? `VPS gratis ≥ €${pol.vps.freeWithDepositEur}`
                    : `VPS €${pol.vps.paidCostEurPerMonth}/mese`
                }
                allowed
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ExecItem({
  label,
  value,
  source,
  strong = false,
}: {
  label: string;
  value: string;
  source?: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          'mt-0.5 truncate text-xs',
          strong ? 'font-bold text-foreground' : 'font-semibold text-foreground',
        )}
      >
        {value}
      </p>
      {source && (
        <p className="mt-0.5 text-[9px] text-muted-foreground/70">
          {source}
        </p>
      )}
    </div>
  );
}

function PolicyChip({ label, allowed }: { label: string; allowed: boolean }) {
  const Icon = allowed ? Check : Minus;
  return (
    <span
      className={cn(
        'flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
        allowed
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
          : 'border-border/60 bg-muted/30 text-muted-foreground',
      )}
    >
      <Icon className="size-2.5" />
      {label}
    </span>
  );
}
