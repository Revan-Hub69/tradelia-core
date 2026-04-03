'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { SectionContainer } from '@/components/ui/SectionContainer';

type AssetKey = 'equities' | 'etf' | 'forex' | 'indices';
type HorizonKey = 'intraday' | 'swing' | 'position' | 'accumulation';
type DriverKey = 'execution' | 'holding' | 'structure';

type DriverWeights = Record<DriverKey, number>;

type StrategyDefinition = {
  key: string;
  horizons: HorizonKey[];
  driverBias: DriverWeights;
};

type AssetDefinition = {
  horizons: HorizonKey[];
  baseDrivers: DriverWeights;
  strategies: StrategyDefinition[];
};

const driverKeys: DriverKey[] = ['execution', 'holding', 'structure'];
const assetKeys: AssetKey[] = ['equities', 'etf', 'forex', 'indices'];

const horizonAdjustments: Record<HorizonKey, DriverWeights> = {
  intraday: { execution: 18, holding: -10, structure: -8 },
  swing: { execution: 8, holding: 4, structure: -2 },
  position: { execution: -4, holding: 8, structure: 8 },
  accumulation: { execution: -12, holding: -6, structure: 18 },
};

const assetMatrix: Record<AssetKey, AssetDefinition> = {
  equities: {
    horizons: ['intraday', 'swing', 'position', 'accumulation'],
    baseDrivers: { execution: 26, holding: 16, structure: 58 },
    strategies: [
      { key: 'opening_breakout', horizons: ['intraday'], driverBias: { execution: 18, holding: -8, structure: -4 } },
      { key: 'mean_reversion', horizons: ['intraday', 'swing'], driverBias: { execution: 12, holding: -4, structure: 0 } },
      { key: 'earnings_swing', horizons: ['swing'], driverBias: { execution: 6, holding: 8, structure: 2 } },
      { key: 'stock_picking', horizons: ['position'], driverBias: { execution: -6, holding: 4, structure: 14 } },
      { key: 'quality_compound', horizons: ['position', 'accumulation'], driverBias: { execution: -10, holding: -2, structure: 18 } },
      { key: 'dividend_reinvest', horizons: ['accumulation'], driverBias: { execution: -12, holding: -4, structure: 20 } },
    ],
  },
  etf: {
    horizons: ['swing', 'position', 'accumulation'],
    baseDrivers: { execution: 18, holding: 10, structure: 72 },
    strategies: [
      { key: 'sector_rotation', horizons: ['swing'], driverBias: { execution: 8, holding: 0, structure: 6 } },
      { key: 'core_satellite', horizons: ['position', 'accumulation'], driverBias: { execution: -4, holding: 0, structure: 12 } },
      { key: 'macro_allocation', horizons: ['position'], driverBias: { execution: -6, holding: 0, structure: 14 } },
      { key: 'pac_etf', horizons: ['accumulation'], driverBias: { execution: -12, holding: -4, structure: 22 } },
    ],
  },
  forex: {
    horizons: ['intraday', 'swing', 'position'],
    baseDrivers: { execution: 50, holding: 30, structure: 20 },
    strategies: [
      { key: 'session_breakout', horizons: ['intraday'], driverBias: { execution: 18, holding: -6, structure: -4 } },
      { key: 'mean_reversion_fx', horizons: ['intraday', 'swing'], driverBias: { execution: 12, holding: 2, structure: -2 } },
      { key: 'macro_swing', horizons: ['swing'], driverBias: { execution: 4, holding: 10, structure: 0 } },
      { key: 'carry_trade', horizons: ['position'], driverBias: { execution: -4, holding: 18, structure: -2 } },
    ],
  },
  indices: {
    horizons: ['intraday', 'swing', 'position'],
    baseDrivers: { execution: 56, holding: 24, structure: 20 },
    strategies: [
      { key: 'trend_day', horizons: ['intraday'], driverBias: { execution: 20, holding: -6, structure: -4 } },
      { key: 'open_drive', horizons: ['intraday'], driverBias: { execution: 18, holding: -6, structure: -4 } },
      { key: 'breakout_pullback', horizons: ['swing'], driverBias: { execution: 8, holding: 6, structure: 0 } },
      { key: 'macro_trend', horizons: ['position'], driverBias: { execution: 2, holding: 12, structure: 0 } },
    ],
  },
};

const sumWeights = (...groups: DriverWeights[]) =>
  driverKeys.reduce<DriverWeights>(
    (accumulator, key) => {
      accumulator[key] = groups.reduce((sum, group) => sum + group[key], 0);
      return accumulator;
    },
    { execution: 0, holding: 0, structure: 0 },
  );

const getCapitalBias = (capital: number): DriverWeights => {
  if (capital >= 50000) {
    return { execution: 8, holding: 4, structure: -10 };
  }

  if (capital >= 10000) {
    return { execution: 3, holding: 2, structure: -2 };
  }

  return { execution: -2, holding: 0, structure: 10 };
};

const getLeverageBias = (leverage: number, horizon: HorizonKey): DriverWeights => ({
  execution: Math.round((leverage - 1) * 0.9),
  holding: Math.round((leverage - 1) * (horizon === 'intraday' ? 0.4 : 1.5)),
  structure: Math.round((leverage - 1) * 0.4),
});

export const ScenarioSection = () => {
  const t = useTranslations('Scenario') as (key: string) => string;

  const [selectedAsset, setSelectedAsset] = useState<AssetKey>('etf');
  const [selectedHorizon, setSelectedHorizon] = useState<HorizonKey>('accumulation');
  const [selectedStrategy, setSelectedStrategy] = useState('pac_etf');
  const [capital, setCapital] = useState(15000);
  const [leverage, setLeverage] = useState(1);

  useEffect(() => {
    const nextHorizons = assetMatrix[selectedAsset].horizons;
    const fallbackHorizon = nextHorizons[0];

    if (fallbackHorizon && !nextHorizons.includes(selectedHorizon)) {
      setSelectedHorizon(fallbackHorizon);
      return;
    }

    const nextStrategies = assetMatrix[selectedAsset].strategies.filter(strategy =>
      strategy.horizons.includes(selectedHorizon),
    );

    if (!nextStrategies.some(strategy => strategy.key === selectedStrategy)) {
      setSelectedStrategy(nextStrategies[0]?.key ?? selectedStrategy);
    }
  }, [selectedAsset, selectedHorizon, selectedStrategy]);

  const selectedAssetConfig = assetMatrix[selectedAsset];
  const availableHorizons = selectedAssetConfig.horizons;
  const availableStrategies = selectedAssetConfig.strategies.filter(strategy =>
    strategy.horizons.includes(selectedHorizon),
  );
  const activeStrategy = availableStrategies.find(strategy => strategy.key === selectedStrategy) ?? availableStrategies[0];

  if (!activeStrategy) {
    return null;
  }

  const rawDrivers = sumWeights(
    selectedAssetConfig.baseDrivers,
    horizonAdjustments[selectedHorizon],
    activeStrategy.driverBias,
    getCapitalBias(capital),
    getLeverageBias(leverage, selectedHorizon),
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
  const pressureScore = Math.min(
    99,
    Math.round((executionRaw * 0.95 + holdingRaw * 1.08 + structureRaw) / 3 + (leverage - 1) * 1.8),
  );
  const firstAudit = t(`review_${dominantDriver}`);

  const capitalRead =
    capital >= 50000
      ? t('read_capital_large')
      : capital >= 10000
        ? t('read_capital_mid')
        : t('read_capital_small');

  const leverageRead =
    leverage === 1
      ? t('read_leverage_unlevered')
      : leverage <= 3
        ? t('read_leverage_light')
        : t('read_leverage_high');

  const engineReads = [
    t(`read_asset_${selectedAsset}`),
    t(`read_horizon_${selectedHorizon}`),
    t(`read_strategy_${activeStrategy.key}`),
    capitalRead,
    leverageRead,
  ];

  return (
    <section
      id="simulator"
      className="scroll-mt-32 border-t border-border/40 py-14 sm:py-16 lg:py-20 xl:py-24 2xl:py-28"
    >
      <SectionContainer size="wide">
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground/60">
          {t('section_eyebrow')}
        </p>

        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
          {t('section_title')}
        </h2>

        <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
          {t('section_intro')}
        </p>

        <div className="mt-10 grid gap-8 xl:grid-cols-[0.88fr_1.12fr] xl:gap-10 2xl:gap-12">
          <div className="rounded-[32px] border border-border/60 bg-card p-6 shadow-[0_20px_55px_-38px_rgba(15,23,42,0.35)] sm:p-7 xl:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55">
              {t('control_label')}
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                <label className="text-sm font-medium">
                  {t('asset_label')}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {assetKeys.map(asset => (
                    <button
                      key={asset}
                      type="button"
                      onClick={() => setSelectedAsset(asset)}
                      className={`inline-flex items-center rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                        selectedAsset === asset
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t(`asset_${asset}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                <label className="text-sm font-medium">
                  {t('horizon_label')}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableHorizons.map(horizon => (
                    <button
                      key={horizon}
                      type="button"
                      onClick={() => setSelectedHorizon(horizon)}
                      className={`inline-flex items-center rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                        selectedHorizon === horizon
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t(`horizon_${horizon}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                <label className="text-sm font-medium">
                  {t('strategy_label')}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableStrategies.map(strategy => (
                    <button
                      key={strategy.key}
                      type="button"
                      onClick={() => setSelectedStrategy(strategy.key)}
                      className={`inline-flex items-center rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                        selectedStrategy === strategy.key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t(`strategy_${strategy.key}`)}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-6 text-muted-foreground/60">
                  {t('strategy_hint')}
                </p>
                <p className="mt-2 text-xs leading-6 text-muted-foreground/60">
                  {t(`strategy_note_${activeStrategy.key}`)}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                <label className="text-sm font-medium">
                  {t('capital_label')}
                </label>
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/50 bg-background px-4 py-3">
                  <span className="font-mono text-sm text-muted-foreground">EUR</span>
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
                <p className="mt-3 text-xs leading-6 text-muted-foreground/60">{t('capital_hint')}</p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    {t('leverage_label')}
                  </label>
                  <span className="font-mono text-sm text-primary">
                    {leverage}
                    x
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={leverage}
                  onChange={e => setLeverage(Number(e.target.value))}
                  className="mt-4 flex h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
                  style={{
                    background: `linear-gradient(to right, var(--primary) ${(leverage / 12) * 100}%, var(--muted) ${(leverage / 12) * 100}%)`,
                  }}
                />
                <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
                  <span>1x</span>
                  <span>12x</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.72)] sm:p-7 xl:p-8">
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
                {t(`asset_${selectedAsset}`)}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {t(`horizon_${selectedHorizon}`)}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {t(`strategy_${activeStrategy.key}`)}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                EUR
                {' '}
                {capital.toLocaleString()}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {leverage}
                x
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
