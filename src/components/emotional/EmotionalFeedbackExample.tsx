/**
 * EMOTIONAL FEEDBACK SYSTEM INTEGRATION EXAMPLE v2.0 - Enterprise 2026
 * 
 * Esempio completo di integrazione del sistema di feedback emotivo
 * Dimostra l'uso pratico di tutti i componenti emotional
 * 
 * Questo file serve come:
 * - Documentazione pratica del sistema
 * - Test di integrazione dei componenti
 * - Esempio per sviluppatori
 */

'use client';

import React, { useState } from 'react';
import { cn } from '../../utils/Helpers';

// Import del sistema emotional completo
import {
  useMicroMoments,
  MicroMomentTester,
  ReassuranceMessage,
  useReassurance,
  AutoSaveIndicator,
  ReassuranceTester,
  NewUserDashboard,
  NoProgressState,
  CompletedPathState,
  ConnectionErrorState,
  EmptyStateTester,
} from './index';

import { EnterAnimation } from '../motion/SemanticAnimations';
import { PressAnticipatory } from '../motion/AnticipatoryFeedback';

/**
 * Esempio completo del sistema emotional feedback
 */
export const EmotionalFeedbackExample: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'micro-moments' | 'reassurance' | 'empty-states'>('micro-moments');
  const [showAutoSave, setShowAutoSave] = useState(false);
  const [userProgress, setUserProgress] = useState(0);

  // Hooks del sistema emotional
  const { triggerMicroMoment } = useMicroMoments();
  const { showReassurance } = useReassurance();

  // Simulazioni per demo
  const simulateLessonComplete = () => {
    triggerMicroMoment('lesson_complete', {
      intensity: 'celebration',
      context: 'lesson',
      data: { lessonTitle: 'Blockchain Basics', xp: 50 }
    });
    
    setTimeout(() => {
      showReassurance('progress_secure', { context: 'educational' });
    }, 2000);
  };

  const simulateStreakSaved = () => {
    triggerMicroMoment('streak_saved', {
      intensity: 'normal',
      context: 'dashboard',
      data: { streakDays: 7 }
    });
  };

  const simulateAutoSave = () => {
    setShowAutoSave(true);
    setTimeout(() => setShowAutoSave(false), 2000);
  };

  const simulateProgressUpdate = () => {
    const newProgress = Math.min(userProgress + 25, 100);
    setUserProgress(newProgress);
    
    if (newProgress === 100) {
      triggerMicroMoment('achievement_earned', {
        intensity: 'celebration',
        data: { achievementName: 'First Module Complete!' }
      });
    } else {
      triggerMicroMoment('xp_gained', {
        intensity: 'subtle',
        data: { xp: 25 }
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      {/* Header */}
      <EnterAnimation context="content">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient-primary">
            Emotional Feedback System 2026
          </h1>
          <p className="text-lg text-muted-foreground">
            Sistema enterprise di feedback emotivo per applicazioni educative
          </p>
          <div className="text-sm text-muted-foreground">
            Basato su ricerca UX 2026 • Apple HIG • Microsoft Fluent • Educational Psychology
          </div>
        </div>
      </EnterAnimation>

      {/* Navigation */}
      <div className="flex justify-center">
        <div className="glass-surface rounded-lg p-1 inline-flex">
          {[
            { key: 'micro-moments', label: 'Micro-Moments' },
            { key: 'reassurance', label: 'Reassurance' },
            { key: 'empty-states', label: 'Empty States' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveDemo(tab.key as any)}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                activeDemo === tab.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demo Sections */}
      {activeDemo === 'micro-moments' && (
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Success Micro-Moments</h2>
            <p className="text-muted-foreground">
              Celebrazioni discrete e significative per i successi dell'utente
            </p>
          </div>

          {/* Interactive Demo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="space-y-6">
              <div className="glass-surface p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Simula Azioni Utente</h3>
                <div className="space-y-3">
                  <PressAnticipatory
                    intensity="normal"
                    hapticPattern="medium"
                    onPress={simulateLessonComplete}
                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg text-center font-medium"
                  >
                    🎓 Completa Lezione
                  </PressAnticipatory>

                  <PressAnticipatory
                    intensity="normal"
                    hapticPattern="light"
                    onPress={simulateStreakSaved}
                    className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg text-center font-medium"
                  >
                    🔥 Mantieni Streak
                  </PressAnticipatory>

                  <PressAnticipatory
                    intensity="normal"
                    hapticPattern="medium"
                    onPress={simulateProgressUpdate}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg text-center font-medium"
                  >
                    📈 Aggiorna Progresso
                  </PressAnticipatory>

                  <PressAnticipatory
                    intensity="subtle"
                    hapticPattern="light"
                    onPress={simulateAutoSave}
                    className="w-full px-4 py-3 bg-slate-600 text-white rounded-lg text-center font-medium"
                  >
                    💾 Trigger Auto-Save
                  </PressAnticipatory>
                </div>
              </div>

              {/* Progress Visualization */}
              <div className="glass-surface p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Progresso Simulato</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Modulo Corrente</span>
                    <span>{userProgress}%</span>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill-primary transition-all duration-500"
                      style={{ width: `${userProgress}%` }}
                    />
                  </div>
                  {userProgress === 100 && (
                    <div className="text-center text-sm text-emerald-600 font-medium">
                      🏆 Modulo Completato!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Visual Examples */}
            <div className="space-y-6">
              <div className="glass-surface p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Esempi Visivi</h3>
                <div className="space-y-4">
                  <div className="p-4 border border-emerald-200/50 bg-emerald-50/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">✨</span>
                      <div>
                        <div className="font-semibold text-sm">Lezione completata!</div>
                        <div className="text-xs text-muted-foreground">Ottimo lavoro, continua così</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-orange-200/50 bg-orange-50/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔥</span>
                      <div>
                        <div className="font-semibold text-sm">Streak mantenuto!</div>
                        <div className="text-xs text-muted-foreground">7 giorni consecutivi</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-200/50 bg-blue-50/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <div className="font-semibold text-sm">+25 XP</div>
                        <div className="text-xs text-muted-foreground">Esperienza guadagnata</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-save indicator */}
              {showAutoSave && (
                <AutoSaveIndicator visible={showAutoSave} context="educational" />
              )}
            </div>
          </div>

          {/* Component Tester */}
          <MicroMomentTester />
        </section>
      )}

      {activeDemo === 'reassurance' && (
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Soft Reassurance System</h2>
            <p className="text-muted-foreground">
              Messaggi rassicuranti per contesti educativi e finanziari
            </p>
          </div>

          {/* Examples Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-surface p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                💾 Contesto Educativo
              </h3>
              <div className="space-y-3">
                <ReassuranceMessage type="auto_save" context="educational" />
                <ReassuranceMessage type="learning_on_track" context="educational" />
                <ReassuranceMessage type="safe_to_explore" context="educational" />
              </div>
            </div>

            <div className="glass-surface p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                🔒 Contesto Finanziario
              </h3>
              <div className="space-y-3">
                <ReassuranceMessage type="data_protected" context="financial" />
                <ReassuranceMessage type="progress_secure" context="financial" />
                <ReassuranceMessage type="safe_action" context="financial" />
              </div>
            </div>

            <div className="glass-surface p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                ⏰ Contesto Supportivo
              </h3>
              <div className="space-y-3">
                <ReassuranceMessage type="no_rush" context="educational" />
                <ReassuranceMessage type="no_action_needed" context="educational" />
                <ReassuranceMessage type="connection_stable" context="technical" />
              </div>
            </div>
          </div>

          {/* Interactive Tester */}
          <ReassuranceTester />
        </section>
      )}

      {activeDemo === 'empty-states' && (
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Educational Empty States</h2>
            <p className="text-muted-foreground">
              Stati vuoti che guidano e incoraggiano invece di frustrare
            </p>
          </div>

          {/* Examples Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Esempi Incoraggianti</h3>
              
              <div className="border rounded-lg bg-background min-h-[300px]">
                <NewUserDashboard onStartLearning={() => console.log('Start learning')} />
              </div>

              <div className="border rounded-lg bg-background min-h-[300px]">
                <NoProgressState onStartJourney={() => console.log('Start journey')} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Esempi Celebrativi</h3>
              
              <div className="border rounded-lg bg-background min-h-[300px]">
                <CompletedPathState onExploreAdvanced={() => console.log('Explore advanced')} />
              </div>

              <div className="border rounded-lg bg-background min-h-[300px]">
                <ConnectionErrorState onRetry={() => console.log('Retry connection')} />
              </div>
            </div>
          </div>

          {/* Interactive Tester */}
          <EmptyStateTester />
        </section>
      )}

      {/* System Info */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sistema Emotional Feedback</h2>
        
        <div className="glass-surface p-6 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-3">🎯 Principi Chiave</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Celebrazione appropriata al contesto</li>
                <li>• Rinforzo positivo senza eccessi</li>
                <li>• Personalità Tradelia professionale</li>
                <li>• Accessibilità e motion preferences</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">🧠 Ricerca UX 2026</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Emotional design come differenziatore</li>
                <li>• Micro-momenti per engagement</li>
                <li>• Rassicurazione in contesti finanziari</li>
                <li>• Empty states educativi vs generici</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">⚡ Performance</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• GPU acceleration per animazioni</li>
                <li>• Rispetto prefers-reduced-motion</li>
                <li>• Lazy loading componenti</li>
                <li>• Cleanup automatico memoria</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmotionalFeedbackExample;