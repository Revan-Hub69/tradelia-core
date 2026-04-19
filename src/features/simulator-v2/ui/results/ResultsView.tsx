'use client';

import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

import { BROKER_ACCOUNTS } from '../../data/brokers';
import type { BrokerResult } from '../../state/useSimulatorState';
import { CompetitorCard } from './CompetitorCard';
import { EmptyResults } from './EmptyResults';
import { SavingsCallout } from './SavingsCallout';
import { WinnerHero } from './WinnerHero';

type ResultsViewProps = {
  results: BrokerResult[];
  capital: number;
  onSelectBrokerAction: (brokerId: string) => void;
  onEditAction: () => void;
};

/**
 * View principale dei risultati: hero winner + savings + competitor cards.
 * Layout a flusso verticale con stagger animation.
 */
export function ResultsView({
  results,
  capital,
  onSelectBrokerAction,
  onEditAction,
}: ResultsViewProps) {
  const eligible = results.filter(r => r.isEligible);
  const locked = results.filter(r => !r.isEligible);
  const winner = eligible[0];
  const competitors = eligible.slice(1);

  // Empty state: nessun broker eligibile
  if (!winner) {
    const minRequired = Math.min(
      ...BROKER_ACCOUNTS.map(a => a.minDepositEur),
    );
    return (
      <div className="p-4 sm:p-5">
        <EmptyResults
          capital={capital}
          minCapitalRequired={minRequired}
          onEditAction={onEditAction}
        />
      </div>
    );
  }

  // Calcolo risparmio vs peggiore eligibile
  const worst = eligible[eligible.length - 1];
  const savingsPerMonth = worst && worst.id !== winner.id
    ? worst.costPerMonth - winner.costPerMonth
    : 0;

  return (
    <div className="space-y-4 p-4 sm:p-5">
      {/* Header sezione */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {eligible.length}
          {' '}
          {eligible.length === 1 ? 'conto analizzato' : 'conti analizzati'}
        </p>
      </motion.div>

      {/* Winner hero */}
      <WinnerHero
        broker={winner}
        onOpenDetailAction={() => onSelectBrokerAction(winner.id)}
      />

      {/* Savings callout */}
      {savingsPerMonth > 0 && (
        <SavingsCallout
          savingsPerMonth={savingsPerMonth}
          worstBrokerName={worst?.brokerName}
        />
      )}

      {/* Competitors */}
      {competitors.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Altri conti (
            {competitors.length}
            )
          </p>
          <div className="space-y-2">
            {competitors.map((broker, idx) => (
              <CompetitorCard
                key={broker.id}
                broker={broker}
                index={idx}
                onOpenDetailAction={() => onSelectBrokerAction(broker.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked — ineligibili per capitale o lot minimo */}
      {locked.length > 0 && (() => {
        const hasCapitalIssue = locked.some(r => r.ineligibilityReasons.includes('capital-below-min-deposit'));
        const hasLotIssue = locked.some(r => r.ineligibilityReasons.includes('lot-below-min-lot'));
        const label = hasCapitalIssue && hasLotIssue
          ? 'Non adatti al tuo setup (capitale o lotto)'
          : hasLotIssue
            ? 'Lotto minimo superiore al tuo'
            : 'Non accessibili con il tuo capitale';
        return (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 px-1">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="space-y-2">
              {locked.map((broker, idx) => (
                <CompetitorCard
                  key={broker.id}
                  broker={broker}
                  index={competitors.length + idx}
                  onOpenDetailAction={() => onSelectBrokerAction(broker.id)}
                  locked
                />
              ))}
            </div>
          </div>
        );
      })()}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="mt-2 flex items-start gap-2 rounded-xl border border-border/40 bg-muted/20 p-3 text-[10px] leading-relaxed text-muted-foreground"
      >
        <Info className="mt-0.5 size-3 shrink-0 text-muted-foreground/70" />
        <p>
          Costi calcolati su spread e commissioni
          {' '}
          <strong className="text-foreground/80">tipiche rilevate</strong>
          {' '}
          (snapshot aggregato, non real-time). Non include funding overnight, slippage e fee di deposito/prelievo.
        </p>
      </motion.div>
    </div>
  );
}
