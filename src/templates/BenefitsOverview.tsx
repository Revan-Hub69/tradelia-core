'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';

/**
 * Premium Benefits Icons - Enterprise grade SVGs
 */
const BenefitIcons = {
  foundation: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" className="fill-primary" />
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" className="fill-primary/60" />
    </svg>
  ),
  efficiency: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <circle cx="12" cy="12" r="9" className="stroke-primary" strokeWidth="2" fill="none" />
      <path d="M12 7v5l3 3" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" className="fill-primary" />
    </svg>
  ),
  adaptive: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 7l10 5 10-5" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" className="fill-primary/20" />
    </svg>
  ),
};

export const BenefitsOverview = () => {
  const t = useTranslations('BenefitsOverview') as any;

  const benefits = [
    {
      icon: BenefitIcons.foundation,
      title: t('benefit1_title'),
      description: t('benefit1_desc'),
      highlight: t('benefit1_highlight'),
    },
    {
      icon: BenefitIcons.efficiency,
      title: t('benefit2_title'),
      description: t('benefit2_desc'),
      highlight: t('benefit2_highlight'),
    },
    {
      icon: BenefitIcons.adaptive,
      title: t('benefit3_title'),
      description: t('benefit3_desc'),
      highlight: t('benefit3_highlight'),
    },
  ];

  return (
    <section id="challenges" className="border-t border-border/50 bg-gradient-to-b from-background to-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {t('section_title')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              {t('section_subtitle')}
            </p>
          </div>
        </FadeIn>

        <StaggerChildren
          staggerDelay={150}
          className="mt-12 grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10"
        >
          {benefits.map((benefit, _index) => (
            <Card
              key={benefit.title}
              className="group relative overflow-hidden border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10 sm:p-8"
            >
              {/* Premium gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                {/* Icon with premium styling */}
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20 sm:size-20">
                  {benefit.icon}
                </div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-semibold tracking-tight sm:text-xl">
                  {benefit.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {benefit.description}
                </p>

                {/* Highlight badge */}
                <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  <svg className="mr-1.5 size-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {benefit.highlight}
                </div>
              </div>
            </Card>
          ))}
        </StaggerChildren>

        {/* Premium trust indicator */}
        <FadeIn delay={400}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-2 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" className="size-5 text-accent" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-medium text-muted-foreground">
                {t('trust_indicator')}
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
