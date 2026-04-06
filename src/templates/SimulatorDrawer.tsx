'use client';

import React, {
  useEffect, useRef, useState, useCallback, useMemo,
} from 'react';
import {
  useFloating, autoUpdate, offset, flip, shift,
  FloatingPortal, size as floatingSize,
} from '@floating-ui/react';
import { X, ChevronDown, Search, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';

// ─── Types ────────────────────────────────────────────────────────────────────

type CapitalRange = 'tiny' | 'small' | 'mid' | 'mid_plus' | 'large' | 'xlarge';
type AssetGroupId = 'forex' | 'indices' | 'equities' | 'etf' | 'commodities' | 'crypto';
type HorizonId    = 'scalp' | 'swing' | 'position';
type StrategyId   = string;

// ─── Underlying groups ────────────────────────────────────────────────────────
// NEVER change ids — they match the DB enum

interface UnderlyingGroup {
  id: string;
  labelKey: string;
  group: AssetGroupId;
  tooltip: string;
}

const UNDERLYING_GROUPS: UnderlyingGroup[] = [
  { id: 'fx_core',           labelKey: 'ug_fx_core',           group: 'forex',       tooltip: 'EURUSD, GBPUSD, USDJPY' },
  { id: 'fx_cross',          labelKey: 'ug_fx_cross',          group: 'forex',       tooltip: 'EURGBP, GBPJPY' },
  { id: 'fx_exotic',         labelKey: 'ug_fx_exotic',         group: 'forex',       tooltip: 'USDTRY, USDMXN' },
  { id: 'index_us',          labelKey: 'ug_index_us',          group: 'indices',     tooltip: 'SP500, NAS100, US30' },
  { id: 'index_eu_core',     labelKey: 'ug_index_eu_core',     group: 'indices',     tooltip: 'DAX40' },
  { id: 'index_eu_tax',      labelKey: 'ug_index_eu_tax',      group: 'indices',     tooltip: 'FTSE MIB, IBEX' },
  { id: 'index_asia',        labelKey: 'ug_index_asia',        group: 'indices',     tooltip: 'Nikkei 225' },
  { id: 'index_volatility',  labelKey: 'ug_index_volatility',  group: 'indices',     tooltip: 'VIX' },
  { id: 'equity_us_large',   labelKey: 'ug_equity_us_large',   group: 'equities',   tooltip: 'AAPL, MSFT, NVDA' },
  { id: 'equity_us_small',   labelKey: 'ug_equity_us_small',   group: 'equities',   tooltip: 'Hard-to-borrow fees' },
  { id: 'equity_eu_ftt',     labelKey: 'ug_equity_eu_ftt',     group: 'equities',   tooltip: 'Italy, France, Spain' },
  { id: 'equity_eu_core',    labelKey: 'ug_equity_eu_core',    group: 'equities',   tooltip: 'Germany, Netherlands' },
  { id: 'equity_uk',         labelKey: 'ug_equity_uk',         group: 'equities',   tooltip: '0.5% Stamp Duty' },
  { id: 'equity_adr',        labelKey: 'ug_equity_adr',        group: 'equities',   tooltip: 'Pass-through fees' },
  { id: 'commodity_metal',   labelKey: 'ug_commodity_metal',   group: 'commodities', tooltip: 'Gold, Silver' },
  { id: 'commodity_energy',  labelKey: 'ug_commodity_energy',  group: 'commodities', tooltip: 'Oil, Gas' },
  { id: 'commodity_agri',    labelKey: 'ug_commodity_agri',    group: 'commodities', tooltip: 'High gap risk' },
  { id: 'etf_us_broad',      labelKey: 'ug_etf_us_broad',      group: 'etf',         tooltip: 'SPY, QQQ' },
  { id: 'etf_us_leveraged',  labelKey: 'ug_etf_us_leveraged',  group: 'etf',         tooltip: '2x/3x vol drag' },
  { id: 'etf_ucits',         labelKey: 'ug_etf_ucits',         group: 'etf',         tooltip: 'EU harmonised' },
  { id: 'crypto_major',      labelKey: 'ug_crypto_major',      group: 'crypto',      tooltip: 'BTC, ETH' },
  { id: 'crypto_altcoin',    labelKey: 'ug_crypto_altcoin',    group: 'crypto',      tooltip: 'Predatory spreads' },
];

// ─── Static data ──────────────────────────────────────────────────────────────

const CAPITAL_RANGES: { id: CapitalRange; labelKey: string; bg: string; border: string }[] = [
  { id: 'tiny',     labelKey: 'capital_tiny',     bg: 'bg-slate-500/10',   border: 'border-slate-500/30' },
  { id: 'small',    labelKey: 'capital_small',    bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'mid',      labelKey: 'capital_mid',      bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  { id: 'mid_plus', labelKey: 'capital_mid_plus', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  { id: 'large',    labelKey: 'capital_large',    bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
  { id: 'xlarge',   labelKey: 'capital_xlarge',   bg: 'bg-orange-500/10',  border: 'border-orange-500/30' },
];

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

const STRATEGY_MAP: Record<HorizonId, { value: StrategyId; labelKey: string }[]> = {
  scalp: [
    { value: 'order_flow',     labelKey: 'strat_order_flow' },
    { value: 'micro_momentum', labelKey: 'strat_micro_momentum' },
    { value: 'news_reaction',  labelKey: 'strat_news_reaction' },
    { value: 'breakout',       labelKey: 'strat_breakout' },
    { value: 'vwap_bounce',    labelKey: 'strat_vwap_bounce' },
  ],
  swing: [
    { value: 'trend_following',     labelKey: 'strat_trend_following' },
    { value: 'range_trading',       labelKey: 'strat_range_trading' },
    { value: 'mean_reversion',      labelKey: 'strat_mean_reversion' },
    { value: 'trend_following_day', labelKey: 'strat_trend_following_day' },
  ],
  position: [
    { value: 'macro_trend',     labelKey: 'strat_macro_trend' },
    { value: 'carry_trade',     labelKey: 'strat_carry_trade' },
    { value: 'value_investing', labelKey: 'strat_value_investing' },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [breakpoint]);
  return isMobile;
}

/**
 * Scrolls the nearest scroll-parent so that `el` is fully in view.
 * Called before opening a floating panel so the trigger is visible
 * and Floating UI can anchor correctly.
 */
function scrollTriggerIntoView(el: HTMLElement | null) {
  if (!el) return;
  el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ─── Driver computation ───────────────────────────────────────────────────────

type OutputKey    = 'execution' | 'holding' | 'structure';
type DriverWeights = { execution: number; holding: number; structure: number };
interface Output { key: OutputKey; value: number; barClass: string }

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
  tiny:     { execution: -2, holding: 0, structure: 10 },
  small:    { execution: -1, holding: 0, structure:  8 },
  mid:      { execution:  3, holding: 2, structure: -2 },
  mid_plus: { execution:  5, holding: 3, structure: -5 },
  large:    { execution:  8, holding: 4, structure: -10 },
  xlarge:   { execution: 10, holding: 5, structure: -12 },
};

function computeOutputs(
  capital: CapitalRange, asset: AssetGroupId,
  horizon: HorizonId, lev: boolean,
): Output[] {
  const levW: DriverWeights = lev
    ? { execution: 6, holding: 8, structure: 4 }
    : { execution: 0, holding: 0, structure: 0 };
  const sum = (...gs: DriverWeights[]) =>
    gs.reduce<DriverWeights>(
      (a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }),
      { execution: 0, holding: 0, structure: 0 },
    );
  const raw = sum(assetDrivers[asset], horizonAdj[horizon], capitalAdj[capital], levW);
  const e = Math.max(8, raw.execution);
  const h = Math.max(8, raw.holding);
  const s = Math.max(8, raw.structure);
  const tot = e + h + s;
  const ep  = Math.round((e / tot) * 100);
  const hp  = Math.round((h / tot) * 100);
  return [
    { key: 'execution', value: ep,           barClass: 'bg-sky-400' },
    { key: 'holding',   value: hp,           barClass: 'bg-amber-400' },
    { key: 'structure', value: 100 - ep - hp, barClass: 'bg-emerald-400' },
  ];
}

// ─── FloatingCombobox ─────────────────────────────────────────────────────────
// Generic floating combobox that portals its list into <body>
// so overflow:auto on the drawer never clips the dropdown.

interface FloatingComboboxProps {
  triggerContent: React.ReactNode;  // what to render inside the trigger button
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;        // the list content
  /** px of max-height for the floating list */
  maxHeight?: number;
}

const FloatingCombobox = ({
  triggerContent, isOpen, onOpenChange, children, maxHeight = 280,
}: FloatingComboboxProps) => {
  const { refs, floatingStyles, update } = useFloating({
    open: isOpen,
    placement: 'bottom-start',
    middleware: [
      offset(4),
      flip({ padding: 12 }),
      shift({ padding: 12 }),
      floatingSize({
        apply({ rects, elements, availableHeight }) {
          // match trigger width; cap height to available space
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(maxHeight, availableHeight - 8)}px`,
          });
        },
        padding: 12,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  // Scroll trigger into view BEFORE opening so Floating UI can position correctly
  const handleTriggerClick = useCallback(() => {
    if (!isOpen) {
      scrollTriggerIntoView(refs.reference.current as HTMLElement | null);
      // tiny delay so the scroll settles, then open
      setTimeout(() => onOpenChange(true), 80);
    } else {
      onOpenChange(false);
    }
  }, [isOpen, onOpenChange, refs.reference]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: MouseEvent) => {
      if (
        refs.reference.current instanceof Element &&
        refs.reference.current.contains(e.target as Node)
      ) return;
      if (
        refs.floating.current instanceof Element &&
        refs.floating.current.contains(e.target as Node)
      ) return;
      onOpenChange(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isOpen, onOpenChange, refs.floating, refs.reference]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onOpenChange]);

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        onClick={handleTriggerClick}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition-colors duration-200 hover:border-border hover:bg-card/80 active:scale-[0.99]"
      >
        {triggerContent}
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 9999 }}
            className="overflow-hidden rounded-xl border border-border bg-popover shadow-xl"
          >
            {children}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

// ─── UnderlyingCombobox ───────────────────────────────────────────────────────

interface UnderlyingComboboxProps {
  selectedAsset: AssetGroupId;
  selectedUnderlying: UnderlyingGroup;
  onSelect: (u: UnderlyingGroup) => void;
}

const UnderlyingCombobox = ({
  selectedAsset, selectedUnderlying, onSelect,
}: UnderlyingComboboxProps) => {
  const t = useTranslations('Simulator') as (key: string) => string;
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else       setQuery('');
  }, [open]);

  const grouped = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = UNDERLYING_GROUPS.filter(u => {
      const inGroup   = q ? true : u.group === selectedAsset;
      const matchText = q
        ? t(u.labelKey).toLowerCase().includes(q) ||
          u.tooltip.toLowerCase().includes(q) ||
          u.id.includes(q)
        : true;
      return inGroup && matchText;
    });
    const map = new Map<AssetGroupId, UnderlyingGroup[]>();
    for (const u of filtered) {
      if (!map.has(u.group)) map.set(u.group, []);
      map.get(u.group)!.push(u);
    }
    return map;
  }, [query, selectedAsset, t]);

  const total = [...grouped.values()].reduce((s, a) => s + a.length, 0);

  const trigger = (
    <div className="min-w-0 flex-1">
      <p className="truncate font-medium">{t(selectedUnderlying.labelKey)}</p>
      <p className="truncate font-mono text-[10px] text-muted-foreground/60">
        {selectedUnderlying.tooltip}
      </p>
    </div>
  );

  return (
    <FloatingCombobox
      triggerContent={trigger}
      isOpen={open}
      onOpenChange={setOpen}
      maxHeight={300}
    >
      {/* Search */}
      <div className="border-b border-border/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Search className="size-3.5 shrink-0 text-muted-foreground/50" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('underlying_search')}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground"
            >
              <X className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
        {total === 0 ? (
          <p className="px-4 py-3 text-sm text-muted-foreground/60">
            {t('underlying_no_results')}
          </p>
        ) : (
          [...grouped.entries()].map(([groupId, items]) => (
            <div key={groupId}>
              {query && (
                <p className="sticky top-0 bg-popover/95 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/50 backdrop-blur-sm">
                  {t(`instrument_${groupId}`)}
                </p>
              )}
              {items.map(u => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => { onSelect(u); setOpen(false); }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 hover:bg-muted/40 ${
                    selectedUnderlying.id === u.id ? 'bg-primary/[0.08]' : ''
                  }`}
                >
                  <span className="flex size-4 shrink-0 items-center justify-center">
                    {selectedUnderlying.id === u.id && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${
                      selectedUnderlying.id === u.id
                        ? 'font-semibold text-foreground'
                        : 'font-medium text-foreground/80'
                    }`}>
                      {t(u.labelKey)}
                    </p>
                    <p className="truncate font-mono text-[10px] text-muted-foreground/50">
                      {u.tooltip}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </FloatingCombobox>
  );
};

// ─── StrategyCombobox ─────────────────────────────────────────────────────────

interface StrategyComboboxProps {
  horizon: HorizonId;
  selected: StrategyId;
  onSelect: (v: StrategyId) => void;
}

const StrategyCombobox = ({ horizon, selected, onSelect }: StrategyComboboxProps) => {
  const t = useTranslations('Simulator') as (key: string) => string;
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60);
    else       setQuery('');
  }, [open]);

  const all      = STRATEGY_MAP[horizon] ?? [];
  const active   = all.find(s => s.value === selected) ?? all[0];
  const filtered = all.filter(s =>
    t(s.labelKey).toLowerCase().includes(query.toLowerCase()),
  );

  const trigger = (
    <span className="truncate">
      {active ? t(active.labelKey) : t('strategy_placeholder')}
    </span>
  );

  return (
    <FloatingCombobox
      triggerContent={trigger}
      isOpen={open}
      onOpenChange={setOpen}
      maxHeight={220}
    >
      {/* Search */}
      <div className="border-b border-border/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Search className="size-3.5 shrink-0 text-muted-foreground/60" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('strategy_search')}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
        {filtered.length > 0 ? (
          filtered.map(s => (
            <button
              key={s.value}
              type="button"
              onClick={() => { onSelect(s.value); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-100 hover:bg-muted/40 ${
                (active?.value ?? '') === s.value
                  ? 'bg-primary/[0.08] font-semibold text-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              <span className="flex size-4 shrink-0 items-center justify-center">
                {(active?.value ?? '') === s.value && (
                  <Check className="size-3.5 text-primary" />
                )}
              </span>
              {t(s.labelKey)}
            </button>
          ))
        ) : (
          <p className="px-4 py-3 text-sm text-muted-foreground/60">
            {t('strategy_no_results')}
          </p>
        )}
      </div>
    </FloatingCombobox>
  );
};

// ─── SimulatorContent ─────────────────────────────────────────────────────────

interface SimulatorContentProps { onClose?: () => void }

const SimulatorContent = ({ onClose: _onClose }: SimulatorContentProps) => {
  const t = useTranslations('Simulator') as (key: string) => string;

  const [selectedCapital,    setSelectedCapital]    = useState<CapitalRange>('mid');
  const [selectedAsset,      setSelectedAsset]      = useState<AssetGroupId>('forex');
  const [selectedUnderlying, setSelectedUnderlying] = useState<UnderlyingGroup>(UNDERLYING_GROUPS[0]!);
  const [selectedHorizon,    setSelectedHorizon]    = useState<HorizonId>('scalp');
  const [selectedStrategy,   setSelectedStrategy]   = useState<StrategyId>('');
  const [leverageOn,         setLeverageOn]         = useState(false);

  // Auto-select first underlying when asset group changes
  useEffect(() => {
    const first = UNDERLYING_GROUPS.find(u => u.group === selectedAsset);
    if (first) setSelectedUnderlying(first);
  }, [selectedAsset]);

  // Auto-select first strategy when horizon changes
  useEffect(() => {
    const available = STRATEGY_MAP[selectedHorizon] ?? [];
    if (!available.some(s => s.value === selectedStrategy))
      setSelectedStrategy(available[0]?.value ?? '');
  }, [selectedHorizon, selectedStrategy]);

  const activeStrategy = (STRATEGY_MAP[selectedHorizon] ?? []).find(s => s.value === selectedStrategy)
    ?? (STRATEGY_MAP[selectedHorizon] ?? [])[0];

  const outputs = computeOutputs(selectedCapital, selectedAsset, selectedHorizon, leverageOn);

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-7">

      {/* Capital */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_capital')}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CAPITAL_RANGES.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCapital(c.id)}
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

      {/* Asset group */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_instrument')}
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ASSET_GROUPS.map(ag => (
            <button
              key={ag.id}
              type="button"
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

      {/* Underlying combobox */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_underlying')}
        </p>
        <UnderlyingCombobox
          selectedAsset={selectedAsset}
          selectedUnderlying={selectedUnderlying}
          onSelect={setSelectedUnderlying}
        />
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
              type="button"
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

      {/* Strategy combobox */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
          {t('label_strategy')}
        </p>
        <StrategyCombobox
          horizon={selectedHorizon}
          selected={selectedStrategy}
          onSelect={setSelectedStrategy}
        />
      </div>

      {/* Leverage toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{t('label_leverage')}</p>
          <p className="text-xs text-muted-foreground/70">{t('leverage_note')}</p>
        </div>
        <button
          type="button"
          onClick={() => setLeverageOn(v => !v)}
          role="switch"
          aria-checked={leverageOn}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
            leverageOn ? 'bg-primary' : 'bg-muted'
          }`}
        >
          <span className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            leverageOn ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* Output preview */}
      <div className="rounded-2xl border border-border/50 bg-muted/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
            {t('preview_title')}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
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
          <span className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/60">
            {t(selectedUnderlying.labelKey)}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
            leverageOn
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'border-border/50 bg-muted/20 text-muted-foreground/60'
          }`}>
            {leverageOn ? t('leverage_on') : t('leverage_off')}
          </span>
        </div>

        {/* Engine status */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/40 bg-background px-3 py-2.5">
          <span className={`size-1.5 rounded-full ${
            leverageOn ? 'animate-pulse bg-emerald-400' : 'bg-muted-foreground/40'
          }`} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
            {t(`engine_${selectedHorizon}`)}
          </span>
        </div>

        {/* Strategy badge */}
        {activeStrategy && (
          <div className={`mb-4 rounded-xl border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] ${
            leverageOn
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-border/40 bg-muted/20 text-muted-foreground/60'
          }`}>
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
                  style={{ width: `${d.value}%`, transition: 'width 600ms cubic-bezier(0.25,0.46,0.45,0.94)' }}
                />
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs leading-6 text-muted-foreground/60">
            {t(`insight_${selectedHorizon}`)}
          </p>
        </div>

        {/* Engine reads */}
        <div className="mt-4 border-t border-border/30 pt-4">
          <p className="pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">
            {t('engine_reads_title')}
          </p>
          <div className="mt-3 space-y-2">
            {(['read_1', 'read_2', 'read_3'] as const).map(k => (
              <div key={k} className="flex items-start gap-2">
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-sky-400" />
                <p className="text-xs leading-5 text-muted-foreground/70">{t(k)}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] leading-5 text-muted-foreground/60">{t('preview_note')}</p>
        </div>
      </div>

      <Button className="w-full" size="lg">{t('cta')}</Button>
    </div>
  );
};

// ─── SimulatorDrawer ──────────────────────────────────────────────────────────

interface Props { isOpen: boolean; onClose: () => void }

export const SimulatorDrawer = ({ isOpen, onClose }: Props) => {
  const t        = useTranslations('Simulator') as (key: string) => string;
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && isOpen) {
      const id = setTimeout(() => panelRef.current?.scrollTo({ top: 0, behavior: 'instant' }), 20);
      return () => clearTimeout(id);
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile && isOpen) {
      const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', h);
      return () => document.removeEventListener('keydown', h);
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
        className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
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
            type="button"
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
