'use client';

import { 
  HeroSection, 
  ContextSection,
  HowItWorksSection,
  ExamplesSection,
  MethodologySection,
  LimitsSection,
  CTASection, 
  FooterSection 
} from '@/components/Sections';

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Tradelia",
            "description": "Financial consistency verification tool based on academic research",
            "url": "https://tradelia.com",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "creator": {
              "@type": "Organization",
              "name": "Tradelia"
            }
          })
        }}
      />

      {/* Architettura Homepage secondo Design Guide 2026 */}
      <HeroSection />        {/* 1. Hero - Statement chiaro, CTA discreta */}
      <ContextSection />     {/* 2. Contesto - Perché esiste questo strumento */}
      <HowItWorksSection />  {/* 3. Funzionamento - Come funziona (3 step) */}
      <ExamplesSection />    {/* 4. Esempi - Incompatibilità comuni */}
      <MethodologySection /> {/* 5. Metodologia - Fonti e processo */}
      <LimitsSection />      {/* 6. Limiti - Cosa non facciamo */}
      <CTASection />         {/* 7. CTA - Call to action discreto */}
      <FooterSection />      {/* 8. Footer - Disclaimer legale */}
    </>
  );
}