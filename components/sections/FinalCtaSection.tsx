'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import { TrustBadges } from '@/src/shared/ui/TrustBadges';
import { useEffect, useRef } from 'react';

export default function FinalCtaSection() {
  const { finalCta } = useTranslations();
  const { openModal } = useDashboardModal();
  const sectionRef = useRef<HTMLElement>(null);

  // Fallback per assicurare visibilità se l'observer non funziona
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Controlla se la sezione è già visibile
    if (section.classList.contains('visible')) return;

    // Fallback timer per l'ultima sezione
    const fallbackTimer = setTimeout(() => {
      if (!section.classList.contains('visible')) {
        section.classList.add('visible');
      }
    }, 1000);

    // Observer per rilevare quando la sezione entra nel viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
            clearTimeout(fallbackTimer);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <section 
      id="final-cta"
      ref={sectionRef}
      className="section-md fade-in-section bg-background"
      aria-labelledby="final-cta-title"
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="space-y-8 text-center relative">
          <h2 
            id="final-cta-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight tracking-tight"
          >
            {finalCta.title}
          </h2>
          
          <div className="space-y-6">
            <button 
              onClick={() => openModal()}
              className="btn-tech"
              aria-label={finalCta.button}
            >
              {finalCta.button}
            </button>
            
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              {finalCta.disclaimer}
            </p>

            {/* TrustBadges completamente fissi */}
            <div className="trust-badges-container">
              <div className="trust-badges-fixed trust-badges-static trust-badge-no-select">
                <TrustBadges 
                  variant="detailed" 
                  placement="footer" 
                  showTooltips={true}
                  animated={false}
                  className="trust-badge-no-select"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}