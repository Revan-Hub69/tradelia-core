'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { SimulatorLauncher } from '@/features/simulator-v2/ui/SimulatorLauncher';

const trustChips = [
  'Dati broker pubblici',
  'Nessuna registrazione',
  'Informativo · non è consulenza',
] as const;

export const HeroModule = () => {
  const t = useTranslations('TradeHero') as (key: string) => string;

  return (
    <section
      id="simulator"
      className="relative overflow-hidden border-b border-border/50 bg-background text-foreground"
    >
      {/* Ambient glow — SOTA 2026 depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 20% 0%, hsl(var(--primary) / 0.08), transparent 60%), radial-gradient(50% 40% at 100% 30%, hsl(var(--accent) / 0.06), transparent 60%)',
        }}
      />

      <SectionContainer className="relative grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16 lg:py-24">
        {/* LEFT · Headline + proof */}
        <div className="flex flex-col">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {t('eyebrow')}
          </p>

          <h1 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {trustChips.map(chip => (
              <span
                key={chip}
                className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-xl border-t border-border/60 pt-6 text-sm leading-7 text-muted-foreground">
            {t('trust')}
          </p>
        </div>

        {/* RIGHT · Live simulator */}
        <div className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-border/60 bg-card/60 p-5 shadow-2xl backdrop-blur-sm sm:p-6 lg:p-7">
            <SimulatorLauncher />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};
