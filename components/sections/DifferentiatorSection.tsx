'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function DifferentiatorSection() {
  const { differentiator } = useTranslations();

  return (
    <section 
      className="section-md fade-in-section bg-muted/30 border-y border-border/50"
      aria-labelledby="differentiator-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Limiti
          </p>
          <h2 
            id="differentiator-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight"
            style={{ letterSpacing: '-0.01em' }}
          >
            {differentiator.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {differentiator.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}