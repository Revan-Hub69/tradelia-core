'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Calculator,
  CalendarClock,
  ChevronUp,
  ChevronDown,
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
import { computeResults } from '../state/useSimulatorState';
import { AssetSwitcher } from './AssetSwitcher';
import { BrokerCard } from './BrokerCard';
import { PairChip } from './PairChip';
import { TRANSITION } from './motion';

const CAPITAL_PRESETS = [100, 500, 1000, 5000, 25000, 100000];
const LOT_PRESETS = [0.01, 0.05, 0.1, 0.5, 1, 2];
const TRADES_PRESETS = [5, 10, 20, 50, 100];
const EXPOSURE_PRESETS = [0, 5, 10, 15, 20, 25];

type CollapsibleWizardProps = {
  assetId: AssetId;
  onCloseAction: () => void;
};

export function CollapsibleWizard({ assetId, onCloseAction }: CollapsibleWizardProps) {
  const isForex = assetId === 'forex';
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDetail, setIsDetail] = useState(false);
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);

  const [pairSymbol, setPairSymbol] = useState<string>(DEFAULT_FOREX_PAIR.symbol);
  const [capital, setCapital] = useState<number>(5000);
  const [lotSize, setLotSize] = useState<number>(0.1);
  const [tradesPerMonth, setTradesPerMonth] = useState<number>(20);
  const [exposureDaysPerMonth, setExposureDaysPerMonth] = useState<number>(0);

  const input: SimulatorInput = {
    assetId,
    pairSymbol: isForex ? pairSymbol : undefined,
    capital,
    tradesPerMonth,
    lotSize,
    exposureDaysPerMonth,
  };

  const results = computeResults(input);
  const selectedBroker = selectedBrokerId ? results.find(r => r.id === selectedBrokerId) : null;

  const handleSubmit = () => {
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  const handleSelectBroker = (brokerId: string) => {
    setSelectedBrokerId(brokerId);
    setIsDetail(true);
  };

  const handleBackToCompare = () => {
    setIsDetail(false);
    setSelectedBrokerId(null);
  };

  const formatCapital = (v: number) => (v >= 1000 ? `${v / 1000}k` : String(v));

  const hapticFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handlePresetSelect = <T,>(v: T, onSelect: (v: T) => void) => {
    hapticFeedback();
    onSelect(v);
  };

  return (
    <div className="flex h-full flex-col bg-card text-foreground">
      {/* Close button - sempre visibile */}
      <div className="flex items-center justify-end px-4 py-2 sm:px-5 flex-shrink-0">
        <button
          type="button"
          onClick={onCloseAction}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Chiudi"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Collapsible Section - unisce asset, coppia, filtri */}
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION.standard}
            className="border-b border-border/60 overflow-hidden"
          >
            <div className="space-y-4 p-4 sm:p-5">
              {/* Asset Switcher */}
              <div className="flex items-center gap-3">
                <span className="inline-flex size-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                <div className="min-w-0 flex-1">
                  <AssetSwitcher
                    value={assetId}
                    onSelectAction={() => {
                      // Per ora solo Forex è attivo
                    }}
                  />
                </div>
              </div>

              {/* Coppia (solo forex) */}
              {isForex && (
                <div className="rounded-xl border border-border/60 bg-popover/40 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Coppia
                    </span>
                    <PairChip value={pairSymbol} onSelectAction={setPairSymbol} />
                  </div>
                </div>
              )}

              {/* Parametri - grid layout per desktop */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                    onSelect={setCapital}
                    format={formatCapital}
                    onPresetSelect={handlePresetSelect}
                  />
                </InputCard>

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
                    placeholder="Inserisci lotto"
                  />
                  <PresetChips<number>
                    values={LOT_PRESETS}
                    value={lotSize}
                    onSelect={setLotSize}
                    format={v => String(v)}
                    onPresetSelect={handlePresetSelect}
                  />
                </InputCard>

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
                    onSelect={setTradesPerMonth}
                    format={v => String(v)}
                    onPresetSelect={handlePresetSelect}
                  />
                </InputCard>

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
                    onSelect={setExposureDaysPerMonth}
                    format={v => `${v}gg`}
                    onPresetSelect={handlePresetSelect}
                  />
                </InputCard>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="border-t border-border/60 bg-card/80 p-4 backdrop-blur-sm">
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Calculator className="size-4" />
                Calcola stima
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION.standard}
          >
            <div className="border-b border-border/60 bg-muted/30 px-4 py-2.5 sm:px-5">
              <button
                type="button"
                onClick={handleExpand}
                className="flex w-full items-center justify-between gap-2 text-left transition-colors hover:bg-muted/50 rounded-lg px-2 py-1.5"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{formatCapital(capital)}€</span>
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{lotSize}</span>
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5">
                    <Repeat className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{tradesPerMonth}/m</span>
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5">
                    <CalendarClock className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{exposureDaysPerMonth}gg</span>
                  </div>
                  {isForex && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="font-semibold text-foreground">{pairSymbol}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Pencil className="size-3.5" />
                  <ChevronDown className="size-4" />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results - visibili quando collassato */}
      <AnimatePresence mode="wait">
        {!isExpanded && !isDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.standard}
            className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5"
          >
            {results
              .filter(r => r.isEligible)
              .map(broker => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  isOpen={false}
                  onToggleAction={() => {}}
                  onOpenDetailAction={() => handleSelectBroker(broker.id)}
                  lotSize={lotSize}
                  tradesPerMonth={tradesPerMonth}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail View */}
      <AnimatePresence mode="wait">
        {isDetail && selectedBroker && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={TRANSITION.standard}
            className="flex-1 overflow-y-auto p-4 sm:p-5"
          >
            <button
              type="button"
              onClick={handleBackToCompare}
              className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronUp className="size-4" />
              Torna ai risultati
            </button>
            <div className="rounded-xl border border-border/60 bg-popover/40 p-4">
              <h3 className="mb-2 text-lg font-semibold">{selectedBroker.brokerName}</h3>
              <p className="text-sm text-muted-foreground">{selectedBroker.accountName}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo/mese</span>
                  <span className="font-semibold">{selectedBroker.costPerMonth}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo/trade</span>
                  <span className="font-semibold">{selectedBroker.costPerTrade}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Score</span>
                  <span className="font-semibold">{selectedBroker.score}/100</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA - visibile quando espanso */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION.standard}
            className="border-t border-border/60 bg-card/80 p-4 backdrop-blur-sm"
          >
            <motion.button
              type="button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Calculator className="size-4" />
              Calcola stima
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helpers

function formatLotLabel(lot: number): string {
  if (lot < 0.01) return 'nano';
  if (lot < 0.1) return 'micro';
  if (lot < 1) return 'mini';
  return 'standard';
}

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
    <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-card/90">
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className={cn(
            'flex size-8 items-center justify-center rounded-lg transition-colors',
            accent === 'emerald' && 'bg-primary/15 text-primary dark:bg-primary/20',
            accent === 'teal' && 'bg-accent/15 text-accent dark:bg-accent/20',
          )}
        >
          <Icon className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground sm:text-xs">{label}</p>
          <p className="truncate text-xs text-muted-foreground sm:text-[11px]">{hint}</p>
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

  return (
    <div className="group mb-3 flex items-baseline gap-2 rounded-sm border-b-2 border-border pb-1.5 transition-all focus-within:border-primary focus-within:bg-primary/5">
      {prefix && (
        <span className="text-xl font-semibold text-muted-foreground sm:text-lg">{prefix}</span>
      )}
      <input
        ref={inputRef}
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? 0 : Number(v));
        }}
        className="min-w-0 flex-1 border-0 bg-transparent text-2xl font-bold tabular-nums tracking-tight text-foreground outline-none placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground/60 focus:ring-0 sm:text-xl"
        min={min}
        max={max}
        step={step}
        inputMode="decimal"
        style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}
      />
      {suffix && (
        <span className="text-xs font-medium text-muted-foreground sm:text-[11px]">{suffix}</span>
      )}
    </div>
  );
}

type PresetChipsProps<T> = {
  values: T[];
  value: T;
  onSelect: (v: T) => void;
  format: (v: T) => string;
  onPresetSelect?: (v: T, onSelect: (v: T) => void) => void;
};

function PresetChips<T>({ values, value, onSelect, format, onPresetSelect }: PresetChipsProps<T>) {
  const handleClick = (v: T) => {
    if (onPresetSelect) {
      onPresetSelect(v, onSelect);
    } else {
      onSelect(v);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {values.map(v => (
        <button
          key={String(v)}
          type="button"
          onClick={() => handleClick(v)}
          className={cn(
            'min-h-[44px] rounded-lg px-3 py-2 text-sm font-medium transition-all sm:px-4 sm:py-2.5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            value === v
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'border border-border/60 bg-card/80 text-muted-foreground hover:border-primary/50 hover:bg-card hover:text-foreground dark:bg-card/90 dark:hover:bg-card/95',
          )}
        >
          {format(v)}
        </button>
      ))}
    </div>
  );
}
