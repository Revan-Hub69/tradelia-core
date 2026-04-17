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
      {/* Layer 1: Deep ambient glow — iOS 26 depth foundation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(80% 60% at 15% 10%, hsl(var(--primary) / 0.12), transparent 55%),
            radial-gradient(60% 50% at 85% 20%, hsl(var(--accent) / 0.08), transparent 50%),
            radial-gradient(40% 30% at 50% 80%, hsl(var(--primary) / 0.05), transparent 45%)
          `,
        }}
      />

      {/* Layer 2: Noise texture overlay for glass material depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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
                className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm"
              >
                {chip}
              </span>
            ))}
          </div>

          <p className="mt-8 max-w-xl border-t border-border/60 pt-6 text-sm leading-7 text-muted-foreground">
            {t('trust')}
          </p>
        </div>

        {/* RIGHT · Live simulator — iOS 26 Glass Card */}
        <div className="relative lg:sticky lg:top-24">
          {/* Glass card glow effect */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px rounded-[calc(1.5rem+1px)] opacity-60 blur-xl"
            style={{
              background: `
                linear-gradient(135deg, hsl(var(--primary) / 0.3) 0%, transparent 50%),
                linear-gradient(225deg, hsl(var(--accent) / 0.2) 0%, transparent 50%)
              `,
            }}
          />

          {/* Main glass card — iOS 26 style */}
          <div
            className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:p-7"
            style={{
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.02) inset,
                0 20px 50px -10px rgba(0,0,0,0.4),
                0 50px 100px -20px rgba(0,0,0,0.3),
                0 0 0 1px rgba(0,0,0,0.1)
              `,
            }}
          >
            {/* Subtle top highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            <SimulatorLauncher />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};
