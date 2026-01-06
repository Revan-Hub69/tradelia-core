'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from './LanguageSelector';
import { useDashboardModal } from '@/contexts/DashboardModalContext';
import Logo from './Logo';

export default function DashboardModal() {
  const { t } = useLanguage();
  const { isOpen, closeModal } = useDashboardModal();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  // Keyboard navigation and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
      
      // Tab trapping
      if (event.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
          
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Focus first element when modal opens
    setTimeout(() => {
      firstFocusableRef.current?.focus();
    }, 100);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-background border border-border/50 rounded-lg shadow-lg animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <Logo />
            <h2 
              id="modal-title"
              className="text-lg font-semibold text-foreground"
            >
              {t('modal.title')}
            </h2>
          </div>
          <button
            ref={firstFocusableRef}
            onClick={closeModal}
            className="p-2 text-muted-foreground hover:text-foreground transition-subtle rounded focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
            aria-label="Chiudi modale"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Educational Notice */}
          <div className="p-4 rounded border border-border/50 bg-muted/30">
            <p className="text-sm text-foreground/90 leading-relaxed">
              <strong className="text-foreground">{t('modal.educational.title')}:</strong> {t('modal.educational.description')}
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-foreground">
              {t('modal.steps.title')}
            </h3>
            
            <ol className="space-y-3">
              {Array.isArray(t('modal.steps.items')) 
                ? (t('modal.steps.items') as string[]).map((step: string, index: number) => (
                    <li key={`modal-step-${index}`} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))
                : null
              }
            </ol>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded border border-border/50 bg-background">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Disclaimer:</strong> {t('modal.disclaimer')}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border/30">
          <button
            onClick={closeModal}
            className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border/50 rounded transition-subtle focus:ring-2 focus:ring-primary/60 focus:ring-offset-2"
          >
            {t('modal.actions.cancel')}
          </button>
          <button
            onClick={() => {
              // TODO: Implement dashboard access logic
              console.log('Accessing dashboard...');
              closeModal();
            }}
            className="flex-1 btn-tech"
          >
            {t('modal.actions.continue')}
          </button>
        </div>
      </div>
    </div>
  );
}