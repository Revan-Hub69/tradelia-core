'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  CalendarClock,
  Gauge,
  Pencil,
  Repeat,
  Wallet,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { cn } from '@/utils/Helpers';

import type { AssetId } from '../data/assets';
import { DEFAULT_FOREX_PAIR } from '../data/forex-pairs';
import type { SimulatorInput } from '../state/useSimulatorState';
import { AssetSwitcher } from './AssetSwitcher';
import { PairChip } from './PairChip';

type WizardProps = {
  assetId: AssetId;
  onSubmitAction: (input: SimulatorInput) => void;
  onCloseAction: () => void;
};

const CAPITAL_PRESETS = [100, 500, 1000, 5000, 25000, 100000];
const LOT_PRESETS = [0.01, 0.05, 0.1, 0.5, 1, 2];
const TRADES_PRESETS = [5, 10, 20, 50, 100];
/** Giorni/mese in cui hai almeno una posizione aperta al rollover. 0 = solo intraday. */
const EXPOSURE_PRESETS = [0, 5, 10, 15, 20, 25];

export function Wizard({ assetId, onSubmitAction, onCloseAction }: WizardProps) {
  const isForex = assetId === 'forex';
  const [pairSymbol, setPairSymbol] = useState<string>(
    DEFAULT_FOREX_PAIR.symbol,
  );
  const [capital, setCapital] = useState<number | null>(null);
  const [lotSize, setLotSize] = useState<number | null>(null);
  const [tradesPerMonth, setTradesPerMonth] = useState<number | null>(null);
  const [exposureDaysPerMonth, setExposureDaysPerMonth] = useState<number | null>(null);

  // Refs per auto-scroll tra step
  const stepRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const scrollToStep = (idx: number) => {
    if (idx < stepRefs.length) {
      stepRefs[idx]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const canSubmit
    = capital !== null && capital >= 10
      && lotSize !== null && lotSize >= 0.001
      && tradesPerMonth !== null && tradesPerMonth > 0
      && exposureDaysPerMonth !== null;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onSubmitAction({
      assetId,
      pairSymbol: isForex ? pairSymbol : undefined,
      capital: capital!,
      tradesPerMonth: tradesPerMonth!,
      lotSize: lotSize!,
      exposureDaysPerMonth: exposureDaysPerMonth!,
    });
  };

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      {/* Header — compact with asset switcher */}
      <div className="border-b border-border/60">
        <div className="flex items-center gap-3 px-5 py-2">
          <span className="inline-flex size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
          <div className="min-w-0 flex-1">
            <AssetSwitcher
              value={assetId}
              onSelectAction={() => {
                // Per ora solo Forex è attivo — altri asset sono "In arrivo"
              }}
            />
          </div>
          <button
            type="button"
            onClick={onCloseAction}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Chiudi"
          >
            <X className="size-4" />
          </button>
        </div>

        {isForex && (
          <div className="border-t border-border/40 bg-popover/30 px-5 py-2.5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  Coppia
                </span>
                <PairChip value={pairSymbol} onSelectAction={setPairSymbol} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {/* Step 1 — Account size */}
        <div ref={stepRefs[0]}>
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
              placeholder="Inserisci capitale"
            />
            <PresetChips<number>
              values={CAPITAL_PRESETS}
              value={capital}
              onSelect={(v) => {
                setCapital(v);
                scrollToStep(1);
              }}
              format={v => `€${v >= 1000 ? `${v / 1000}k` : v}`}
            />
          </InputCard>
        </div>

        {/* Step 2 — Lot size */}
        <div ref={stepRefs[1]}>
          <InputCard
            icon={Gauge}
            accent="teal"
            label="Dimensione posizione"
            hint={lotSize !== null ? `Lotti per trade · ${formatLotLabel(lotSize)}` : 'Lotti per trade'}
          >
            <EditableAmount
              suffix="lot"
              value={lotSize}
              onChange={setLotSize}
              min={0.001}
              step={0.01}
              placeholder="Inserisci lotto"
            />
            <PresetChips<number>
              values={LOT_PRESETS}
              value={lotSize}
              onSelect={(v) => {
                setLotSize(v);
                scrollToStep(2);
              }}
              format={v => String(v)}
            />
          </InputCard>
        </div>

        {/* Step 3 — Trade al mese */}
        <div ref={stepRefs[2]}>
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
              placeholder="Inserisci frequenza"
            />
            <PresetChips<number>
              values={TRADES_PRESETS}
              value={tradesPerMonth}
              onSelect={(v) => {
                setTradesPerMonth(v);
                scrollToStep(3);
              }}
              format={v => String(v)}
            />
          </InputCard>
        </div>

        {/* Step 4 — Esposizione overnight (0 gg = intraday) */}
        <div ref={stepRefs[3]}>
          <InputCard
            icon={CalendarClock}
            accent="teal"
            label="Esposizione overnight"
            hint="Giorni al mese con posizione aperta al rollover · 0 = solo intraday"
          >
            <EditableAmount
              suffix="gg/mese"
              value={exposureDaysPerMonth}
              onChange={setExposureDaysPerMonth}
              min={0}
              max={25}
              step={1}
              placeholder="Inserisci giorni"
            />
            <PresetChips<number>
              values={EXPOSURE_PRESETS}
              value={exposureDaysPerMonth}
              onSelect={v => setExposureDaysPerMonth(v)}
              format={v => `${v}gg`}
            />
          </InputCard>
        </div>
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
  value: number | null;
  onChange: (v: number | null) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
};

function EditableAmount({
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step,
  placeholder,
}: EditableAmountProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handlePencilClick = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className="group mb-3 flex items-baseline gap-2 border-b-2 border-border pb-1.5 transition-colors focus-within:border-primary">
      {prefix && (
        <span className="text-xl font-semibold text-muted-foreground">
          {prefix}
        </span>
      )}
      <input
        ref={inputRef}
        type="number"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? null : Number(v));
        }}
        className="min-w-0 flex-1 border-0 bg-transparent text-2xl font-bold tracking-tight text-foreground outline-none placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground/40 focus:ring-0"
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
      <button
        type="button"
        onClick={handlePencilClick}
        className="rounded p-0.5 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-primary group-focus-within:text-primary"
        aria-label="Modifica"
      >
        <Pencil className="size-3.5" />
      </button>
    </div>
  );
}

type PresetChipsProps<T> = {
  values: T[];
  value: T | null;
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
