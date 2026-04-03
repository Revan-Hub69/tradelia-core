'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { SectionContainer } from '@/components/ui/SectionContainer';

const timeHorizons = [
  { key: 'intraday' },
  { key: 'multiday' },
  { key: 'position' },
] as const;

const tradeFrequencies = [
  { key: 'low' },
  { key: 'medium' },
  { key: 'high' },
] as const;

export const ScenarioSection = () => {
  const t = useTranslations('Scenario') as (key: string) => string;

  const [selectedHorizon, setSelectedHorizon] = useState('multiday');
  const [selectedFrequency, setSelectedFrequency] = useState('medium');
  const [capital, setCapital] = useState(10000);
  const [leverage, setLeverage] = useState(3);

  const baseWeights = {
    intraday: { spread: 54, swap: 6, commissions: 40 },
    multiday: { spread: 34, swap: 38, commissions: 28 },
    position: { spread: 18, swap: 58, commissions: 24 },
  }[selectedHorizon as 'intraday' | 'multiday' | 'position'];

  const frequencyAdjustments = {
    low: { spread: -8, swap: 8, commissions: -3 },
    medium: { spread: 0, swap: 0, commissions: 0 },
    high: { spread: 12, swap: -10, commissions: 10 },
  }[selectedFrequency as 'low' | 'medium' | 'high'];

  const rawDrivers = {
    spread: Math.max(8, baseWeights.spread + frequencyAdjustments.spread + Math.round(leverage * 0.8)),
    swap: Math.max(6, baseWeights.swap + frequencyAdjustments.swap + Math.round(leverage * (selectedHorizon === 'position' ? 1.6 : 0.7))),
    commissions: Math.max(8, baseWeights.commissions + frequencyAdjustments.commissions + Math.round(leverage * (selectedFrequency === 'high' ? 0.7 : 0.3))),
  };

  const total = rawDrivers.spread + rawDrivers.swap + rawDrivers.commissions;
  const spreadValue = Math.round((rawDrivers.spread / total) * 100);
  const swapValue = Math.round((rawDrivers.swap / total) * 100);
  const drivers = [
    { key: 'spread', value: spreadValue, barClass: 'bg-sky-400' },
    { key: 'swap', value: swapValue, barClass: 'bg-amber-400' },
    { key: 'commissions', value: 100 - spreadValue - swapValue, barClass: 'bg-indigo-400' },
  ];

  const dominantDriver = [...drivers].sort((a, b) => b.value - a.value)[0]?.key ?? 'spread';
  const pressureScore = Math.min(99, Math.round((rawDrivers.spread + rawDrivers.swap * 1.1 + rawDrivers.commissions * 0.9) / 3));
  const firstAudit = t(`review_${dominantDriver}`);

  const capitalRead =
    capital >= 50000
      ? t('read_capital_large')
      : capital >= 10000
        ? t('read_capital_mid')
        : t('read_capital_small');

  const engineReads = [
    t(`read_horizon_${selectedHorizon}`),
    t(`read_frequency_${selectedFrequency}`),
    capitalRead,
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
                  max={15}
                  value={leverage}
                  onChange={e => setLeverage(Number(e.target.value))}
                  className="mt-4 flex h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
                  style={{
                    background: `linear-gradient(to right, var(--primary) ${(leverage / 15) * 100}%, var(--muted) ${(leverage / 15) * 100}%)`,
                  }}
                />
                <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
                  <span>1x</span>
                  <span>15x</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                <label className="text-sm font-medium">
                  {t('horizon_label')}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {timeHorizons.map(horizon => (
                    <button
                      key={horizon.key}
                      type="button"
                      onClick={() => setSelectedHorizon(horizon.key)}
                      className={`inline-flex items-center rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                        selectedHorizon === horizon.key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t(`horizon_${horizon.key}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                <label className="text-sm font-medium">
                  {t('frequency_label')}
                </label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tradeFrequencies.map(frequency => (
                    <button
                      key={frequency.key}
                      type="button"
                      onClick={() => setSelectedFrequency(frequency.key)}
                      className={`inline-flex items-center rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                        selectedFrequency === frequency.key
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {t(`frequency_${frequency.key}`)}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs leading-6 text-muted-foreground/60">
                  {t(`frequency_hint_${selectedFrequency}`)}
                </p>
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
                EUR
{' '}
{capital.toLocaleString()}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {leverage}
x
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {t(`horizon_${selectedHorizon}`)}
              </span>
              <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">
                {t(`frequency_${selectedFrequency}`)}
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
