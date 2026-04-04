'use client';

import { useTranslations } from 'next-intl';

import { AnimatedCounter, FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';
import { SectionContainer } from '@/components/ui/SectionContainer';

const metrics = [
  { value: 12847, suffix: '+', labelKey: 'metric_users' },
  { value: 2.4, suffix: 'B', prefix: '$', decimals: 1, labelKey: 'metric_volume' },
  { value: 99.9, suffix: '%', decimals: 1, labelKey: 'metric_uptime' },
  { value: 47, suffix: '%', labelKey: 'metric_savings' },
] as const;

export const SocialProof = () => {
  const t = useTranslations('SocialProof') as (key: string) => string;

  return (
    <section className="border-t border-border/40 py-14 sm:py-16 lg:py-20 xl:py-24">
      <SectionContainer size="wide">
        <FadeIn>
          <div className="text-center">
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/60 sm:tracking-[0.24em]">
              {t('eyebrow')}
            </p>
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base sm:leading-8">
              {t('subtitle')}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren staggerDelay={100} className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.labelKey}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:border-border/70 hover:shadow-md sm:rounded-[20px]"
            >
              <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
              <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {'prefix' in metric && metric.prefix ? metric.prefix : ''}
                <AnimatedCounter
                  end={metric.value}
                  suffix={metric.suffix}
                  duration={2200}
                  decimals={'decimals' in metric ? metric.decimals : 0}
                />
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {t(metric.labelKey)}
              </p>
            </div>
          ))}
        </StaggerChildren>

        <FadeIn delay={400}>
          <div className="mt-10 border-t border-border/40 pt-8 sm:mt-12 sm:pt-10">
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
              {t('trusted_by')}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-40 grayscale">
              {['Bloomberg', 'Reuters', 'Financial Times', 'WSJ', 'Forbes'].map((brand) => (
                <span key={brand} className="text-lg font-bold tracking-tight text-muted-foreground sm:text-xl">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </SectionContainer>
    </section>
  );
};
