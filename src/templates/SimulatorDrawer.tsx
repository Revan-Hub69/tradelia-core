'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { X, ChevronDown, Search, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';

// ─── Types ──────────────────────────────────────────────────────────────

type CapitalRange = 'tiny' | 'small' | 'mid' | 'mid_plus' | 'large' | 'xlarge';
type AssetGroupId = 'forex' | 'indices' | 'equities' | 'etf' | 'commodities' | 'crypto';
type HorizonId    = 'scalp' | 'swing' | 'position';
type StrategyId   = string;

// ─── UNDERLYING GROUPS — 1:1 with ScenarioSection UNDERLYING_GROUPS ─────────────
// NEVER MODIFY ids — they match PostgreSQL underlying_group enum

interface UnderlyingGroup {
  id: string;
  labelKey: string; // key in Simulator namespace: ug_{id}
  group: AssetGroupId;
  tooltip: string;
}

const UNDERLYING_GROUPS: UnderlyingGroup[] = [
  // Forex
  { id: 'fx_core',    labelKey: 'ug_fx_core',    group: 'forex',       tooltip: 'EURUSD, GBPUSD, USDJPY' },
  { id: 'fx_cross',   labelKey: 'ug_fx_cross',   group: 'forex',       tooltip: 'EURGBP, GBPJPY' },
  { id: 'fx_exotic',  labelKey: 'ug_fx_exotic',  group: 'forex',       tooltip: 'USDTRY, USDMXN' },
  // Indices
  { id: 'index_us',          labelKey: 'ug_index_us',          group: 'indices', tooltip: 'SP500, NAS100, US30' },
  { id: 'index_eu_core',     labelKey: 'ug_index_eu_core',     group: 'indices', tooltip: 'DAX40' },
  { id: 'index_eu_tax',      labelKey: 'ug_index_eu_tax',      group: 'indices', tooltip: 'FTSE MIB, IBEX' },
  { id: 'index_asia',        labelKey: 'ug_index_asia',        group: 'indices', tooltip: 'Nikkei 225' },
  { id: 'index_volatility',  labelKey: 'ug_index_volatility',  group: 'indices', tooltip: 'VIX' },
  // Equities
  { id: 'equity_us_large', labelKey: 'ug_equity_us_large', group: 'equities', tooltip: 'AAPL, MSFT, NVDA' },
  { id: 'equity_us_small', labelKey: 'ug_equity_us_small', group: 'equities', tooltip: 'Hard-to-borrow fees' },
  { id: 'equity_eu_ftt',   labelKey: 'ug_equity_eu_ftt',   group: 'equities', tooltip: 'Italy, France, Spain' },
  { id: 'equity_eu_core',  labelKey: 'ug_equity_eu_core',  group: 'equities', tooltip: 'Germany, Netherlands' },
  { id: 'equity_uk',       labelKey: 'ug_equity_uk',       group: 'equities', tooltip: '0.5% Stamp Duty' },
  { id: 'equity_adr',      labelKey: 'ug_equity_adr',      group: 'equities', tooltip: 'Pass-through fees' },
  // Commodities
  { id: 'commodity_metal',  labelKey: 'ug_commodity_metal',  group: 'commodities', tooltip: 'Gold, Silver' },
  { id: 'commodity_energy', labelKey: 'ug_commodity_energy', group: 'commodities', tooltip: 'Oil, Gas' },
  { id: 'commodity_agri',   labelKey: 'ug_commodity_agri',   group: 'commodities', tooltip: 'High gap risk' },
  // ETF
  { id: 'etf_us_broad',     labelKey: 'ug_etf_us_broad',     group: 'etf', tooltip: 'SPY, QQQ' },
  { id: 'etf_us_leveraged', labelKey: 'ug_etf_us_leveraged', group: 'etf', tooltip: '2x/3x vol drag' },
  { id: 'etf_ucits',        labelKey: 'ug_etf_ucits',        group: 'etf', tooltip: 'EU harmonised' },
  // Crypto
  { id: 'crypto_major',   labelKey: 'ug_crypto_major',   group: 'crypto', tooltip: 'BTC, ETH' },
  { id: 'crypto_altcoin', labelKey: 'ug_crypto_altcoin', group: 'crypto', tooltip: 'Predatory spreads' },
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

// ─── Helpers ──────────────────────────────────────────────────────────────

function scrollIntoContainer(el: HTMLElement | null, behavior: ScrollBehavior = 'smooth') {
  if (!el) return;
  let parent = el.parentElement;
  while (parent) {
    const s = window.getComputedStyle(parent);
    if (s.overflowY === 'auto' || s.overflowY === 'scroll') {
      const er = el.getBoundingClientRect();
      const pr = parent.getBoundingClientRect();
      if (er.top < pr.top + 8)         parent.scrollBy({ top: er.top - pr.top - 16, behavior });
      else if (er.bottom > pr.bottom - 8) parent.scrollBy({ top: er.bottom - pr.bottom + 16, behavior });
      return;
    }
    parent = parent.parentElement;
  }
}

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

// ─── Driver computation (mirrors ScenarioSection exactly) ─────────────────────

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

function computeOutputs(capital: CapitalRange, asset: AssetGroupId, horizon: HorizonId, lev: boolean): Output[] {
  const levW: DriverWeights = lev ? { execution: 6, holding: 8, structure: 4 } : { execution: 0, holding: 0, structure: 0 };
  const sum = (...gs: DriverWeights[]) =>
    gs.reduce<DriverWeights>((a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }), { execution: 0, holding: 0, structure: 0 });
  const raw = sum(assetDrivers[asset], horizonAdj[horizon], capitalAdj[capital], levW);
  const e = Math.max(8, raw.execution), h = Math.max(8, raw.holding), s = Math.max(8, raw.structure);
  const tot = e + h + s;
  const ep = Math.round((e / tot) * 100), hp = Math.round((h / tot) * 100);
  return [
    { key: 'execution', value: ep,          barClass: 'bg-sky-400' },
    { key: 'holding',   value: hp,          barClass: 'bg-amber-400' },
    { key: 'structure', value: 100 - ep - hp, barClass: 'bg-emerald-400' },
  ];
}

// ─── UnderlyingCombobox ──────────────────────────────────────────────────────────

interface UnderlyingComboboxProps {
  selectedAsset: AssetGroupId;
  selectedUnderlying: UnderlyingGroup;
  onSelect: (u: UnderlyingGroup) => void;
}

const UnderlyingCombobox = ({ selectedAsset, selectedUnderlying, onSelect }: UnderlyingComboboxProps) => {
  const t = useTranslations('Simulator') as (key: string) => string;
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState('');
  const rootRef   = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  // Focus search on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // When searching, show all groups; otherwise only selected
  const grouped = useMemo(() => {
    const q = query.toLowerCase();
    const filtered = UNDERLYING_GROUPS.filter(u => {
      const matchesGroup = q ? true : u.group === selectedAsset;
      const matchesQuery = q
        ? t(u.labelKey).toLowerCase().includes(q) || u.tooltip.toLowerCase().includes(q) || u.id.includes(q)
        : true;
      return matchesGroup && matchesQuery;
    });

    // Group by asset group preserving order
    const map = new Map<AssetGroupId, UnderlyingGroup[]>();
    for (const u of filtered) {
      if (!map.has(u.group)) map.set(u.group, []);
      map.get(u.group)!.push(u);
    }
    return map;
  }, [query, selectedAsset, t]);

  const totalResults = [...grouped.values()].reduce((s, a) => s + a.length, 0);

  return (
    <div ref={rootRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-left text-sm font-medium text-foreground transition-colors duration-200 hover:border-border hover:bg-card/80 active:scale-[0.99]"
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{t(selectedUnderlying.labelKey)}</p>
          <p className="truncate font-mono text-[10px] text-muted-foreground/60">{selectedUnderlying.tooltip}</p>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
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
                  onClick={() => setQuery('')}
                  className="shrink-0 text-muted-foreground/50 hover:text-muted-foreground"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto">
            {totalResults === 0 ? (
              <p className="px-4 py-3 text-sm text-muted-foreground/60">{t('underlying_no_results')}</p>
            ) : (
              [...grouped.entries()].map(([groupId, items]) => (
                <div key={groupId}>
                  {/* Section header — only shown when searching across groups */}
                  {query && (
                    <p className="sticky top-0 bg-popover/95 px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground/50 backdrop-blur-sm">
                      {t(`instrument_${groupId}`)}
                    </p>
                  )}
                  {items.map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => { onSelect(u); setOpen(false); setQuery(''); }}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 hover:bg-muted/40 ${
                        selectedUnderlying.id === u.id ? 'bg-primary/8' : ''
                      }`}
                    >
                      {/* Checkmark column */}
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        {selectedUnderlying.id === u.id && (
                          <Check className="size-3.5 text-primary" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm ${ selectedUnderlying.id === u.id ? 'font-semibold text-foreground' : 'font-medium text-foreground/80' }`}>
                          {t(u.labelKey)}
                        </p>
                        <p className="truncate font-mono text-[10px] text-muted-foreground/50">{u.tooltip}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
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
  const [isStratOpen,        setIsStratOpen]        = useState(false);
  const [stratQuery,         setStratQuery]         = useState('');

  const stratDropdownRef = useRef<HTMLDivElement>(null);
  const stratTriggerRef  = useRef<HTMLButtonElement>(null);
  const stratSearchRef   = useRef<HTMLInputElement>(null);
  const capitalRef       = useRef<HTMLDivElement>(null);

  // Auto-select first underlying when asset group changes
  useEffect(() => {
    const first = UNDERLYING_GROUPS.find(u => u.group === selectedAsset);
    if (first) setSelectedUnderlying(first);
  }, [selectedAsset]);

  // Auto-select first strategy when horizon changes
  useEffect(() => {
    const available = STRATEGY_MAP[selectedHorizon] ?? [];
    if (!available.some(s => s.value === selectedStrategy)) {
      setSelectedStrategy(available[0]?.value ?? '');
    }
  }, [selectedHorizon, selectedStrategy]);

  // Close strategy dropdown on outside click
  useEffect(() => {
    if (!isStratOpen) return;
    const h = (e: MouseEvent) => {
      if (stratDropdownRef.current && !stratDropdownRef.current.contains(e.target as Node)) {
        setIsStratOpen(false); setStratQuery('');
      }
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [isStratOpen]);

  useEffect(() => {
    if (!isStratOpen) return;
    const id = setTimeout(() => {
      stratSearchRef.current?.focus();
      scrollIntoContainer(stratTriggerRef.current);
    }, 60);
    return () => clearTimeout(id);
  }, [isStratOpen]);

  const availableStrategies = STRATEGY_MAP[selectedHorizon] ?? [];
  const activeStrategy = availableStrategies.find(s => s.value === selectedStrategy) ?? availableStrategies[0];
  const filteredStrats = availableStrategies.filter(s =>
    t(s.labelKey).toLowerCase().includes(stratQuery.toLowerCase()),
  );

  const outputs = computeOutputs(selectedCapital, selectedAsset, selectedHorizon, leverageOn);

  const handleAssetChange = useCallback((id: AssetGroupId) => {
    setSelectedAsset(id);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 sm:p-7">

      {/* Capital — 6 tiers, grid 2→3 */}
      <div ref={capitalRef}>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('label_capital')}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CAPITAL_RANGES.map(c => (
            <button
              key={c.id}
              onClick={() => { setSelectedCapital(c.id); scrollIntoContainer(capitalRef.current); }}
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

      {/* Asset group — 6 groups, grid 2→3 */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('label_instrument')}</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ASSET_GROUPS.map(ag => (
            <button
              key={ag.id}
              onClick={() => handleAssetChange(ag.id)}
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

      {/* Underlying grouped combobox */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('label_underlying')}</p>
        <UnderlyingCombobox
          selectedAsset={selectedAsset}
          selectedUnderlying={selectedUnderlying}
          onSelect={setSelectedUnderlying}
        />
      </div>

      {/* Horizon — 3 buttons */}
      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('label_horizon')}</p>
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

      {/* Strategy combobox */}
      <div ref={stratDropdownRef} className="relative">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('label_strategy')}</p>
        <button
          ref={stratTriggerRef}
          onClick={() => setIsStratOpen(v => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-border hover:bg-card/80 active:scale-[0.99]"
        >
          <span>{activeStrategy ? t(activeStrategy.labelKey) : t('strategy_placeholder')}</span>
          <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isStratOpen ? 'rotate-180' : ''}`} />
        </button>

        {isStratOpen && (
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
            <div className="border-b border-border/50 px-3 py-2">
              <div className="flex items-center gap-2">
                <Search className="size-3.5 shrink-0 text-muted-foreground/60" />
                <input
                  ref={stratSearchRef}
                  value={stratQuery}
                  onChange={e => setStratQuery(e.target.value)}
                  placeholder={t('strategy_search')}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {filteredStrats.length > 0 ? (
                filteredStrats.map(s => (
                  <button
                    key={s.value}
                    onClick={() => { setSelectedStrategy(s.value); setIsStratOpen(false); setStratQuery(''); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-muted/40 ${
                      (activeStrategy?.value ?? '') === s.value ? 'bg-primary/8 font-semibold text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {(activeStrategy?.value ?? '') === s.value && <Check className="size-3.5 text-primary" />}
                    </span>
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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${ leverageOn ? 'bg-primary' : 'bg-muted' }`}
          role="switch"
          aria-checked={leverageOn}
        >
          <span className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${ leverageOn ? 'translate-x-6' : 'translate-x-1' }`} />
        </button>
      </div>

      {/* ── Output preview ───────────────────────────────────────────── */}
      <div className="rounded-2xl border border-border/50 bg-muted/10 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('preview_title')}</p>
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400">{t('preview_live')}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {[CAPITAL_RANGES.find(c => c.id === selectedCapital), ASSET_GROUPS.find(a => a.id === selectedAsset)].filter(Boolean).map(item => item && (
            <span key={item.id} className={`rounded-full border ${item.border} ${item.bg} px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/70`}>
              {t(item.labelKey)}
            </span>
          ))}
          <span className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/60">
            {t(selectedUnderlying.labelKey)}
          </span>
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${ leverageOn ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-border/50 bg-muted/20 text-muted-foreground/60' }`}>
            {leverageOn ? t('leverage_on') : t('leverage_off')}
          </span>
        </div>

        {/* Engine status */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border/40 bg-background px-3 py-2.5">
          <span className={`size-1.5 rounded-full ${ leverageOn ? 'animate-pulse bg-emerald-400' : 'bg-muted-foreground/40' }`} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">{t(`engine_${selectedHorizon}`)}</span>
        </div>

        {/* Active strategy badge */}
        {activeStrategy && (
          <div className={`mb-4 rounded-xl border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] ${ leverageOn ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-border/40 bg-muted/20 text-muted-foreground/60' }`}>
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
                <div className={`h-1.5 rounded-full ${d.barClass}`} style={{ width: `${d.value}%`, transition: 'width 600ms cubic-bezier(0.25,0.46,0.45,0.94)' }} />
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs leading-6 text-muted-foreground/60">{t(`insight_${selectedHorizon}`)}</p>
        </div>

        {/* Engine reads */}
        <div className="mt-4 border-t border-border/30 pt-4">
          <p className="pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('engine_reads_title')}</p>
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

      {/* CTA */}
      <Button className="w-full" size="lg">{t('cta')}</Button>
    </div>
  );
};

// ─── SimulatorDrawer ─────────────────────────────────────────────────────────

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label={t('drawer_title')}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={panelRef} className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background px-6 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/60">{t('drawer_eyebrow')}</p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-foreground">{t('drawer_title')}</h2>
          </div>
          <button onClick={onClose} className="flex size-9 items-center justify-center rounded-xl border border-border bg-muted/30 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">{t('close')}</span>
          </button>
        </div>
        <SimulatorContent onClose={onClose} />
      </div>
    </div>
  );
};
