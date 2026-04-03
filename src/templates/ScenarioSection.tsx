'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

/** Time horizon options */
const timeHorizons = [
  { key: 'scalping', label: 'Scalping' },
  { key: 'intraday', label: 'Intraday' },
  { key: 'multi_day', label: 'Multi-day' },
  { key: 'long_term', label: 'Lungo termine' },
];

/** Strategy options */
const strategies = [
  { key: 'breakout', label: 'Breakout' },
  { key: 'momentum', label: 'Momentum' },
  { key: 'spiky', label: 'Spiky' },
  { key: 'pullback', label: 'Pullback' },
  { key: 'carry', label: 'Carry/Income' },
];

interface ScenarioSectionProps {
  onSimulate?: () => void;
}

export const ScenarioSection = ({ onSimulate }: ScenarioSectionProps) => {
  const t = useTranslations('Scenario') as (key: string) => string;
  
  const [selectedHorizon, setSelectedHorizon] = useState('intraday');
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');
  const [capital, setCapital] = useState(10000);
  const [leverage, setLeverage] = useState(1);

  // Filter strategies based on horizon (simplified logic)
  const availableStrategies = selectedHorizon === 'long_term' 
    ? strategies.filter(s => ['carry', 'momentum'].includes(s.key))
    : strategies;

  return (
    <section className="border-t border-border/40 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-4xl">
        {/* Section header with step indicator */}
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            1
          </span>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
            {t('section_eyebrow')}
          </p>
        </div>

        <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl">
          {t('section_title')}
        </h2>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left column: Inputs */}
          <div className="flex flex-col gap-6">
            {/* Capital input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t('capital_label')}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">€</span>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  min={1000}
                  max={10000000}
                  step={1000}
                />
              </div>
            </div>

            {/* Leverage slider */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  {t('leverage_label')}
                </label>
                <span className="font-mono text-sm text-primary">{leverage}x</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={leverage}
                onChange={(e) => setLeverage(Number(e.target.value))}
                className="flex h-2 w-full cursor-pointer appearance-none rounded-full bg-muted"
                style={{
                  background: `linear-gradient(to right, var(--primary) ${(leverage/30)*100}%, var(--muted) ${(leverage/30)*100}%)`,
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1x</span>
                <span>30x</span>
              </div>
            </div>

            {/* Time horizon pills */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t('horizon_label')}
              </label>
              <div className="flex flex-wrap gap-2">
                {timeHorizons.map((horizon) => (
                  <button
                    key={horizon.key}
                    type="button"
                    onClick={() => {
                      setSelectedHorizon(horizon.key);
                      // Reset strategy when horizon changes
                      if (horizon.key === 'long_term') {
                        setSelectedStrategy('carry');
                      }
                    }}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

            {/* Strategy pills */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t('strategy_label')}
              </label>
              <div className="flex flex-wrap gap-2">
                {availableStrategies.map((strategy) => (
                  <button
                    key={strategy.key}
                    type="button"
                    onClick={() => setSelectedStrategy(strategy.key)}
                    className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedStrategy === strategy.key
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {t(`strategy_${strategy.key}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: Mini preview chart + CTA */}
          <div className="flex flex-col gap-6">
            {/* Mini preview */}
            <div className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/50">
                {t('preview_label')}
              </p>
              
              {/* Mini bar chart preview */}
              <div className="flex h-24 items-end justify-around gap-2">
                {[
                  { label: 'ETF', value: 21, height: '35%' },
                  { label: 'CFD', value: 57, height: '95%' },
                  { label: 'Fut', value: 25, height: '42%' },
                  { label: 'Opt', value: 49, height: '82%' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 rounded-t-sm bg-primary/60"
                      style={{ height: item.height }}
                    />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="font-mono text-xs">€{item.value}</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-muted-foreground/60">
                {t('preview_note')}
              </p>
            </div>

            {/* CTA */}
            <Button 
              size="lg" 
              className="h-12 w-full text-base font-semibold"
              onClick={onSimulate}
            >
              {t('cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};