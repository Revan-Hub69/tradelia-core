'use client';

import { 
  HeroSection, 
  ContextSection,
  HowItWorksSection,
  ExamplesSection,
  MethodologySection,
  LimitsSection,
  CTASection
} from '@/components/Sections-Enterprise';

export default function EnterpriseHomePage() {
  return (
    <>
      {/* Enhanced Structured Data for Enterprise */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Tradelia",
            "description": "Enterprise-grade financial consistency verification tool based on academic behavioral research",
            "url": "https://tradelia.com",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "browserRequirements": "Requires JavaScript. Optimized for modern browsers.",
            "softwareVersion": "2026.02",
            "datePublished": "2026-01-01",
            "dateModified": "2026-01-05",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "availability": "https://schema.org/InStock"
            },
            "creator": {
              "@type": "Organization",
              "name": "Tradelia",
              "url": "https://tradelia.com",
              "sameAs": [
                "https://twitter.com/tradelia",
                "https://linkedin.com/company/tradelia"
              ]
            },
            "featureList": [
              "Academic research-based verification",
              "Risk profile compatibility analysis", 
              "Time horizon consistency check",
              "Capital adequacy assessment",
              "Instrument complexity evaluation"
            ],
            "screenshot": "https://tradelia.com/images/dashboard-screenshot.png",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "127",
              "bestRating": "5",
              "worstRating": "1"
            }
          })
        }}
      />

      {/* Open Graph Meta Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Tradelia - Financial Consistency Verification",
            "description": "Verify consistency between your investment objectives and financial instruments using academic behavioral research",
            "url": "https://tradelia.com",
            "inLanguage": ["it-IT", "en-US"],
            "isPartOf": {
              "@type": "WebSite",
              "name": "Tradelia",
              "url": "https://tradelia.com"
            },
            "about": {
              "@type": "Thing",
              "name": "Financial Technology",
              "description": "Behavioral finance and investment consistency verification"
            },
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "Tradelia Verification Tool"
            }
          })
        }}
      />

      {/* Enterprise Homepage Architecture */}
      <main className="min-h-screen">
        <HeroSection />        {/* 1. Hero - Ultra premium with trust indicators */}
        <ContextSection />     {/* 2. Context - Academic foundation */}
        <HowItWorksSection />  {/* 3. Process - 3-step methodology */}
        <ExamplesSection />    {/* 4. Examples - Real incompatibilities */}
        <MethodologySection /> {/* 5. Sources - Academic credibility */}
        <LimitsSection />      {/* 6. Limits - Intellectual honesty */}
        <CTASection />         {/* 7. CTA - Final conversion point */}
      </main>
    </>
  );
}