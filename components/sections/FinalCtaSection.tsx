'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import { useEffect, useRef } from 'react';

export default function FinalCtaSection() {
  const { finalCta } = useTranslations();
  const { openModal } = useDashboardModal();
  const sectionRef = useRef<HTMLElement>(null);

  // Force visibility after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.classList.add('visible');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={sectionRef}
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
              onClick={openModal}
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