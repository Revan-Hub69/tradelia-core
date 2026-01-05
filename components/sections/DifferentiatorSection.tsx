'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function DifferentiatorSection() {
  const { differentiator } = useTranslations();

  return (
    <section 
      className="section-md bg-foreground text-background fade-in-section"
      aria-labelledby="differentiator-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
        <h2 
          id="differentiator-title"
          className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 leading-tight tracking-tight"
        >
          {differentiator.title}
        </h2>
        <p className="text-sm sm:text-base text-background/80">
          {differentiator.subtitle}
        </p>
      </div>
    </section>
  );
}