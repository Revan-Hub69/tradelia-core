'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Gauge,
  Repeat,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/Helpers';

import { DEFAULT_FOREX_PAIR } from '../data/forex-pairs';
import type { SimulatorInput } from '../state/useSimulatorState';
import type { AssetId } from './AssetSelector';

type WizardProps = {
  assetId: AssetId;
  onSubmit: (input: SimulatorInput) => void;
  onClose: () => void;
};

const CAPITAL_PRESETS = [1000, 2500, 5000, 10000, 25000, 50000];
const LOTS_PRESETS = [0.01, 0.1, 0.5, 1, 2, 5];
const TRADES_PRESETS = [5, 10, 20, 50, 100];

export function Wizard({ assetId, onSubmit, onClose }: WizardProps) {
  const [capital, setCapital] = useState<number>(10000);
  const [lotSize, setLotSize] = useState<number>(0.1);
  const [tradesPerMonth, setTradesPerMonth] = useState<number>(20);

  const canSubmit = capital > 0 && lotSize > 0 && tradesPerMonth > 0;
  const defaultPair = assetId === 'forex' ? DEFAULT_FOREX_PAIR : null;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onSubmit({
      assetId,
      pairSymbol: defaultPair?.symbol,
      capital,
      tradesPerMonth,
      lotSize,
    });
  };

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      {/* Header */}
      <div className="relative border-b border-border/60 px-6 pb-5 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Chiudi"
        >
          <X className="size-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="inline-flex size-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Forex Cost Simulator
          </p>
        </div>

        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          Simula i costi reali del forex
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Calcoliamo spread, commissioni e funding su dati broker aggregati. Imposta la dimensione e la frequenza dei tuoi trade.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {/* Pair context chip */}
        {defaultPair && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-popover/60 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-1 text-2xl leading-none">
                <span>{defaultPair.baseFlag}</span>
                <span>{defaultPair.quoteFlag}</span>
              </div>
              <div>
                <p className="font-mono text-sm font-semibold tracking-tight text-foreground">
                  {defaultPair.symbol}
                </p>
                <p className="text-xs text-muted-foreground">
                  Coppia predefinita · cambiabile dopo
                </p>
              </div>
            </div>
            <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Default
            </span>
          </div>
        )}

        {/* Account size */}
        <InputCard
          icon={Wallet}
          accent="emerald"
          label="Dimensione account"
          hint="Il capitale totale del tuo conto trading"
        >
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-muted-foreground">€</span>
            <input
              type="number"
              value={capital}
              onChange={e => setCapital(Number(e.target.value))}
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none focus:ring-0"
              min={100}
              step={100}
              aria-label="Dimensione account in euro"
            />
          </div>
          <PresetChips
            values={CAPITAL_PRESETS}
            value={capital}
            onSelect={setCapital}
            format={v => `€${v.toLocaleString('it-IT')}`}
          />
        </InputCard>

        {/* Lot size */}
        <InputCard
          icon={Gauge}
          accent="teal"
          label="Dimensione posizione"
          hint="Quanto è grande in media un tuo trade (in lotti standard)"
        >
          <div className="mb-4 flex items-baseline gap-2">
            <input
              type="number"
              value={lotSize}
              onChange={e => setLotSize(Number(e.target.value))}
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none focus:ring-0"
              min={0.01}
              step={0.01}
              aria-label="Dimensione posizione in lotti"
            />
            <span className="text-sm font-medium text-muted-foreground">lots</span>
          </div>
          <PresetChips
            values={LOTS_PRESETS}
            value={lotSize}
            onSelect={setLotSize}
            format={v => String(v)}
          />
        </InputCard>

        {/* Trades per month */}
        <InputCard
          icon={Repeat}
          accent="emerald"
          label="Trade al mese"
          hint="Quante operazioni esegui mediamente in un mese"
        >
          <div className="mb-4 flex items-baseline gap-2">
            <input
              type="number"
              value={tradesPerMonth}
              onChange={e => setTradesPerMonth(Number(e.target.value))}
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none focus:ring-0"
              min={1}
              max={500}
              aria-label="Numero trade al mese"
            />
            <span className="text-sm font-medium text-muted-foreground">/ mese</span>
          </div>
          <PresetChips
            values={TRADES_PRESETS}
            value={tradesPerMonth}
            onSelect={setTradesPerMonth}
            format={v => String(v)}
          />
        </InputCard>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border/60 bg-card/80 p-4 backdrop-blur-sm">
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          whileHover={canSubmit ? { scale: 1.01 } : {}}
          whileTap={canSubmit ? { scale: 0.99 } : {}}
          className={cn(
            'group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold transition-all',
            'bg-primary text-primary-foreground shadow-lg shadow-primary/20',
            'hover:shadow-xl hover:shadow-primary/30',
            'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <Sparkles className="size-4" />
          Vedi risultati
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </motion.button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
          Gratuito · nessuna registrazione · risultati in tempo reale
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Subcomponents

type InputCardProps = {
  icon: React.ElementType;
  accent: 'emerald' | 'teal';
  label: string;
  hint: string;
  children: React.ReactNode;
};

function InputCard({ icon: Icon, accent, label, hint, children }: InputCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-popover/40 p-5 backdrop-blur-sm transition-colors hover:border-border">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            'flex size-10 items-center justify-center rounded-xl',
            accent === 'emerald' && 'bg-primary/10 text-primary',
            accent === 'teal' && 'bg-accent/10 text-accent',
          )}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

type PresetChipsProps<T> = {
  values: T[];
  value: T;
  onSelect: (v: T) => void;
  format: (v: T) => string;
};

function PresetChips<T>({ values, value, onSelect, format }: PresetChipsProps<T>) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {values.map(v => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onSelect(v)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            value === v
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'border border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground',
          )}
        >
          {format(v)}
        </button>
      ))}
    </div>
  );
}
