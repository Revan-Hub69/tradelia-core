'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useMemo, useRef } from 'react';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { AppConfig } from '@/utils/AppConfig';

// ==============================================
// SOTA MATRIX CONFIG - 1:1 DB ENUM ALIGNMENT
// NEVER MODIFY THESE VALUES - THEY MATCH POSTGRESQL
// ==============================================
export const ASSET_GROUPS = [
  { id: 'forex', label: 'Forex' },
  { id: 'indices', label: 'Indices & Volatility' },
  { id: 'equities', label: 'Equities' },
  { id: 'etf', label: 'ETF' },
  { id: 'commodities', label: 'Commodities' },
  { id: 'crypto', label: 'Crypto' },
];

// EXACT UNDERLYING_GROUP ENUM FROM DATABASE SCHEMA
// THIS IS THE SINGLE SOURCE OF TRUTH
export const UNDERLYING_GROUPS = [
  // Forex
  { id: 'fx_core', label: 'Major (Core)', group: 'forex', tooltip: 'EURUSD, GBPUSD, USDJPY. Ultra-tight spreads.' },
  { id: 'fx_cross', label: 'Cross', group: 'forex', tooltip: 'EURGBP, GBPJPY. G10 non-USD pairs.' },
  { id: 'fx_exotic', label: 'Exotic', group: 'forex', tooltip: 'USDTRY, USDMXN. Predatory spreads.' },
  
  // Indices
  { id: 'index_us', label: 'US Indices', group: 'indices', tooltip: 'SP500, NAS100, US30. 24h liquidity.' },
  { id: 'index_eu_core', label: 'EU Indices (No Tax)', group: 'indices', tooltip: 'DAX40. No government levy.' },
  { id: 'index_eu_tax', label: 'EU Indices (FTT)', group: 'indices', tooltip: 'FTSE MIB, IBEX. Tobin Tax applies.' },
  { id: 'index_asia', label: 'Asian Indices', group: 'indices', tooltip: 'Nikkei 225. Off-hours slippage.' },
  { id: 'index_volatility', label: 'Volatility (VIX)', group: 'indices', tooltip: 'Structural contango decay.' },
  
  // Equities
  { id: 'equity_us_large', label: 'US Large Cap', group: 'equities', tooltip: 'AAPL, MSFT, NVDA. Penny spreads.' },
  { id: 'equity_us_small', label: 'US Small Cap', group: 'equities', tooltip: 'Hard-to-borrow fees apply.' },
  { id: 'equity_eu_ftt', label: 'EU (With FTT)', group: 'equities', tooltip: 'Italy, France, Spain. Spot Tobin Tax.' },
  { id: 'equity_eu_core', label: 'EU (No Tax)', group: 'equities', tooltip: 'Germany, Netherlands. Pure broker costs.' },
  { id: 'equity_uk', label: 'UK (London)', group: 'equities', tooltip: '0.5% Stamp Duty on spot buy.' },
  { id: 'equity_adr', label: 'ADR', group: 'equities', tooltip: 'Foreign companies US listed. Pass-through fees.' },
  
  // Commodities
  { id: 'commodity_metal', label: 'Metals (Spot)', group: 'commodities', tooltip: 'Gold, Silver. FX-like behaviour.' },
  { id: 'commodity_energy', label: 'Energy', group: 'commodities', tooltip: 'Oil, Gas. Monthly rollover cost.' },
  { id: 'commodity_agri', label: 'Agriculture', group: 'commodities', tooltip: 'Opening gap risk and high slippage.' },
  
  // ETF
  { id: 'etf_us_broad', label: 'US Broad Market', group: 'etf', tooltip: 'SPY, QQQ. Often commission-free.' },
  { id: 'etf_us_leveraged', label: 'Leveraged 2x/3x', group: 'etf', tooltip: 'Volatility drag over long term.' },
  { id: 'etf_ucits', label: 'UCITS (Europe)', group: 'etf', tooltip: 'Harmonised for EU residents.' },
  
  // Crypto
  { id: 'crypto_major', label: 'Major', group: 'crypto', tooltip: 'BTC, ETH. Reasonable spreads.' },
  { id: 'crypto_altcoin', label: 'Altcoins', group: 'crypto', tooltip: 'Predatory retail spreads.' },
];

export const HORIZONS = [
  { id: 'scalping', label: 'Scalping', holdingDays: 0, tradesPerDay: 15 },
  { id: 'intraday', label: 'Intraday', holdingDays: 0, tradesPerDay: 3 },
  { id: 'swing', label: 'Swing Trading', holdingDays: 4, tradesPerDay: 0.5 },
  { id: 'position', label: 'Position / Hold', holdingDays: 45, tradesPerDay: 0.05 },
];

export const STRATEGY_MAP: Record<string, { value: string; label: string }[]> = {
  scalping: [
    { value: 'order_flow', label: 'Order Flow / DOM' },
    { value: 'micro_momentum', label: 'Micro Momentum' },
    { value: 'news_reaction', label: 'News Reaction' },
  ],
  intraday: [
    { value: 'breakout', label: 'Breakout' },
    { value: 'vwap_bounce', label: 'VWAP Reversion' },
    { value: 'trend_following_day', label: 'Trend Following Intraday' },
  ],
  swing: [
    { value: 'trend_following', label: 'Trend Following' },
    { value: 'range_trading', label: 'Range / Channel Trading' },
    { value: 'mean_reversion', label: 'Mean Reversion' },
  ],
  position: [
    { value: 'macro_trend', label: 'Macro Trend Play' },
    { value: 'carry_trade', label: 'Carry Trade (Swap Yield)' },
    { value: 'value_investing', label: 'Value / Dividend Capture' },
  ],
};

const capitalRanges = [
  { key: 'tiny', min: 100, max: 300, label: '100 – 300' },
  { key: 'small', min: 300, max: 1000, label: '300 – 1.000' },
  { key: 'mid', min: 1000, max: 3000, label: '1.000 – 3.000' },
  { key: 'mid_plus', min: 3000, max: 7000, label: '3.000 – 7.000' },
  { key: 'large', min: 7000, max: 15000, label: '7.000 – 15.000' },
  { key: 'xlarge', min: 15000, max: 1_000_000, label: '> 15.000' },
] as const;

type CapitalRangeKey = (typeof capitalRanges)[number]['key'];
type AssetGroupKey = (typeof ASSET_GROUPS)[number]['id'];
type HorizonKey = (typeof HORIZONS)[number]['id'];
type DriverWeights = { execution: number; holding: number; structure: number };
type AssetDefinition = { baseDrivers: DriverWeights };

// ==================== DRIVER BIAS MAP ====================
const assetDefs: Record<AssetGroupKey, AssetDefinition> = {
  forex:       { baseDrivers: { execution: 50, holding: 30, structure: 20 } },
  indices:     { baseDrivers: { execution: 56, holding: 24, structure: 20 } },
  equities:    { baseDrivers: { execution: 28, holding: 16, structure: 56 } },
  etf:         { baseDrivers: { execution: 22, holding: 22, structure: 56 } },
  commodities: { baseDrivers: { execution: 34, holding: 28, structure: 38 } },
  crypto:      { baseDrivers: { execution: 40, holding: 36, structure: 24 } },
};

const horizonAdjustments: Record<HorizonKey, DriverWeights> = {
  scalping: { execution: 28, holding: -14, structure: -12 },
  intraday: { execution: 18, holding: -10, structure: -8 },
  swing:    { execution:  8, holding:   4, structure: -2 },
  position: { execution: -4, holding:  14, structure:  2 },
};

const getCapitalBias = (crk: CapitalRangeKey): DriverWeights => {
  switch (crk) {
    case 'tiny':  return { execution: -2, holding: 0,  structure: 10 };
    case 'small': return { execution: -1, holding: 0,  structure:  8 };
    case 'mid':   return { execution:  3, holding: 2,  structure: -2 };
    case 'mid_plus': return { execution: 5, holding: 3, structure: -5 };
    case 'large': return { execution:  8, holding: 4,  structure: -10 };
    case 'xlarge':return { execution: 10, holding: 5,  structure: -12 };
  }
};

const getLeverageBias = (on: boolean): DriverWeights =>
  on ? { execution: 6, holding: 8, structure: 4 } : { execution: 0, holding: 0, structure: 0 };

const sumWeights = (...g: DriverWeights[]) =>
  g.reduce<DriverWeights>(
    (a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }),
    { execution: 0, holding: 0, structure: 0 },
  );

const groupColors: Record<AssetGroupKey, { bg: string; border: string; active: string }> = {
  forex:       { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   active: 'bg-amber-500' },
  indices:     { bg: 'bg-sky-500/10',     border: 'border-sky-500/30',     active: 'bg-sky-500' },
  equities:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', active: 'bg-emerald-500' },
  etf:         { bg: 'bg-teal-500/10',    border: 'border-teal-500/30',    active: 'bg-teal-500' },
  commodities: { bg: 'bg-orange-500/10',  border: 'border-orange-500/30',  active: 'bg-orange-500' },
  crypto:      { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  active: 'bg-violet-500' },
};

// ==================== COMPONENT ====================
export const ScenarioSection = () => {
  const t = useTranslations('Scenario') as (key: string) => string;
  const currencyCode = AppConfig.defaultCurrency;

  const [selectedGroup, setSelectedGroup] = useState<AssetGroupKey>('forex');
  const [selectedUnderlying, setSelectedUnderlying] = useState(UNDERLYING_GROUPS[0]);
  const [selectedHorizon, setSelectedHorizon] = useState<HorizonKey>('intraday');
  const [selectedStrategy, setSelectedStrategy] = useState('breakout');
  const [capitalRange, setCapitalRange] = useState<CapitalRangeKey>('mid');
  const [leverageOn, setLeverageOn] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentDef = assetDefs[selectedGroup];
  
  // Filter underlying groups by selected asset group
  const filteredUnderlyings = useMemo(() => {
    let items = UNDERLYING_GROUPS.filter(u => u.group === selectedGroup);
    if (searchQuery.length > 0) {
      const q = searchQuery.toLowerCase();
      items = items.filter(u => 
        u.label.toLowerCase().includes(q) || 
        u.id.toLowerCase().includes(q) ||
        u.tooltip.toLowerCase().includes(q)
      );
    }
    return items;
  }, [selectedGroup, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-select first underlying when group changes
  useEffect(() => {
    const firstMatch = UNDERLYING_GROUPS.find(u => u.group === selectedGroup);
    if (firstMatch) setSelectedUnderlying(firstMatch);
  }, [selectedGroup]);

  useEffect(() => {
    const available = STRATEGY_MAP[selectedHorizon] ?? [];
    if (!available.some(s => s.value === selectedStrategy)) {
      setSelectedStrategy(available[0]?.value ?? '');
    }
  }, [selectedHorizon, selectedStrategy]);

  const availableStrategies = STRATEGY_MAP[selectedHorizon] ?? [];
  const activeStrategy = availableStrategies.find(s => s.value === selectedStrategy) ?? availableStrategies[0];

  if (!activeStrategy) return null;

  const rawDrivers = sumWeights(
    currentDef.baseDrivers,
    horizonAdjustments[selectedHorizon],
    getCapitalBias(capitalRange),
    getLeverageBias(leverageOn),
  );

  const executionRaw = Math.max(8, rawDrivers.execution);
  const holdingRaw   = Math.max(8, rawDrivers.holding);
  const structureRaw = Math.max(8, rawDrivers.structure);
  const total        = executionRaw + holdingRaw + structureRaw;
  const execPct      = Math.round((executionRaw / total) * 100);
  const holdPct      = Math.round((holdingRaw / total) * 100);
  const structPct    = 100 - execPct - holdPct;

  const drivers = [
    { key: 'execution', value: execPct, barClass: 'bg-sky-400' },
    { key: 'holding',   value: holdPct, barClass: 'bg-amber-400' },
    { key: 'structure', value: structPct, barClass: 'bg-emerald-400' },
  ] as const;

  const dominantDriver = [...drivers].sort((a, b) => b.value - a.value)[0]?.key ?? 'execution';
  const pressureScore = Math.min(99, Math.round((executionRaw + holdingRaw + structureRaw) / 3 + (leverageOn ? 8 : 0)));
  const firstAudit = t(`review_${dominantDriver}`);

  const capitalRead =
    capitalRange === 'large' || capitalRange === 'xlarge'
      ? t('read_capital_large')
      : capitalRange === 'mid' || capitalRange === 'mid_plus'
        ? t('read_capital_mid')
        : t('read_capital_small');

  const leverageRead = leverageOn ? t('read_leverage_on') : t('read_leverage_off');

  const engineReads = [
    t(`read_group_${selectedUnderlying.id}`),
    t(`read_horizon_${selectedHorizon}`),
    t(`read_strategy_${activeStrategy.value}`),
    capitalRead,
    leverageRead,
  ];

  return (
    <section id="simulator" className="scroll-mt-32 border-t border-border/40 bg-gradient-to-b from-background to-muted/20 py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28">
      <SectionContainer size="wide">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_0.6fr] xl:grid-cols-[0.42fr_0.58fr] lg:gap-6 xl:gap-8">
          {/* INPUT PANEL - SOTA 2026 INSTITUTIONAL DESIGN */}
          <div className="space-y-6">
            <div>
              <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
                {t('section_eyebrow')}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
                {t('section_title')}
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {t('section_intro')}
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-xl sm:p-5 lg:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
                {t('control_label')}
              </p>

              <div className="mt-5 space-y-5">
                {/* Asset Group Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('group_label')}</label>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {ASSET_GROUPS.map(group => {
                      const colors = groupColors[group.id];
                      const isActive = selectedGroup === group.id;
                      return (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => {
                            setSelectedGroup(group.id);
                            setSearchQuery('');
                          }}
                          className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 hover:scale-[1.02] ${
                            isActive
                              ? `${colors.border} ${colors.bg}`
                              : 'border-border/50 bg-muted/40 hover:border-border hover:bg-muted/60'
                          }`}
                        >
                          <span className={`block font-mono text-[10px] uppercase tracking-[0.12em] ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {group.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Underlying Group Dropdown - SOTA 2026 CLEAN DESIGN */}
                <div ref={dropdownRef}>
                  <label className="text-sm font-medium text-foreground/80">{t('sub_label')}</label>
                  <div className="mt-3 relative">
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full rounded-2xl border border-border/50 bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary/50 text-left flex items-center justify-between"
                    >
                      <div className="text-left">
                        <p className="font-medium">{selectedUnderlying.label}</p>
                        <p className="text-xs text-muted-foreground font-mono opacity-70">{selectedUnderlying.id}</p>
                      </div>
                      <svg className="w-4 h-4 text-muted-foreground transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : '' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Panel */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/60 rounded-2xl shadow-xl z-50 overflow-hidden">
                        <div className="p-2 border-b border-border/30">
                          <input
                            type="text"
                            placeholder="Filter groups..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-border/40 bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary/50"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {filteredUnderlyings.map(ug => (
                            <button
                              key={ug.id}
                              type="button"
                              onClick={() => {
                                setSelectedUnderlying(ug);
                                setIsDropdownOpen(false);
                                setSearchQuery('');
                              }}
                              className={`w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors ${
                                selectedUnderlying.id === ug.id ? 'bg-muted/30 border-l-2 border-primary' : ''
                              }`}
                            >
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">{ug.label}</span>
                                <span className="text-xs text-muted-foreground opacity-70">{ug.tooltip}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizon Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('horizon_label')}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {HORIZONS.map(h => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHorizon(h.id as HorizonKey)}
                        className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                          selectedHorizon === h.id
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Strategy Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('strategy_label')}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableStrategies.map(s => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setSelectedStrategy(s.value)}
                        className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                          selectedStrategy === s.value
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground/60">{t('strategy_hint')}</p>
                </div>

                {/* Capital + Leverage */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">{t('capital_label')}</label>
                    <select
                      value={capitalRange}
                      onChange={e => setCapitalRange(e.target.value as CapitalRangeKey)}
                      className="mt-3 w-full rounded-2xl border border-border/50 bg-background px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-primary/50"
                    >
                      {capitalRanges.map(r => (
                        <option key={r.key} value={r.key}>{r.label} EUR</option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-muted-foreground/60">{t('capital_hint')}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80">{t('leverage_label')}</label>
                    <button
                      type="button"
                      onClick={() => setLeverageOn(!leverageOn)}
                      className={`mt-3 flex h-12 w-full items-center justify-center rounded-2xl border text-sm font-medium uppercase tracking-wider transition-all duration-200 ${
                        leverageOn
                          ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400'
                          : 'border-slate-600 bg-slate-800/50 text-slate-400'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {leverageOn ? (
                          <>
                            <span className="size-2.5 rounded-full bg-emerald-400 animate-pulse" />
                            {t('leverage_on')}
                          </>
                        ) : (
                          <>
                            <span className="size-2.5 rounded-full bg-slate-500" />
                            {t('leverage_off')}
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT CONSOLE */}
          <div className="rounded-[32px] border border-slate-800/80 bg-slate-950 p-5 shadow-2xl sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('console_label')}</p>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                {t('preview_ready')}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {selectedUnderlying.label}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {HORIZONS.find(h => h.id === selectedHorizon)?.label}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {currencyCode} {capitalRanges.find(r => r.key === capitalRange)?.label}
              </span>
              <span className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] ${leverageOn ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                {leverageOn ? 'Leva ON' : 'Leva OFF'}
              </span>
            </div>

            {/* KPIs */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/[0.78] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('dominant_label')}</p>
                <p className="mt-3 text-lg font-semibold tracking-tight text-white">{t(`driver_${dominantDriver}`)}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/[0.78] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('score_label')}</p>
                <p className="mt-3 text-lg font-semibold tracking-tight text-white">{pressureScore}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{t('score_note')}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/[0.78] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('review_label')}</p>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-100">{firstAudit}</p>
              </div>
            </div>

            {/* Pressure Map */}
            <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-900/[0.64] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('preview_label')}</p>
              <div className="mt-5 space-y-4">
                {drivers.map(d => (
                  <div key={d.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{t(`driver_${d.key}`)}</span>
                      <span className="font-mono text-xs">{d.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className={`h-2 rounded-full ${d.barClass}`} style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-400">{t(`insight_${selectedHorizon}`)}</p>
            </div>

            {/* Engine Reads */}
            <div className="mt-4 rounded-[24px] border border-slate-800 bg-slate-900/[0.58] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('engine_reads_label')}</p>
              <div className="mt-4 space-y-3">
                {engineReads.map(line => (
                  <div key={line} className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-400" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-slate-500">{t('preview_note')}</p>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};