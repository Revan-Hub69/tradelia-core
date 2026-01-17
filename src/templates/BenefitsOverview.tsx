'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';

/**
 * TRAD Educational Icons - Token reward system
 */
const BenefitIcons = {
  quiz: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" className="stroke-primary" strokeWidth="2" fill="none" />
      <path d="M7 8h10M7 12h6M7 16h4" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="8" r="3" className="fill-accent" />
      <path d="M16.5 8l1 1 2-2" className="stroke-background" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  referral: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" className="stroke-primary" strokeWidth="2" fill="none" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20" cy="12" r="2" className="fill-accent" />
      <path d="M19 12h2" className="stroke-background" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  missions: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" className="fill-primary" />
      <circle cx="12" cy="12" r="3" className="fill-accent" />
      <path d="M10.5 12l1 1 2-2" className="stroke-background" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export const BenefitsOverview = () => {
  const t = useTranslations('BenefitsOverview' as any) as (key: string) => string;

  const benefits = [
    {
      icon: BenefitIcons.quiz,
      title: t('benefit1_title'),
      description: t('benefit1_desc'),
      highlight: t('benefit1_highlight'),
    },
    {
      icon: BenefitIcons.referral,
      title: t('benefit2_title'),
      description: t('benefit2_desc'),
      highlight: t('benefit2_highlight'),
    },
    {
      icon: BenefitIcons.missions,
      title: t('benefit3_title'),
      description: t('benefit3_desc'),
      highlight: t('benefit3_highlight'),
    },
  ];

  return (
    <section className="border-t border-border/50 bg-gradient-to-b from-background to-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
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
