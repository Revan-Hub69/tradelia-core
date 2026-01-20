'use client';

import React from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';

export const CryptoLesson0Real: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);

  // Guided step-by-step flow - EXACTLY like Tradelia onboarding
  const steps = [
    {
      id: 'intro',
      title: 'Cosa sono le Criptovalute',
      subtitle: 'Scopriamo insieme questo mondo, passo dopo passo',
    },
    {
      id: 'analogical',
      title: 'Come un Registro Bancario',
      subtitle: 'Iniziamo con qualcosa di familiare',
    },
    {
      id: 'procedural',
      title: 'Come Funziona in Pratica',
      subtitle: 'Vediamo una transazione dal vivo',
    },
    {
      id: 'conceptual',
      title: 'La Definizione Tecnica',
      subtitle: 'Ora che hai le basi, approfondiamo',
    },
    {
      id: 'quiz',
      title: 'Verifica la Comprensione',
      subtitle: 'Tre domande per consolidare',
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderIntroStep = () => (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <SlideReveal>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Cosa sono le Criptovalute
          </h1>
        </SlideReveal>

        <FadeIn delay={200}>
          <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
            Una guida pratica e onesta. Niente fuffa, solo quello che serve davvero.
          </p>
        </FadeIn>
      </div>

      {/* Value indicators - EXACTLY like Tradelia onboarding */}
      <FadeIn delay={400}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-center">
            <div className="mx-auto mb-2 size-12 rounded-lg bg-blue-100 p-2">
              <svg className="size-full text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-blue-900">Facile da capire</h3>
            <p className="text-sm text-blue-700">Partiamo dalle basi</p>
          </div>

          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center">
            <div className="mx-auto mb-2 size-12 rounded-lg bg-green-100 p-2">
              <svg className="size-full text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-green-900">Informazioni sicure</h3>
            <p className="text-sm text-green-700">Ti aiutiamo a non sbagliare</p>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-center">
            <div className="mx-auto mb-2 size-12 rounded-lg bg-purple-100 p-2">
              <svg className="size-full text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-purple-900">Solo 5 minuti</h3>
            <p className="text-sm text-purple-700">Veloce e al punto</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={600}>
        <Card className="border-primary/20 bg-primary/5 p-6">
          <h3 className="mb-4 text-center text-lg font-semibold">Cosa scoprirai:</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 p-1.5">
                <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Cos'è davvero una criptovaluta</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 p-1.5">
                <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Come funziona una transazione</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 p-1.5">
                <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">Perché è diverso dalle banche</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 p-1.5">
                <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium">I rischi da evitare</span>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );

  const renderAnalogicalStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Come un Registro Bancario
          </h2>
        </SlideReveal>
        <FadeIn delay={200}>
          <p className="mt-3 text-muted-foreground">
            Iniziamo con qualcosa che conosci già
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-lg leading-relaxed">
              <span className="float-left mr-3 text-5xl font-bold text-primary">I</span>
              <span>
                magina di entrare in una banca molto speciale. Non c'è un direttore, non ci sono cassieri,
                ma migliaia di persone in tutto il mondo tengono una copia identica dello stesso registro dei conti.
              </span>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-3 font-semibold text-blue-900">Come funziona:</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-blue-500"></div>
                  <span>
                    <strong>Registro tradizionale</strong>
                    {' '}
                    → Blockchain (catena di blocchi)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-blue-500"></div>
                  <span>
                    <strong>Pagine del registro</strong>
                    {' '}
                    → Blocchi di transazioni
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-blue-500"></div>
                  <span>
                    <strong>Contabili</strong>
                    {' '}
                    → Computer della rete
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-blue-500"></div>
                  <span>
                    <strong>Approvazione unanime</strong>
                    {' '}
                    → Consenso distribuito
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 size-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-amber-900">Importante da sapere:</h4>
                  <p className="mt-1 text-sm text-amber-800">
                    A differenza di un registro fisico, la blockchain funziona 24/7 in tutto il mondo
                    e può crescere infinitamente. Inoltre garantisce privacy (pseudonimato) invece di trasparenza completa.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <h4 className="mb-3 font-semibold text-green-900">Punti chiave:</h4>
              <div className="space-y-2">
                {[
                  'Nessuna autorità centrale controlla il sistema',
                  'La sicurezza deriva dalla verifica collettiva',
                  'Una volta registrata, una transazione è praticamente immutabile',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <svg className="mt-0.5 size-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-green-800">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );

  const renderProceduralStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Come Funziona in Pratica
          </h2>
        </SlideReveal>
        <FadeIn delay={200}>
          <p className="mt-3 text-muted-foreground">
            Seguiamo Alice che manda Bitcoin a Bob
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-lg leading-relaxed">
              <span className="float-left mr-3 text-5xl font-bold text-primary">S</span>
              <span>
                eguiamo passo dopo passo cosa succede quando Alice decide di inviare 1 Bitcoin a Bob.
                Ogni passaggio è verificabile e trasparente.
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  number: 1,
                  title: 'Alice crea la transazione',
                  description: 'Apre il wallet, inserisce l\'indirizzo di Bob e l\'importo da inviare',
                  checkpoint: 'Il sistema verifica che Alice abbia fondi sufficienti',
                },
                {
                  number: 2,
                  title: 'Alice firma digitalmente',
                  description: 'Usa la sua chiave privata segreta per autorizzare il trasferimento',
                  checkpoint: 'La firma prova matematicamente che è davvero Alice',
                },
                {
                  number: 3,
                  title: 'Trasmissione alla rete',
                  description: 'La transazione viene inviata a migliaia di computer nel mondo',
                  checkpoint: 'Ogni nodo riceve e inizia la verifica',
                },
                {
                  number: 4,
                  title: 'Validazione distribuita',
                  description: 'Ogni computer verifica indipendentemente che tutto sia corretto',
                  checkpoint: 'Controlli matematici su firma, fondi e regole',
                },
                {
                  number: 5,
                  title: 'Inclusione nel blocco',
                  description: 'I miner competono per includere la transazione nel prossimo blocco',
                  checkpoint: 'Transazione diventa parte permanente della blockchain',
                },
                {
                  number: 6,
                  title: 'Bob riceve i Bitcoin',
                  description: 'La transazione è completata e Bob può usare i fondi',
                  checkpoint: 'Processo completato in 10-60 minuti',
                },
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-sm font-bold text-white">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{step.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                    <div className="mt-2 text-xs font-medium text-green-600">
                      ✓
                      {' '}
                      {step.checkpoint}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 size-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h4 className="font-semibold text-green-900">Risultato:</h4>
                  <p className="mt-1 text-sm text-green-800">
                    Alice ha trasferito valore a Bob senza banche, governi o intermediari.
                    La sicurezza deriva dalla
                    {' '}
                    <strong>matematica e dal consenso distribuito</strong>
                    , non dalla fiducia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );

  const renderConceptualStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            La Definizione Tecnica
          </h2>
        </SlideReveal>
        <FadeIn delay={200}>
          <p className="mt-3 text-muted-foreground">
            Ora che hai le basi, approfondiamo
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-lg leading-relaxed">
              <span className="float-left mr-3 text-5xl font-bold text-primary">U</span>
              <span>
                na criptovaluta è un
                <strong>asset digitale programmabile</strong>
                {' '}
                che utilizza
                la crittografia per garantire transazioni sicure, operando su una rete distribuita senza autorità centrale.
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <div className="size-2 rounded-full bg-primary"></div>
                  Componenti Fondamentali
                </h4>
                <div className="space-y-3">
                  {[
                    'Crittografia asimmetrica (chiavi pubbliche/private)',
                    'Funzioni hash crittografiche (SHA-256)',
                    'Algoritmi di consenso (Proof of Work, Proof of Stake)',
                    'Strutture dati Merkle Tree',
                    'Rete peer-to-peer distribuita',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <div className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-4 flex items-center gap-2 text-lg font-bold">
                  <div className="size-2 rounded-full bg-accent"></div>
                  Proprietà Emergenti
                </h4>
                <div className="space-y-3">
                  {[
                    { title: 'Decentralizzazione', desc: 'Nessun single point of failure' },
                    { title: 'Immutabilità', desc: 'Resistenza alle modifiche retroattive' },
                    { title: 'Trasparenza', desc: 'Tutte le transazioni verificabili' },
                    { title: 'Pseudonimato', desc: 'Privacy con trasparenza selettiva' },
                  ].map((item, i) => (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-foreground">{item.title}</div>
                      <div className="text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <h4 className="mb-3 font-semibold text-purple-900">Implicazioni Sistemiche:</h4>
              <div className="grid gap-2 text-sm text-purple-800 sm:grid-cols-2">
                <div>
                  <strong>Trade-off:</strong>
                  {' '}
                  Decentralizzazione vs Efficienza
                </div>
                <div>
                  <strong>Sicurezza:</strong>
                  {' '}
                  Crittografia vs Gestione chiavi
                </div>
                <div>
                  <strong>Scalabilità:</strong>
                  {' '}
                  Throughput vs Decentralizzazione
                </div>
                <div>
                  <strong>Governance:</strong>
                  {' '}
                  Immutabilità vs Correzione errori
                </div>
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );

  const renderQuizStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Verifica la Comprensione
          </h2>
        </SlideReveal>
        <FadeIn delay={200}>
          <p className="mt-3 text-muted-foreground">
            Tre domande veloci per consolidare quello che hai imparato
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-primary/20 bg-primary/5 p-6">
          <div className="text-center">
            <div className="mx-auto mb-4 size-16 rounded-full bg-gradient-to-br from-primary to-accent p-4">
              <svg className="size-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold">Complimenti!</h3>
            <p className="mb-4 text-muted-foreground">
              Hai completato la lezione base sulle criptovalute.
              Ora sai cos'è una blockchain, come funziona una transazione e quali sono i concetti fondamentali.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg className="size-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                +50 punti guadagnati
              </div>
              <div className="flex items-center gap-1">
                <svg className="size-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                5 minuti completati
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );

  const renderCurrentStep = () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData) {
      return renderIntroStep();
    }

    const stepId = currentStepData.id;

    switch (stepId) {
      case 'intro':
        return renderIntroStep();
      case 'analogical':
        return renderAnalogicalStep();
      case 'procedural':
        return renderProceduralStep();
      case 'conceptual':
        return renderConceptualStep();
      case 'quiz':
        return renderQuizStep();
      default:
        return renderIntroStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Progress Header - EXACTLY like Tradelia onboarding */}
      <div className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Back button */}
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Indietro
              </button>
            )}

            {/* Progress info */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Passo
                {' '}
                {currentStep + 1}
                {' '}
                di
                {' '}
                {steps.length}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8 pt-24 sm:px-6 sm:pb-12">
        <div className="mx-auto max-w-4xl">
          {renderCurrentStep()}

          {/* Navigation - EXACTLY like Tradelia onboarding */}
          <div className="mt-8 text-center">
            {currentStep < steps.length - 1
              ? (
                  <Button onClick={handleNext} size="lg" className="px-8">
                    {currentStep === 0 ? 'Iniziamo! →' : 'Continua →'}
                  </Button>
                )
              : (
                  <Button size="lg" className="px-8">
                    Vai al Dashboard →
                  </Button>
                )}

            {currentStep === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                5 minuti • Niente spam • Informazioni verificate
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
