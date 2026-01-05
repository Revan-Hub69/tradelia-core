'use client';

import { useIntersectionObserver, useStaggeredInView } from '@/hooks/useIntersectionObserver';
import { useLanguage } from '@/components/LanguageSelector';
import { Section, Container, Card, Button, Badge, Grid, GradientText, Stats } from '@/components/UI-Enterprise';
import { 
  ShieldIcon, 
  AnalyticsIcon, 
  CheckIcon,
  ArrowRightIcon,
  VerifiedIcon,
  ChartIcon,
  LightningIcon,
  DiamondIcon
} from '@/components/Icons-Enterprise';

// Hero Section - Enterprise Level
export const HeroSection = () => {
  const { ref, isInView } = useIntersectionObserver({ threshold: 0.2 });
  const { locale } = useLanguage();

  return (
    <Section variant="hero" background="mesh" className="relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <Container size="lg" center>
        <div ref={ref} className="relative z-10">
          
          {/* Eyebrow */}
          <div className={`transition-all duration-600 ${isInView ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <Badge variant="glass" size="lg" className="mb-8">
              {locale === 'it' ? 'Verifica' : 'Verification'}
            </Badge>
          </div>

          {/* Hero Headline */}
          <div className={`transition-all duration-600 delay-200 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h1 className="text-hero mb-8 text-balance max-w-4xl mx-auto">
              {locale === 'it' 
                ? <>Verifica la <GradientText>coerenza</GradientText> tra obiettivo e strumento finanziario</>
                : <>Verify <GradientText>consistency</GradientText> between objective and financial instrument</>
              }
            </h1>
          </div>
          
          {/* Hero Description */}
          <div className={`transition-all duration-600 delay-400 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <p className="text-body-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
              {locale === 'it'
                ? 'Strumento di analisi basato su ricerca comportamentale accademica. Identifica incompatibilità comuni tra profilo di rischio e strumenti selezionati.'
                : 'Analysis tool based on academic behavioral research. Identifies common incompatibilities between risk profile and selected instruments.'
              }
            </p>
          </div>

          {/* CTA Button */}
          <div className={`transition-all duration-600 delay-600 ${isInView ? 'animate-scale-in' : 'opacity-0'}`}>
            <Button 
              href="/dashboard" 
              variant="primary"
              size="xl"
              className="mb-16 group"
            >
              {locale === 'it' ? 'Avvia verifica' : 'Start verification'}
              <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          {/* Trust Indicators */}
          <div className={`transition-all duration-600 delay-800 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Grid cols={3} gap="lg" className="max-w-4xl mx-auto">
              <Card variant="glass" className="text-center p-6">
                <VerifiedIcon size={32} className="mx-auto mb-4 text-primary" />
                <Stats 
                  value="100%" 
                  label={locale === 'it' ? 'Fonti verificate' : 'Verified sources'} 
                  description={locale === 'it' ? 'Ricerca accademica' : 'Academic research'}
                />
              </Card>
              
              <Card variant="glass" className="text-center p-6">
                <ShieldIcon size={32} className="mx-auto mb-4 text-primary" />
                <Stats 
                  value="0" 
                  label={locale === 'it' ? 'Dati inventati' : 'Invented data'} 
                  description={locale === 'it' ? 'Solo fatti verificabili' : 'Only verifiable facts'}
                />
              </Card>
              
              <Card variant="glass" className="text-center p-6">
                <AnalyticsIcon size={32} className="mx-auto mb-4 text-primary" />
                <Stats 
                  value="WCAG AAA" 
                  label={locale === 'it' ? 'Accessibilità' : 'Accessibility'} 
                  description={locale === 'it' ? 'Standard enterprise' : 'Enterprise standard'}
                />
              </Card>
            </Grid>
          </div>
        </div>
      </Container>
    </Section>
  );
};

// Context Section - Why this tool exists
export const ContextSection = () => {
  const { ref, isInView } = useIntersectionObserver();
  const { locale } = useLanguage();

  return (
    <Section variant="lg" background="muted">
      <Container size="md" center>
        <div ref={ref}>
          
          {/* Eyebrow */}
          <div className={`transition-all duration-600 ${isInView ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <p className="text-eyebrow text-muted-foreground mb-6">
              {locale === 'it' ? 'Contesto' : 'Context'}
            </p>
          </div>

          {/* Headline */}
          <div className={`transition-all duration-600 delay-200 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <h2 className="text-h2 mb-8 text-balance">
              {locale === 'it' 
                ? 'I portali di comparazione sono spesso remunerati tramite affiliazioni'
                : 'Comparison portals are often remunerated through affiliations'
              }
            </h2>
          </div>
          
          {/* Body */}
          <div className={`transition-all duration-600 delay-400 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-body-lg mb-6">
                {locale === 'it'
                  ? 'La ricerca comportamentale documenta sistematicamente incompatibilità tra obiettivi dichiarati e strumenti selezionati nel trading retail.'
                  : 'Behavioral research systematically documents incompatibilities between stated objectives and selected instruments in retail trading.'
                }
              </p>
              
              <p className="text-body mb-8">
                {locale === 'it'
                  ? 'Questo strumento applica parametri di verifica derivati da letteratura accademica peer-reviewed per identificare potenziali incoerenze.'
                  : 'This tool applies verification parameters derived from peer-reviewed academic literature to identify potential inconsistencies.'
                }
              </p>
            </div>
          </div>

          {/* Source Citation */}
          <div className={`transition-all duration-600 delay-600 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Card variant="glass" className="p-6">
              <div className="flex items-start gap-4">
                <CheckIcon size={20} className="text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-body-sm text-muted-foreground">
                    {locale === 'it'
                      ? 'Fonte: Barber, B. M., & Odean, T. (2000). Trading is hazardous to your wealth. Journal of Finance, 55(2), 773-806.'
                      : 'Source: Barber, B. M., & Odean, T. (2000). Trading is hazardous to your wealth. Journal of Finance, 55(2), 773-806.'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
// How It Works Section - 3 Steps Process
export const HowItWorksSection = () => {
  const { ref, visibleItems } = useStaggeredInView(3, 200);
  const { locale } = useLanguage();

  const steps = [
    {
      number: '01',
      title: locale === 'it' ? 'Input parametri' : 'Input parameters',
      description: locale === 'it' 
        ? 'Inserimento obiettivo di investimento, orizzonte temporale, tolleranza al rischio e capitale disponibile.'
        : 'Input investment objective, time horizon, risk tolerance and available capital.',
      icon: AnalyticsIcon
    },
    {
      number: '02', 
      title: locale === 'it' ? 'Analisi coerenza' : 'Consistency analysis',
      description: locale === 'it'
        ? 'Verifica automatica tramite algoritmi basati su ricerca comportamentale accademica.'
        : 'Automatic verification through algorithms based on academic behavioral research.',
      icon: ChartIcon
    },
    {
      number: '03',
      title: locale === 'it' ? 'Report risultati' : 'Results report', 
      description: locale === 'it'
        ? 'Generazione report con identificazione incompatibilità e riferimenti a fonti accademiche.'
        : 'Report generation with incompatibility identification and references to academic sources.',
      icon: LightningIcon
    }
  ];

  return (
    <Section variant="lg">
      <Container size="lg">
        <div ref={ref}>
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-eyebrow text-muted-foreground mb-6">
              {locale === 'it' ? 'Funzionamento' : 'How it works'}
            </p>
            
            <h2 className="text-h2 mb-8 text-balance">
              {locale === 'it' 
                ? 'Processo di verifica in tre fasi'
                : 'Three-phase verification process'
              }
            </h2>
            
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              {locale === 'it'
                ? 'Metodologia strutturata per identificare potenziali incompatibilità tra profilo e strumento finanziario.'
                : 'Structured methodology to identify potential incompatibilities between profile and financial instrument.'
              }
            </p>
          </div>

          {/* Steps Grid */}
          <Grid cols={3} gap="xl">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`transition-all duration-600 ${
                    visibleItems[index] ? 'animate-fade-in-up' : 'opacity-0'
                  }`}
                >
                  <Card variant="premium" interactive className="h-full group">
                    <div className="text-center">
                      {/* Step Number */}
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        {step.number}
                      </div>
                      
                      {/* Icon */}
                      <div className="mb-6">
                        <Icon size={48} className="mx-auto text-primary/60 group-hover:text-primary transition-colors duration-300" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-h4 mb-4">{step.title}</h3>
                      <p className="text-body text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Card>
                </div>
              );
            })}
          </Grid>
        </div>
      </Container>
    </Section>
  );
};
// Examples Section - Common incompatibilities
export const ExamplesSection = () => {
  const { ref, isInView } = useIntersectionObserver();
  const { locale } = useLanguage();

  const examples = [
    {
      scenario: locale === 'it' ? 'Obiettivo: Pensione (30 anni)' : 'Objective: Retirement (30 years)',
      instrument: locale === 'it' ? 'Strumento: Trading giornaliero' : 'Instrument: Day trading',
      issue: locale === 'it' ? 'Orizzonte temporale incompatibile' : 'Incompatible time horizon',
      status: 'error'
    },
    {
      scenario: locale === 'it' ? 'Capitale: €1.000' : 'Capital: €1,000', 
      instrument: locale === 'it' ? 'Strumento: Opzioni complesse' : 'Instrument: Complex options',
      issue: locale === 'it' ? 'Capitale insufficiente per diversificazione' : 'Insufficient capital for diversification',
      status: 'warning'
    },
    {
      scenario: locale === 'it' ? 'Tolleranza: Bassa volatilità' : 'Tolerance: Low volatility',
      instrument: locale === 'it' ? 'Strumento: Criptovalute leverage' : 'Instrument: Leveraged crypto',
      issue: locale === 'it' ? 'Profilo di rischio incoerente' : 'Inconsistent risk profile',
      status: 'error'
    }
  ];

  return (
    <Section variant="lg" background="muted">
      <Container size="lg">
        <div ref={ref}>
          
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-600 ${isInView ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <p className="text-eyebrow text-muted-foreground mb-6">
              {locale === 'it' ? 'Esempi' : 'Examples'}
            </p>
            
            <h2 className="text-h2 mb-8 text-balance">
              {locale === 'it' 
                ? 'Incompatibilità comuni identificate'
                : 'Common incompatibilities identified'
              }
            </h2>
            
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              {locale === 'it'
                ? 'Esempi di incoerenze frequentemente rilevate tra obiettivi dichiarati e strumenti selezionati.'
                : 'Examples of inconsistencies frequently detected between stated objectives and selected instruments.'
              }
            </p>
          </div>

          {/* Examples Grid */}
          <div className="space-y-6">
            {examples.map((example, index) => (
              <div
                key={index}
                className={`transition-all duration-600 delay-${(index + 2) * 200} ${
                  isInView ? 'animate-slide-in-left' : 'opacity-0'
                }`}
              >
                <Card 
                  variant={example.status === 'error' ? 'default' : 'default'} 
                  className="p-8 border-l-4 border-l-error/50"
                >
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    <div>
                      <Badge variant="default" size="sm" className="mb-3">
                        {locale === 'it' ? 'Scenario' : 'Scenario'}
                      </Badge>
                      <p className="text-body font-medium">{example.scenario}</p>
                    </div>
                    
                    <div>
                      <Badge variant="primary" size="sm" className="mb-3">
                        {locale === 'it' ? 'Strumento' : 'Instrument'}
                      </Badge>
                      <p className="text-body font-medium">{example.instrument}</p>
                    </div>
                    
                    <div>
                      <Badge variant="error" size="sm" className="mb-3">
                        {locale === 'it' ? 'Incompatibilità' : 'Incompatibility'}
                      </Badge>
                      <p className="text-body text-error font-medium">{example.issue}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className={`mt-12 transition-all duration-600 delay-800 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Card variant="glass" className="p-6">
              <div className="flex items-start gap-4">
                <DiamondIcon size={20} className="text-primary mt-1 shrink-0" />
                <p className="text-body-sm text-muted-foreground">
                  {locale === 'it'
                    ? 'Gli esempi sono basati su pattern documentati in letteratura accademica. Ogni situazione richiede analisi individuale.'
                    : 'Examples are based on patterns documented in academic literature. Each situation requires individual analysis.'
                  }
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
// Methodology Section - Sources and verification process
export const MethodologySection = () => {
  const { ref, isInView } = useIntersectionObserver();
  const { locale } = useLanguage();

  const sources = [
    {
      title: 'Barber & Odean (2000)',
      description: locale === 'it' ? 'Trading is Hazardous to Your Wealth' : 'Trading is Hazardous to Your Wealth',
      journal: 'Journal of Finance',
      impact: locale === 'it' ? 'Costi di transazione e overconfidence' : 'Transaction costs and overconfidence'
    },
    {
      title: 'Kahneman & Tversky (1979)', 
      description: locale === 'it' ? 'Prospect Theory' : 'Prospect Theory',
      journal: 'Econometrica',
      impact: locale === 'it' ? 'Avversione alle perdite e framing' : 'Loss aversion and framing'
    },
    {
      title: 'Thaler & Sunstein (2008)',
      description: locale === 'it' ? 'Nudge Theory' : 'Nudge Theory', 
      journal: 'Yale University Press',
      impact: locale === 'it' ? 'Architettura delle scelte' : 'Choice architecture'
    }
  ];

  return (
    <Section variant="lg">
      <Container size="lg">
        <div ref={ref}>
          
          {/* Section Header */}
          <div className={`text-center mb-16 transition-all duration-600 ${isInView ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <p className="text-eyebrow text-muted-foreground mb-6">
              {locale === 'it' ? 'Metodologia' : 'Methodology'}
            </p>
            
            <h2 className="text-h2 mb-8 text-balance">
              {locale === 'it' 
                ? 'Fonti accademiche e processo di verifica'
                : 'Academic sources and verification process'
              }
            </h2>
            
            <p className="text-body-lg text-muted-foreground max-w-3xl mx-auto">
              {locale === 'it'
                ? 'Parametri di verifica derivati esclusivamente da ricerca comportamentale peer-reviewed.'
                : 'Verification parameters derived exclusively from peer-reviewed behavioral research.'
              }
            </p>
          </div>

          {/* Sources Grid */}
          <Grid cols={3} gap="lg" className="mb-16">
            {sources.map((source, index) => (
              <div
                key={index}
                className={`transition-all duration-600 delay-${(index + 2) * 200} ${
                  isInView ? 'animate-fade-in-up' : 'opacity-0'
                }`}
              >
                <Card variant="elevated" className="h-full">
                  <div className="mb-4">
                    <Badge variant="primary" size="sm" className="mb-3">
                      {locale === 'it' ? 'Fonte accademica' : 'Academic source'}
                    </Badge>
                    <h3 className="text-h4 mb-2">{source.title}</h3>
                    <p className="text-body-sm text-primary font-medium mb-2">{source.description}</p>
                    <p className="text-body-sm text-muted-foreground mb-4">{source.journal}</p>
                  </div>
                  
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-body-sm text-muted-foreground">
                      <span className="font-medium">{locale === 'it' ? 'Applicazione:' : 'Application:'}</span> {source.impact}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </Grid>

          {/* Verification Parameters */}
          <div className={`transition-all duration-600 delay-800 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Card variant="premium" className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-h3 mb-4">
                  {locale === 'it' ? 'Parametri di verifica' : 'Verification parameters'}
                </h3>
                <p className="text-body text-muted-foreground">
                  {locale === 'it'
                    ? 'Criteri applicati per identificare potenziali incompatibilità'
                    : 'Criteria applied to identify potential incompatibilities'
                  }
                </p>
              </div>
              
              <Grid cols={2} gap="lg">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckIcon size={16} className="text-primary mt-1 shrink-0" />
                    <p className="text-body-sm text-muted-foreground">
                      {locale === 'it' ? 'Coerenza orizzonte temporale' : 'Time horizon consistency'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon size={16} className="text-primary mt-1 shrink-0" />
                    <p className="text-body-sm text-muted-foreground">
                      {locale === 'it' ? 'Adeguatezza capitale disponibile' : 'Available capital adequacy'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon size={16} className="text-primary mt-1 shrink-0" />
                    <p className="text-body-sm text-muted-foreground">
                      {locale === 'it' ? 'Compatibilità profilo di rischio' : 'Risk profile compatibility'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckIcon size={16} className="text-primary mt-1 shrink-0" />
                    <p className="text-body-sm text-muted-foreground">
                      {locale === 'it' ? 'Complessità strumento vs esperienza' : 'Instrument complexity vs experience'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon size={16} className="text-primary mt-1 shrink-0" />
                    <p className="text-body-sm text-muted-foreground">
                      {locale === 'it' ? 'Costi di transazione proporzionali' : 'Proportional transaction costs'}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon size={16} className="text-primary mt-1 shrink-0" />
                    <p className="text-body-sm text-muted-foreground">
                      {locale === 'it' ? 'Diversificazione possibile' : 'Possible diversification'}
                    </p>
                  </div>
                </div>
              </Grid>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};
// Limits Section - What we don't do (intellectual honesty)
export const LimitsSection = () => {
  const { ref, isInView } = useIntersectionObserver();
  const { locale } = useLanguage();

  const limitations = [
    {
      title: locale === 'it' ? 'Nessuna previsione di mercato' : 'No market predictions',
      description: locale === 'it' 
        ? 'Non forniamo previsioni sui prezzi o performance future degli strumenti finanziari.'
        : 'We do not provide predictions on prices or future performance of financial instruments.'
    },
    {
      title: locale === 'it' ? 'Nessun consiglio di investimento' : 'No investment advice',
      description: locale === 'it'
        ? 'Lo strumento identifica incompatibilità, non fornisce raccomandazioni specifiche di investimento.'
        : 'The tool identifies incompatibilities, does not provide specific investment recommendations.'
    },
    {
      title: locale === 'it' ? 'Nessuna garanzia di risultati' : 'No guarantee of results', 
      description: locale === 'it'
        ? 'La verifica di coerenza non garantisce performance positive degli investimenti.'
        : 'Consistency verification does not guarantee positive investment performance.'
    }
  ];

  return (
    <Section variant="lg" background="muted">
      <Container size="md" center>
        <div ref={ref}>
          
          {/* Section Header */}
          <div className={`mb-16 transition-all duration-600 ${isInView ? 'animate-fade-in-down' : 'opacity-0'}`}>
            <p className="text-eyebrow text-muted-foreground mb-6">
              {locale === 'it' ? 'Limiti' : 'Limitations'}
            </p>
            
            <h2 className="text-h2 mb-8 text-balance">
              {locale === 'it' 
                ? 'Cosa non facciamo'
                : 'What we do not do'
              }
            </h2>
            
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              {locale === 'it'
                ? 'Trasparenza sui limiti dello strumento per un utilizzo consapevole e appropriato.'
                : 'Transparency about tool limitations for conscious and appropriate use.'
              }
            </p>
          </div>

          {/* Limitations List */}
          <div className="space-y-6">
            {limitations.map((limit, index) => (
              <div
                key={index}
                className={`transition-all duration-600 delay-${(index + 2) * 200} ${
                  isInView ? 'animate-slide-in-right' : 'opacity-0'
                }`}
              >
                <Card variant="glass" className="p-8 text-left">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                      <span className="text-error font-bold text-lg">✕</span>
                    </div>
                    <div>
                      <h3 className="text-h4 mb-3">{limit.title}</h3>
                      <p className="text-body text-muted-foreground leading-relaxed">
                        {limit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Legal Disclaimer */}
          <div className={`mt-12 transition-all duration-600 delay-800 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <Card variant="default" className="p-6 border-warning/50">
              <div className="text-center">
                <Badge variant="warning" size="sm" className="mb-4">
                  {locale === 'it' ? 'Disclaimer' : 'Disclaimer'}
                </Badge>
                <p className="text-body-sm text-muted-foreground">
                  {locale === 'it'
                    ? 'Questo strumento ha finalità educative. Per decisioni di investimento consultare sempre un consulente finanziario qualificato.'
                    : 'This tool is for educational purposes. Always consult a qualified financial advisor for investment decisions.'
                  }
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};

// Final CTA Section - Discrete call to action
export const CTASection = () => {
  const { ref, isInView } = useIntersectionObserver();
  const { locale } = useLanguage();

  return (
    <Section variant="lg">
      <Container size="md" center>
        <div ref={ref}>
          
          {/* CTA Content */}
          <div className={`transition-all duration-600 ${isInView ? 'animate-scale-in' : 'opacity-0'}`}>
            <Card variant="premium" className="p-12 text-center">
              <div className="mb-8">
                <ShieldIcon size={48} className="mx-auto text-primary mb-6" />
                
                <h2 className="text-h2 mb-6 text-balance">
                  {locale === 'it' 
                    ? 'Verifica la coerenza del tuo strumento'
                    : 'Verify your instrument consistency'
                  }
                </h2>
                
                <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  {locale === 'it'
                    ? 'Analisi basata su ricerca accademica per identificare potenziali incompatibilità tra obiettivi e strumenti.'
                    : 'Analysis based on academic research to identify potential incompatibilities between objectives and instruments.'
                  }
                </p>
              </div>

              <Button 
                href="/dashboard" 
                variant="primary"
                size="xl"
                className="group"
              >
                {locale === 'it' ? 'Avvia verifica' : 'Start verification'}
                <ArrowRightIcon size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <p className="text-body-sm text-muted-foreground mt-6">
                {locale === 'it' ? 'Gratuito • Nessuna registrazione richiesta' : 'Free • No registration required'}
              </p>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
};