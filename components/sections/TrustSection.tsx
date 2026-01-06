'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function TrustSection() {
  const { trust } = useTranslations();

  return (
    <section 
      className="section-md bg-muted/30 fade-in-section section-separator-full"
      aria-labelledby="trust-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <header className="text-center mb-12">
          <h2 
            id="trust-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight tracking-tight mb-4"
          >
            {trust.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {trust.subtitle}
          </p>
        </header>
        
        <ul 
          className="flex flex-wrap justify-center gap-3"
          aria-label="Caratteristiche di trasparenza"
        >
          {trust.badges.map((badge, index) => (
            <li key={`trust-badge-${index}`}>
              <span className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                {badge}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}