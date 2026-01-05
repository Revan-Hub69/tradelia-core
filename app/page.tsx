'use client';

import { useFadeInObserver } from '@/hooks/useFadeInObserver';
import { useTranslations } from '@/hooks/useTranslations';
import HeroSection from '@/components/sections/HeroSection';
import ResearchSection from '@/components/sections/ResearchSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import DifferentiatorSection from '@/components/sections/DifferentiatorSection';
import TrustSection from '@/components/sections/TrustSection';
import FinalCtaSection from '@/components/sections/FinalCtaSection';

export default function HomePage() {
  const { hero } = useTranslations();
  
  // Hook per gestire le animazioni fade-in
  useFadeInObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });

  return (
    <>
      {/* SEO Meta - Dinamico basato su traduzioni */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tradelia",
            "description": hero.description,
            "url": "https://tradelia.com",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            }
          })
        }}
      />

      {/* Sezioni Modulari */}
      <HeroSection />
      <ResearchSection />
      <HowItWorksSection />
      <DifferentiatorSection />
      <TrustSection />
      <FinalCtaSection />
    </>
  );
}