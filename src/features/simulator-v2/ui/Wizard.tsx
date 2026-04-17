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
import { PairChip } from './PairChip';

type WizardProps = {
  assetId: AssetId;
  onSubmit: (input: SimulatorInput) => void;
  onClose: () => void;
};

// Retail-realistic presets (2026 aggregated market data)
const CAPITAL_PRESETS = [100, 500, 1000, 5000, 25000, 100000];
const LOTS_PRESETS = [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2];
const TRADES_PRESETS = [5, 10, 20, 50, 100];

export function Wizard({ assetId, onSubmit, onClose }: WizardProps) {
  const isForex = assetId === 'forex';
  const [pairSymbol, setPairSymbol] = useState<string>(
    DEFAULT_FOREX_PAIR.symbol,
  );
  const [capital, setCapital] = useState<number>(1000);
  const [lotSize, setLotSize] = useState<number>(0.1);
  const [tradesPerMonth, setTradesPerMonth] = useState<number>(20);

  const canSubmit
    = capital >= 10 && lotSize >= 0.001 && tradesPerMonth > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onSubmit({
      assetId,
      pairSymbol: isForex ? pairSymbol : undefined,
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
          Spread, commissioni e funding aggregati da tariffari broker pubblici.
          Imposta il tuo scenario e confronta i broker eleggibili.
        </p>

        {/* Pair chip inline */}
        {isForex && (
          <div className="mt-5">
            <PairChip value={pairSymbol} onSelect={setPairSymbol} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
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
              min={10}
              step={10}
              aria-label="Dimensione account in euro"
            />
          </div>
          <PresetChips
            values={CAPITAL_PRESETS}
            value={capital}
            onSelect={setCapital}
            format={v => `€${v >= 1000 ? `${v / 1000}k` : v}`}
          />
          <p className="mt-3 text-[11px] text-muted-foreground/70">
            Il capitale filtra i broker che potresti realmente aprire (ogni
            broker ha un deposito minimo).
          </p>
        </InputCard>

        {/* Lot size */}
        <InputCard
          icon={Gauge}
          accent="teal"
          label="Dimensione posizione"
          hint="Grandezza media di un tuo trade"
        >
          <div className="mb-4 flex items-baseline gap-2">
            <input
              type="number"
              value={lotSize}
              onChange={e => setLotSize(Number(e.target.value))}
              className="w-full border-0 bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none focus:ring-0"
              min={0.001}
              step={0.01}
              aria-label="Dimensione posizione in lotti"
            />
            <span className="text-sm font-medium text-muted-foreground">
              {formatLotLabel(lotSize)}
            </span>
          </div>
          <PresetChips
            values={LOTS_PRESETS}
            value={lotSize}
            onSelect={setLotSize}
            format={v => String(v)}
          />
          <p className="mt-3 text-[11px] text-muted-foreground/70">
            1 micro lot = 1.000 unità · 1 mini = 10.000 · 1 standard = 100.000
          </p>
        </InputCard>

        {/* Trades per month */}
        <InputCard
          icon={Repeat}
          accent="emerald"
          label="Trade al mese"
          hint="Quante operazioni esegui mediamente"
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
            <span className="text-sm font-medium text-muted-foreground">
              / mese
            </span>
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
          Vedi broker eleggibili
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </motion.button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground/70">
          Gratuito · nessuna registrazione · dati aggregati da tariffari
          pubblici
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Helpers

function formatLotLabel(lot: number): string {
  if (lot < 0.01) {
    return 'nano lot';
  }
  if (lot < 0.1) {
    return 'micro lot';
  }
  if (lot < 1) {
    return 'mini lot';
  }
  return 'standard lot';
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
