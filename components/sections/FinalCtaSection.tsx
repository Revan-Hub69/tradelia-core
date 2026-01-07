'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardModal } from '@/contexts/DashboardModalContext';

export default function FinalCtaSection() {
  const { finalCta } = useTranslations();
  const { openModal } = useDashboardModal();

  return (
    <section 
      id="final-cta"
      className="section-md bg-background"
      aria-labelledby="final-cta-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="space-y-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Verifica
          </p>
          <h2 
            id="final-cta-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight"
            style={{ letterSpacing: '-0.01em' }}
          >
            {finalCta.title}
          </h2>
          
          <div className="space-y-4 pt-2">
            <button 
              onClick={() => openModal()}
              className="h-10 px-6 text-sm font-medium rounded bg-foreground text-background hover:bg-foreground/90 transition-colors duration-150 focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
              aria-label={finalCta.button}
            >
              {finalCta.button}
            </button>
            
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {finalCta.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}