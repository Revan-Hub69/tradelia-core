'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';

/**
 * Learning Path Progress Indicator
 */
const ProgressPath = () => (
  <div className="relative">
    {/* Main path line */}
    <div className="absolute left-6 top-12 h-[calc(100%-6rem)] w-0.5 bg-gradient-to-b from-primary via-primary/60 to-primary/20" />

    {/* Animated dots */}
    <div className="absolute left-5 top-16 size-2 animate-pulse rounded-full bg-primary" />
    <div className="absolute left-5 top-32 size-2 animate-pulse rounded-full bg-primary/60" style={{ animationDelay: '0.5s' }} />
    <div className="absolute left-5 top-48 size-2 animate-pulse rounded-full bg-primary/40" style={{ animationDelay: '1s' }} />
  </div>
);

/**
 * Module Icons - Premium SVG set
 */
const ModuleIcons = {
  foundations: (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 sm:size-7" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" className="fill-primary" />
      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
  security: (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 sm:size-7" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9 12l2 2 4-4" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  trading: (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 sm:size-7" aria-hidden="true">
      <path d="M3 3v18h18" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 12l4-4 4 4 6-6" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="11" cy="8" r="2" className="fill-primary" />
    </svg>
  ),
  defi: (
    <svg viewBox="0 0 24 24" fill="none" className="size-6 sm:size-7" aria-hidden="true">
      <circle cx="12" cy="12" r="3" className="stroke-primary" strokeWidth="2" fill="none" />
      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1" className="fill-primary" />
    </svg>
  ),
};

export const LearningPath = () => {
  const t = useTranslations('LearningPath') as any;

  const modules = [
    {
      icon: ModuleIcons.foundations,
      title: t('module1_title'),
      description: t('module1_desc'),
      duration: t('module1_duration'),
      lessons: t('module1_lessons'),
      level: t('level_beginner'),
      color: 'from-blue-500/20 to-primary/20',
    },
    {
      icon: ModuleIcons.security,
      title: t('module2_title'),
      description: t('module2_desc'),
      duration: t('module2_duration'),
      lessons: t('module2_lessons'),
      level: t('level_intermediate'),
      color: 'from-emerald-500/20 to-accent/20',
    },
    {
      icon: ModuleIcons.trading,
      title: t('module3_title'),
      description: t('module3_desc'),
      duration: t('module3_duration'),
      lessons: t('module3_lessons'),
      level: t('level_advanced'),
      color: 'from-orange-500/20 to-yellow-500/20',
    },
    {
      icon: ModuleIcons.defi,
      title: t('module4_title'),
      description: t('module4_desc'),
      duration: t('module4_duration'),
      lessons: t('module4_lessons'),
      level: t('level_expert'),
      color: 'from-purple-500/20 to-pink-500/20',
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-border/50 bg-muted/20 px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
      {/* Premium background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
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

        <div className="mt-12 grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Learning Path Visual */}
          <FadeIn className="order-2 lg:order-1">
            <div className="relative rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm sm:p-8">
              <h3 className="mb-6 text-lg font-semibold">
                {t('path_visual_title')}
              </h3>

              <ProgressPath />

              <div className="space-y-6">
                {modules.map((module, _index) => (
                  <div key={module.title} className="flex items-start gap-4">
                    {/* Step indicator */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                      {_index + 1}
                    </div>

                    {/* Module info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{module.title}</h4>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {module.level}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {module.duration}
                        {' • '}
                        {module.lessons}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Module Cards */}
          <div className="order-1 lg:order-2">
            <StaggerChildren staggerDelay={100} className="space-y-4">
              {modules.map((module, _index) => (
                <Card
                  key={module.title}
                  className="group relative overflow-hidden border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
                >
                  {/* Premium gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                      {module.icon}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{module.title}</h3>
                        <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          {module.level}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {module.description}
                      </p>

                      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {module.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          {module.lessons}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </StaggerChildren>
          </div>
        </div>

        {/* Premium CTA */}
        <FadeIn delay={600}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-2">
              <svg className="size-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-accent">
                {t('cta_badge')}
              </span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
