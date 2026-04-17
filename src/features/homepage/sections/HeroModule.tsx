'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';

const kpiCards = [
  { label: 'Execution Friction', value: 'Spread + Slippage' },
  { label: 'Holding Cost', value: 'Funding + Overnight' },
  { label: 'Cost Structure', value: 'Fees + Instrument Logic' },
] as const;

export const HeroModule = () => {
  const t = useTranslations('TradeHero') as (key: string) => string;

  return (
    <section id="simulator" className="border-b border-border/50 bg-slate-950 text-slate-100">
      <SectionContainer className="grid gap-10 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">{t('eyebrow')}</p>
          <h1 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{t('title')}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{t('subtitle')}</p>
          <p className="mt-6 max-w-2xl border-t border-slate-700 pt-6 text-sm leading-7 text-slate-400">{t('trust')}</p>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t('simulator_label')}</p>
            <span className="rounded-full border border-amber-400/60 px-3 py-1 text-xs font-medium text-amber-200">
              Placeholder
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {kpiCards.map(card => (
              <div key={card.label} className="rounded-2xl border border-slate-700/80 bg-slate-950/80 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">{card.label}</p>
                <p className="mt-2 text-sm font-medium text-slate-200">{card.value}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm leading-7 text-slate-400">
            Stiamo ricostruendo il simulatore in modalità modulare. In questa fase mostriamo solo la struttura
            del motore e non il calcolo completo.
          </p>
        </div>
      </SectionContainer>
    </section>
  );
};
