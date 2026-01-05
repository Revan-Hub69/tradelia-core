'use client';

import { 
  HeroSection, 
  ProblemSection, 
  TechnologySection,
  SocialProofSection,
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
            "description": "AI-powered dashboard that prevents crypto trading mistakes using behavioral research",
            "url": "https://tradelia.com",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "50247"
            },
            "creator": {
              "@type": "Organization",
              "name": "Tradelia"
            }
          })
        }}
      />

      <HeroSection />
      <ProblemSection />
      <TechnologySection />
      <SocialProofSection />
      <CTASection />
      <FooterSection />
    </>
  );
}