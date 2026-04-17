'use client';

import { useTranslations } from 'next-intl';

import { SectionContainer } from '@/components/ui/SectionContainer';
import { InteractiveSimulator } from '@/features/landing/InteractiveSimulator';

export const TradeHero = () => {
  const t = useTranslations('TradeHero') as (key: string) => string;

  return (
    <section
      id="simulator"
      className="relative min-h-[calc(100dvh-88px)] overflow-hidden border-b border-border/40"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_0%,rgba(59,130,246,0.06),transparent_60%),radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(249,115,22,0.04),transparent_60%)]" />

      <SectionContainer
        size="wide"
        className="relative flex min-h-[calc(100dvh-88px)] flex-col justify-center py-16 xl:flex-row xl:items-center xl:gap-16 xl:py-20 2xl:gap-24"
      >
        <div className="shrink-0 xl:w-[380px] 2xl:w-[420px]">
          <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-muted-foreground/75">
            {t('eyebrow')}
          </p>
          <h1
            className="text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl xl:text-[2.6rem] 2xl:text-5xl"
            style={{ textWrap: 'balance' } as React.CSSProperties}
          >
            {t('title')}
          </h1>
          <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t('subtitle')}
          </p>
          <p className="mt-8 border-t border-border/30 pt-6 text-xs leading-6 text-muted-foreground/75">
            {t('trust')}
          </p>
        </div>

        <div className="mt-12 min-w-0 flex-1 xl:mt-0">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/40" />
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/75">
              {t('simulator_label')}
            </span>
            <div className="h-px flex-1 bg-border/40" />
          </div>

          <div className="rounded-[32px] border border-border/60 bg-card/80 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)]">
            <InteractiveSimulator />
          </div>
        </div>
      </SectionContainer>
    </section>
  );
};
