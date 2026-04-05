'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { MobileBottomSheet } from '@/components/ui/MobileBottomSheet';
import { AppConfig } from '@/utils/AppConfig';
import {
  ASSET_GROUPS,
  UNDERLYING_GROUPS,
  HORIZONS,
  STRATEGY_MAP,
} from '@/templates/ScenarioSection';

// ── types ──────────────────────────────────────────────────────────────────
type AssetGroupKey   = (typeof ASSET_GROUPS)[number]['id'];
type HorizonKey      = (typeof HORIZONS)[number]['id'];
type CapitalRangeKey = 'tiny' | 'small' | 'mid' | 'mid_plus' | 'large' | 'xlarge';
type DriverWeights   = { execution: number; holding: number; structure: number };

// ── static data ────────────────────────────────────────────────────────────
const capitalRanges = [
  { key: 'tiny'     as CapitalRangeKey, label: '100 – 300' },
  { key: 'small'    as CapitalRangeKey, label: '300 – 1.000' },
  { key: 'mid'      as CapitalRangeKey, label: '1.000 – 3.000' },
  { key: 'mid_plus' as CapitalRangeKey, label: '3.000 – 7.000' },
  { key: 'large'    as CapitalRangeKey, label: '7.000 – 15.000' },
  { key: 'xlarge'   as CapitalRangeKey, label: '> 15.000' },
];

const assetDefs: Record<AssetGroupKey, { baseDrivers: DriverWeights }> = {
  forex:       { baseDrivers: { execution: 50, holding: 30, structure: 20 } },
  indices:     { baseDrivers: { execution: 56, holding: 24, structure: 20 } },
  equities:    { baseDrivers: { execution: 28, holding: 16, structure: 56 } },
  etf:         { baseDrivers: { execution: 22, holding: 22, structure: 56 } },
  commodities: { baseDrivers: { execution: 34, holding: 28, structure: 38 } },
  crypto:      { baseDrivers: { execution: 40, holding: 36, structure: 24 } },
};

const horizonAdjustments: Record<HorizonKey, DriverWeights> = {
  scalping: { execution:  28, holding: -14, structure: -12 },
  intraday: { execution:  18, holding: -10, structure:  -8 },
  swing:    { execution:   8, holding:   4, structure:  -2 },
  position: { execution:  -4, holding:  14, structure:   2 },
};

const getCapitalBias = (k: CapitalRangeKey): DriverWeights => ({
  tiny:     { execution: -2, holding: 0,  structure: 10 },
  small:    { execution: -1, holding: 0,  structure:  8 },
  mid:      { execution:  3, holding: 2,  structure: -2 },
  mid_plus: { execution:  5, holding: 3,  structure: -5 },
  large:    { execution:  8, holding: 4,  structure: -10 },
  xlarge:   { execution: 10, holding: 5,  structure: -12 },
}[k]);

const sumWeights = (...g: DriverWeights[]) =>
  g.reduce<DriverWeights>(
    (a, c) => ({ execution: a.execution + c.execution, holding: a.holding + c.holding, structure: a.structure + c.structure }),
    { execution: 0, holding: 0, structure: 0 },
  );

const groupColors: Record<AssetGroupKey, { bg: string; border: string }> = {
  forex:       { bg: 'bg-amber-500/10',   border: 'border-amber-500/30' },
  indices:     { bg: 'bg-sky-500/10',     border: 'border-sky-500/30' },
  equities:    { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  etf:         { bg: 'bg-teal-500/10',    border: 'border-teal-500/30' },
  commodities: { bg: 'bg-orange-500/10',  border: 'border-orange-500/30' },
  crypto:      { bg: 'bg-violet-500/10',  border: 'border-violet-500/30' },
};

// ── hook: useIsMobile ────────────────────────────────────────────────────
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
};

// ── SimulatorContent ──────────────────────────────────────────────────────
const SimulatorContent = () => {
  const t = useTranslations('Scenario') as (key: string) => string;
  const currencyCode = AppConfig.defaultCurrency;

  const [selectedGroup,      setSelectedGroup]      = useState<AssetGroupKey>('forex');
  const [selectedUnderlying, setSelectedUnderlying] = useState(UNDERLYING_GROUPS[0]!);
  const [selectedHorizon,    setSelectedHorizon]    = useState<HorizonKey>('intraday');
  const [selectedStrategy,   setSelectedStrategy]   = useState('breakout');
  const [capitalRange,       setCapitalRange]       = useState<CapitalRangeKey>('mid');
  const [leverageOn,         setLeverageOn]         = useState(true);
  const [isDropdownOpen,     setIsDropdownOpen]     = useState(false);
  const [searchQuery,        setSearchQuery]        = useState('');
  const dropdownRef    = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredUnderlyings = useMemo(() => {
    let items = UNDERLYING_GROUPS.filter(u => u.group === selectedGroup);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(u => u.label.toLowerCase().includes(q) || u.tooltip.toLowerCase().includes(q));
    }
    return items;
  }, [selectedGroup, searchQuery]);

  useEffect(() => {
    const first = UNDERLYING_GROUPS.find(u => u.group === selectedGroup);
    if (first) setSelectedUnderlying(first);
    setSearchQuery('');
  }, [selectedGroup]);

  useEffect(() => {
    const available = STRATEGY_MAP[selectedHorizon] ?? [];
    if (!available.some(s => s.value === selectedStrategy))
      setSelectedStrategy(available[0]?.value ?? '');
  }, [selectedHorizon, selectedStrategy]);

  // Chiudi dropdown cliccando fuori
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsDropdownOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  // Autofocus sull'input di ricerca + scrollIntoView sul dropdown
  // - focus(): porta il cursore nell'input per digitare subito
  // - scrollIntoView(): su desktop, se il dialog e scrollato e il dropdown
  //   e parzialmente fuori vista, lo porta in view automaticamente.
  //   block:'nearest' evita scroll aggressivo se gia visibile.
  useEffect(() => {
    if (!isDropdownOpen) return;
    const id = setTimeout(() => {
      // 1. focus input ricerca
      searchInputRef.current?.focus();
      // 2. scroll desktop: porta il wrapper del dropdown in vista
      dropdownRef.current?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }, 50);
    return () => clearTimeout(id);
  }, [isDropdownOpen]);

  const availableStrategies = STRATEGY_MAP[selectedHorizon] ?? [];
  const activeStrategy      = availableStrategies.find(s => s.value === selectedStrategy) ?? availableStrategies[0];

  if (!activeStrategy) return null;

  const rawDrivers = sumWeights(
    assetDefs[selectedGroup]!.baseDrivers,
    horizonAdjustments[selectedHorizon],
    getCapitalBias(capitalRange),
    leverageOn ? { execution: 6, holding: 8, structure: 4 } : { execution: 0, holding: 0, structure: 0 },
  );
  const execRaw   = Math.max(8, rawDrivers.execution);
  const holdRaw   = Math.max(8, rawDrivers.holding);
  const structRaw = Math.max(8, rawDrivers.structure);
  const total     = execRaw + holdRaw + structRaw;
  const execPct   = Math.round((execRaw  / total) * 100);
  const holdPct   = Math.round((holdRaw  / total) * 100);
  const structPct = 100 - execPct - holdPct;

  const drivers = [
    { key: 'execution' as const, value: execPct,   barClass: 'bg-sky-400' },
    { key: 'holding'   as const, value: holdPct,   barClass: 'bg-amber-400' },
    { key: 'structure' as const, value: structPct, barClass: 'bg-emerald-400' },
  ];

  const dominantDriver = [...drivers].sort((a, b) => b.value - a.value)[0]!.key;
  const pressureScore  = Math.min(99, Math.round((execRaw + holdRaw + structRaw) / 3 + (leverageOn ? 8 : 0)));
  const firstAudit     = t(`review_${dominantDriver}`);

  const capitalRead = capitalRange === 'large' || capitalRange === 'xlarge'
    ? t('read_capital_large')
    : capitalRange === 'mid' || capitalRange === 'mid_plus'
      ? t('read_capital_mid')
      : t('read_capital_small');

  const engineReads = [
    t(`read_group_${selectedUnderlying.id}`),
    t(`read_horizon_${selectedHorizon}`),
    t(`read_strategy_${activeStrategy.value}`),
    capitalRead,
    leverageOn ? t('read_leverage_on') : t('read_leverage_off'),
  ];

  const colors = groupColors[selectedGroup]!;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:items-start">

      {/* ── LEFT: INPUT PANEL ── */}
      <div className="space-y-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
          {t('control_label')}
        </p>

        {/* Asset Group */}
        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{t('group_label')}</label>
          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {ASSET_GROUPS.map(g => {
              const c = groupColors[g.id]!;
              const active = selectedGroup === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGroup(g.id as AssetGroupKey)}
                  className={`rounded-xl border px-3 py-2.5 text-left transition-all duration-200 hover:scale-[1.02] ${
                    active
                      ? `${c.border} ${c.bg}`
                      : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  <span className={`block font-mono text-[10px] uppercase tracking-[0.14em] ${
                    active ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {g.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Underlying dropdown */}
        <div ref={dropdownRef}>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{t('sub_label')}</label>
          <div className="relative mt-2.5">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(v => !v)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-sm text-left flex items-center justify-between outline-none transition-colors focus:border-blue-500/50"
            >
              <div>
                <p className="font-medium text-sm text-zinc-900 dark:text-white">{selectedUnderlying.label}</p>
                <p className="text-[10px] font-mono text-zinc-400">{selectedUnderlying.id}</p>
              </div>
              <svg
                className="w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200"
                style={{ transform: isDropdownOpen ? 'rotate(180deg)' : '' }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Filter..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredUnderlyings.map(ug => (
                    <button
                      key={ug.id}
                      type="button"
                      onClick={() => { setSelectedUnderlying(ug); setIsDropdownOpen(false); setSearchQuery(''); }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                        selectedUnderlying.id === ug.id ? 'bg-zinc-50 dark:bg-zinc-800' : ''
                      }`}
                    >
                      <p className="font-medium text-zinc-900 dark:text-white">{ug.label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{ug.tooltip}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horizon */}
        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{t('horizon_label')}</label>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {HORIZONS.map(h => (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHorizon(h.id as HorizonKey)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all ${
                  selectedHorizon === h.id
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* Strategy */}
        <div>
          <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{t('strategy_label')}</label>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {availableStrategies.map(s => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSelectedStrategy(s.value)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all ${
                  selectedStrategy === s.value
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Capital + Leverage */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{t('capital_label')}</label>
            <select
              value={capitalRange}
              onChange={e => setCapitalRange(e.target.value as CapitalRangeKey)}
              className="mt-2.5 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-3.5 py-2.5 font-mono text-sm outline-none focus:border-blue-500/50"
            >
              {capitalRanges.map(r => (
                <option key={r.key} value={r.key}>{r.label} {currencyCode}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">{t('leverage_label')}</label>
            <button
              type="button"
              onClick={() => setLeverageOn(v => !v)}
              className={`mt-2.5 flex h-[42px] w-full items-center justify-center rounded-xl border text-xs font-medium uppercase tracking-wider transition-all duration-200 ${
                leverageOn
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-400'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${
                  leverageOn ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-400'
                }`} />
                {leverageOn ? t('leverage_on') : t('leverage_off')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: OUTPUT CONSOLE ── */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t('console_label')}
          </p>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${colors.border} bg-zinc-900 text-zinc-300`}>
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('preview_ready')}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            selectedUnderlying.label,
            HORIZONS.find(h => h.id === selectedHorizon)?.label,
            `${currencyCode} ${capitalRanges.find(r => r.key === capitalRange)?.label}`,
          ].map(chip => chip && (
            <span key={chip} className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-300">
              {chip}
            </span>
          ))}
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
            leverageOn
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-zinc-800 bg-zinc-900 text-zinc-500'
          }`}>
            {leverageOn ? 'Leva ON' : 'Leva OFF'}
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{t('dominant_label')}</p>
            <p className="mt-2 text-sm font-semibold tracking-tight text-white">{t(`driver_${dominantDriver}`)}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{t('score_label')}</p>
            <p className="mt-2 text-sm font-semibold tracking-tight text-white">{pressureScore}</p>
            <p className="mt-1 text-[10px] leading-4 text-zinc-500">{t('score_note')}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{t('review_label')}</p>
            <p className="mt-2 text-xs font-medium leading-5 text-zinc-100">{firstAudit}</p>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{t('preview_label')}</p>
          {drivers.map(d => (
            <div key={d.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-300">{t(`driver_${d.key}`)}</span>
                <span className="font-mono text-[10px] text-zinc-400">{d.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-zinc-800">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${d.barClass}`}
                  style={{ width: `${d.value}%` }}
                />
              </div>
            </div>
          ))}
          <p className="pt-1 text-xs leading-6 text-zinc-400">{t(`insight_${selectedHorizon}`)}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2.5">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{t('engine_reads_label')}</p>
          {engineReads.map((line, i) => (
            <div key={i} className="flex items-start gap-2.5 text-xs leading-5 text-zinc-300">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-sky-400" />
              <span>{line}</span>
            </div>
          ))}
        </div>

        <p className="text-[10px] leading-5 text-zinc-600">{t('preview_note')}</p>
      </div>
    </div>
  );
};

// ── SimulatorDrawer ────────────────────────────────────────────────────────
type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export const SimulatorDrawer = ({ isOpen, onClose }: Props) => {
  const t = useTranslations('Scenario') as (key: string) => string;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isMobile, isOpen]);

  useEffect(() => {
    if (!isMobile && isOpen) {
      const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', fn);
      return () => document.removeEventListener('keydown', fn);
    }
  }, [isMobile, isOpen, onClose]);

  // ── mobile: MobileBottomSheet ──
  if (isMobile) {
    return (
      <MobileBottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={t('section_title')}
        showHandle
      >
        <div
          className="min-h-0 overflow-y-auto bg-white dark:bg-zinc-900"
          style={{
            maxHeight: 'calc(100dvh - 140px)',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          }}
        >
          <SimulatorContent />
        </div>
      </MobileBottomSheet>
    );
  }

  // ── desktop: centered dialog ──
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={t('section_title')}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">

        {/* Sticky header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
              {t('section_eyebrow')}
            </p>
            <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              {t('section_title')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi simulatore"
            className="flex size-9 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <SimulatorContent />
        </div>
      </div>
    </div>
  );
};
