'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Calculator,
  CalendarClock,
  ChevronDown,
  Gauge,
  Info,
  Minus,
  Pencil,
  Plus,
  Repeat,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { TooltipProvider, TooltipWrapper } from '@/components/ui/tooltip';
import { cn } from '@/utils/Helpers';

import type { AssetId } from '../data/assets';
import { DEFAULT_FOREX_PAIR } from '../data/forex-pairs';
import type { SimulatorInput } from '../state/useSimulatorState';
import { computeResults } from '../state/useSimulatorState';
import { AssetSwitcher } from './AssetSwitcher';
import { TRANSITION } from './motion';
import { PairCommandSelector } from './PairCommandSelector';
import { ResultsDetail } from './results/ResultsDetail';
import { ResultsSkeleton } from './results/ResultsSkeleton';
import { ResultsView } from './results/ResultsView';

const CAPITAL_PRESETS = [100, 500, 1000, 5000, 25000, 100000];
const TRADES_PRESETS = [5, 10, 20, 50, 100, 200, 500];
const EXPOSURE_PRESETS = [0, 5, 10, 15, 20, 25];

/**
 * Step a scaglioni per il capitale: salti più ampi per cambiare valore più velocemente.
 * Regole: <500 → 50 · <2k → 100 · <5k → 250 · <10k → 500 · <25k → 1000 · <100k → 2500 · >=100k → 5000.
 */
function capitalStep(v: number): number {
  if (v < 500) {
 return 50;
}
  if (v < 2000) {
 return 100;
}
  if (v < 5000) {
 return 250;
}
  if (v < 10000) {
 return 500;
}
  if (v < 25000) {
 return 1000;
}
  if (v < 100000) {
 return 2500;
}
  return 5000;
}

/**
 * Step a scaglioni per il lotto: rispetta granularità reale del broker.
 * Usa strict less-than con epsilon per evitare stalli ai confini di tier.
 * <0.01 → 0.001 (nano) · <0.1 → 0.01 (micro) · <1 → 0.1 (mini) · >=1 → 1 (standard).
 */
function lotStep(v: number): number {
  if (v < 0.01 - 1e-9) {
 return 0.001;
}
  if (v < 0.1 - 1e-9) {
 return 0.01;
}
  if (v < 1 - 1e-9) {
 return 0.1;
}
  return 1;
}

/**
 * Step a scaglioni per i trade/mese: evita +1 all'infinito fino a 500.
 * <10 → 1 · <50 → 5 · <100 → 10 · <200 → 25 · <500 → 50 · >=500 → 100.
 */
function tradesStep(v: number): number {
  if (v < 10) {
 return 1;
}
  if (v < 50) {
 return 5;
}
  if (v < 100) {
 return 10;
}
  if (v < 200) {
 return 25;
}
  if (v < 500) {
 return 50;
}
  return 100;
}

/**
 * Preset lotto adattivi al capitale. Include nano (0.001) per conti piccoli.
 */
function getLotPresets(capital: number): number[] {
  if (capital < 500) {
 return [0.001, 0.005, 0.01, 0.05, 0.1];
}
  if (capital < 2500) {
 return [0.01, 0.05, 0.1, 0.25, 0.5];
}
  if (capital < 10000) {
 return [0.05, 0.1, 0.25, 0.5, 1, 2];
}
  if (capital < 50000) {
 return [0.1, 0.5, 1, 2, 5, 10];
}
  return [0.5, 1, 2, 5, 10, 20];
}

function formatLot(v: number): string {
  // 0.001 → "0.001", 0.01 → "0.01", 1 → "1", 2 → "2"
  if (v < 0.01) {
 return v.toFixed(3);
}
  if (v < 1) {
 return v.toFixed(2).replace(/0$/, '').replace(/\.$/, '');
}
  return String(v);
}

type CollapsibleWizardProps = {
  assetId: AssetId;
  onCloseAction: () => void;
};

export function CollapsibleWizard({ assetId, onCloseAction }: CollapsibleWizardProps) {
  const isForex = assetId === 'forex';
  type ViewState = 'wizard' | 'computing' | 'results' | 'detail';
  const [viewState, setViewState] = useState<ViewState>('wizard');
  const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isExpanded = viewState === 'wizard';
  const isDetail = viewState === 'detail';
  const isComputing = viewState === 'computing';

  const [pairSymbol, setPairSymbol] = useState<string>(DEFAULT_FOREX_PAIR.symbol);
  const [capital, setCapital] = useState<number>(0);
  const [lotSize, setLotSize] = useState<number>(0);
  const [tradesPerMonth, setTradesPerMonth] = useState<number>(0);
  const [exposureDaysPerMonth, setExposureDaysPerMonth] = useState<number>(0);

  // Validation: CTA disabled if required fields are empty
  const isValid = capital > 0 && lotSize > 0 && tradesPerMonth > 0;

  // Helper to scroll element into view within the scrollable container
  const scrollIntoView = (element: HTMLElement) => {
    const container = scrollContainerRef.current;
    if (!container || !element) {
 return;
}
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
    const padding = 16; // px padding
    container.scrollTo({
      top: Math.max(0, relativeTop - padding),
      behavior: 'smooth',
    });
  };

  /**
   * Aggiorna capitale + adatta il lotto al nuovo tier.
   * - Se il lotto corrente coincide con un preset del vecchio tier, mantiene
   *   lo stesso indice nel nuovo tier (es. "2° preset" resta "2° preset").
   * - Altrimenti scala proporzionalmente sul max del tier e fa snap al
   *   preset più vicino.
   * Così l'utente vede sempre la selezione muoversi in modo coerente.
   */
  const handleCapitalChange = (newCapital: number) => {
    const oldPresets = getLotPresets(capital);
    const newPresets = getLotPresets(newCapital);
    const oldIdx = oldPresets.findIndex(p => Math.abs(p - lotSize) < 1e-6);
    let nextLot: number;
    if (oldIdx >= 0) {
      nextLot = newPresets[oldIdx]!;
    } else {
      const oldMax = oldPresets[oldPresets.length - 1]!;
      const newMax = newPresets[newPresets.length - 1]!;
      const scaled = lotSize * (newMax / oldMax);
      nextLot = newPresets.reduce((a, b) =>
        Math.abs(b - scaled) < Math.abs(a - scaled) ? b : a,
      );
    }
    setCapital(newCapital);
    setLotSize(nextLot);
  };

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
    setViewState('computing');
  };

  const handleExpand = () => {
    setViewState('wizard');
  };

  const handleSelectBroker = (brokerId: string) => {
    setSelectedBrokerId(brokerId);
    setViewState('detail');
  };

  const handleBackToCompare = () => {
    setSelectedBrokerId(null);
    setViewState('results');
  };

  // Transizione artificiale skeleton → results (400ms, accessibility-aware)
  useEffect(() => {
    if (viewState !== 'computing') {
 return;
}
    const t = setTimeout(() => {
      setViewState('results');
    }, 400);
    return () => clearTimeout(t);
  }, [viewState]);

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

  const capitalId = useId();
  const lotId = useId();
  const tradesId = useId();
  const daysId = useId();

  const prefersReduced = useReducedMotion();
  const stagger = prefersReduced
    ? { initial: false as const, animate: {}, transition: { duration: 0 } }
    : {
        initial: 'hidden' as const,
        animate: 'visible' as const,
        variants: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
        },
      };
  const itemVariants = prefersReduced
    ? undefined
    : {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: TRANSITION.standard },
      };

  return (
    <TooltipProvider delayDuration={400}>
    <div className="flex h-full min-h-0 flex-col bg-card text-foreground">
      {/* Header: titolo + close — nascosto in detail per massima focus sulla scheda conto */}
      {!isDetail && (
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-foreground">Configura simulazione</h2>
          <button
            type="button"
            onClick={onCloseAction}
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Chiudi simulatore"
          >
            <X className="size-5" />
          </button>
        </div>
      )}

      {/* Collapsible Section - unisce asset, coppia, filtri. Nascosta in detail. */}
      <AnimatePresence mode="wait">
        {isDetail ? null : isExpanded ? (
          <motion.div
            key="expanded"
            ref={scrollContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.standard}
            className="min-h-0 flex-1 overflow-y-auto border-b border-border"
          >
            <motion.div
              {...stagger}
              className="space-y-6 p-4 sm:p-5 lg:p-6"
            >
              {/* Gruppo: Strumento */}
              <motion.section variants={itemVariants} aria-labelledby="group-instrument" className="space-y-3">
                <h3 id="group-instrument" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Strumento</h3>
                <AssetSwitcher
                  value={assetId}
                  onSelectAction={() => {
                    // Per ora solo Forex è attivo
                  }}
                />
                {isForex && (
                  <PairCommandSelector
                    value={pairSymbol}
                    onSelectAction={setPairSymbol}
                    onOpenScrollAction={scrollIntoView}
                  />
                )}
              </motion.section>

              {/* Gruppo: Parametri */}
              <motion.section variants={itemVariants} aria-labelledby="group-params" className="space-y-3">
                <h3 id="group-params" className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Parametri</h3>
                <div className="grid grid-cols-1 gap-4">
                <InputCard
                  icon={Wallet}
                  accent="emerald"
                  label="Dimensione account"
                  hint="Il capitale del tuo conto trading"
                  htmlFor={capitalId}
                >
                  <EditableAmount
                    id={capitalId}
                    prefix="€"
                    value={capital}
                    onChange={handleCapitalChange}
                    min={10}
                    step={capitalStep}
                    placeholder="Inserisci capitale"
                    onFocusScroll={scrollIntoView}
                  />
                  <PresetChips<number>
                    values={CAPITAL_PRESETS}
                    value={capital}
                    onSelect={handleCapitalChange}
                    format={formatCapital}
                    onPresetSelect={handlePresetSelect}
                    onSelectScroll={scrollIntoView}
                  />
                </InputCard>

                <InputCard
                  icon={Gauge}
                  accent="teal"
                  label="Dimensione posizione"
                  hint={`Lotti per trade · ${formatLotLabel(lotSize)}`}
                  htmlFor={lotId}
                  tooltip="1 lotto standard = 100.000 unità della valuta base. Mini = 0.1, micro = 0.01, nano < 0.01."
                >
                  <EditableAmount
                    id={lotId}
                    suffix="lot"
                    value={lotSize}
                    onChange={setLotSize}
                    min={0.001}
                    step={lotStep}
                    placeholder="Inserisci lotto"
                    onFocusScroll={scrollIntoView}
                  />
                  <PresetChips<number>
                    values={getLotPresets(capital)}
                    value={lotSize}
                    onSelect={setLotSize}
                    format={formatLot}
                    onSelectScroll={scrollIntoView}
                    onPresetSelect={handlePresetSelect}
                  />
                </InputCard>

                <InputCard
                  icon={Repeat}
                  accent="emerald"
                  label="Trade al mese"
                  hint="Frequenza operativa media"
                  htmlFor={tradesId}
                >
                  <EditableAmount
                    id={tradesId}
                    suffix="/mese"
                    value={tradesPerMonth}
                    onChange={setTradesPerMonth}
                    min={1}
                    max={1000}
                    step={tradesStep}
                    placeholder="Inserisci frequenza"
                    onFocusScroll={scrollIntoView}
                  />
                  <PresetChips<number>
                    values={TRADES_PRESETS}
                    value={tradesPerMonth}
                    onSelect={setTradesPerMonth}
                    format={v => String(v)}
                    onSelectScroll={scrollIntoView}
                    onPresetSelect={handlePresetSelect}
                  />
                </InputCard>

                <InputCard
                  icon={CalendarClock}
                  accent="teal"
                  label="Esposizione overnight"
                  hint="Giorni/mese con posizione aperta al rollover"
                  htmlFor={daysId}
                  tooltip="Le posizioni aperte dopo le 23:00 (rollover) pagano uno swap giornaliero. 0 = solo intraday, nessun costo swap."
                >
                  <EditableAmount
                    id={daysId}
                    suffix="gg/mese"
                    value={exposureDaysPerMonth}
                    onChange={setExposureDaysPerMonth}
                    min={0}
                    max={25}
                    step={1}
                    placeholder="Inserisci giorni"
                    onFocusScroll={scrollIntoView}
                  />
                  <PresetChips<number>
                    values={EXPOSURE_PRESETS}
                    value={exposureDaysPerMonth}
                    onSelect={setExposureDaysPerMonth}
                    format={v => `${v}gg`}
                    onSelectScroll={scrollIntoView}
                    onPresetSelect={handlePresetSelect}
                  />
                </InputCard>
                </div>
              </motion.section>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.standard}
            className="flex-shrink-0"
          >
            <div className="border-b border-border bg-muted/40 px-4 py-2.5 sm:px-5">
              <button
                type="button"
                onClick={handleExpand}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs tabular-nums">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {formatCapital(capital)}
                      €
                    </span>
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5">
                    <Gauge className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{lotSize}</span>
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5">
                    <Repeat className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {tradesPerMonth}
                      /m
                    </span>
                  </div>
                  <span className="text-muted-foreground/40">·</span>
                  <div className="flex items-center gap-1.5">
                    <CalendarClock className="size-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {exposureDaysPerMonth}
                      gg
                    </span>
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

      {/* Results / Computing / Detail - visibili quando non si è nel wizard */}
      <AnimatePresence mode="wait">
        {isComputing && (
          <motion.div
            key="computing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.standard}
            className="flex-1 overflow-y-auto"
          >
            <ResultsSkeleton />
          </motion.div>
        )}

        {viewState === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.standard}
            className="flex-1 overflow-y-auto"
          >
            <ResultsView
              results={results}
              capital={capital}
              onSelectBrokerAction={handleSelectBroker}
              onEditAction={handleExpand}
            />
          </motion.div>
        )}

        {isDetail && selectedBroker && (
          <div key="detail" className="flex flex-1 flex-col overflow-hidden">
            <ResultsDetail
              broker={selectedBroker}
              lotSize={lotSize}
              tradesPerMonth={tradesPerMonth}
              onBackAction={handleBackToCompare}
              onCloseAction={onCloseAction}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Footer CTA - visibile quando espanso */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITION.standard}
            className="flex-shrink-0 border-t border-border bg-card/95 p-4 shadow-[0_-6px_24px_-8px_rgba(0,0,0,0.15)] backdrop-blur-md"
          >
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              whileHover={{ scale: isValid ? 1.01 : 1 }}
              whileTap={{ scale: isValid ? 0.99 : 1 }}
              className={cn(
                'group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isValid
                  ? 'bg-primary text-primary-foreground shadow-primary/20 hover:shadow-xl hover:shadow-primary/30'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60',
              )}
            >
              <Calculator className="size-4" />
              Analizza costi
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </TooltipProvider>
  );
}

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

// Subcomponents

type InputCardProps = {
  icon: React.ElementType;
  accent: 'emerald' | 'teal';
  label: string;
  hint: string;
  children: React.ReactNode;
  htmlFor?: string;
  tooltip?: string;
};

function InputCard({ icon: Icon, accent, label, hint, children, htmlFor, tooltip }: InputCardProps) {
  return (
    <div data-input-card className="rounded-xl border border-border bg-background/60 p-4 shadow-sm transition-all hover:border-border hover:shadow-md">
      <div className="mb-3 flex items-center gap-2.5">
        <div
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            accent === 'emerald' && 'bg-primary/15 text-primary dark:bg-primary/20',
            accent === 'teal' && 'bg-accent/15 text-accent dark:bg-accent/20',
          )}
        >
          <Icon className="size-4" />
        </div>
        <label htmlFor={htmlFor} className="min-w-0 flex-1 cursor-pointer">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            {label}
            {tooltip && (
              <TooltipWrapper content={<span className="block max-w-[220px] text-pretty">{tooltip}</span>} side="top">
                <button
                  type="button"
                  aria-label={`Info su ${label}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Info className="size-3.5" />
                </button>
              </TooltipWrapper>
            )}
          </p>
          <p className="truncate text-xs text-muted-foreground">{hint}</p>
        </label>
      </div>
      {children}
    </div>
  );
}

type EditableAmountProps = {
  id?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  /** Numero fisso oppure funzione che calcola lo step in base al valore corrente (tiered). */
  step?: number | ((v: number) => number);
  placeholder?: string;
  /** Optional callback to scroll element into view when focused */
  onFocusScroll?: (element: HTMLElement) => void;
};

function EditableAmount({
  id,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
  step = 1,
  placeholder,
  onFocusScroll,
}: EditableAmountProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState<string>('');

  const integerValue = Number.isInteger(value);
  const formatter = new Intl.NumberFormat('it-IT', {
    maximumFractionDigits: integerValue ? 0 : 4,
    minimumFractionDigits: 0,
  });
  const displayValue = focused
    ? draft
    : value === 0
      ? ''
      : formatter.format(value);
  const inputType = focused ? 'number' : 'text';

  const hapticTick = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
 navigator.vibrate(8);
}
  };

  const clamp = (v: number) => {
    let n = v;
    if (typeof min === 'number') {
 n = Math.max(min, n);
}
    if (typeof max === 'number') {
 n = Math.min(max, n);
}
    return n;
  };

  const resolveStep = (v: number) => (typeof step === 'function' ? step(v) : step);

  /** Arrotonda v al numero di decimali implicato dallo step (evita 0.30000000004). */
  const roundToStep = (v: number, s: number) => {
    const decimals = s < 1 ? Math.max(0, Math.ceil(-Math.log10(s))) : 0;
    return Number(v.toFixed(decimals));
  };

  const EPS = 1e-9;

  const decrement = () => {
    hapticTick();
    // Usa step di un valore appena sotto: gestisce down-tier (es. 0.01 → 0.009)
    const s = resolveStep(Math.max(0, value - EPS));
    // Più grande multiplo di s strettamente < value
    const next = Math.ceil(value / s - EPS) * s - s;
    onChange(clamp(roundToStep(next, s)));
  };
  const increment = () => {
    hapticTick();
    const s = resolveStep(value);
    // Più piccolo multiplo di s strettamente > value
    const next = Math.floor(value / s + EPS) * s + s;
    onChange(clamp(roundToStep(next, s)));
  };

  return (
    <div className="mb-3 flex items-stretch gap-2">
      <button
        type="button"
        onClick={decrement}
        disabled={typeof min === 'number' && value <= min}
        aria-label="Diminuisci"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-muted-foreground"
      >
        <Minus className="size-4" />
      </button>
      <div className="group flex min-w-0 flex-1 items-baseline gap-2 rounded-lg border border-border bg-background px-3 py-2 transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30">
        {prefix && (
          <span className="shrink-0 text-lg font-semibold text-muted-foreground">{prefix}</span>
        )}
        <input
          id={id}
          ref={inputRef}
          type={inputType}
          value={displayValue}
          placeholder={placeholder}
          onFocus={() => {
            setDraft(value === 0 ? '' : String(value));
            setFocused(true);
            // Defer to next tick so keyboard/layout is stable, then scroll into view
            setTimeout(() => {
              if (inputRef.current) {
                onFocusScroll?.(inputRef.current);
              }
            }, 100);
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            if (raw === '') {
              onChange(0);
              return;
            }
            const parsed = Number(raw);
            if (!Number.isNaN(parsed)) {
              onChange(parsed);
            }
          }}
          onBlur={() => {
            setFocused(false);
          }}
          className="min-w-0 flex-1 border-0 bg-transparent text-xl font-bold tabular-nums tracking-tight text-foreground outline-none [appearance:textfield] placeholder:text-base placeholder:font-medium placeholder:text-muted-foreground/60 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          min={min}
          max={max}
          step={typeof step === 'function' ? step(value) : step}
          inputMode="decimal"
          aria-label={placeholder}
        />
        {suffix && (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">{suffix}</span>
        )}
      </div>
      <button
        type="button"
        onClick={increment}
        disabled={typeof max === 'number' && value >= max}
        aria-label="Aumenta"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-muted-foreground"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

type PresetChipsProps<T> = {
  values: T[];
  value: T;
  onSelect: (v: T) => void;
  format: (v: T) => string;
  onPresetSelect?: (v: T, onSelect: (v: T) => void) => void;
  /** Optional callback to scroll element into view when selected */
  onSelectScroll?: (element: HTMLElement) => void;
};

function PresetChips<T>({ values, value, onSelect, format, onPresetSelect, onSelectScroll }: PresetChipsProps<T>) {
  const buttonRefs = useRef<Map<T, HTMLButtonElement>>(new Map());

  const handleClick = (v: T) => {
    if (onPresetSelect) {
      onPresetSelect(v, onSelect);
    } else {
      onSelect(v);
    }
    // Scroll into view after selection
    setTimeout(() => {
      const btn = buttonRefs.current.get(v);
      if (btn) {
        onSelectScroll?.(btn);
      }
    }, 50);
  };

  return (
    <div
      role="group"
      aria-label="Valori preimpostati"
      className="[&::-ms-overflow-style]:none -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
    >
      {values.map(v => (
        <button
          key={String(v)}
          ref={(el) => {
            if (el) {
 buttonRefs.current.set(v, el);
}
          }}
          type="button"
          onClick={() => handleClick(v)}
          aria-pressed={value === v}
          className={cn(
            'inline-flex min-h-[44px] shrink-0 snap-start items-center justify-center rounded-lg px-4 py-2 text-sm font-medium tabular-nums transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            value === v
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'border border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted',
          )}
        >
          {format(v)}
        </button>
      ))}
    </div>
  );
}
