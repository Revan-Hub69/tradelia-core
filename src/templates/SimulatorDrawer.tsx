'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';

// ─── Types ───────────────────────────────────────────────────────────────────

type CapitalRange = 'small' | 'mid' | 'mid_plus' | 'large';
type InstrumentId = 'forex' | 'indices' | 'equities';
type HorizonId = 'scalp' | 'swing' | 'position';
type StrategyId = string;

// ─── Static data ─────────────────────────────────────────────────────────────

const CAPITAL_RANGES: { id: CapitalRange; labelKey: string; bg: string; border: string }[] = [
  { id: 'small',    labelKey: 'capital_small',    bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'mid',      labelKey: 'capital_mid',      bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'mid_plus', labelKey: 'capital_mid_plus', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'large',    labelKey: 'capital_large',    bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
];

const INSTRUMENTS: { id: InstrumentId; labelKey: string; bg: string; border: string }[] = [
  { id: 'forex',    labelKey: 'instrument_forex',    bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
  { id: 'indices',  labelKey: 'instrument_indices',  bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'equities', labelKey: 'instrument_equities', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
];

const HORIZONS: { id: HorizonId; labelKey: string }[] = [
  { id: 'scalp',    labelKey: 'horizon_scalp' },
  { id: 'swing',    labelKey: 'horizon_swing' },
  { id: 'position', labelKey: 'horizon_position' },
];

const STRATEGY_MAP: Record<HorizonId, { value: StrategyId; labelKey: string }[]> = {
  scalp:    [{ value: 'momentum_1m', labelKey: 'strat_momentum_1m' }, { value: 'breakout_5m', labelKey: 'strat_breakout_5m' }, { value: 'mean_rev', labelKey: 'strat_mean_rev' }],
  swing:    [{ value: 'trend_4h',   labelKey: 'strat_trend_4h' },   { value: 'pullback_d1', labelKey: 'strat_pullback_d1' }],
  position: [{ value: 'macro_wk',   labelKey: 'strat_macro_wk' },   { value: 'carry',       labelKey: 'strat_carry' }],
};

// ─── scrollIntoContainer helper ───────────────────────────────────────────────

function scrollIntoContainer(el: HTMLElement | null, behavior: ScrollBehavior = 'smooth') {
  if (!el) return;
  let parent = el.parentElement;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const ov = style.overflowY;
    if (ov === 'auto' || ov === 'scroll') {
      const elRect     = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const scrollTop  = parent.scrollTop;
      if (elRect.top < parentRect.top + 8) {
        parent.scrollBy({ top: elRect.top - parentRect.top - 16, behavior });
      } else if (elRect.bottom > parentRect.bottom - 8) {
        parent.scrollBy({ top: elRect.bottom - parentRect.bottom + 16, behavior });
      }
      return;
    }
    parent = parent.parentElement;
  }
}

// ─── useIsMobile ─────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

// ─── Output computation ───────────────────────────────────────────────────────

type OutputKey = 'execution' | 'holding' | 'structure';

interface Output {
  key: OutputKey;
  value: number;
  barClass: string;
}

function computeOutputs(
  capital: CapitalRange,
  instrument: InstrumentId,
  horizon: HorizonId,
  leverageOn: boolean,
): Output[] {
  const base: Record<CapitalRange, [number, number]> = {
    small:    [40, 35],
    mid:      [35, 38],
    mid_plus: [30, 42],
    large:    [25, 45],
  };
  const instBonus: Record<InstrumentId, [number, number]> = {
    forex:    [5, 0],
    indices:  [0, 5],
    equities: [2, 3],
  };
  const horizonBonus: Record<HorizonId, [number, number]> = {
    scalp:    [8, -4],
    swing:    [0, 2],
    position: [-5, 8],
  };
  const leverageAdj = leverageOn ? [3, -3] : [0, 0];

  const [b0, b1] = base[capital];
  const [i0, i1] = instBonus[instrument];
  const [h0, h1] = horizonBonus[horizon];
  const [l0, l1] = leverageAdj;

  const execRaw   = Math.max(10, b0 + i0 + h0 + l0);
  const holdRaw   = Math.max(10, b1 + i1 + h1 + l1);
  const total     = execRaw + holdRaw + 20;
  const execPct   = Math.round((execRaw  / total) * 100);
  const holdPct   = Math.round((holdRaw  / total) * 100);
  const structPct = 100 - execPct - holdPct;

  return [
    { key: 'execution' as const, value: execPct,   barClass: 'bg-sky-400' },
    { key: 'holding'   as const, value: holdPct,   barClass: 'bg-amber-400' },
    { key: 'structure' as const, value: structPct, barClass: 'bg-emerald-400' },
  ];
}

// ─── SimulatorContent ─────────────────────────────────────────────────────────

interface SimulatorContentProps {
  onClose?: () => void;
}

const SimulatorContent = ({ onClose }: SimulatorContentProps) => {
  const t = useTranslations('Simulator') as (key: string) => string;

  const [selectedCapital,   setSelectedCapital]   = useState<CapitalRange>('mid');
  const [selectedInstrument,setSelectedInstrument]= useState<InstrumentId>('forex');
  const [selectedHorizon,   setSelectedHorizon]   = useState<HorizonId>('scalp');
  const [selectedStrategy,  setSelectedStrategy]  = useState<StrategyId>('');
  const [leverageOn,        setLeverageOn]        = useState(false);
  const [isDropdownOpen,    setIsDropdownOpen]    = useState(false);
  const [searchQuery,       setSearchQuery]       = useState('');

  const dropdownRef        = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef     = useRef<HTMLInputElement>(null);
  const capitalSectionRef  = useRef<HTMLDivElement>(null);

  const outputs = computeOutputs(selectedCapital, selectedInstrument, selectedHorizon, leverageOn);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen]);

  // Quando il dropdown si apre:
  // 1. focus sull\'input di ricerca (digitazione immediata)
  // 2. scrollIntoContainer sul trigger porta il trigger in vista nel panel
  // 3. doppio setTimeout (120ms) per aspettare che il dropdown list sia nel DOM
  //    e poi calcola se la lista dropdown sfora il bottom del container scroll
  useEffect(() => {
    if (!isDropdownOpen) return;
    const id = setTimeout(() => {
      searchInputRef.current?.focus();
      scrollIntoContainer(dropdownTriggerRef.current, 'smooth');
    }, 60);
    // Secondo pass: dopo che la lista è renderata, scrolla il container se sfora in basso
    const id2 = setTimeout(() => {
      if (!dropdownRef.current) return;
      let parent = dropdownRef.current.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const ov = style.overflowY;
        if (ov === 'auto' || ov === 'scroll') {
          const listEl = dropdownRef.current.querySelector('[data-dropdown-list]') as HTMLElement | null;
          if (!listEl) break;
          const listRect  = listEl.getBoundingClientRect();
          const parentRect = parent.getBoundingClientRect();
          if (listRect.bottom > parentRect.bottom) {
            parent.scrollBy({ top: listRect.bottom - parentRect.bottom + 16, behavior: 'smooth' });
          }
          break;
        }
        parent = parent.parentElement;
      }
    }, 120);
    return () => { clearTimeout(id); clearTimeout(id2); };
  }, [isDropdownOpen]);

  const availableStrategies = STRATEGY_MAP[selectedHorizon] ?? [];
  const activeStrategy = availableStrategies.find(s => s.value === selectedStrategy)
    ?? availableStrategies[0];

  const filteredStrategies = availableStrategies.filter(s =>
    t(s.labelKey).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCapitalSelect = useCallback((id: CapitalRange) => {
    setSelectedCapital(id);
    if (capitalSectionRef.current) {
      scrollIntoContainer(capitalSectionRef.current);
    }
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-7">

      {/* Capital range */}
      <div ref={capitalSectionRef}>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_capital')}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CAPITAL_RANGES.map(c => (
            <button
              key={c.id}
              onClick={() => handleCapitalSelect(c.id)}
              className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                selectedCapital === c.id
                  ? `${c.bg} ${c.border} text-foreground shadow-sm`
                  : 'border-border/50 bg-card text-muted-foreground hover:border-border hover:bg-card/80'
              }`}
            >
              {t(c.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Instrument */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_instrument')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {INSTRUMENTS.map(ins => (
            <button
              key={ins.id}
              onClick={() => setSelectedInstrument(ins.id)}
              className={`rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                selectedInstrument === ins.id
                  ? `${ins.bg} ${ins.border} text-foreground shadow-sm`
                  : 'border-border/50 bg-card text-muted-foreground hover:border-border hover:bg-card/80'
              }`}
            >
              {t(ins.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Horizon */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_horizon')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {HORIZONS.map(h => (
            <button
              key={h.id}
              onClick={() => setSelectedHorizon(h.id as HorizonId)}
              className={`rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                selectedHorizon === h.id
                  ? 'border-primary/40 bg-primary/10 text-foreground shadow-sm'
                  : 'border-border/50 bg-card text-muted-foreground hover:border-border hover:bg-card/80'
              }`}
            >
              {t(h.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Strategy dropdown */}
      <div ref={dropdownRef} className="relative">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_strategy')}
        </p>
        <button
          ref={dropdownTriggerRef}
          onClick={() => setIsDropdownOpen(v => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-border hover:bg-card/80 active:scale-[0.99]"
        >
          <span>{activeStrategy ? t(activeStrategy.labelKey) : t('strategy_placeholder')}</span>
          <ChevronDown
            className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isDropdownOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
            {/* Search */}
            <div className="border-b border-border/50 px-3 py-2">
              <div className="flex items-center gap-2">
                <Search className="size-3.5 shrink-0 text-muted-foreground/60" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('strategy_search')}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
              </div>
            </div>
            {/* List */}
            <div className="max-h-48 overflow-y-auto" data-dropdown-list>
              {filteredStrategies.length > 0 ? (
                filteredStrategies.map(s => (
                  <button
                    key={s.value}
                    onClick={() => {
                      setSelectedStrategy(s.value);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-muted/40 ${
                      (activeStrategy?.value ?? '') === s.value
                        ? 'bg-primary/10 font-medium text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {t(s.labelKey)}
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-muted-foreground/60">{t('strategy_no_results')}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Leverage toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{t('label_leverage')}</p>
          <p className="text-xs text-muted-foreground/70">{t('leverage_note')}</p>
        </div>
        <button
          onClick={() => setLeverageOn(v => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            leverageOn ? 'bg-primary' : 'bg-muted'
          }`}
          role="switch"
          aria-checked={leverageOn}
        >
          <span
            className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              leverageOn ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* ── Output preview ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/50 bg-muted/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
            {t('preview_title')}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">
              {t('preview_live')}
            </span>
          </div>
        </div>

        {/* Active config badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {[
            CAPITAL_RANGES.find(c => c.id === selectedCapital),
            INSTRUMENTS.find(i => i.id === selectedInstrument),
          ].filter(Boolean).map(item => item && (
            <span
              key={item.id}
              className={`rounded-full border ${item.border} ${item.bg} px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70`}
            >
              {t(item.labelKey)}
            </span>
          ))}
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
              leverageOn
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-border/50 bg-muted/20 text-muted-foreground/60'
            }`}
          >
            {leverageOn ? t('leverage_on') : t('leverage_off')}
          </span>
        </div>

        {/* Engine status */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/40 bg-background px-3 py-2.5">
          <span className={`size-1.5 rounded-full ${ leverageOn ? 'bg-emerald-400 animate-pulse' : 'bg-muted-foreground/40' }`} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {t(`engine_${selectedHorizon}`)}
          </span>
        </div>

        {/* Active strategy */}
        {activeStrategy && (
          <div
            className={`mb-4 rounded-xl border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] ${
              leverageOn
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-border/40 bg-muted/20 text-muted-foreground/60'
            }`}
          >
            {t(activeStrategy.labelKey)}
          </div>
        )}

        {/* Driver bars */}
        <div className="space-y-3">
          {outputs.map(d => (
            <div key={d.key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{t(`driver_${d.key}`)}</span>
                <span className="font-mono text-[10px] text-muted-foreground/70">{d.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted/40">
                <div
                  className={`h-1.5 rounded-full ${d.barClass}`}
                  style={{ width: `${d.value}%`, transition: 'width 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)', willChange: 'width' }}
                />
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs leading-6 text-muted-foreground/60">{t(`insight_${selectedHorizon}`)}</p>
        </div>

        {/* Engine reads */}
        <div className="mt-4 border-t border-border/30 pt-4">
          <p className="pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
            {t('engine_reads_title')}
          </p>
          <div className="mt-3 space-y-2">
            {(['read_1', 'read_2', 'read_3'] as const).map(key => (
              <div key={key} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-sky-400" />
                <p className="text-xs leading-5 text-muted-foreground/70">{t(key)}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-muted-foreground/60">{t('preview_note')}</p>
        </div>
      </div>

      {/* CTA */}
      <Button className="w-full" size="lg">
        {t('cta')}
      </Button>
    </div>
  );
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ─── SimulatorDrawer ─────────────────────────────────────────────────────────

export const SimulatorDrawer = ({ isOpen, onClose }: Props) => {
  const t          = useTranslations('Simulator') as (key: string) => string;
  const isMobile   = useIsMobile();
  const panelRef   = useRef<HTMLDivElement>(null);

  // Scroll panel to top every time drawer opens (desktop)
  useEffect(() => {
    if (!isMobile && isOpen) {
      // small delay so the panel is mounted before scrolling
      const id = setTimeout(() => {
        panelRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      }, 20);
      return () => clearTimeout(id);
    }
  }, [isMobile, isOpen]);

  // Close on Escape (desktop)
  useEffect(() => {
    if (!isMobile && isOpen) {
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }
  }, [isMobile, isOpen, onClose]);

  // ── Mobile: Sheet ───────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
        <SheetContent side="bottom" className="max-h-[92dvh] overflow-y-auto rounded-t-2xl p-0">
          <SheetHeader className="sticky top-0 z-20 border-b border-border bg-background px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
                  {t('drawer_eyebrow')}
                </p>
                <SheetTitle className="mt-0.5 text-lg font-semibold tracking-tight">
                  {t('drawer_title')}
                </SheetTitle>
              </div>
              <SheetClose asChild>
                <button className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <X className="size-4" />
                  <span className="sr-only">{t('close')}</span>
                </button>
              </SheetClose>
            </div>
          </SheetHeader>
          <SimulatorContent />
        </SheetContent>
      </Sheet>
    );
  }

  // ── Desktop: Dialog overlay ──────────────────────────────────────────────────
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t('drawer_title')}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
              {t('drawer_eyebrow')}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">
              {t('drawer_title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
            <span className="sr-only">{t('close')}</span>
          </button>
        </div>

        <SimulatorContent onClose={onClose} />
      </div>
    </div>
  );
};
