'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  size as floatingSize,
  useFloating,
} from '@floating-ui/react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, X } from 'lucide-react';
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

// ─── Premium inline SVG icons (16×16, currentColor, strokeWidth 1.4) ───────────────
// One geometric mark per asset class — minimal, scalable, monochrome.

const IconForex = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {/* Two overlapping currency rings suggesting exchange */}
    <circle cx="5.5" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="10.5" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconIndices = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {/* OHLC-style bars — three vertical candlestick marks */}
    <line x1="4" y1="3" x2="4" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="2.5" y1="6" x2="5.5" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="2.5" y1="10" x2="5.5" y2="10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="9" y1="2" x2="9" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7.5" y1="4.5" x2="10.5" y2="4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7.5" y1="8.5" x2="10.5" y2="8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="13.5" y1="5" x2="13.5" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="12" y1="7.5" x2="15" y2="7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="12" y1="11.5" x2="15" y2="11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconEquities = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {/* Minimal building facade: base + two columns + cornice */}
    <rect x="2" y="11" width="12" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
    <rect x="2" y="3" width="12" height="2" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
    <line x1="5" y1="5" x2="5" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="11" y1="5" x2="11" y2="11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const IconEtf = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {/* 2×2 grid of squares — portfolio basket */}
    <rect x="2" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="8.5" y="2" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="2" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const IconCommodities = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {/* Hexagon — crystalline / raw material */}
    <polygon
      points="8,2 13.2,5 13.2,11 8,14 2.8,11 2.8,5"
      stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
    />
  </svg>
);

const IconCrypto = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    {/* Rotated square (diamond) — canonical crypto mark */}
    <rect
      x="3.5" y="3.5" width="9" height="9" rx="1"
      stroke="currentColor" strokeWidth="1.4"
      transform="rotate(45 8 8)"
    />
  </svg>
);

const ASSET_ICONS: Record<AssetGroupId, React.ReactNode> = {
  forex:       <IconForex />,
  indices:     <IconIndices />,
  equities:    <IconEquities />,
  etf:         <IconEtf />,
  commodities: <IconCommodities />,
  crypto:      <IconCrypto />,
};

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

const CAPITAL_RANGES: { id: CapitalRange; labelKey: string }[] = [
  { id: 'tiny',     labelKey: 'capital_tiny' },
  { id: 'small',    labelKey: 'capital_small' },
  { id: 'mid',      labelKey: 'capital_mid' },
  { id: 'mid_plus', labelKey: 'capital_mid_plus' },
  { id: 'large',    labelKey: 'capital_large' },
  { id: 'xlarge',   labelKey: 'capital_xlarge' },
];

const ASSET_GROUPS: { id: AssetGroupId; labelKey: string }[] = [
  { id: 'forex',       labelKey: 'instrument_forex' },
  { id: 'indices',     labelKey: 'instrument_indices' },
  { id: 'equities',    labelKey: 'instrument_equities' },
  { id: 'etf',         labelKey: 'instrument_etf' },
  { id: 'commodities', labelKey: 'instrument_commodities' },
  { id: 'crypto',      labelKey: 'instrument_crypto' },
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

// ─── Design tokens ─────────────────────────────────────────────────────────────
//
// Monochrome institutional palette:
//   — IDLE chips   : border/25, bg transparent, text muted/60
//   — ACTIVE chips : border/50, bg foreground/5, text foreground
//   — Driver bars  : single foreground fill, three opacity levels (80/55/35)
//                     → hierarchy without hue diversity
//   — Accent green : ONLY for the live-dot (×1 instance), opacity 40 max

const IDLE =
  'border-border/25 bg-transparent text-muted-foreground/60 ' +
  'hover:border-border/50 hover:bg-foreground/[0.03] hover:text-foreground ' +
  'transition-all duration-150 active:scale-[0.97]';

const ACTIVE =
  'border-foreground/30 bg-foreground/[0.06] text-foreground ' +
  'transition-all duration-150 active:scale-[0.97]';

// Three driver bar fills — same hue (foreground), different opacity
const DRIVER_BARS = [
  { fillClass: 'bg-foreground/80', trackClass: 'bg-foreground/[0.07]' },
  { fillClass: 'bg-foreground/50', trackClass: 'bg-foreground/[0.05]' },
  { fillClass: 'bg-foreground/30', trackClass: 'bg-foreground/[0.04]' },
] as const;

// ─── Driver computation ───────────────────────────────────────────────────────

type OutputKey = 'execution' | 'holding' | 'structure';
type W = { execution: number; holding: number; structure: number };
interface Output { key: OutputKey; value: number; label: string; fillClass: string; trackClass: string }

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
  const levW: W = lev
    ? { execution: 6, holding: 8, structure: 4 }
    : { execution: 0, holding: 0, structure: 0 };
  const add = (...ws: W[]): W => ws.reduce(
    (a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }),
    { execution: 0, holding: 0, structure: 0 },
  );
  const raw = add(assetW[asset], horizonW[horizon], capitalW[capital], levW);
  const e = Math.max(8, raw.execution);
  const h = Math.max(8, raw.holding);
  const s = Math.max(8, raw.structure);
  const tot = e + h + s;
  const ep  = Math.round(e / tot * 100);
  const hp  = Math.round(h / tot * 100);
  return [
    { key: 'execution', value: ep,            label: 'driver_execution', ...DRIVER_BARS[0] },
    { key: 'holding',   value: hp,            label: 'driver_holding',   ...DRIVER_BARS[1] },
    { key: 'structure', value: 100 - ep - hp, label: 'driver_structure', ...DRIVER_BARS[2] },
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

// ─── AnimatedNumber ───────────────────────────────────────────────────────────

const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const diff = value - start;
    const duration = 400;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - startTime) / duration);
      const ease = 1 - (1 - p) ** 3;
      setDisplay(Math.round(start + diff * ease));
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{display}</>;
};

// ─── SearchCombobox (floating, portal) ───────────────────────────────────────

interface SearchComboboxProps {
  label: string;
  value: UnderlyingGroup;
  options: UnderlyingGroup[];
  onSelect: (u: UnderlyingGroup) => void;
  searchPlaceholder: string;
  noResults: string;
  t: (k: string) => string;
}

const SearchCombobox = ({
  label, value, options, onSelect, searchPlaceholder, noResults, t,
}: SearchComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { refs, floatingStyles } = useFloating({
    open,
    placement: 'bottom-start',
    middleware: [
      offset(4), flip({ padding: 8 }), shift({ padding: 8 }),
      floatingSize({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${Math.min(280, availableHeight - 8)}px`,
          });
        },
        padding: 8,
      }),
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

  const filtered = options.filter(u =>
    t(u.labelKey).toLowerCase().includes(q.toLowerCase()) ||
    u.tooltip.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <p className="mb-2.5 text-xs font-medium text-muted-foreground/50">{label}</p>
      <button
        ref={refs.setReference}
        type="button"
        onClick={() => {
          if (refs.reference.current instanceof HTMLElement)
            refs.reference.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          setTimeout(() => setOpen(v => !v), 60);
        }}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/30 bg-foreground/[0.02] px-4 py-3 text-sm font-medium text-foreground transition-all duration-150 hover:border-border/50 hover:bg-foreground/[0.04] active:scale-[0.99]"
      >
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate">{t(value.labelKey)}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground/35">{value.tooltip}</p>
        </div>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{ ...floatingStyles, zIndex: 9999 }}
            className="overflow-hidden rounded-xl border border-border/40 bg-popover shadow-xl shadow-black/20"
          >
            <div className="border-b border-border/20 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <Search className="size-3.5 shrink-0 text-muted-foreground/35" />
                <input
                  ref={inputRef} value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/35 focus:outline-none"
                />
                {q && (
                  <button type="button" onClick={() => setQ('')} className="shrink-0">
                    <X className="size-3 text-muted-foreground/35" />
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
              {filtered.length === 0
                ? <p className="px-4 py-3 text-sm text-muted-foreground/40">{noResults}</p>
                : filtered.map(u => (
                  <button
                    key={u.id} type="button"
                    onClick={() => { onSelect(u); setOpen(false); }}
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-foreground/[0.04] ${
                      value.id === u.id ? 'bg-foreground/[0.05] text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <span className="flex size-4 shrink-0 items-center justify-center">
                      {value.id === u.id && <Check className="size-3.5 text-foreground" />}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{t(u.labelKey)}</p>
                      <p className="text-[11px] text-muted-foreground/35">{u.tooltip}</p>
                    </div>
                  </button>
                ))
              }
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

const LivePreview = ({
  capital, asset, underlying, horizon, strategy, leverage, t, compact,
}: PreviewProps) => {
  const outputs = computeOutputs(capital, asset, horizon, leverage);
  const strategies = STRATEGY_MAP[horizon] ?? [];
  const activeStrat = strategies.find(s => s.value === strategy) ?? strategies[0];
  const assetItem = ASSET_GROUPS.find(a => a.id === asset);

  return (
    <div className={`flex flex-col gap-5 ${compact ? '' : 'h-full'}`}>

      {/* ── Header: label + live badge ── */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/40">
          {t('preview_title')}
        </span>
        {/* Minimal live indicator — one subdued green dot, no pill */}
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-foreground/25" />
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground/40">
            {t('preview_live')}
          </span>
        </div>
      </div>

      {/* ── Configuration summary ── */}
      <div className="rounded-xl border border-border/20 bg-foreground/[0.02] p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/35">
          {t('preview_config_title')}
        </p>
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/35">{t('label_capital')}</p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {t(CAPITAL_RANGES.find(c => c.id === capital)?.labelKey ?? '')}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/35">{t('label_instrument')}</p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="text-muted-foreground/50">{ASSET_ICONS[asset]}</span>
              <p className="text-sm font-semibold text-foreground">{t(assetItem?.labelKey ?? '')}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/35">{t('label_underlying')}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground/75">{t(underlying.labelKey)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/35">{t('label_horizon')}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground/75">
              {t(HORIZONS.find(h => h.id === horizon)?.labelKey ?? '')}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/35">{t('label_strategy')}</p>
            <p className="mt-0.5 text-sm font-medium text-foreground/75">
              {activeStrat ? t(activeStrat.labelKey) : '—'}
            </p>
          </div>
        </div>
        {/* Leverage row */}
        <div className="mt-3 flex items-center gap-2 border-t border-border/15 pt-3">
          <div
            className={`size-1.5 rounded-full transition-colors duration-300 ${
              leverage ? 'bg-foreground/60' : 'bg-foreground/15'
            }`}
          />
          <span
            className={`text-[11px] font-medium transition-colors duration-300 ${
              leverage ? 'text-foreground/60' : 'text-muted-foreground/30'
            }`}
          >
            {leverage ? t('leverage_on') : t('leverage_off')}
          </span>
        </div>
      </div>

      {/* ── Cost driver bars ── */}
      <div className="flex flex-col gap-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/35">
          {t('drivers_title')}
        </p>
        {outputs.map(d => (
          <div key={d.key} className="flex items-center gap-3">
            <div className="w-11 shrink-0 text-right">
              <span className="text-xl font-bold tabular-nums leading-none text-foreground">
                <AnimatedNumber value={d.value} />
              </span>
              <span className="text-[11px] text-muted-foreground/40">%</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 text-[11px] font-medium text-muted-foreground/50">{t(d.label)}</p>
              <div className={`h-[3px] overflow-hidden rounded-full ${d.trackClass}`}>
                <div
                  className={`h-[3px] rounded-full ${d.fillClass} transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}
                  style={{ width: `${d.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Engine insight ── */}
      <div className="rounded-xl border border-border/15 bg-foreground/[0.02] px-4 py-3.5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/35">
          {t(`engine_${horizon}`)}
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground/55">{t(`insight_${horizon}`)}</p>
      </div>

      {/* ── Numbered reads ── */}
      <div className="space-y-2.5">
        {(['read_1', 'read_2', 'read_3'] as const).map((k, i) => (
          <div key={k} className="flex items-start gap-3">
            <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-border/30">
              <span className="text-[9px] font-semibold tabular-nums text-muted-foreground/50">{i + 1}</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground/55">{t(k)}</p>
          </div>
        ))}
      </div>

      <p className="text-[10px] leading-4 text-muted-foreground/30">{t('preview_note')}</p>
    </div>
  );
};

// ─── FieldLabel ──────────────────────────────────────────────────────────────

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/40">
    {children}
  </p>
);

// ─── SimulatorControls ────────────────────────────────────────────────────────

interface ControlsProps {
  capital: CapitalRange;      setCapital: (v: CapitalRange) => void;
  asset: AssetGroupId;        setAsset: (v: AssetGroupId) => void;
  underlying: UnderlyingGroup; setUnderlying: (v: UnderlyingGroup) => void;
  horizon: HorizonId;         setHorizon: (v: HorizonId) => void;
  strategy: StrategyId;       setStrategy: (v: StrategyId) => void;
  leverage: boolean;          setLeverage: (v: boolean) => void;
  t: (k: string) => string;
  step?: 1 | 2 | 3;
}

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
    <div className="flex flex-col gap-6">

      {/* ── STEP 1: Capital + Asset ── */}
      {showStep1 && (
        <>
          <div>
            <FieldLabel>{t('label_capital')}</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {CAPITAL_RANGES.map(c => (
                <button
                  key={c.id} type="button"
                  onClick={() => setCapital(c.id)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm font-medium ${
                    capital === c.id ? ACTIVE : IDLE
                  }`}
                >
                  {t(c.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>{t('label_instrument')}</FieldLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ASSET_GROUPS.map(ag => (
                <button
                  key={ag.id} type="button"
                  onClick={() => setAsset(ag.id)}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium ${
                    asset === ag.id ? ACTIVE : IDLE
                  }`}
                >
                  {/* SVG icon — desaturated when idle, full foreground when active */}
                  <span
                    className={`shrink-0 transition-opacity duration-150 ${
                      asset === ag.id ? 'opacity-80' : 'opacity-30'
                    }`}
                  >
                    {ASSET_ICONS[ag.id]}
                  </span>
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
          <div>
            <FieldLabel>{t('label_underlying')}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {underlyingsForAsset.map(u => (
                <button
                  key={u.id} type="button"
                  onClick={() => setUnderlying(u)}
                  title={u.tooltip}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                    underlying.id === u.id ? ACTIVE : IDLE
                  }`}
                >
                  {t(u.labelKey)}
                </button>
              ))}
            </div>
            {underlying && (
              <p className="mt-2 text-[11px] text-muted-foreground/35">{underlying.tooltip}</p>
            )}
          </div>

          <div>
            <FieldLabel>{t('label_horizon')}</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {HORIZONS.map(h => (
                <button
                  key={h.id} type="button"
                  onClick={() => setHorizon(h.id)}
                  className={`flex flex-col items-start rounded-xl border px-3 py-2.5 ${
                    horizon === h.id ? ACTIVE : IDLE
                  }`}
                >
                  <span className="text-sm font-semibold">{t(h.labelKey)}</span>
                  <span className="mt-1 text-[10px] opacity-40">{h.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>{t('label_strategy')}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {strategies.map(s => (
                <button
                  key={s.value} type="button"
                  onClick={() => setStrategy(s.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium ${
                    strategy === s.value ? ACTIVE : IDLE
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
        <div className="flex items-center justify-between rounded-xl border border-border/25 bg-foreground/[0.02] px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">{t('label_leverage')}</p>
            <p className="mt-0.5 text-xs text-muted-foreground/45">{t('leverage_note')}</p>
          </div>
          <button
            type="button" role="switch" aria-checked={leverage}
            onClick={() => setLeverage(!leverage)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 ${
              leverage ? 'bg-foreground/70' : 'bg-foreground/15'
            }`}
          >
            <span
              className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform duration-200 ${
                leverage ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

// ─── DesktopContent ───────────────────────────────────────────────────────────

const DesktopContent = ({ onClose }: { onClose: () => void }) => {
  const t = useTranslations('Simulator') as (k: string) => string;
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

  return (
    <div className="flex h-full flex-col">

      {/* Sticky header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/30 px-7 py-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-muted-foreground/35">
            {t('drawer_eyebrow')}
          </p>
          <h2 className="mt-1 text-base font-semibold tracking-tight text-foreground">{t('drawer_title')}</h2>
        </div>
        <button
          type="button" onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg border border-border/30 text-muted-foreground/50 transition-all duration-150 hover:border-border/50 hover:text-foreground"
        >
          <X className="size-3.5" />
          <span className="sr-only">{t('close')}</span>
        </button>
      </div>

      {/* Body: 54 controls / 46 preview */}
      <div className="grid min-h-0 flex-1 grid-cols-[54fr_46fr] divide-x divide-border/20">

        {/* Left — scrollable controls */}
        <div className="overflow-y-auto p-7">
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

        {/* Right — live preview */}
        <div className="flex flex-col overflow-y-auto p-7">
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

// ─── MobileWizard ───────────────────────────────────────────────────────────

const STEPS = [1, 2, 3] as const;
type Step = typeof STEPS[number];

const STEP_LABELS: Record<Step, string> = {
  1: 'Capital & Asset',
  2: 'Market & Strategy',
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

  const progress = Math.round((step / 3) * 100);

  return (
    <div className="flex flex-col">

      {/* ── 1px progress bar ── */}
      <div className="h-px w-full bg-border/20">
        <div
          className="h-px bg-foreground/40 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Step header ── */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          {STEPS.map(s => (
            <div
              key={s}
              className={`flex size-5 items-center justify-center rounded-full text-[10px] font-semibold transition-all duration-200 ${
                s < step
                  ? 'bg-foreground/80 text-background'
                  : s === step
                    ? 'border border-foreground/50 text-foreground'
                    : 'border border-border/30 text-muted-foreground/25'
              }`}
            >
              {s < step ? <Check className="size-2.5" strokeWidth={2.5} /> : s}
            </div>
          ))}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/40">
          {STEP_LABELS[step]}
        </span>
      </div>

      {/* ── Step content ── */}
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
            <div className="flex flex-col gap-5">
              <SimulatorControls
                capital={capital} setCapital={setCapital}
                asset={asset}     setAsset={setAsset}
                underlying={underlying} setUnderlying={setUnderlying}
                horizon={horizon} setHorizon={setHorizon}
                strategy={strategy} setStrategy={setStrategy}
                leverage={leverage} setLeverage={setLeverage}
                t={t} step={3}
              />
              <div className="rounded-xl border border-border/20 bg-foreground/[0.02] p-4">
                <LivePreview
                  capital={capital} asset={asset} underlying={underlying}
                  horizon={horizon} strategy={strategy} leverage={leverage}
                  t={t} compact
                />
              </div>
            </div>
          )
        }
      </div>

      {/* ── Navigation footer ── */}
      <div className="flex items-center gap-3 border-t border-border/20 px-5 py-4">
        {step > 1
          ? (
            <button
              type="button"
              onClick={() => setStep(s => (s - 1) as Step)}
              className="flex items-center gap-1.5 rounded-xl border border-border/30 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground/60 transition-all duration-150 hover:border-border/50 hover:text-foreground active:scale-[0.97]"
            >
              <ArrowLeft className="size-3.5" />
              {t('wizard_back')}
            </button>
          )
          : <div />}
        {step < 3
          ? (
            <button
              type="button"
              onClick={() => setStep(s => (s + 1) as Step)}
              className="ml-auto flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-all duration-150 hover:opacity-85 active:scale-[0.97]"
            >
              {t('wizard_next')}
              <ArrowRight className="size-3.5" />
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[4px]"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="relative z-10 flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/40 bg-background shadow-2xl shadow-black/25">
        <DesktopContent onClose={onClose} />
      </div>
    </div>
  );
};
