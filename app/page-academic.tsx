'use client';

import { 
  AbstractSection,
  IntroductionSection,
  MethodologySection,
  ResultsSection,
  LimitationsSection,
  BibliographySection,
  VerificationSection
} from '@/components/Academic-Sections';

export default function AcademicHomePage() {
  return (
    <>
      {/* Academic Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ScholarlyArticle",
            "name": "Framework di Verifica della Coerenza tra Obiettivi di Investimento e Strumenti Finanziari",
            "headline": "Framework di Verifica della Coerenza tra Obiettivi di Investimento e Strumenti Finanziari",
            "description": "Framework di verifica basato su ricerca comportamentale accademica per identificare incompatibilità tra obiettivi di investimento e strumenti finanziari selezionati",
            "url": "https://tradelia.com",
            "datePublished": "2026-01-05",
            "dateModified": "2026-01-05",
            "author": {
              "@type": "Organization",
              "name": "Tradelia",
              "url": "https://tradelia.com"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Tradelia",
              "url": "https://tradelia.com"
            },
            "keywords": [
              "finanza comportamentale",
              "verifica coerenza",
              "trading retail", 
              "bias cognitivi",
              "strumenti finanziari",
              "ricerca accademica"
            ],
            "about": [
              {
                "@type": "Thing",
                "name": "Behavioral Finance"
              },
              {
                "@type": "Thing", 
                "name": "Investment Analysis"
              },
              {
                "@type": "Thing",
                "name": "Financial Instruments"
              }
            ],
            "citation": [
              {
                "@type": "ScholarlyArticle",
                "name": "Trading is hazardous to your wealth",
                "author": ["Brad M. Barber", "Terrance Odean"],
                "datePublished": "2000",
                "isPartOf": {
                  "@type": "Periodical",
                  "name": "Journal of Finance"
                }
              },
              {
                "@type": "ScholarlyArticle", 
                "name": "Prospect theory: An analysis of decision under risk",
                "author": ["Daniel Kahneman", "Amos Tversky"],
                "datePublished": "1979",
                "isPartOf": {
                  "@type": "Periodical",
                  "name": "Econometrica"
                }
              }
            ]
          })
        }}
      />

      {/* Academic Paper Structure */}
      <main className="min-h-screen no-animations">
        <AbstractSection />      {/* Abstract/Sommario */}
        <IntroductionSection />  {/* 1. Contesto e Razionale */}
        <MethodologySection />   {/* 2. Metodologia */}
        <ResultsSection />       {/* 3. Risultati/Esempi */}
        <LimitationsSection />   {/* 4. Limitazioni */}
        <BibliographySection />  {/* 5. Bibliografia */}
        <VerificationSection />  {/* Accesso Framework */}
      </main>
    </>
  );
}