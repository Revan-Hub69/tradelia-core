'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Info, X } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

import type { BrokerResult, SimulatorInput } from '../state/useSimulatorState';
import { BrokerCard } from './BrokerCard';

type CompareViewProps = {
  results: BrokerResult[];
  input: SimulatorInput;
  onSelectBroker: (brokerId: string) => void;
  onBack: () => void;
  onClose: () => void;
};

export function CompareView({
  results,
  input,
  onSelectBroker,
  onBack,
  onClose,
}: CompareViewProps) {
  // Multi-expand: set di broker aperti. Winner aperto di default.
  const winnerId = results.find(r => r.isWinner)?.id;
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(winnerId ? [winnerId] : []),
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const eligible = results.filter(r => r.isEligible);
  const locked = results.filter(r => !r.isEligible);

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 bg-card/80 px-5 py-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Torna al wizard"
        >
          <ChevronLeft className="size-4" />
          Modifica
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Risultati
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

      {/* Context recap */}
      <div className="border-b border-border/40 bg-muted/20 px-5 py-2.5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <Badge
            label="Modalità"
            value={input.mode === 'multiday'
              ? `Overnight · ${input.exposureDaysPerMonth ?? 0}gg`
              : 'Intraday'}
            highlight
          />
          <Badge label="Capitale" value={`€${input.capital.toLocaleString('it-IT')}`} />
          <Badge label="Lotto" value={`${input.lotSize}`} />
          <Badge label="Trade/mese" value={String(input.tradesPerMonth)} />
          {input.pairSymbol && (
            <Badge label="Coppia" value={input.pairSymbol} />
          )}
        </div>
      </div>

      {/* Cards list */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {eligible.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {eligible.map(broker => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                isOpen={openIds.has(broker.id)}
                onToggle={() => toggle(broker.id)}
                onOpenDetail={() => onSelectBroker(broker.id)}
                lotSize={input.lotSize}
                tradesPerMonth={input.tradesPerMonth}
              />
            ))}
          </motion.div>
        )}

        {locked.length > 0 && (
          <div className="pt-2">
            <div className="mb-2 flex items-center gap-2 px-1">
              <div className="h-px flex-1 bg-border/40" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Non accessibili con il tuo capitale
              </span>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="space-y-2">
              {locked.map(broker => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  isOpen={false}
                  onToggle={() => {}}
                  onOpenDetail={() => onSelectBroker(broker.id)}
                  lotSize={input.lotSize}
                  tradesPerMonth={input.tradesPerMonth}
                  locked
                />
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className={cn(
          'mt-2 flex items-start gap-2 rounded-xl border border-border/40 bg-muted/20 p-3',
          'text-[11px] leading-5 text-muted-foreground',
        )}
        >
          <Info className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/70" />
          <p>
            Costi calcolati su spread e commissioni tipiche
            {' '}
            <strong className="text-foreground/80">rilevate sui broker</strong>
            {' '}
            (snapshot aggregato, non real-time). Non include funding overnight, slippage e fee di deposito/prelievo — questi fattori sono riportati come
            {' '}
            <strong className="text-foreground/80">stime indicative</strong>
            {' '}
            nelle schede espanse.
          </p>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        highlight && 'rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5',
      )}
    >
      <span className={cn('text-muted-foreground/70', highlight && 'text-primary/80')}>{label}</span>
      <span className={cn('font-medium', highlight ? 'text-primary' : 'text-foreground')}>{value}</span>
    </span>
  );
}
