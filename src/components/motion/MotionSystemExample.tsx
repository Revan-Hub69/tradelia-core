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
  TradeliaMotion,
  PressMotion,
  HoverMotion,
  StaggerContainer,
  SemanticAnimation,
  EnterAnimation,
  ExitAnimation,
  SuccessAnimation,
  ErrorAnimation,
  AnticipatoryFeedback,
  PressAnticipatory,
  HoverAnticipatory,
  LongPressAnticipatory,
  useTradeliaMotion,
  useSemanticAnimations,
  useAnticipatoryFeedback,
} from './index';

/**
 * Esempio completo del sistema motion
 */
export const MotionSystemExample: React.FC = () => {
  const [showElements, setShowElements] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [longPressProgress, setLongPressProgress] = useState(0);

  // Hooks del sistema motion
  const { triggerMotion, shouldAnimate, motionPreference } = useTradeliaMotion();
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
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Header con motion info */}
      <EnterAnimation context="content">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient-primary">
            Tradelia Motion System 2026
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema enterprise di motion design con personalità
          </p>
          <div className="text-sm text-muted-foreground">
            Motion Preference: <span className="font-mono">{motionPreference}</span> | 
            Current Animation: <span className="font-mono">{currentAnimation || 'none'}</span> |
            Feedback State: <span className="font-mono">{feedbackState}</span>
          </div>
        </div>
      </EnterAnimation>

      {/* Feedback Message */}
      {feedbackMessage && (
        <SuccessAnimation context="feedback">
          <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
            {feedbackMessage}
          </div>
        </SuccessAnimation>
      )}

      {/* 1. Basic Motion Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">1. Basic Motion Components</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TradeliaMotion type="enter" intensity="medium">
            <div className="glass-surface p-6 rounded-lg text-center">
              <h3 className="font-semibold mb-2">Enter Motion</h3>
              <p className="text-sm text-muted-foreground">
                Welcoming entry animation
              </p>
            </div>
          </TradeliaMotion>

          <PressMotion>
            <div className="glass-surface p-6 rounded-lg text-center cursor-pointer">
              <h3 className="font-semibold mb-2">Press Motion</h3>
              <p className="text-sm text-muted-foreground">
                Click per feedback tattile
              </p>
            </div>
          </PressMotion>

          <HoverMotion>
            <div className="glass-surface p-6 rounded-lg text-center cursor-pointer">
              <h3 className="font-semibold mb-2">Hover Motion</h3>
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
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={handleSuccess}
            className="glass-surface p-4 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <SuccessAnimation context="feedback">
              <div className="text-center">
                <div className="text-2xl mb-2">✅</div>
                <div className="text-sm">Success</div>
              </div>
            </SuccessAnimation>
          </button>

          <button
            onClick={handleError}
            className="glass-surface p-4 rounded-lg hover:bg-destructive/10 transition-colors"
          >
            <ErrorAnimation context="feedback">
              <div className="text-center">
                <div className="text-2xl mb-2">❌</div>
                <div className="text-sm">Error</div>
              </div>
            </ErrorAnimation>
          </button>

          <SemanticAnimation type="loading" context="ui">
            <div className="glass-surface p-4 rounded-lg text-center">
              <div className="text-2xl mb-2 animate-spin">⏳</div>
              <div className="text-sm">Loading</div>
            </div>
          </SemanticAnimation>

          <SemanticAnimation type="complete" context="feedback">
            <div className="glass-surface p-4 rounded-lg text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="text-sm">Complete</div>
            </div>
          </SemanticAnimation>
        </div>
      </section>

      {/* 3. Anticipatory Feedback */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">3. Anticipatory Feedback</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PressAnticipatory
            intensity="normal"
            hapticPattern="medium"
            onPress={() => triggerAnticipation()}
            className="glass-surface p-6 rounded-lg text-center"
          >
            <h3 className="font-semibold mb-2">Press Anticipatory</h3>
            <p className="text-sm text-muted-foreground">
              Feedback con micro-delay
            </p>
          </PressAnticipatory>

          <HoverAnticipatory
            intensity="normal"
            anticipationDelay={25}
            className="glass-surface p-6 rounded-lg text-center"
          >
            <h3 className="font-semibold mb-2">Hover Anticipatory</h3>
            <p className="text-sm text-muted-foreground">
              Hover con anticipazione
            </p>
          </HoverAnticipatory>

          <LongPressAnticipatory
            onLongPress={handleLongPress}
            duration={1500}
            className="glass-surface p-6 rounded-lg text-center relative"
          >
            <h3 className="font-semibold mb-2">Long Press</h3>
            <p className="text-sm text-muted-foreground">
              Tieni premuto per 1.5s
            </p>
          </LongPressAnticipatory>
        </div>
      </section>

      {/* 4. Staggered Animations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">4. Staggered Animations</h2>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={toggleElements}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showElements ? 'Hide' : 'Show'} Elements
          </button>
        </div>

        {showElements && (
          <StaggerContainer intensity="medium" direction="up">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <EnterAnimation key={i} context="content">
                  <div 
                    className="glass-surface p-4 rounded-lg text-center"
                    style={{ '--stagger-index': i } as React.CSSProperties}
                  >
                    <div className="text-lg font-semibold">Item {i + 1}</div>
                    <div className="text-sm text-muted-foreground">
                      Stagger delay: {i * 50}ms
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card interattiva con motion completo */}
          <AnticipatoryFeedback
            type="hover"
            intensity="normal"
            anticipationDelay={30}
            className="group"
          >
            <div className="glass-surface p-6 rounded-lg cursor-pointer transition-all duration-300 group-hover:shadow-lg">
              <TradeliaMotion type="enter" intensity="medium">
                <h3 className="text-xl font-semibold mb-3">Interactive Card</h3>
                <p className="text-muted-foreground mb-4">
                  Questa card combina hover anticipatory, press feedback e semantic animations.
                </p>
                
                <div className="flex gap-2">
                  <PressAnticipatory
                    intensity="subtle"
                    hapticPattern="light"
                    className="px-3 py-1 bg-accent text-accent-foreground rounded text-sm"
                  >
                    Action 1
                  </PressAnticipatory>
                  
                  <PressAnticipatory
                    intensity="normal"
                    hapticPattern="medium"
                    className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                  >
                    Action 2
                  </PressAnticipatory>
                </div>
              </TradeliaMotion>
            </div>
          </AnticipatoryFeedback>

          {/* Form con feedback semantico */}
          <div className="glass-surface p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Form with Semantic Feedback</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Input con focus motion
                </label>
                <SemanticAnimation type="focus" context="form">
                  <input
                    type="text"
                    placeholder="Focus per vedere l'animazione"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </SemanticAnimation>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleSuccess}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Submit (Success)
                </button>
                
                <button
                  onClick={handleError}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
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
        
        <div className="glass-surface p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🚀 Performance</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• GPU acceleration (transform/opacity)</li>
                <li>• Will-change optimization</li>
                <li>• 60fps target</li>
                <li>• Responsive timing</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">♿ Accessibility</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Prefers-reduced-motion support</li>
                <li>• High contrast mode</li>
                <li>• Focus management</li>
                <li>• Screen reader friendly</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">🎨 Design System</h4>
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