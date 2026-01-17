'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';

/**
 * TRAD Usage Icons - What you can buy with TRAD Educational
 */
const UsageIcons = {
  courses: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" className="stroke-primary" strokeWidth="2" fill="none" />
      <path d="M8 21l4-7 4 7" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17v4" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
      <circle cx="7" cy="9" r="2" className="fill-accent" />
      <path d="M11 7h6M11 11h4" className="stroke-primary/60" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  tools: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" className="fill-primary" />
      <circle cx="18" cy="6" r="3" className="fill-accent" />
      <path d="M16.5 6l1 1 2-2" className="stroke-background" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  premium: (
    <svg viewBox="0 0 24 24" fill="none" className="size-8 sm:size-10" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" className="stroke-primary" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4" className="fill-accent/20" />
      <path d="M10 12l1.5 1.5L15 10" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export const TradUsage = () => {
  const t = useTranslations('TradUsage' as any) as (key: string) => string;

  const usageOptions = [
    {
      icon: UsageIcons.courses,
      title: t('usage1_title'),
      description: t('usage1_desc'),
      price: t('usage1_price'),
      examples: t('usage1_examples'),
    },
    {
      icon: UsageIcons.tools,
      title: t('usage2_title'),
      description: t('usage2_desc'),
      price: t('usage2_price'),
      examples: t('usage2_examples'),
    },
    {
      icon: UsageIcons.premium,
      title: t('usage3_title'),
      description: t('usage3_desc'),
      price: t('usage3_price'),
      examples: t('usage3_examples'),
    },
  ];

  return (
    <section className="bg-muted/30 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
                <circle cx="12" cy="12" r="3" className="fill-current" />
                <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" className="stroke-current" strokeWidth="2" strokeLinecap="round" />
              </svg>
              TRAD Educational
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
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
          {usageOptions.map((option, _index) => (
            <Card
              key={option.title}
              className="group relative overflow-hidden border-border/50 bg-card/80 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-card hover:shadow-lg hover:shadow-accent/10 sm:p-8"
            >
              {/* Premium gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                {/* Icon with TRAD styling */}
                <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-accent/10 transition-colors duration-300 group-hover:bg-accent/20 sm:size-20">
                  {option.icon}
                </div>

                {/* Content */}
                <h3 className="mb-3 text-lg font-semibold tracking-tight sm:text-xl">
                  {option.title}
                </h3>

                <p className="mb-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {option.description}
                </p>

                {/* Price badge */}
                <div className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {option.price}
                </div>

                {/* Examples */}
                <p className="text-xs text-muted-foreground/80 sm:text-sm">
                  <span className="font-medium">Esempi:</span>
                  {' '}
                  {option.examples}
                </p>
              </div>
            </Card>
          ))}
        </StaggerChildren>

        {/* Educational disclaimer */}
        <FadeIn delay={400}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-background/50 px-4 py-2 backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" className="size-5 text-muted-foreground" aria-hidden="true">
                <circle cx="12" cy="12" r="10" className="stroke-current" strokeWidth="2" />
                <path d="M12 6v6l4 2" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-medium text-muted-foreground">
                {t('disclaimer')}
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
