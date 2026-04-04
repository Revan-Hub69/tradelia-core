'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { AppConfig } from '@/utils/AppConfig';

type AssetGroupKey = 'forex' | 'indices' | 'equities' | 'crypto' | 'commodities';
type AssetSubKey = 'major' | 'minor' | 'exotic' | 'america' | 'europa' | 'asia' | 'us' | 'eu' | 'energy' | 'metals' | 'agriculture';
type HorizonKey = 'scalping' | 'intraday' | 'swing' | 'position';

type DriverWeights = {
  execution: number;
  holding: number;
  structure: number;
};

type StrategyDefinition = {
  key: string;
  horizons: HorizonKey[];
  driverBias: DriverWeights;
};

type AssetDefinition = {
  subOptions: { key: AssetSubKey; label: string }[];
  horizons: HorizonKey[];
  baseDrivers: DriverWeights;
  strategies: StrategyDefinition[];
};

const assetGroups: Record<AssetGroupKey, AssetDefinition> = {
  forex: {
    subOptions: [
      { key: 'major', label: 'Major' },
      { key: 'minor', label: 'Minor' },
      { key: 'exotic', label: 'Exotic' },
    ],
    horizons: ['scalping', 'intraday', 'swing', 'position'],
    baseDrivers: { execution: 50, holding: 30, structure: 20 },
    strategies: [
      { key: 'micro_momentum', horizons: ['scalping'], driverBias: { execution: 22, holding: -8, structure: -4 } },
      { key: 'market_making', horizons: ['scalping'], driverBias: { execution: 24, holding: -10, structure: -4 } },
      { key: 'spread_hunting', horizons: ['scalping'], driverBias: { execution: 20, holding: -6, structure: -4 } },
      { key: 'momentum_intraday', horizons: ['intraday'], driverBias: { execution: 18, holding: -4, structure: -2 } },
      { key: 'breakout_intraday', horizons: ['intraday'], driverBias: { execution: 20, holding: -6, structure: -4 } },
      { key: 'range_trading', horizons: ['intraday'], driverBias: { execution: 14, holding: 2, structure: -2 } },
      { key: 'trend_following', horizons: ['swing', 'position'], driverBias: { execution: -4, holding: 12, structure: 0 } },
      { key: 'mean_reversion', horizons: ['swing'], driverBias: { execution: 12, holding: 2, structure: -2 } },
      { key: 'carry_trade', horizons: ['swing', 'position'], driverBias: { execution: -6, holding: 18, structure: -2 } },
      { key: 'hedging', horizons: ['position'], driverBias: { execution: 4, holding: 8, structure: 2 } },
    ],
  },
  indices: {
    subOptions: [
      { key: 'america', label: 'America' },
      { key: 'europa', label: 'Europa' },
      { key: 'asia', label: 'Asia' },
    ],
    horizons: ['scalping', 'intraday', 'swing', 'position'],
    baseDrivers: { execution: 56, holding: 24, structure: 20 },
    strategies: [
      { key: 'index_micro_momentum', horizons: ['scalping'], driverBias: { execution: 22, holding: -8, structure: -4 } },
      { key: 'order_flow_scalping', horizons: ['scalping'], driverBias: { execution: 24, holding: -10, structure: -4 } },
      { key: 'breakout_intraday', horizons: ['intraday'], driverBias: { execution: 20, holding: -6, structure: -4 } },
      { key: 'momentum_reversal', horizons: ['intraday'], driverBias: { execution: 16, holding: -2, structure: -2 } },
      { key: 'pairs_trading', horizons: ['intraday'], driverBias: { execution: 14, holding: 4, structure: 0 } },
      { key: 'trend_following', horizons: ['swing', 'position'], driverBias: { execution: -2, holding: 10, structure: 2 } },
      { key: 'range_volatility', horizons: ['swing'], driverBias: { execution: 8, holding: 6, structure: 0 } },
      { key: 'etf_hedging', horizons: ['position'], driverBias: { execution: 2, holding: 10, structure: 4 } },
      { key: 'sector_rotation', horizons: ['position'], driverBias: { execution: -4, holding: 12, structure: 4 } },
    ],
  },
  equities: {
    subOptions: [
      { key: 'us', label: 'USA' },
      { key: 'eu', label: 'EU' },
      { key: 'asia', label: 'Asia' },
    ],
    horizons: ['scalping', 'intraday', 'swing', 'position'],
    baseDrivers: { execution: 28, holding: 16, structure: 56 },
    strategies: [
      { key: 'level2_scalping', horizons: ['scalping'], driverBias: { execution: 24, holding: -8, structure: -6 } },
      { key: 'news_reaction', horizons: ['scalping', 'intraday'], driverBias: { execution: 22, holding: -8, structure: -4 } },
      { key: 'momentum_intraday', horizons: ['intraday'], driverBias: { execution: 18, holding: -4, structure: -4 } },
      { key: 'breakout_intraday', horizons: ['intraday'], driverBias: { execution: 20, holding: -6, structure: -2 } },
      { key: 'arbitrage_etf', horizons: ['intraday'], driverBias: { execution: 16, holding: -2, structure: 0 } },
      { key: 'earnings_play', horizons: ['swing'], driverBias: { execution: 10, holding: 4, structure: 2 } },
      { key: 'mean_reversion', horizons: ['swing'], driverBias: { execution: 10, holding: 4, structure: 2 } },
      { key: 'value_growth', horizons: ['position'], driverBias: { execution: -4, holding: 8, structure: 8 } },
      { key: 'dividend_capture', horizons: ['position'], driverBias: { execution: -6, holding: 14, structure: 2 } },
    ],
  },
  crypto: {
    subOptions: [{ key: 'major', label: 'Major' }],
    horizons: ['scalping', 'intraday', 'swing', 'position'],
    baseDrivers: { execution: 40, holding: 36, structure: 24 },
    strategies: [
      { key: 'micro_momentum', horizons: ['scalping'], driverBias: { execution: 20, holding: -6, structure: -4 } },
      { key: 'order_book_imbalance', horizons: ['scalping'], driverBias: { execution: 22, holding: -8, structure: -4 } },
      { key: 'exchange_arbitrage', horizons: ['scalping'], driverBias: { execution: 18, holding: -4, structure: -2 } },
      { key: 'momentum_intraday', horizons: ['intraday'], driverBias: { execution: 16, holding: -2, structure: 0 } },
      { key: 'breakout_intraday', horizons: ['intraday'], driverBias: { execution: 18, holding: -4, structure: -2 } },
      { key: 'volatility_fade', horizons: ['intraday'], driverBias: { execution: 14, holding: 4, structure: 0 } },
      { key: 'trend_following', horizons: ['swing', 'position'], driverBias: { execution: -4, holding: 14, structure: 2 } },
      { key: 'swing_reversal', horizons: ['swing'], driverBias: { execution: 8, holding: 8, structure: 0 } },
      { key: 'hodl_macro', horizons: ['position'], driverBias: { execution: -8, holding: 16, structure: 4 } },
      { key: 'seasonal_rotation', horizons: ['position'], driverBias: { execution: -4, holding: 12, structure: 2 } },
    ],
  },
  commodities: {
    subOptions: [
      { key: 'energy', label: 'Energia' },
      { key: 'metals', label: 'Metalli' },
      { key: 'agriculture', label: 'Agricole' },
    ],
    horizons: ['scalping', 'intraday', 'swing', 'position'],
    baseDrivers: { execution: 34, holding: 28, structure: 38 },
    strategies: [
      { key: 'micro_momentum', horizons: ['scalping'], driverBias: { execution: 20, holding: -6, structure: -4 } },
      { key: 'calendar_spread', horizons: ['scalping'], driverBias: { execution: 18, holding: -4, structure: -2 } },
      { key: 'intermarket_spread', horizons: ['scalping'], driverBias: { execution: 16, holding: 2, structure: -2 } },
      { key: 'momentum_intraday', horizons: ['intraday'], driverBias: { execution: 16, holding: -2, structure: 0 } },
      { key: 'breakout_intraday', horizons: ['intraday'], driverBias: { execution: 18, holding: -4, structure: -2 } },
      { key: 'volatility_fade', horizons: ['intraday'], driverBias: { execution: 14, holding: 4, structure: 0 } },
      { key: 'trend_following', horizons: ['swing', 'position'], driverBias: { execution: -4, holding: 12, structure: 4 } },
      { key: 'seasonal_inventory', horizons: ['swing'], driverBias: { execution: 6, holding: 10, structure: 2 } },
      { key: 'macro_play', horizons: ['position'], driverBias: { execution: -6, holding: 14, structure: 4 } },
      { key: 'hedging', horizons: ['position'], driverBias: { execution: 2, holding: 10, structure: 4 } },
    ],
  },
};

const assetGroupKeys: AssetGroupKey[] = ['forex', 'indices', 'equities', 'crypto', 'commodities'];
const horizonKeys: HorizonKey[] = ['scalping', 'intraday', 'swing', 'position'];

const horizonAdjustments: Record<HorizonKey, DriverWeights> = {
  scalping: { execution: 28, holding: -14, structure: -12 },
  intraday: { execution: 18, holding: -10, structure: -8 },
  swing: { execution: 8, holding: 4, structure: -2 },
  position: { execution: -4, holding: 14, structure: 2 },
};

const sumWeights = (...groups: DriverWeights[]) =>
  groups.reduce<DriverWeights>(
    (acc, group) => ({
      execution: acc.execution + group.execution,
      holding: acc.holding + group.holding,
      structure: acc.structure + group.structure,
    }),
    { execution: 0, holding: 0, structure: 0 },
  );

const getCapitalBias = (capital: number): DriverWeights => {
  if (capital >= 50000) return { execution: 8, holding: 4, structure: -10 };
  if (capital >= 10000) return { execution: 3, holding: 2, structure: -2 };
  return { execution: -2, holding: 0, structure: 10 };
};

const getLeverageBias = (leverageOn: boolean): DriverWeights =>
  leverageOn ? { execution: 6, holding: 8, structure: 4 } : { execution: 0, holding: 0, structure: 0 };

const groupColors: Record<AssetGroupKey, { bg: string; border: string; active: string }> = {
  forex: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', active: 'bg-amber-500' },
  indices: { bg: 'bg-sky-500/10', border: 'border-sky-500/30', active: 'bg-sky-500' },
  equities: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', active: 'bg-emerald-500' },
  crypto: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', active: 'bg-violet-500' },
  commodities: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', active: 'bg-orange-500' },
};

export const ScenarioSection = () => {
  const t = useTranslations('Scenario') as (key: string) => string;
  const currencyCode = AppConfig.defaultCurrency;

  const [selectedGroup, setSelectedGroup] = useState<AssetGroupKey>('forex');
  const [selectedSub, setSelectedSub] = useState<AssetSubKey>('major');
  const [selectedHorizon, setSelectedHorizon] = useState<HorizonKey>('intraday');
  const [selectedStrategy, setSelectedStrategy] = useState('momentum_intraday');
  const [capital, setCapital] = useState(15000);
  const [leverageOn, setLeverageOn] = useState(true);

  const currentAsset = assetGroups[selectedGroup];

  useEffect(() => {
    const nextSub = currentAsset.subOptions[0]?.key;
    if (nextSub && !currentAsset.subOptions.some(s => s.key === selectedSub)) {
      setSelectedSub(nextSub);
    }
  }, [selectedGroup, currentAsset, selectedSub]);

  useEffect(() => {
    const validStrategies = currentAsset.strategies.filter(s => s.horizons.includes(selectedHorizon));
    if (!validStrategies.some(s => s.key === selectedStrategy)) {
      setSelectedStrategy(validStrategies[0]?.key ?? '');
    }
  }, [selectedGroup, selectedHorizon, selectedStrategy, currentAsset]);

  const availableStrategies = currentAsset.strategies.filter(s => s.horizons.includes(selectedHorizon));
  const activeStrategy = availableStrategies.find(s => s.key === selectedStrategy) ?? availableStrategies[0];

  if (!activeStrategy) return null;

  const rawDrivers = sumWeights(
    currentAsset.baseDrivers,
    horizonAdjustments[selectedHorizon],
    activeStrategy.driverBias,
    getCapitalBias(capital),
    getLeverageBias(leverageOn),
  );

  const executionRaw = Math.max(8, rawDrivers.execution);
  const holdingRaw = Math.max(8, rawDrivers.holding);
  const structureRaw = Math.max(8, rawDrivers.structure);
  const total = executionRaw + holdingRaw + structureRaw;
  const executionValue = Math.round((executionRaw / total) * 100);
  const holdingValue = Math.round((holdingRaw / total) * 100);

  const drivers = [
    { key: 'execution', value: executionValue, barClass: 'bg-sky-400' },
    { key: 'holding', value: holdingValue, barClass: 'bg-amber-400' },
    { key: 'structure', value: 100 - executionValue - holdingValue, barClass: 'bg-emerald-400' },
  ] as const;

  const dominantDriver = [...drivers].sort((a, b) => b.value - a.value)[0]?.key ?? 'execution';
  const pressureScore = Math.min(99, Math.round((executionRaw + holdingRaw + structureRaw) / 3 + (leverageOn ? 8 : 0)));
  const firstAudit = t(`review_${dominantDriver}`);

  const capitalRead = capital >= 50000 ? t('read_capital_large') : capital >= 10000 ? t('read_capital_mid') : t('read_capital_small');
  const leverageRead = leverageOn ? t('read_leverage_on') : t('read_leverage_off');

  const engineReads = [
    t(`read_group_${selectedGroup}`),
    t(`read_horizon_${selectedHorizon}`),
    t(`read_strategy_${activeStrategy.key}`),
    capitalRead,
    leverageRead,
  ];

  return (
    <section
      id="simulator"
      className="scroll-mt-32 border-t border-border/40 bg-gradient-to-b from-background to-muted/20 py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28"
    >
      <SectionContainer size="wide">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 2xl:gap-12">
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

            <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-xl sm:p-6 lg:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
                {t('control_label')}
              </p>

              <div className="mt-5 space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('group_label')}</label>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {assetGroupKeys.map(group => {
                      const colors = groupColors[group];
                      const isActive = selectedGroup === group;
                      return (
                        <button
                          key={group}
                          type="button"
                          onClick={() => setSelectedGroup(group)}
                          className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 hover:scale-[1.02] ${
                            isActive
                              ? `border-${colors.active.replace('bg-', '')}/50 ${colors.bg}`
                              : 'border-border/50 bg-muted/40 hover:border-border hover:bg-muted/60'
                          }`}
                        >
                          <div className="relative z-10">
                            <span className={`block font-mono text-[10px] uppercase tracking-[0.12em] ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {t(`group_${group}`)}
                            </span>
                          </div>
                          {isActive && (
                            <div className={`absolute inset-0 ${colors.bg} opacity-50`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {currentAsset.subOptions.length > 1 && (
                  <div>
                    <label className="text-sm font-medium text-foreground/80">{t('sub_label')}</label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentAsset.subOptions.map(sub => (
                        <button
                          key={sub.key}
                          type="button"
                          onClick={() => setSelectedSub(sub.key)}
                          className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                            selectedSub === sub.key
                              ? 'bg-foreground text-background'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('horizon_label')}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {horizonKeys.filter(h => currentAsset.horizons.includes(h)).map(horizon => (
                      <button
                        key={horizon}
                        type="button"
                        onClick={() => setSelectedHorizon(horizon)}
                        className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                          selectedHorizon === horizon
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {t(`horizon_${horizon}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/80">{t('strategy_label')}</label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {availableStrategies.map(strategy => (
                      <button
                        key={strategy.key}
                        type="button"
                        onClick={() => setSelectedStrategy(strategy.key)}
                        className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-all ${
                          selectedStrategy === strategy.key
                            ? 'bg-foreground text-background'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {t(`strategy_${strategy.key}`)}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-5 text-muted-foreground/60">{t('strategy_hint')}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-foreground/80">{t('capital_label')}</label>
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/50 bg-background px-4 py-3">
                      <span className="font-mono text-sm text-muted-foreground">{currencyCode}</span>
                      <input
                        type="number"
                        value={capital}
                        onChange={e => setCapital(Number(e.target.value) || 0)}
                        className="w-full bg-transparent text-base font-medium outline-none"
                        min={1000}
                        max={10000000}
                        step={1000}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground/60">{t('capital_hint')}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground/80">{t('leverage_label')}</label>
                    <button
                      type="button"
                      onClick={() => setLeverageOn(!leverageOn)}
                      className={`mt-3 relative h-12 w-full rounded-2xl border transition-all duration-300 ${
                        leverageOn
                          ? 'border-emerald-500/50 bg-emerald-500/10'
                          : 'border-border/50 bg-muted/40'
                      }`}
                    >
                      <span
                        className={`absolute left-1 top-1 h-10 w-[calc(50%-4px)] rounded-xl bg-emerald-500 transition-transform duration-300 ${
                          leverageOn ? 'translate-x-0' : 'translate-x-full'
                        }`}
                      />
                      <div className="relative flex h-full items-center justify-around">
                        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${!leverageOn ? 'text-background' : 'text-muted-foreground'}`}>
                          OFF
                        </span>
                        <span className={`font-mono text-[10px] uppercase tracking-[0.12em] ${leverageOn ? 'text-background' : 'text-muted-foreground'}`}>
                          ON
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800/80 bg-slate-950 p-5 shadow-2xl sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                {t('console_label')}
              </p>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300">
                {t('preview_ready')}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {t(`group_${selectedGroup}`)}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {t(`horizon_${selectedHorizon}`)}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {t(`strategy_${activeStrategy.key}`)}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {currencyCode}
                {' '}
                {capital.toLocaleString()}
              </span>
              <span className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] ${leverageOn ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/70 text-slate-400'}`}>
                {leverageOn ? 'LEVA ON' : 'LEVA OFF'}
              </span>
            </div>

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

            <div className="mt-5 rounded-[24px] border border-slate-800 bg-slate-900/[0.64] p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{t('preview_label')}</p>

              <div className="mt-5 space-y-4">
                {drivers.map(driver => (
                  <div key={driver.key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{t(`driver_${driver.key}`)}</span>
                      <span className="font-mono text-xs">
                        {driver.value}
                        %
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-800">
                      <div className={`h-2 rounded-full ${driver.barClass}`} style={{ width: `${driver.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {t(`insight_${selectedHorizon}`)}
              </p>
            </div>

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

            <p className="mt-4 text-xs leading-6 text-slate-500">
              {t('preview_note')}
            </p>
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};