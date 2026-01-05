'use client';

import { useLanguage } from '@/components/LanguageSelector';
import { HeroSection, ProblemSection, EvidenceSection, CTASection } from '@/components/Sections';
import { Section, Container, Card } from '@/components/UI';
import { CheckIcon, AlertIcon, FileTextIcon } from '@/components/Icons';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Tradelia",
            "description": "Dashboard anti-errori crypto",
            "url": "https://tradelia.com",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            }
          })
        }}
      />

      <HeroSection 
        title={t('hero.title')}
        subtitle={t('hero.subtitle')}
        subtitleBold={t('hero.subtitleBold')}
      />

      <ProblemSection />

      <EvidenceSection />

      {/* Statistics Section */}
      <Section className="bg-gray-50">
        <Container size="md" center>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
            Un dato per orientarsi
          </h2>
          
          <Card className="shadow-sm">
            <p className="text-xl text-gray-800 mb-8 leading-relaxed">
              I regolatori europei riportano che la maggioranza dei clienti retail
              <strong className="text-red-600"> perde denaro</strong> quando utilizza strumenti speculativi a leva
              (CFD e strumenti analoghi).
            </p>
            
            <Card variant="error" className="mb-8">
              <p className="text-5xl font-black text-red-600 mb-2">70-80%</p>
              <p className="text-red-800 font-bold text-xl">dei clienti retail finisce in perdita</p>
              <p className="text-red-700 text-sm mt-2">Fonte: Report ESMA su CFD e prodotti derivati</p>
            </Card>
            
            <div className="text-left space-y-4 max-w-2xl mx-auto">
              <p className="text-lg text-gray-800 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-green-600" />
                Questo non significa <strong>"mai usarli"</strong>
              </p>
              <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertIcon className="w-5 h-5 text-amber-600" />
                Significa che <strong>se l'obiettivo è sbagliato, le probabilità peggiorano</strong>
              </p>
            </div>
          </Card>
        </Container>
      </Section>

      {/* What Tradelia Does */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Cosa fa Tradelia
            </h2>
            <p className="text-2xl text-gray-800">
              Tradelia <strong className="text-red-600">non fornisce consigli di investimento</strong><br />
              e <strong className="text-red-600">non suggerisce operazioni</strong>.
            </p>
          </div>
          
          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              La dashboard fornisce analisi:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                { text: 'Il percorso coerente con ciò che vuoi fare', icon: 'target' },
                { text: 'Strumenti crypto adatti al tuo profilo', icon: 'tool' },
                { text: 'Analisi di coerenza obiettivo-strumento', icon: 'alert' },
                { text: 'Monitoraggio continuo anti-errore', icon: 'shield' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-lg text-gray-800 font-medium pt-2">{item.text}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-xl font-bold text-gray-900">
                Nient'altro. Zero overload informativo.
              </p>
            </div>
          </Card>
        </Container>
      </Section>

      <CTASection />

      {/* Disclaimer */}
      <Section className="py-12 bg-gray-100">
        <Container size="md" center>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <FileTextIcon className="w-6 h-6" />
            Nota metodologica
          </h3>
          <p className="text-gray-700">
            Tradelia è uno strumento educativo.
            Non fornisce raccomandazioni personalizzate
            e non sostituisce consulenza finanziaria professionale.
          </p>
        </Container>
      </Section>
    </>
  );
}