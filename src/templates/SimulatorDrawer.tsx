'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size as floatingSize,
  useFloating,
} from '@floating-ui/react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, X, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';

// ─── Types ────────────────────────────────────────────────────────────────────

type CapitalRange = 'tiny' | 'small' | 'mid' | 'mid_plus' | 'large' | 'xlarge';
type AssetGroupId = 'forex' | 'indices' | 'equities' | 'etf' | 'commodities' | 'crypto';
type HorizonId = 'scalp' | 'swing' | 'position';
type StrategyId = string;

interface UnderlyingGroup {
  id: string;
  labelKey: string;
  group: AssetGroupId;
  tooltip: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const UNDERLYING_GROUPS: UnderlyingGroup[] = [
  { id: 'fx_core',           labelKey: 'ug_fx_core',           group: 'forex',       tooltip: 'EURUSD · GBPUSD · USDJPY' },
  { id: 'fx_cross',          labelKey: 'ug_fx_cross',          group: 'forex',       tooltip: 'EURGBP · GBPJPY' },
  { id: 'fx_exotic',         labelKey: 'ug_fx_exotic',         group: 'forex',       tooltip: 'USDTRY · USDMXN' },
  { id: 'index_us',          labelKey: 'ug_index_us',          group: 'indices',     tooltip: 'SP500 · NAS100 · US30' },
  { id: 'index_eu_core',     labelKey: 'ug_index_eu_core',     group: 'indices',     tooltip: 'DAX40' },
  { id: 'index_eu_tax',      labelKey: 'ug_index_eu_tax',      group: 'indices',     tooltip: 'FTSE MIB · IBEX' },
  { id: 'index_asia',        labelKey: 'ug_index_asia',        group: 'indices',     tooltip: 'Nikkei 225' },
  { id: 'index_volatility',  labelKey: 'ug_index_volatility',  group: 'indices',     tooltip: 'VIX' },
  { id: 'equity_us_large',   labelKey: 'ug_equity_us_large',   group: 'equities',   tooltip: 'AAPL · MSFT · NVDA' },
  { id: 'equity_us_small',   labelKey: 'ug_equity_us_small',   group: 'equities',   tooltip: 'Hard-to-borrow fees' },
  { id: 'equity_eu_ftt',     labelKey: 'ug_equity_eu_ftt',     group: 'equities',   tooltip: 'Italy · France · Spain' },
  { id: 'equity_eu_core',    labelKey: 'ug_equity_eu_core',    group: 'equities',   tooltip: 'Germany · Netherlands' },
  { id: 'equity_uk',         labelKey: 'ug_equity_uk',         group: 'equities',   tooltip: '0.5% Stamp Duty' },
  { id: 'equity_adr',        labelKey: 'ug_equity_adr',        group: 'equities',   tooltip: 'Pass-through fees' },
  { id: 'commodity_metal',   labelKey: 'ug_commodity_metal',   group: 'commodities', tooltip: 'Gold · Silver' },
  { id: 'commodity_energy',  labelKey: 'ug_commodity_energy',  group: 'commodities', tooltip: 'Oil · Gas' },
  { id: 'commodity_agri',    labelKey: 'ug_commodity_agri',    group: 'commodities', tooltip: 'High gap risk' },
  { id: 'etf_us_broad',      labelKey: 'ug_etf_us_broad',      group: 'etf',         tooltip: 'SPY · QQQ' },
  { id: 'etf_us_leveraged',  labelKey: 'ug_etf_us_leveraged',  group: 'etf',         tooltip: '2x/3x vol drag' },
  { id: 'etf_ucits',         labelKey: 'ug_etf_ucits',         group: 'etf',         tooltip: 'EU harmonised' },
  { id: 'crypto_major',      labelKey: 'ug_crypto_major',      group: 'crypto',      tooltip: 'BTC · ETH' },
  { id: 'crypto_altcoin',    labelKey: 'ug_crypto_altcoin',    group: 'crypto',      tooltip: 'Predatory spreads' },
];

const CAPITAL_RANGES: { id: CapitalRange; labelKey: string; color: string }[] = [
  { id: 'tiny',     labelKey: 'capital_tiny',     color: 'slate' },
  { id: 'small',    labelKey: 'capital_small',    color: 'sky' },
  { id: 'mid',      labelKey: 'capital_mid',      color: 'sky' },
  { id: 'mid_plus', labelKey: 'capital_mid_plus', color: 'emerald' },
  { id: 'large',    labelKey: 'capital_large',    color: 'amber' },
  { id: 'xlarge',   labelKey: 'capital_xlarge',   color: 'orange' },
];

const ASSET_GROUPS: { id: AssetGroupId; labelKey: string; color: string; emoji: string }[] = [
  { id: 'forex',       labelKey: 'instrument_forex',       color: 'amber',   emoji: '💱' },
  { id: 'indices',     labelKey: 'instrument_indices',     color: 'sky',     emoji: '📈' },
  { id: 'equities',    labelKey: 'instrument_equities',    color: 'emerald', emoji: '🏢' },
  { id: 'etf',         labelKey: 'instrument_etf',         color: 'teal',    emoji: '🗂' },
  { id: 'commodities', labelKey: 'instrument_commodities', color: 'orange',  emoji: '⛏️' },
  { id: 'crypto',      labelKey: 'instrument_crypto',      color: 'violet',  emoji: '₿' },
];

const HORIZONS: { id: HorizonId; labelKey: string; desc: string }[] = [
  { id: 'scalp',    labelKey: 'horizon_scalp',    desc: 'seconds – minutes' },
  { id: 'swing',    labelKey: 'horizon_swing',    desc: 'hours – days' },
  { id: 'position', labelKey: 'horizon_position', desc: 'weeks – months' },
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

// ─── Color helpers ────────────────────────────────────────────────────────────

const COLOR_ACTIVE: Record<string, string> = {
  slate:   'border-slate-400/50   bg-slate-400/10   text-slate-300',
  sky:     'border-sky-400/50     bg-sky-400/10     text-sky-300',
  emerald: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300',
  amber:   'border-amber-400/50   bg-amber-400/10   text-amber-300',
  orange:  'border-orange-400/50  bg-orange-400/10  text-orange-300',
  teal:    'border-teal-400/50    bg-teal-400/10    text-teal-300',
  violet:  'border-violet-400/50  bg-violet-400/10  text-violet-300',
};

const IDLE = 'border-border/40 bg-card/60 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground';

// ─── Driver computation ───────────────────────────────────────────────────────

type OutputKey = 'execution' | 'holding' | 'structure';
type W = { execution: number; holding: number; structure: number };
interface Output { key: OutputKey; value: number; bar: string; label: string }

const assetW: Record<AssetGroupId, W> = {
  forex:       { execution: 50, holding: 30, structure: 20 },
  indices:     { execution: 56, holding: 24, structure: 20 },
  equities:    { execution: 28, holding: 16, structure: 56 },
  etf:         { execution: 22, holding: 22, structure: 56 },
  commodities: { execution: 34, holding: 28, structure: 38 },
  crypto:      { execution: 40, holding: 36, structure: 24 },
};
const horizonW: Record<HorizonId, W> = {
  scalp:    { execution: 26, holding: -12, structure: -10 },
  swing:    { execution:  8, holding:   4, structure:  -2 },
  position: { execution: -4, holding:  14, structure:   2 },
};
const capitalW: Record<CapitalRange, W> = {
  tiny:     { execution: -2, holding: 0, structure: 10 },
  small:    { execution: -1, holding: 0, structure:  8 },
  mid:      { execution:  3, holding: 2, structure: -2 },
  mid_plus: { execution:  5, holding: 3, structure: -5 },
  large:    { execution:  8, holding: 4, structure: -10 },
  xlarge:   { execution: 10, holding: 5, structure: -12 },
};

function computeOutputs(capital: CapitalRange, asset: AssetGroupId, horizon: HorizonId, lev: boolean): Output[] {
  const levW: W = lev ? { execution: 6, holding: 8, structure: 4 } : { execution: 0, holding: 0, structure: 0 };
  const add = (...ws: W[]): W => ws.reduce((a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }), { execution: 0, holding: 0, structure: 0 });
  const raw = add(assetW[asset], horizonW[horizon], capitalW[capital], levW);
  const e = Math.max(8, raw.execution), h = Math.max(8, raw.holding), s = Math.max(8, raw.structure);
  const tot = e + h + s;
  const ep = Math.round(e / tot * 100), hp = Math.round(h / tot * 100);
  return [
    { key: 'execution', value: ep,            bar: 'bg-sky-400',     label: 'driver_execution' },
    { key: 'holding',   value: hp,            bar: 'bg-amber-400',   label: 'driver_holding' },
    { key: 'structure', value: 100 - ep - hp, bar: 'bg-emerald-400', label: 'driver_structure' },
  ];
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIsMobile(bp = 768) {
  const [v, set] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${bp - 1}px)`);
    set(mq.matches);
    const h = (e: MediaQueryListEvent) => set(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, [bp]);
  return v;
}

// ─── SearchCombobox (floating, portal) ───────────────────────────────────────
// Used ONLY as fallback on tablet for underlying search.

interface SearchComboboxProps {
  label: string;
  value: UnderlyingGroup;
  options: UnderlyingGroup[];
  onSelect: (u: UnderlyingGroup) => void;
  searchPlaceholder: string;
  noResults: string;
  t: (k: string) => string;
}

const SearchCombobox = ({ label, value, options, onSelect, searchPlaceholder, noResults, t }: SearchComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles } = useFloating({
    open,
    placement: 'bottom-start',
    middleware: [
      offset(4), flip({ padding: 8 }), shift({ padding: 8 }),
      floatingSize({ apply({ rects, elements, availableHeight }) {
        Object.assign(elements.floating.style, { width: `${rects.reference.width}px`, maxHeight: `${Math.min(280, availableHeight - 8)}px` });
      }, padding: 8 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); else setQ(''); }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (refs.reference.current instanceof Element && refs.reference.current.contains(e.target as Node)) return;
      if (refs.floating.current instanceof Element && refs.floating.current.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open, refs.floating, refs.reference]);

  const filtered = options.filter(u => t(u.labelKey).toLowerCase().includes(q.toLowerCase()) || u.tooltip.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">{label}</p>
      <button
        ref={refs.setReference} type="button"
        onClick={() => { refs.reference.current instanceof HTMLElement && refs.reference.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); setTimeout(() => setOpen(v => !v), 60); }}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-border hover:bg-card/80 active:scale-[0.99]"
      >
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate">{t(value.labelKey)}</p>
          <p className="truncate font-mono text-[10px] text-muted-foreground/50">{value.tooltip}</p>
        </div>
        <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} style={{ ...floatingStyles, zIndex: 9999 }} className="overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
            <div className="border-b border-border/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <Search className="size-3.5 text-muted-foreground/50" />
                <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder={searchPlaceholder} className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none" />
                {q && <button type="button" onClick={() => setQ('')}><X className="size-3 text-muted-foreground/50" /></button>}
              </div>
            </div>
            <div className="overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
              {filtered.length === 0
                ? <p className="px-4 py-3 text-sm text-muted-foreground/50">{noResults}</p>
                : filtered.map(u => (
                  <button key={u.id} type="button" onClick={() => { onSelect(u); setOpen(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/40 ${value.id === u.id ? 'bg-primary/[0.07] font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    <span className="flex size-4 shrink-0 items-center justify-center">{value.id === u.id && <Check className="size-3.5 text-primary" />}</span>
                    <div>
                      <p className="text-sm">{t(u.labelKey)}</p>
                      <p className="font-mono text-[10px] text-muted-foreground/40">{u.tooltip}</p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

// ─── LivePreview ──────────────────────────────────────────────────────────────

interface PreviewProps {
  capital: CapitalRange;
  asset: AssetGroupId;
  underlying: UnderlyingGroup;
  horizon: HorizonId;
  strategy: StrategyId;
  leverage: boolean;
  t: (k: string) => string;
  compact?: boolean;
}

const LivePreview = ({ capital, asset, underlying, horizon, strategy, leverage, t, compact }: PreviewProps) => {
  const outputs = computeOutputs(capital, asset, horizon, leverage);
  const strategies = STRATEGY_MAP[horizon] ?? [];
  const activeStrat = strategies.find(s => s.value === strategy) ?? strategies[0];
  const capitalItem = CAPITAL_RANGES.find(c => c.id === capital);
  const assetItem   = ASSET_GROUPS.find(a => a.id === asset);

  return (
    <div className={`flex flex-col gap-4 ${compact ? '' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="size-3.5 text-primary" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">
            {t('preview_title')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-400">{t('preview_live')}</span>
        </div>
      </div>

      {/* Config summary pills */}
      <div className="flex flex-wrap gap-1.5">
        {capitalItem && (
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${COLOR_ACTIVE[capitalItem.color]}`}>
            {t(capitalItem.labelKey)}
          </span>
        )}
        {assetItem && (
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${COLOR_ACTIVE[assetItem.color]}`}>
            {assetItem.emoji} {t(assetItem.labelKey)}
          </span>
        )}
        <span className="rounded-full border border-border/40 bg-muted/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground/60">
          {t(underlying.labelKey)}
        </span>
        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
          leverage ? 'border-emerald-400/50 bg-emerald-400/10 text-emerald-300' : 'border-border/40 bg-muted/20 text-muted-foreground/50'
        }`}>
          {leverage ? t('leverage_on') : t('leverage_off')}
        </span>
      </div>

      {/* Engine row */}
      <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/60 px-3 py-2.5">
        <span className={`size-1.5 rounded-full ${leverage ? 'animate-pulse bg-emerald-400' : 'bg-muted-foreground/30'}`} />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/60">{t(`engine_${horizon}`)}</span>
      </div>

      {/* Strategy pill */}
      {activeStrat && (
        <div className={`rounded-xl border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.12em] ${
          leverage ? 'border-emerald-400/30 bg-emerald-400/[0.07] text-emerald-300' : 'border-border/40 bg-muted/20 text-muted-foreground/50'
        }`}>
          {t(activeStrat.labelKey)}
        </div>
      )}

      {/* Driver bars */}
      <div className="space-y-3">
        {outputs.map(d => (
          <div key={d.key}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t(d.label)}</span>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">{d.value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted/30">
              <div
                className={`h-1.5 rounded-full ${d.bar} transition-[width] duration-500 ease-out`}
                style={{ width: `${d.value}%` }}
              />
            </div>
          </div>
        ))}
        <p className="pt-1 text-[11px] leading-5 text-muted-foreground/50">{t(`insight_${horizon}`)}</p>
      </div>

      {/* Engine reads */}
      <div className="rounded-xl border border-border/30 bg-muted/10 px-4 py-3">
        <p className="mb-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">{t('engine_reads_title')}</p>
        <div className="space-y-2">
          {(['read_1', 'read_2', 'read_3'] as const).map(k => (
            <div key={k} className="flex items-start gap-2">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-sky-400/70" />
              <p className="text-[11px] leading-5 text-muted-foreground/60">{t(k)}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] leading-4 text-muted-foreground/40">{t('preview_note')}</p>
    </div>
  );
};

// ─── SimulatorControls ────────────────────────────────────────────────────────
// All the form fields. Used both in desktop (full) and mobile (per-step).

interface ControlsProps {
  capital: CapitalRange; setCapital: (v: CapitalRange) => void;
  asset: AssetGroupId;   setAsset: (v: AssetGroupId) => void;
  underlying: UnderlyingGroup; setUnderlying: (v: UnderlyingGroup) => void;
  horizon: HorizonId;    setHorizon: (v: HorizonId) => void;
  strategy: StrategyId;  setStrategy: (v: StrategyId) => void;
  leverage: boolean;     setLeverage: (v: boolean) => void;
  t: (k: string) => string;
  /** Which step to show on mobile (0 = all on desktop) */
  step?: 1 | 2 | 3;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/50">{children}</p>
);

const SimulatorControls = ({
  capital, setCapital, asset, setAsset, underlying, setUnderlying,
  horizon, setHorizon, strategy, setStrategy, leverage, setLeverage, t, step,
}: ControlsProps) => {
  const underlyingsForAsset = UNDERLYING_GROUPS.filter(u => u.group === asset);
  const strategies = STRATEGY_MAP[horizon] ?? [];

  const showStep1 = !step || step === 1;
  const showStep2 = !step || step === 2;
  const showStep3 = !step || step === 3;

  return (
    <div className="flex flex-col gap-5">

      {/* ── STEP 1: Capital + Asset ── */}
      {showStep1 && (
        <>
          <div>
            <Label>{t('label_capital')}</Label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {CAPITAL_RANGES.map(c => (
                <button
                  key={c.id} type="button"
                  onClick={() => setCapital(c.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-[13px] font-medium transition-all duration-150 active:scale-[0.97] ${
                    capital === c.id ? COLOR_ACTIVE[c.color] : IDLE
                  }`}
                >
                  {t(c.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>{t('label_instrument')}</Label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {ASSET_GROUPS.map(ag => (
                <button
                  key={ag.id} type="button"
                  onClick={() => setAsset(ag.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-150 active:scale-[0.97] ${
                    asset === ag.id ? COLOR_ACTIVE[ag.color] : IDLE
                  }`}
                >
                  <span className="text-base leading-none">{ag.emoji}</span>
                  <span className="truncate">{t(ag.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── STEP 2: Underlying + Horizon + Strategy ── */}
      {showStep2 && (
        <>
          {/* Underlying chips — inline, no dropdown */}
          <div>
            <Label>{t('label_underlying')}</Label>
            <div className="flex flex-wrap gap-1.5">
              {underlyingsForAsset.map(u => (
                <button
                  key={u.id} type="button"
                  onClick={() => setUnderlying(u)}
                  title={u.tooltip}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 active:scale-[0.97] ${
                    underlying.id === u.id
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : IDLE
                  }`}
                >
                  {t(u.labelKey)}
                </button>
              ))}
            </div>
            {underlying && (
              <p className="mt-1.5 font-mono text-[10px] text-muted-foreground/40">{underlying.tooltip}</p>
            )}
          </div>

          <div>
            <Label>{t('label_horizon')}</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {HORIZONS.map(h => (
                <button
                  key={h.id} type="button"
                  onClick={() => setHorizon(h.id)}
                  className={`flex flex-col items-start rounded-xl border px-3 py-2.5 transition-all duration-150 active:scale-[0.97] ${
                    horizon === h.id
                      ? 'border-primary/40 bg-primary/10 text-foreground'
                      : IDLE
                  }`}
                >
                  <span className="text-[13px] font-medium">{t(h.labelKey)}</span>
                  <span className="mt-0.5 font-mono text-[9px] text-muted-foreground/40">{h.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Strategy pills */}
          <div>
            <Label>{t('label_strategy')}</Label>
            <div className="flex flex-wrap gap-1.5">
              {strategies.map(s => (
                <button
                  key={s.value} type="button"
                  onClick={() => setStrategy(s.value)}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all duration-150 active:scale-[0.97] ${
                    strategy === s.value
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : IDLE
                  }`}
                >
                  {t(s.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── STEP 3: Leverage ── */}
      {showStep3 && (
        <div className="flex items-center justify-between rounded-xl border border-border/40 bg-card/60 px-4 py-3.5">
          <div>
            <p className="text-[13px] font-medium text-foreground">{t('label_leverage')}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground/50">{t('leverage_note')}</p>
          </div>
          <button
            type="button" role="switch" aria-checked={leverage}
            onClick={() => setLeverage(!leverage)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
              leverage ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <span className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${leverage ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Desktop / Tablet layout ──────────────────────────────────────────────────

const DesktopContent = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations('Simulator') as (k: string) => string;
  const [capital,    setCapital]    = useState<CapitalRange>('mid');
  const [asset,      setAsset]      = useState<AssetGroupId>('forex');
  const [underlying, setUnderlying] = useState<UnderlyingGroup>(UNDERLYING_GROUPS[0]!);
  const [horizon,    setHorizon]    = useState<HorizonId>('scalp');
  const [strategy,   setStrategy]   = useState<StrategyId>('order_flow');
  const [leverage,   setLeverage]   = useState(false);

  // Auto-reset underlying when asset changes
  useEffect(() => {
    const first = UNDERLYING_GROUPS.find(u => u.group === asset);
    if (first) setUnderlying(first);
  }, [asset]);

  // Auto-reset strategy when horizon changes
  useEffect(() => {
    const available = STRATEGY_MAP[horizon] ?? [];
    if (!available.find(s => s.value === strategy))
      setStrategy(available[0]?.value ?? '');
  }, [horizon, strategy]);

  return (
    <div className="flex h-full flex-col">
      {/* Sticky header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-6 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/50">{t('drawer_eyebrow')}</p>
          <h2 className="mt-0.5 text-[17px] font-semibold tracking-tight text-foreground">{t('drawer_title')}</h2>
        </div>
        <button
          type="button" onClick={onClose}
          className="flex size-9 items-center justify-center rounded-xl border border-border/50 bg-muted/20 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
          <span className="sr-only">{t('close')}</span>
        </button>
      </div>

      {/* Body: two columns */}
      <div className="grid min-h-0 flex-1 grid-cols-[58fr_42fr] divide-x divide-border/40">

        {/* Left — controls, scrollable */}
        <div className="overflow-y-auto p-6">
          <SimulatorControls
            capital={capital} setCapital={setCapital}
            asset={asset}     setAsset={setAsset}
            underlying={underlying} setUnderlying={setUnderlying}
            horizon={horizon} setHorizon={setHorizon}
            strategy={strategy} setStrategy={setStrategy}
            leverage={leverage} setLeverage={setLeverage}
            t={t}
          />
        </div>

        {/* Right — live preview, sticky (does not scroll) */}
        <div className="flex flex-col overflow-y-auto p-6">
          <LivePreview
            capital={capital} asset={asset} underlying={underlying}
            horizon={horizon} strategy={strategy} leverage={leverage}
            t={t}
          />
          <div className="mt-auto pt-6">
            <Button className="w-full" size="lg">{t('cta')}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Mobile step wizard ───────────────────────────────────────────────────────

const STEPS = [1, 2, 3] as const;
type Step = typeof STEPS[number];

const STEP_LABELS: Record<Step, string> = {
  1: 'Capital & Asset',
  2: 'Underlying & Strategy',
  3: 'Leverage & Preview',
};

const MobileWizard = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations('Simulator') as (k: string) => string;
  const [step,       setStep]       = useState<Step>(1);
  const [capital,    setCapital]    = useState<CapitalRange>('mid');
  const [asset,      setAsset]      = useState<AssetGroupId>('forex');
  const [underlying, setUnderlying] = useState<UnderlyingGroup>(UNDERLYING_GROUPS[0]!);
  const [horizon,    setHorizon]    = useState<HorizonId>('scalp');
  const [strategy,   setStrategy]   = useState<StrategyId>('order_flow');
  const [leverage,   setLeverage]   = useState(false);

  useEffect(() => {
    const first = UNDERLYING_GROUPS.find(u => u.group === asset);
    if (first) setUnderlying(first);
  }, [asset]);

  useEffect(() => {
    const available = STRATEGY_MAP[horizon] ?? [];
    if (!available.find(s => s.value === strategy))
      setStrategy(available[0]?.value ?? '');
  }, [horizon, strategy]);

  const progress = (step / 3) * 100;

  return (
    <div className="flex flex-col">
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-border/30">
        <div
          className="h-0.5 bg-primary transition-[width] duration-400 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2">
          {STEPS.map(s => (
            <div key={s} className={`flex size-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
              s < step ? 'bg-primary text-white' :
              s === step ? 'border-2 border-primary text-primary' :
              'border border-border/50 text-muted-foreground/40'
            }`}>
              {s < step ? <Check className="size-2.5" /> : s}
            </div>
          ))}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/50">
          {STEP_LABELS[step]}
        </span>
      </div>

      {/* Step content */}
      <div className="px-5 pb-4">
        {step < 3
          ? (
            <SimulatorControls
              capital={capital} setCapital={setCapital}
              asset={asset}     setAsset={setAsset}
              underlying={underlying} setUnderlying={setUnderlying}
              horizon={horizon} setHorizon={setHorizon}
              strategy={strategy} setStrategy={setStrategy}
              leverage={leverage} setLeverage={setLeverage}
              t={t} step={step as 1 | 2}
            />
          )
          : (
            <div className="flex flex-col gap-4">
              <SimulatorControls
                capital={capital} setCapital={setCapital}
                asset={asset}     setAsset={setAsset}
                underlying={underlying} setUnderlying={setUnderlying}
                horizon={horizon} setHorizon={setHorizon}
                strategy={strategy} setStrategy={setStrategy}
                leverage={leverage} setLeverage={setLeverage}
                t={t} step={3}
              />
              <LivePreview
                capital={capital} asset={asset} underlying={underlying}
                horizon={horizon} strategy={strategy} leverage={leverage}
                t={t} compact
              />
            </div>
          )
        }
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 border-t border-border/30 px-5 py-4">
        {step > 1
          ? (
            <button
              type="button" onClick={() => setStep(s => (s - 1) as Step)}
              className="flex items-center gap-1.5 rounded-xl border border-border/50 bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Back
            </button>
          )
          : <div />}
        {step < 3
          ? (
            <button
              type="button" onClick={() => setStep(s => (s + 1) as Step)}
              className="ml-auto flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
            >
              Next <ArrowRight className="size-3.5" />
            </button>
          )
          : (
            <Button className="ml-auto" size="default">{t('cta')}</Button>
          )
        }
      </div>
    </div>
  );
};

// ─── SimulatorDrawer — public export ─────────────────────────────────────────

interface Props { isOpen: boolean; onClose: () => void }

export const SimulatorDrawer = ({ isOpen, onClose }: Props) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [isOpen, onClose]);

  if (isMobile) {
    return (
      <MobileBottomSheet isOpen={isOpen} onClose={onClose} title="" showHandle>
        <MobileWizard onClose={onClose} />
      </MobileBottomSheet>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
        <DesktopContent onClose={onClose} />
      </div>
    </div>
  );
};
