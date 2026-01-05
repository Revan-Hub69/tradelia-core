'use client';

import { useInView } from '@/hooks/useAnimations';
import { useLanguage } from '@/components/LanguageSelector';
import { Section, Container, Card, Button } from '@/components/UI';
import { 
  CheckIcon, 
  AlertIcon, 
  ShieldIcon, 
  BarChartIcon, 
  LightbulbIcon,
  RocketIcon,
  TargetIcon,
  ClockIcon,
  LockIcon,
  FileTextIcon
} from '@/components/Icons';

// 1. Hero Section - Statement chiaro per principianti
export const HeroSection = () => {
  const { ref, isInView } = useInView();
  const { t } = useLanguage();

  return (
    <Section variant="lg">
      <Container size="md" center>
        <div ref={ref} className={`transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="headline-1 mb-6">
            {t('hero.title')}
          </h1>
          
          <p className="text-lg sm:text-xl mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {t('hero.subtitle')}
          </p>
          <p className="text-lg sm:text-xl font-semibold mb-8" style={{ color: 'hsl(var(--foreground))' }}>
            {t('hero.subtitleBold')}
          </p>

          <p className="body-text mb-8 max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          <Card className="mb-8 max-w-2xl mx-auto">
            <ul className="space-y-3">
              {Array.isArray(t('hero.features')) ? (t('hero.features') as string[]).map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 flex-shrink-0" style={{ color: 'hsl(120 60% 50%)' }} />
                  <span className="body-text">{feature}</span>
                </li>
              )) : null}
            </ul>
          </Card>

          <Button href="/dashboard" size="lg" className="mb-6">
            {t('hero.cta')}
          </Button>

          <p className="small-text">
            {t('hero.disclaimer')}
          </p>
        </div>
      </Container>
    </Section>
  );
};

// 2. Context Section - Perché esistiamo (errori dei principianti)
export const ContextSection = () => {
  const { ref, isInView } = useInView();
  const { t } = useLanguage();

  return (
    <Section variant="md" background="muted">
      <Container size="md" center>
        <div ref={ref}>
          <p className="eyebrow-text mb-4">Contesto</p>
          <h2 className={`headline-2 mb-6 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t('problem.title')}<br />
            <span style={{ color: 'hsl(var(--primary))' }}>{t('problem.titleSecond')}</span>
          </h2>
          
          <p className="body-text mb-8 max-w-2xl mx-auto">
            {t('problem.description')}:
          </p>

          <div className="grid gap-4 mb-8 max-w-2xl mx-auto">
            {Array.isArray(t('problem.errors')) ? (t('problem.errors') as string[]).map((error, index) => (
              <Card 
                key={index}
                className={`transition-all duration-500 ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <AlertIcon className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'hsl(45 60% 50%)' }} />
                  <span className="body-text">{error}</span>
                </div>
              </Card>
            )) : null}
          </div>

          <Card>
            <p className="headline-3 mb-2 text-center">
              {t('problem.conclusion')}<br />
              <span style={{ color: 'hsl(var(--primary))' }}>{t('problem.conclusionSecond')}</span>
            </p>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

// 3. How It Works Section - 3 step del processo
export const HowItWorksSection = () => {
  const { ref, isInView } = useInView();
  const { locale } = useLanguage();

  const steps = {
    it: [
      {
        number: "01",
        title: "Definisci il tuo profilo",
        description: "Questionario guidato per identificare obiettivi, orizzonte temporale e tolleranza al rischio basato su framework accademici."
      },
      {
        number: "02", 
        title: "Analisi di coerenza",
        description: "Il sistema confronta il tuo profilo con le caratteristiche degli strumenti crypto per identificare incompatibilità."
      },
      {
        number: "03",
        title: "Dashboard personalizzata",
        description: "Ricevi analisi continue e alert per mantenere coerenza tra obiettivi e strumenti nel tempo."
      }
    ],
    en: [
      {
        number: "01",
        title: "Define your profile",
        description: "Guided questionnaire to identify objectives, time horizon and risk tolerance based on academic frameworks."
      },
      {
        number: "02", 
        title: "Coherence analysis",
        description: "The system compares your profile with crypto tool characteristics to identify incompatibilities."
      },
      {
        number: "03",
        title: "Personalized dashboard",
        description: "Receive continuous analysis and alerts to maintain coherence between objectives and tools over time."
      }
    ]
  };

  return (
    <Section variant="lg">
      <Container size="md" center>
        <div ref={ref}>
          <p className="eyebrow-text mb-4">Processo</p>
          <h2 className={`headline-2 mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Come funziona l'analisi di coerenza
          </h2>
          
          <div className="space-y-8">
            {steps[locale].map((step, index) => (
              <Card 
                key={index}
                interactive
                className={`transition-all duration-700 ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="flex items-start gap-4">
                  <span className="eyebrow-text px-2 py-1 rounded" style={{ backgroundColor: 'hsl(var(--muted))' }}>
                    {step.number}
                  </span>
                  <div>
                    <h3 className="headline-3 mb-2">{step.title}</h3>
                    <p className="body-text">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

// 4. Examples Section - Pattern di errore documentati
export const ExamplesSection = () => {
  const { ref, isInView } = useInView();
  const { t } = useLanguage();

  return (
    <Section variant="md" background="muted">
      <Container size="md" center>
        <div ref={ref}>
          <p className="eyebrow-text mb-4">Esempi</p>
          <h2 className={`headline-2 mb-6 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {t('evidence.title')}
          </h2>
          <p className="body-text mb-8 max-w-2xl mx-auto">
            {t('evidence.subtitle')}.
          </p>

          {/* Statistica ESMA */}
          <Card className="mb-8">
            <h3 className="headline-3 mb-4 text-center">{t('statistics.title')}</h3>
            <p className="body-text mb-6 text-center">
              {t('statistics.description')} (CFD e strumenti analoghi).
            </p>
            
            <Card variant="error" className="mb-6 text-center">
              <p className="headline-1 mb-2" style={{color: 'hsl(0 60% 50%)'}}>
                {t('statistics.percentage')}
              </p>
              <p className="headline-3 mb-2" style={{color: 'hsl(0 60% 40%)'}}>
                {t('statistics.result')}
              </p>
              <p className="small-text">{t('statistics.source')}</p>
            </Card>
            
            <div className="space-y-3 max-w-xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckIcon className="w-4 h-4" style={{color: 'hsl(120 60% 50%)'}} />
                <span className="body-text">Questo non significa "mai usarli"</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertIcon className="w-4 h-4" style={{color: 'hsl(45 60% 50%)'}} />
                <span className="body-text">Significa che se l'obiettivo è sbagliato, le probabilità peggiorano</span>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

// 5. Methodology Section - Ricerche accademiche
export const MethodologySection = () => {
  const { ref, isInView } = useInView();
  const { locale } = useLanguage();

  const sources = [
    {
      authors: "Kahneman & Tversky",
      work: "Prospect Theory",
      relevance: locale === 'it' ? "Bias cognitivi nelle decisioni finanziarie" : "Cognitive biases in financial decisions"
    },
    {
      authors: "Barber & Odean", 
      work: "Trading Is Hazardous to Your Wealth",
      relevance: locale === 'it' ? "Overconfidence e overtrading nei mercati" : "Overconfidence and overtrading in markets"
    },
    {
      authors: "ESMA",
      work: "CFD Retail Investor Reports",
      relevance: locale === 'it' ? "Perdite sistematiche nei prodotti a leva" : "Systematic losses in leveraged products"
    },
    {
      authors: "Thaler & Sunstein",
      work: "Nudge Theory",
      relevance: locale === 'it' ? "Architettura delle scelte finanziarie" : "Financial choice architecture"
    }
  ];

  return (
    <Section variant="lg" id="metodologia">
      <Container size="md" center>
        <div ref={ref}>
          <p className="eyebrow-text mb-4">Metodologia</p>
          <h2 className={`headline-2 mb-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {locale === 'it' ? 'Ricerche accademiche di riferimento' : 'Academic research references'}
          </h2>
          
          <Card className="mb-8">
            <p className="body-text mb-6">
              {locale === 'it' 
                ? 'L\'analisi si basa su decenni di ricerca in finanza comportamentale e sui report dei regolatori finanziari europei.'
                : 'The analysis is based on decades of behavioral finance research and European financial regulators\' reports.'
              }
            </p>
            
            <h3 className="headline-3 mb-4">
              {locale === 'it' ? 'Fonti principali' : 'Main sources'}
            </h3>
            
            <div className="space-y-4">
              {sources.map((source, index) => (
                <div 
                  key={index}
                  className={`transition-all duration-500 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'hsl(var(--foreground) / 0.3)' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                        {source.authors} - {source.work}
                      </p>
                      <p className="small-text">{source.relevance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          <p className="small-text text-center">
            {locale === 'it' 
              ? 'Tutte le fonti sono pubblicamente verificabili e peer-reviewed.'
              : 'All sources are publicly verifiable and peer-reviewed.'
            }
          </p>
        </div>
      </Container>
    </Section>
  );
};

// 6. Limits Section - Onestà intellettuale
export const LimitsSection = () => {
  const { ref, isInView } = useInView();
  const { locale } = useLanguage();

  const limits = {
    it: [
      "Non fornisce consigli di investimento personalizzati",
      "Non predice performance future degli asset",
      "Non sostituisce consulenza finanziaria professionale", 
      "Non garantisce risultati di investimento"
    ],
    en: [
      "Does not provide personalized investment advice",
      "Does not predict future asset performance",
      "Does not replace professional financial advice",
      "Does not guarantee investment results"
    ]
  };

  return (
    <Section variant="md" background="muted">
      <Container size="md" center>
        <div ref={ref}>
          <p className="eyebrow-text mb-4">Limiti</p>
          <h2 className={`headline-2 mb-8 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {locale === 'it' ? 'Cosa non facciamo' : 'What we don\'t do'}
          </h2>
          
          <Card>
            <p className="body-text mb-6">
              {locale === 'it' 
                ? 'Tradelia è uno strumento educativo per l\'analisi di coerenza. È importante comprendere i suoi limiti operativi.'
                : 'Tradelia is an educational tool for coherence analysis. It\'s important to understand its operational limits.'
              }
            </p>
            
            <ul className="space-y-3">
              {limits[locale].map((limit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: 'hsl(var(--foreground) / 0.3)' }} />
                  <span className="body-text">{limit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

// 7. CTA Section - Call to action discreto
export const CTASection = () => {
  const { ref, isInView } = useInView();
  const { t } = useLanguage();

  return (
    <Section variant="md">
      <Container size="md" center>
        <div ref={ref}>
          <Card className={`text-center transition-all duration-700 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <h2 className="headline-2 mb-4">
              {t('cta.title')}
            </h2>
            <p className="body-text mb-6">
              {t('cta.disclaimer')}
            </p>
            <Button href="/dashboard" size="lg" className="mb-4">
              {t('cta.button')}
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {Array.isArray(t('cta.benefits')) ? (t('cta.benefits') as string[]).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4" style={{ color: 'hsl(120 60% 50%)' }} />
                  <span>{benefit}</span>
                </div>
              )) : null}
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  );
};

// 8. Footer Section - Disclaimer legale
export const FooterSection = () => {
  const { t } = useLanguage();

  return (
    <Section variant="sm" background="muted">
      <Container size="md" center>
        <div className="text-center">
          <FileTextIcon className="w-6 h-6 mx-auto mb-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          <h3 className="headline-3 mb-4">{t('disclaimer.title')}</h3>
          <p className="small-text">
            {t('disclaimer.text')}
          </p>
        </div>
      </Container>
    </Section>
  );
};