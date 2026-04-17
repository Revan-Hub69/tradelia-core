'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  Gauge,
  Pencil,
  Repeat,
  Wallet,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';

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

const CAPITAL_PRESETS = [100, 500, 1000, 5000, 25000, 100000];
const TRADES_PRESETS = [5, 10, 20, 50, 100];

/**
 * Lot presets balanced with account size.
 * Rule: max preset should allow ~10% of account at 100:1 leverage (micro) or
 * reflect realistic retail position sizing (0.01-0.5 lot typical).
 */
function getLotPresets(capital: number): number[] {
  if (capital < 500) {
    // Cent/micro accounts - nano lots
    return [0.001, 0.005, 0.01, 0.02, 0.05];
  }
  if (capital < 2000) {
    // Small retail - micro lots
    return [0.01, 0.02, 0.05, 0.1, 0.2];
  }
  if (capital < 5000) {
    // Mid retail - mini/micro mix
    return [0.05, 0.1, 0.2, 0.5, 1];
  }
  if (capital < 20000) {
    // Standard retail
    return [0.1, 0.25, 0.5, 1, 2];
  }
  // Pro/large accounts
  return [0.5, 1, 2, 5, 10];
}

export function Wizard({ assetId, onSubmit, onClose }: WizardProps) {
  const isForex = assetId === 'forex';
  const [pairSymbol, setPairSymbol] = useState<string>(
    DEFAULT_FOREX_PAIR.symbol,
  );
  const [capital, setCapital] = useState<number>(1000);
  const [lotSize, setLotSize] = useState<number>(0.1);
  const [tradesPerMonth, setTradesPerMonth] = useState<number>(20);

  const lotPresets = useMemo(() => getLotPresets(capital), [capital]);

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
      {/* Header — compact */}
      <div className="border-b border-border/60">
        <div className="flex items-center justify-between px-5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Forex Simulator
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

        {isForex && (
          <div className="border-t border-border/40 bg-popover/30 px-5 py-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Coppia
              </span>
              <PairChip value={pairSymbol} onSelect={setPairSymbol} />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {/* Account size */}
        <InputCard
          icon={Wallet}
          accent="emerald"
          label="Dimensione account"
          hint="Il capitale del tuo conto trading"
        >
          <EditableAmount
            prefix="€"
            value={capital}
            onChange={setCapital}
            min={10}
            step={10}
          />
          <PresetChips<number>
            values={CAPITAL_PRESETS}
            value={capital}
            onSelect={v => setCapital(v)}
            format={v => `€${v >= 1000 ? `${v / 1000}k` : v}`}
          />
        </InputCard>

        {/* Lot size — adaptive to account */}
        <InputCard
          icon={Gauge}
          accent="teal"
          label="Dimensione posizione"
          hint={`Lotti per trade · ${formatLotLabel(lotSize)}`}
        >
          <EditableAmount
            suffix="lot"
            value={lotSize}
            onChange={setLotSize}
            min={0.001}
            step={0.01}
            decimals={3}
          />
          <PresetChips<number>
            values={lotPresets}
            value={lotSize}
            onSelect={v => setLotSize(v)}
            format={v => String(v)}
          />
        </InputCard>

        {/* Trades per month */}
        <InputCard
          icon={Repeat}
          accent="emerald"
          label="Trade al mese"
          hint="Frequenza operativa media"
        >
          <EditableAmount
            suffix="/mese"
            value={tradesPerMonth}
            onChange={setTradesPerMonth}
            min={1}
            max={500}
            step={1}
          />
          <PresetChips<number>
            values={TRADES_PRESETS}
            value={tradesPerMonth}
            onSelect={v => setTradesPerMonth(v)}
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
            'group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all',
            'bg-primary text-primary-foreground shadow-lg shadow-primary/20',
            'hover:shadow-xl hover:shadow-primary/30',
            'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          )}
        >
          <Calculator className="size-4" />
          Calcola stima
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </motion.button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Helpers

function formatLotLabel(lot: number): string {
  if (lot < 0.01) {
    return 'nano';
  }
  if (lot < 0.1) {
    return 'micro';
  }
  if (lot < 1) {
    return 'mini';
  }
  return 'standard';
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
    <div className="rounded-xl border border-border/60 bg-popover/40 p-4">
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-lg',
            accent === 'emerald' && 'bg-primary/10 text-primary',
            accent === 'teal' && 'bg-accent/10 text-accent',
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-foreground">{label}</p>
          <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

type EditableAmountProps = {
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  decimals?: number;
};

function EditableAmount({
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
  decimals,
}: EditableAmountProps) {
  return (
    <div
      className={cn(
        'group mb-3 flex items-baseline gap-2 border-b-2 border-border pb-1.5 transition-colors',
        'focus-within:border-primary',
      )}
    >
      {prefix && (
        <span className="text-xl font-semibold text-muted-foreground">
          {prefix}
        </span>
      )}
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="min-w-0 flex-1 border-0 bg-transparent text-2xl font-bold tracking-tight text-foreground outline-none focus:ring-0"
        min={min}
        max={max}
        step={step}
        inputMode="decimal"
      />
      {suffix && (
        <span className="text-xs font-medium text-muted-foreground">
          {suffix}
        </span>
      )}
      <Pencil className="size-3.5 text-muted-foreground/50 group-focus-within:text-primary" />
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
            'rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all',
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
