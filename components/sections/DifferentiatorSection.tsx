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
        <div className="space-y-6">
          <h2 
            id="differentiator-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight tracking-tight"
          >
            {differentiator.title}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {differentiator.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}