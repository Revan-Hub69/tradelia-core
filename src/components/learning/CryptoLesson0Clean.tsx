'use client';

import React from 'react';

import { Card } from '@/components/ui/card';
import { FadeIn, SlideReveal } from '@/components/ui/scroll-animations';
import { useLessonCompletion } from '@/hooks/useLessonCompletion';
import type { LearningApproach } from '@/libs/gamification';
import { ProfessionalGamificationEngine } from '@/libs/gamification';

import { LessonFooter } from './LessonFooter';
import { LessonHeader } from './LessonHeader';

export const CryptoLesson0Clean: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [startTime] = React.useState(Date.now());
  const [approachesUsed, setApproachesUsed] = React.useState<string[]>([]);
  const { completeLesson } = useLessonCompletion();

  const steps = [
    {
      id: 'hook',
      title: 'Il Problema di Alice',
      subtitle: 'Un caso reale che ti farà capire tutto',
      duration: '30 sec',
      approach: 'hook',
    },
    {
      id: 'analogical',
      title: 'Come un Registro Bancario',
      subtitle: 'La metafora che rende tutto chiaro',
      duration: '60 sec',
      approach: 'analogical',
    },
    {
      id: 'procedural',
      title: 'Come Funziona in Pratica',
      subtitle: 'Seguiamo una transazione dal vivo',
      duration: '90 sec',
      approach: 'procedural',
    },
    {
      id: 'conceptual',
      title: 'La Definizione Tecnica',
      subtitle: 'Ora che hai le basi, approfondiamo',
      duration: '60 sec',
      approach: 'conceptual',
    },
    {
      id: 'check',
      title: 'Verifica Rapida',
      subtitle: 'Una domanda per consolidare',
      duration: '30 sec',
      approach: 'quiz',
    },
  ];

  const handleNext = async () => {
    // Track approach used
    const currentApproach = steps[currentStep]?.approach;
    if (currentApproach && !approachesUsed.includes(currentApproach)) {
      setApproachesUsed(prev => [...prev, currentApproach]);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Lesson completion with professional gamification
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds
      const baseXP = 50;
      const targetTime = 300; // 5 minutes target
      const quizScore = 100; // Assume perfect for lesson 0

      // Calculate XP with professional system
      const { totalXP } = ProfessionalGamificationEngine.calculateLessonXP({
        baseXP,
        timeSpent,
        targetTime,
        quizScore,
        approachesUsed: approachesUsed as LearningApproach[],
        isFirstCompletion: true,
        currentStreak: 0, // Will be updated by backend
      });

      // ✅ CRITICAL FIX: Stable array reference (prevents unnecessary re-renders)
      // Research: Qodo AI 2026 - "Array literals create new references on every render"
      const badges: Array<{
        id: string;
        name: string;
        description: string;
        icon: string;
        rarity: string;
      }> = [];

      // Crypto Pioneer badge (always awarded for first lesson)
      badges.push({
        id: 'crypto_pioneer',
        name: 'Pioniere Crypto',
        description: 'Hai iniziato il tuo viaggio nel mondo delle criptovalute',
        icon: '🎯',
        rarity: 'common',
      });

      // Cognitive Architect badge (if used multiple approaches)
      if (approachesUsed.length >= 3) {
        badges.push({
          id: 'cognitive_architect',
          name: 'Architetto Cognitivo',
          description: 'Maestria nell\'utilizzo di diversi approcci di apprendimento',
          icon: '🧠',
          rarity: 'rare',
        });
      }

      // Velocity Learner badge (if completed quickly)
      if (timeSpent < targetTime) {
        badges.push({
          id: 'velocity_learner',
          name: 'Apprendimento Veloce',
          description: 'Completamento rapido ed efficace delle lezioni',
          icon: '⚡',
          rarity: 'rare',
        });
      }

      try {
        await completeLesson({
          lessonId: 'lesson-0',
          pathId: 'base',
          xpEarned: totalXP,
          approachesUsed,
          quizScore,
          timeSpent,
          badges,
        });
      } catch (error) {
        console.error('Error completing lesson:', error);
        // Fallback: still redirect to dashboard
        window.location.href = '/dashboard';
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderHookStep = () => (
    <div className="space-y-6">
      {/* Lesson Title - Moved from header to content */}
      <div className="mb-6 text-center">
        <div className="mb-2 text-sm font-medium text-muted-foreground">
          Lezione 0: Crypto Basics • 5 min
        </div>
      </div>

      <div className="text-center">
        <SlideReveal>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Il Problema di Alice
          </h1>
        </SlideReveal>
        <FadeIn delay={200}>
          <p className="mt-3 text-lg text-muted-foreground">
            Un caso reale che cambierà la tua prospettiva
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-primary/20 bg-primary/5 p-8">
          <div className="space-y-6">
            {/* Il Problema Reale */}
            <div className="text-center">
              <div className="mx-auto mb-4 size-16 rounded-full bg-gradient-to-br from-primary to-accent p-4">
                <svg className="size-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h2 className="mb-4 text-xl font-bold">La Situazione</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Scenario Tradizionale */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-muted p-2">
                    <svg className="size-full text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="font-semibold">Banca Tradizionale</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commissioni:</span>
                    <span className="font-medium text-destructive">€25</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo:</span>
                    <span className="font-medium text-destructive">3-5 giorni</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orari:</span>
                    <span className="font-medium text-destructive">9-17, lun-ven</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Controllo:</span>
                    <span className="font-medium text-destructive">Può bloccare</span>
                  </div>
                </div>
              </div>

              {/* Scenario Bitcoin */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 p-2">
                    <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-primary">Bitcoin</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commissioni:</span>
                    <span className="font-medium text-primary">€2-5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tempo:</span>
                    <span className="font-medium text-primary">10-60 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Orari:</span>
                    <span className="font-medium text-primary">24/7/365</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Controllo:</span>
                    <span className="font-medium text-primary">Solo tu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* La Domanda Provocatoria */}
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
              <h3 className="mb-2 text-lg font-bold">La Domanda</h3>
              <p className="mb-6 text-base leading-relaxed">
                Alice vuole mandare €100 a Bob in Giappone.
                <br />
                Come può Bitcoin essere
                {' '}
                <strong>10x più economico e 100x più veloce</strong>
                {' '}
                di una banca?
                <br />
                <span className="font-semibold text-accent">Cosa c'è dietro questa "magia"?</span>
              </p>
            </div>

            {/* Micro-Context */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-muted p-1.5">
                  <svg className="size-full text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Prossimi 4 minuti:</div>
                  <div className="text-muted-foreground">
                    3 modi per capirlo → Analogia semplice → Procedura pratica → Definizione tecnica
                  </div>
                </div>
              </div>
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

            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="mb-3 font-semibold text-foreground">Come funziona:</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>
                    <strong>Registro tradizionale</strong>
                    {' '}
                    → Blockchain (catena di blocchi)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>
                    <strong>Pagine del registro</strong>
                    {' '}
                    → Blocchi di transazioni
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>
                    <strong>Contabili</strong>
                    {' '}
                    → Computer della rete
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <span>
                    <strong>Approvazione unanime</strong>
                    {' '}
                    → Consenso distribuito
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <h4 className="mb-3 font-semibold text-foreground">Punti chiave:</h4>
              <div className="space-y-2">
                {[
                  'Nessuna autorità centrale controlla il sistema',
                  'La sicurezza deriva dalla verifica collettiva',
                  'Una volta registrata, una transazione è praticamente immutabile',
                ].map(point => (
                  <div key={`point-${point.slice(0, 10)}`} className="flex items-start gap-2">
                    <svg className="mt-0.5 size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </FadeIn>
    </div>
  );

  const renderCheckStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <SlideReveal>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Verifica Rapida
          </h2>
        </SlideReveal>
        <FadeIn delay={200}>
          <p className="mt-3 text-muted-foreground">
            Una domanda per consolidare quello che hai imparato
          </p>
        </FadeIn>
      </div>

      <FadeIn delay={400}>
        <Card className="border-border/50 bg-card/50 p-6 backdrop-blur-sm">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 size-16 rounded-full bg-gradient-to-br from-primary to-accent p-4">
                <svg className="size-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-4 text-lg font-semibold">
                Torniamo al problema di Alice
              </h3>
              <p className="mb-6 text-base leading-relaxed">
                Alice vuole mandare €100 a Bob in Giappone.
                <br />
                Ora che conosci come funziona Bitcoin, quale di questi è il motivo principale
                per cui è più economico e veloce delle banche?
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'a',
                  text: 'Bitcoin usa internet, le banche usano sistemi vecchi',
                  correct: false,
                },
                {
                  id: 'b',
                  text: 'Bitcoin elimina gli intermediari e la verifica è automatica',
                  correct: true,
                },
                {
                  id: 'c',
                  text: 'Bitcoin è digitale, i soldi delle banche sono fisici',
                  correct: false,
                },
                {
                  id: 'd',
                  text: 'Bitcoin è più nuovo e tecnologicamente avanzato',
                  correct: false,
                },
              ].map(option => (
                <button
                  key={option.id}
                  type="button"
                  className="w-full rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-muted font-mono text-sm font-semibold">
                      {option.id.toUpperCase()}
                    </span>
                    <span className="font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <div className="size-8 rounded-lg bg-primary/10 p-1.5">
                  <svg className="size-full text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-primary">Ricorda i 3 approcci:</h4>
                  <div className="space-y-1 text-sm text-primary/80">
                    <div>
                      <strong>Analogia:</strong>
                      {' '}
                      Registro distribuito vs banca centrale
                    </div>
                    <div>
                      <strong>Procedura:</strong>
                      {' '}
                      Verifica matematica automatica
                    </div>
                    <div>
                      <strong>Concetto:</strong>
                      {' '}
                      Rete peer-to-peer senza intermediari
                    </div>
                  </div>
                </div>
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
      return renderHookStep();
    }

    const stepId = currentStepData.id;

    switch (stepId) {
      case 'hook':
        return renderHookStep();
      case 'analogical':
        return renderAnalogicalStep();
      case 'procedural':
        return <div className="p-8 text-center">Procedural step coming soon...</div>;
      case 'conceptual':
        return <div className="p-8 text-center">Conceptual step coming soon...</div>;
      case 'check':
        return renderCheckStep();
      default:
        return renderHookStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Research-Based Header */}
      <LessonHeader
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={currentStep > 0 ? handlePrevious : undefined}
        onClose={() => {
          // Research-based: Close returns to lessons context, not dashboard
          // Save progress for resume functionality
          const progressData = {
            lessonId: 'lesson-0',
            currentStep,
            completedSteps: Array.from({ length: currentStep }, (_, i) => i),
            timestamp: new Date().toISOString(),
          };
          localStorage.setItem('lesson-0-progress', JSON.stringify(progressData));

          // Return to lessons overview (contextual return)
          window.location.href = '/lessons';
        }}
        showLogo
        showTrustSignals
      />

      {/* Content Area with proper spacing */}
      <div className="px-4 pb-32 pt-6 sm:px-6 sm:pb-36 md:pb-32">
        <div className="mx-auto max-w-4xl">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Research-Based Footer - No Redundancies */}
      <LessonFooter
        canGoForward
        onNext={handleNext}
        onHelp={() => {
          // Handle help - show help modal or guide
          // console.log('Help requested');
        }}
        onFeedback={() => {
          // Handle feedback - show feedback form
          // console.log('Feedback requested');
        }}
        nextLabel={
          currentStep === 0
            ? 'Scopriamo come! →'
            : currentStep < steps.length - 1
              ? 'Continua →'
              : 'Completa Lezione →'
        }
        isCompleting={currentStep === steps.length - 1}
        showHelp
        showFeedback
      />
    </div>
  );
};
