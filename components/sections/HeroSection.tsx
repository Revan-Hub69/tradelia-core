'use client';

import { useTranslations } from '@/hooks/useTranslations';
import DashboardModal from '../DashboardModal';
import { useDashboardModal } from '@/hooks/useDashboardModal';

const DELAY_CLASSES = ['', 'delay-100', 'delay-200'] as const;

export default function HeroSection() {
  const { hero } = useTranslations();
  const { isOpen, openModal, closeModal } = useDashboardModal();

  return (
    <>
      <section 
        className="relative section-md sm:section-lg overflow-hidden pattern-geo"
        aria-labelledby="hero-title"
      >
        <div className="max-w-2xl mx-auto px-6 sm:px-8">
          <div className="space-y-6 sm:space-y-8 animate-fade-up">
            <div className="space-y-4 sm:space-y-6">
              {/* Overlay solo dietro i testi */}
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-white/80 rounded-lg -m-3 p-3"
                  aria-hidden="true"
                />
                <h1 
                  id="hero-title"
                  className="relative text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight"
                >
                  {hero.title}{" "}
                  <span className="relative">
                    {hero.titleHighlight}
                    <div 
                      className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/60 to-primary/30 rounded-full"
                      aria-hidden="true"
                    />
                  </span>
                </h1>
                
                <p className="relative text-base sm:text-lg text-foreground leading-relaxed font-medium mt-4">
                  {hero.description}
                </p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <button 
                onClick={openModal}
                className="btn-tech"
                aria-label={`${hero.cta} - Accesso alla dashboard educativa`}
              >
                {hero.cta}
              </button>
              
              <ul 
                className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-1 sm:gap-y-2 text-xs text-muted-foreground"
                aria-label="Caratteristiche principali"
              >
                {hero.features.map((feature, index) => (
                  <li key={`hero-feature-${index}`} className="flex items-center gap-2">
                    <div 
                      className={`w-1.5 h-1.5 bg-primary/70 rounded-full pulse-tech ${DELAY_CLASSES[index] || ''}`}
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Modal */}
      <DashboardModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}