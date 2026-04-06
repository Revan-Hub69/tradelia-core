'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';

// ─── Types ────────────────────────────────────────────────────────────────────

type CapitalRange = 'tiny' | 'small' | 'mid' | 'mid_plus' | 'large' | 'xlarge';
type AssetGroupId = 'forex' | 'indices' | 'equities' | 'etf' | 'commodities' | 'crypto';
type HorizonId    = 'scalp' | 'swing' | 'position';
type StrategyId   = string;

// ─── Static data ──────────────────────────────────────────────────────────────
// Capital ranges — 1:1 with ScenarioSection capitalRanges (6 tiers)

const CAPITAL_RANGES: { id: CapitalRange; labelKey: string; bg: string; border: string }[] = [
  { id: 'tiny',     labelKey: 'capital_tiny',     bg: 'bg-slate-500/10',   border: 'border-slate-500/30' },
  { id: 'small',    labelKey: 'capital_small',     bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'mid',      labelKey: 'capital_mid',       bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'mid_plus', labelKey: 'capital_mid_plus',  bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'large',    labelKey: 'capital_large',     bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
  { id: 'xlarge',   labelKey: 'capital_xlarge',    bg: 'bg-orange-500/10',  border: 'border-orange-500/30' },
];

// Asset groups — 1:1 with ScenarioSection ASSET_GROUPS (6 groups)

const ASSET_GROUPS: { id: AssetGroupId; labelKey: string; bg: string; border: string }[] = [
  { id: 'forex',       labelKey: 'instrument_forex',       bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
  { id: 'indices',     labelKey: 'instrument_indices',     bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'equities',    labelKey: 'instrument_equities',    bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'etf',         labelKey: 'instrument_etf',         bg: 'bg-teal-500/10',    border: 'border-teal-500/30' },
  { id: 'commodities', labelKey: 'instrument_commodities', bg: 'bg-orange-500/10',  border: 'border-orange-500/30' },
  { id: 'crypto',      labelKey: 'instrument_crypto',      bg: 'bg-violet-500/10',  border: 'border-violet-500/30' },
];

const HORIZONS: { id: HorizonId; labelKey: string }[] = [
  { id: 'scalp',    labelKey: 'horizon_scalp' },
  { id: 'swing',    labelKey: 'horizon_swing' },
  { id: 'position', labelKey: 'horizon_position' },
];

// Strategies — aligned with ScenarioSection STRATEGY_MAP (scalping→scalp, intraday merged into scalp/swing)

const STRATEGY_MAP: Record<HorizonId, { value: StrategyId; labelKey: string }[]> = {
  scalp: [
    { value: 'order_flow',    labelKey: 'strat_order_flow' },
    { value: 'micro_momentum',labelKey: 'strat_micro_momentum' },
    { value: 'news_reaction', labelKey: 'strat_news_reaction' },
    { value: 'breakout',      labelKey: 'strat_breakout' },
    { value: 'vwap_bounce',   labelKey: 'strat_vwap_bounce' },
  ],
  swing: [
    { value: 'trend_following',     labelKey: 'strat_trend_following' },
    { value: 'range_trading',       labelKey: 'strat_range_trading' },
    { value: 'mean_reversion',      labelKey: 'strat_mean_reversion' },
    { value: 'trend_following_day', labelKey: 'strat_trend_following_day' },
  ],
  position: [
    { value: 'macro_trend',    labelKey: 'strat_macro_trend' },
    { value: 'carry_trade',    labelKey: 'strat_carry_trade' },
    { value: 'value_investing',labelKey: 'strat_value_investing' },
  ],
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

// ─── useIsMobile ──────────────────────────────────────────────────────────────

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
// Mirrors assetDefs + horizonAdjustments + getCapitalBias from ScenarioSection

type OutputKey = 'execution' | 'holding' | 'structure';

interface Output {
  key: OutputKey;
  value: number;
  barClass: string;
}

type DriverWeights = { execution: number; holding: number; structure: number };

const assetDrivers: Record<AssetGroupId, DriverWeights> = {
  forex:       { execution: 50, holding: 30, structure: 20 },
  indices:     { execution: 56, holding: 24, structure: 20 },
  equities:    { execution: 28, holding: 16, structure: 56 },
  etf:         { execution: 22, holding: 22, structure: 56 },
  commodities: { execution: 34, holding: 28, structure: 38 },
  crypto:      { execution: 40, holding: 36, structure: 24 },
};

const horizonAdj: Record<HorizonId, DriverWeights> = {
  scalp:    { execution: 26, holding: -12, structure: -10 },
  swing:    { execution:  8, holding:   4, structure:  -2 },
  position: { execution: -4, holding:  14, structure:   2 },
};

const capitalAdj: Record<CapitalRange, DriverWeights> = {
  tiny:     { execution: -2, holding: 0,  structure: 10 },
  small:    { execution: -1, holding: 0,  structure:  8 },
  mid:      { execution:  3, holding: 2,  structure: -2 },
  mid_plus: { execution:  5, holding: 3,  structure: -5 },
  large:    { execution:  8, holding: 4,  structure: -10 },
  xlarge:   { execution: 10, holding: 5,  structure: -12 },
};

function computeOutputs(
  capital: CapitalRange,
  asset: AssetGroupId,
  horizon: HorizonId,
  leverageOn: boolean,
): Output[] {
  const lev: DriverWeights = leverageOn ? { execution: 6, holding: 8, structure: 4 } : { execution: 0, holding: 0, structure: 0 };

  const sum = (...gs: DriverWeights[]) =>
    gs.reduce<DriverWeights>((a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }), { execution: 0, holding: 0, structure: 0 });

  const raw = sum(assetDrivers[asset], horizonAdj[horizon], capitalAdj[capital], lev);

  const execRaw   = Math.max(8, raw.execution);
  const holdRaw   = Math.max(8, raw.holding);
  const structRaw = Math.max(8, raw.structure);
  const total     = execRaw + holdRaw + structRaw;

  const execPct   = Math.round((execRaw   / total) * 100);
  const holdPct   = Math.round((holdRaw   / total) * 100);
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

const SimulatorContent = ({ onClose: _onClose }: SimulatorContentProps) => {
  const t = useTranslations('Simulator') as (key: string) => string;

  const [selectedCapital,    setSelectedCapital]    = useState<CapitalRange>('mid');
  const [selectedAsset,      setSelectedAsset]      = useState<AssetGroupId>('forex');
  const [selectedHorizon,    setSelectedHorizon]    = useState<HorizonId>('scalp');
  const [selectedStrategy,   setSelectedStrategy]   = useState<StrategyId>('');
  const [leverageOn,         setLeverageOn]         = useState(false);
  const [isDropdownOpen,     setIsDropdownOpen]     = useState(false);
  const [searchQuery,        setSearchQuery]        = useState('');

  const dropdownRef        = useRef<HTMLDivElement>(null);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef     = useRef<HTMLInputElement>(null);
  const capitalSectionRef  = useRef<HTMLDivElement>(null);

  const outputs = computeOutputs(selectedCapital, selectedAsset, selectedHorizon, leverageOn);

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

  useEffect(() => {
    if (!isDropdownOpen) return;
    const id = setTimeout(() => {
      searchInputRef.current?.focus();
      scrollIntoContainer(dropdownTriggerRef.current, 'smooth');
    }, 60);
    const id2 = setTimeout(() => {
      if (!dropdownRef.current) return;
      let parent = dropdownRef.current.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        const ov = style.overflowY;
        if (ov === 'auto' || ov === 'scroll') {
          const listEl = dropdownRef.current.querySelector('[data-dropdown-list]') as HTMLElement | null;
          if (!listEl) break;
          const listRect   = listEl.getBoundingClientRect();
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
    if (capitalSectionRef.current) scrollIntoContainer(capitalSectionRef.current);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-7">

      {/* Capital range — 6 tiers, 3-col grid */}
      <div ref={capitalSectionRef}>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_capital')}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

      {/* Asset group — 6 groups, 3-col grid */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_instrument')}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ASSET_GROUPS.map(ag => (
            <button
              key={ag.id}
              onClick={() => setSelectedAsset(ag.id)}
              className={`rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                selectedAsset === ag.id
                  ? `${ag.bg} ${ag.border} text-foreground shadow-sm`
                  : 'border-border/50 bg-card text-muted-foreground hover:border-border hover:bg-card/80'
              }`}
            >
              {t(ag.labelKey)}
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
              onClick={() => setSelectedHorizon(h.id)}
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

      {/* ── Output preview ─────────────────────────────────────────────────── */}
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
            ASSET_GROUPS.find(a => a.id === selectedAsset),
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

// ─── SimulatorDrawer ──────────────────────────────────────────────────────────

export const SimulatorDrawer = ({ isOpen, onClose }: Props) => {
  const t        = useTranslations('Simulator') as (key: string) => string;
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && isOpen) {
      const id = setTimeout(() => {
        panelRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      }, 20);
      return () => clearTimeout(id);
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile && isOpen) {
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }
  }, [isMobile, isOpen, onClose]);

  if (isMobile) {
    return (
      <MobileBottomSheet isOpen={isOpen} onClose={onClose} title={t('drawer_title')} showHandle>
        <SimulatorContent />
      </MobileBottomSheet>
    );
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t('drawer_title')}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
      >
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
