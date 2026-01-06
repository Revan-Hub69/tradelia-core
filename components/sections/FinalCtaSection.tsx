'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { useDashboardModal } from '@/contexts/DashboardModalContext';

export default function FinalCtaSection() {
  const { finalCta } = useTranslations();
  const { openModal } = useDashboardModal();

  console.log('FinalCtaSection rendering:', finalCta);

  return (
    <section 
      className="section-md"
      aria-labelledby="final-cta-title"
      style={{ backgroundColor: 'red', minHeight: '200px' }}
    >
      <div className="max-w-2xl mx-auto px-6 sm:px-8">
        <div className="space-y-8">
          <h2 
            id="final-cta-title"
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground leading-tight tracking-tight"
          >
            {finalCta?.title || 'DEBUG: No title'}
          </h2>
          
          <div className="space-y-4">
            <button 
              onClick={openModal}
              className="btn-tech"
              aria-label={`${finalCta?.button || 'DEBUG'} - Accesso finale alla dashboard`}
            >
              {finalCta?.button || 'DEBUG: No button text'}
            </button>
            
            <p className="text-xs text-muted-foreground">
              {finalCta?.disclaimer || 'DEBUG: No disclaimer'}
            </p>
          </div>
          
          <p style={{ color: 'white', fontSize: '20px' }}>
            DEBUG: FinalCtaSection is rendering!
          </p>
        </div>
      </div>
    </section>
  );
}