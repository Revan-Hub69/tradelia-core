/**
 * MOTION SYSTEM INTEGRATION EXAMPLE v2.0 - Enterprise 2026
 *
 * Esempio di integrazione del sistema motion Tradelia
 * Dimostra l'uso pratico di tutti i componenti motion
 *
 * Questo file serve come:
 * - Documentazione pratica del sistema
 * - Test di integrazione dei componenti
 * - Esempio per sviluppatori
 */

'use client';

import React, { useState } from 'react';

// Import del sistema motion completo
import {
  AnticipatoryFeedback,
  EnterAnimation,
  ErrorAnimation,
  HoverAnticipatory,
  HoverMotion,
  LongPressAnticipatory,
  PressAnticipatory,
  PressMotion,
  SemanticAnimation,
  StaggerContainer,
  SuccessAnimation,
  TradeliaMotion,
  useAnticipatoryFeedback,
  useSemanticAnimations,
  useTradeliaMotion,
} from './index';

/**
 * Esempio completo del sistema motion
 */
export const MotionSystemExample: React.FC = () => {
  const [showElements, setShowElements] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Hooks del sistema motion
  const { motionPreference } = useTradeliaMotion();
  const { triggerAnimation, currentAnimation } = useSemanticAnimations();
  const { feedbackState, triggerAnticipation } = useAnticipatoryFeedback();

  // Handlers per esempi
  const handleSuccess = () => {
    triggerAnimation('success');
    setFeedbackMessage('✅ Azione completata con successo!');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleError = () => {
    triggerAnimation('error');
    setFeedbackMessage('❌ Si è verificato un errore');
    setTimeout(() => setFeedbackMessage(''), 3000);
  };

  const handleLongPress = () => {
    setFeedbackMessage('🔥 Long press completato!');
    setTimeout(() => setFeedbackMessage(''), 2000);
  };

  const toggleElements = () => {
    setShowElements(!showElements);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-12 p-8">
      {/* Header con motion info */}
      <EnterAnimation context="content">
        <div className="space-y-4 text-center">
          <h1 className="text-gradient-primary text-4xl font-bold">
            Tradelia Motion System 2026
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema enterprise di motion design con personalità
          </p>
          <div className="text-sm text-muted-foreground">
            Motion Preference:
            {' '}
            <span className="font-mono">{motionPreference}</span>
            {' '}
            |
            Current Animation:
            {' '}
            <span className="font-mono">{currentAnimation || 'none'}</span>
            {' '}
            |
            Feedback State:
            {' '}
            <span className="font-mono">{feedbackState}</span>
          </div>
        </div>
      </EnterAnimation>

      {/* Feedback Message */}
      {feedbackMessage && (
        <SuccessAnimation context="feedback">
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4 text-center">
            {feedbackMessage}
          </div>
        </SuccessAnimation>
      )}

      {/* 1. Basic Motion Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Basic Motion Components</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TradeliaMotion type="enter" intensity="medium">
            <div className="glass-surface rounded-lg p-6 text-center">
              <h3 className="mb-2 font-semibold">Enter Motion</h3>
              <p className="text-sm text-muted-foreground">
                Welcoming entry animation
              </p>
            </div>
          </TradeliaMotion>

          <PressMotion>
            <div className="glass-surface cursor-pointer rounded-lg p-6 text-center">
              <h3 className="mb-2 font-semibold">Press Motion</h3>
              <p className="text-sm text-muted-foreground">
                Click per feedback tattile
              </p>
            </div>
          </PressMotion>

          <HoverMotion>
            <div className="glass-surface cursor-pointer rounded-lg p-6 text-center">
              <h3 className="mb-2 font-semibold">Hover Motion</h3>
              <p className="text-sm text-muted-foreground">
                Hover per anticipazione
              </p>
            </div>
          </HoverMotion>
        </div>
      </section>

      {/* 2. Semantic Animations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">2. Semantic Animations</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <button
            onClick={handleSuccess}
            className="glass-surface rounded-lg p-4 transition-colors hover:bg-accent/10"
          >
            <SuccessAnimation context="feedback">
              <div className="text-center">
                <div className="mb-2 text-2xl">✅</div>
                <div className="text-sm">Success</div>
              </div>
            </SuccessAnimation>
          </button>

          <button
            onClick={handleError}
            className="glass-surface rounded-lg p-4 transition-colors hover:bg-destructive/10"
          >
            <ErrorAnimation context="feedback">
              <div className="text-center">
                <div className="mb-2 text-2xl">❌</div>
                <div className="text-sm">Error</div>
              </div>
            </ErrorAnimation>
          </button>

          <SemanticAnimation type="loading" context="ui">
            <div className="glass-surface rounded-lg p-4 text-center">
              <div className="mb-2 animate-spin text-2xl">⏳</div>
              <div className="text-sm">Loading</div>
            </div>
          </SemanticAnimation>

          <SemanticAnimation type="complete" context="feedback">
            <div className="glass-surface rounded-lg p-4 text-center">
              <div className="mb-2 text-2xl">🎉</div>
              <div className="text-sm">Complete</div>
            </div>
          </SemanticAnimation>
        </div>
      </section>

      {/* 3. Anticipatory Feedback */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">3. Anticipatory Feedback</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PressAnticipatory
            intensity="normal"
            hapticPattern="medium"
            onPress={() => triggerAnticipation()}
            className="glass-surface rounded-lg p-6 text-center"
          >
            <h3 className="mb-2 font-semibold">Press Anticipatory</h3>
            <p className="text-sm text-muted-foreground">
              Feedback con micro-delay
            </p>
          </PressAnticipatory>

          <HoverAnticipatory
            intensity="normal"
            anticipationDelay={25}
            className="glass-surface rounded-lg p-6 text-center"
          >
            <h3 className="mb-2 font-semibold">Hover Anticipatory</h3>
            <p className="text-sm text-muted-foreground">
              Hover con anticipazione
            </p>
          </HoverAnticipatory>

          <LongPressAnticipatory
            onLongPress={handleLongPress}
            duration={1500}
            className="glass-surface relative rounded-lg p-6 text-center"
          >
            <h3 className="mb-2 font-semibold">Long Press</h3>
            <p className="text-sm text-muted-foreground">
              Tieni premuto per 1.5s
            </p>
          </LongPressAnticipatory>
        </div>
      </section>

      {/* 4. Staggered Animations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">4. Staggered Animations</h2>

        <div className="mb-4 flex gap-4">
          <button
            onClick={toggleElements}
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showElements ? 'Hide' : 'Show'}
            {' '}
            Elements
          </button>
        </div>

        {showElements && (
          <StaggerContainer intensity="medium" direction="up">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <EnterAnimation key={i} context="content">
                  <div
                    className="glass-surface rounded-lg p-4 text-center"
                    style={{ '--stagger-index': i } as React.CSSProperties}
                  >
                    <div className="text-lg font-semibold">
                      Item
                      {i + 1}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Stagger delay:
                      {' '}
                      {i * 50}
                      ms
                    </div>
                  </div>
                </EnterAnimation>
              ))}
            </div>
          </StaggerContainer>
        )}
      </section>

      {/* 5. Complex Interactions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">5. Complex Interactions</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card interattiva con motion completo */}
          <AnticipatoryFeedback
            type="hover"
            intensity="normal"
            anticipationDelay={30}
            className="group"
          >
            <div className="glass-surface cursor-pointer rounded-lg p-6 transition-all duration-300 group-hover:shadow-lg">
              <TradeliaMotion type="enter" intensity="medium">
                <h3 className="mb-3 text-xl font-semibold">Interactive Card</h3>
                <p className="mb-4 text-muted-foreground">
                  Questa card combina hover anticipatory, press feedback e semantic animations.
                </p>

                <div className="flex gap-2">
                  <PressAnticipatory
                    intensity="subtle"
                    hapticPattern="light"
                    className="rounded bg-accent px-3 py-1 text-sm text-accent-foreground"
                  >
                    Action 1
                  </PressAnticipatory>

                  <PressAnticipatory
                    intensity="normal"
                    hapticPattern="medium"
                    className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
                  >
                    Action 2
                  </PressAnticipatory>
                </div>
              </TradeliaMotion>
            </div>
          </AnticipatoryFeedback>

          {/* Form con feedback semantico */}
          <div className="glass-surface rounded-lg p-6">
            <h3 className="mb-4 text-xl font-semibold">Form with Semantic Feedback</h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Input con focus motion
                </label>
                <SemanticAnimation type="focus" context="form">
                  <input
                    type="text"
                    placeholder="Focus per vedere l'animazione"
                    className="w-full rounded-lg border border-border px-3 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </SemanticAnimation>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSuccess}
                  className="rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  Submit (Success)
                </button>

                <button
                  onClick={handleError}
                  className="rounded-lg bg-destructive px-4 py-2 text-destructive-foreground transition-colors hover:bg-destructive/90"
                >
                  Submit (Error)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Performance Info */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Performance & Accessibility</h2>

        <div className="glass-surface rounded-lg p-6">
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div>
              <h4 className="mb-2 font-semibold">🚀 Performance</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• GPU acceleration (transform/opacity)</li>
                <li>• Will-change optimization</li>
                <li>• 60fps target</li>
                <li>• Responsive timing</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">♿ Accessibility</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Prefers-reduced-motion support</li>
                <li>• High contrast mode</li>
                <li>• Focus management</li>
                <li>• Screen reader friendly</li>
              </ul>
            </div>

            <div>
              <h4 className="mb-2 font-semibold">🎨 Design System</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Signature Tradelia timing</li>
                <li>• Semantic meaning</li>
                <li>• Anticipatory feedback</li>
                <li>• Enterprise polish</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MotionSystemExample;
