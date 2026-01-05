'use client';

import { useTranslations } from '@/hooks/useTranslations';

export default function FinalCtaSection() {
  const { finalCta } = useTranslations();

  return (
    <section 
      className="section-md fade-in-section"
      aria-labelledby="final-cta-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="space-y-8">
          <h2 
            id="final-cta-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight tracking-tight"
          >
            {finalCta.title}
          </h2>
          
          <div className="space-y-4">
            <button 
              className="btn-tech"
              aria-label={`${finalCta.button} - Accesso finale alla dashboard`}
            >
              {finalCta.button}
            </button>
            
            <p className="text-xs text-muted-foreground">
              {finalCta.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}