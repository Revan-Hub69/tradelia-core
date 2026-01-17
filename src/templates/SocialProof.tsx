'use client';

import { useTranslations } from 'next-intl';

import { Card } from '@/components/ui/card';
import { AnimatedCounter, FadeIn, StaggerChildren } from '@/components/ui/scroll-animations';

/**
 * Premium Star Rating Component
 */
const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <svg
        key={`star-${rating}-${i}`}
        className={`size-4 ${i < rating ? 'text-yellow-400' : 'text-muted-foreground/30'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

/**
 * Premium Avatar Component
 */
const Avatar = ({ name, role }: { name: string; role: string }) => (
  <div className="flex items-center gap-3">
    <div className="size-12 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
      <div className="flex size-full items-center justify-center text-sm font-semibold text-primary">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
    </div>
    <div>
      <div className="font-medium text-foreground">{name}</div>
      <div className="text-sm text-muted-foreground">{role}</div>
    </div>
  </div>
);

export const SocialProof = () => {
  const t = useTranslations('SocialProof' as any) as (key: string) => string;

  const testimonials = [
    {
      name: t('testimonial1_name'),
      role: t('testimonial1_role'),
      content: t('testimonial1_content'),
      rating: 5,
    },
    {
      name: t('testimonial2_name'),
      role: t('testimonial2_role'),
      content: t('testimonial2_content'),
      rating: 5,
    },
    {
      name: t('testimonial3_name'),
      role: t('testimonial3_role'),
      content: t('testimonial3_content'),
      rating: 5,
    },
  ];

  const stats = [
    {
      value: 2847,
      suffix: '+',
      label: t('stat1_label'),
    },
    {
      value: 94,
      suffix: '%',
      label: t('stat2_label'),
    },
    {
      value: 4.9,
      suffix: '/5',
      label: t('stat3_label'),
    },
    {
      value: 15,
      suffix: 'min',
      label: t('stat4_label'),
    },
  ];

  return (
    <section className="border-t border-border/50 bg-gradient-to-b from-muted/30 to-background px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
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

        {/* Stats Grid - Premium animated counters */}
        <FadeIn delay={200}>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:gap-8">
            {stats.map((stat, _index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary sm:text-3xl lg:text-4xl">
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials Grid */}
        <StaggerChildren
          staggerDelay={150}
          className="mt-16 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {testimonials.map((testimonial, _index) => (
            <Card
              key={testimonial.name}
              className="group relative overflow-hidden border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative">
                {/* Quote icon */}
                <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="size-5 text-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Content */}
                <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  "
                  {testimonial.content}
                  "
                </blockquote>

                {/* Author */}
                <Avatar
                  name={testimonial.name}
                  role={testimonial.role}
                />
              </div>
            </Card>
          ))}
        </StaggerChildren>

        {/* Premium trust badges */}
        <FadeIn delay={600}>
          <div className="mt-16 text-center">
            <p className="mb-6 text-sm font-medium text-muted-foreground">
              {t('trust_title')}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:gap-8">
              {/* Placeholder trust badges - replace with real logos */}
              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-4 py-2">
                <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">SSL Secured</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-4 py-2">
                <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-medium">Privacy First</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-4 py-2">
                <svg className="size-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Fast Learning</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
