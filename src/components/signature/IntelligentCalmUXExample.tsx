/**
 * INTELLIGENT CALM UX EXAMPLE - Enterprise 2026
 *
 * Showcase completo del sistema UX intelligente per riduzione stimoli visivi
 * Dimostra tutte le modalità calm, stati cognitivi e adattamenti intelligenti
 */

import React, { useState } from 'react';

import { BreathingElement, CalmElement, type CalmMode, type CognitiveState, FocusIndicator, IntelligentCalmUX, useCalmUX, type VisualIntensity } from './IntelligentCalmUX';

// ============================================================================
// DEMO CONTENT COMPONENTS
// ============================================================================

const LearningInterface: React.FC = () => {
  return (
    <div className="learning-interface space-y-6">
      {/* Essential Content - Always visible */}
      <CalmElement priority="essential" className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h2 className="mb-4 text-2xl font-bold">Blockchain Fundamentals</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Learn the core concepts of blockchain technology in this focused lesson.
        </p>
        <BreathingElement intensity="subtle" className="w-full">
          <div className="progress-bar h-2 rounded-full bg-gray-200 dark:bg-gray-700">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: '65%' }} />
          </div>
        </BreathingElement>
      </CalmElement>

      {/* Important Content - Visible in most calm modes */}
      <CalmElement priority="important" className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FocusIndicator className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h3 className="mb-2 font-semibold">Key Concepts</h3>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>• Decentralization</li>
            <li>• Cryptographic Hashing</li>
            <li>• Consensus Mechanisms</li>
          </ul>
        </FocusIndicator>

        <BreathingElement intensity="medium" className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
          <h3 className="mb-2 font-semibold">Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span>65%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Time Remaining</span>
              <span>12 min</span>
            </div>
          </div>
        </BreathingElement>
      </CalmElement>

      {/* Optional Content - Hidden in minimal modes */}
      <CalmElement priority="optional" className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
        <h3 className="mb-2 font-semibold">Additional Resources</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="rounded bg-white p-3 text-sm dark:bg-gray-800">
            <div className="font-medium">Video Tutorial</div>
            <div className="text-gray-500">15 min</div>
          </div>
          <div className="rounded bg-white p-3 text-sm dark:bg-gray-800">
            <div className="font-medium">Practice Quiz</div>
            <div className="text-gray-500">10 questions</div>
          </div>
          <div className="rounded bg-white p-3 text-sm dark:bg-gray-800">
            <div className="font-medium">Discussion</div>
            <div className="text-gray-500">Community</div>
          </div>
        </div>
      </CalmElement>
    </div>
  );
};

const CalmControlPanel: React.FC = () => {
  const {
    config,
    updateMode,
    updateCognitiveState,
    updateVisualIntensity,
    enableAdaptive,
    disableAdaptive,
  } = useCalmUX();

  const calmModes: CalmMode[] = ['off', 'learning', 'deep-focus', 'meditation', 'adaptive'];
  const cognitiveStates: CognitiveState[] = ['fresh', 'focused', 'tired', 'stressed', 'distracted', 'overwhelmed'];
  const visualIntensities: VisualIntensity[] = ['minimal', 'reduced', 'moderate', 'standard', 'enhanced'];

  return (
    <CalmElement priority="important" className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 className="mb-6 text-xl font-semibold">Calm UX Controls</h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Calm Mode Selection */}
        <div>
          <h4 className="mb-3 font-medium">Calm Mode</h4>
          <div className="space-y-2">
            {calmModes.map(mode => (
              <button
                key={mode}
                onClick={() => updateMode(mode)}
                className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  config.mode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Cognitive State Simulation */}
        <div>
          <h4 className="mb-3 font-medium">Cognitive State</h4>
          <div className="space-y-2">
            {cognitiveStates.map(state => (
              <button
                key={state}
                onClick={() => updateCognitiveState(state)}
                className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  config.cognitiveState === state
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Intensity */}
        <div>
          <h4 className="mb-3 font-medium">Visual Intensity</h4>
          <div className="space-y-2">
            {visualIntensities.map(intensity => (
              <button
                key={intensity}
                onClick={() => updateVisualIntensity(intensity)}
                className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  config.visualIntensity === intensity
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Adaptive Mode Toggle */}
      <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Adaptive Mode</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatically adjust based on user behavior
            </p>
          </div>
          <button
            onClick={config.adaptiveEnabled ? disableAdaptive : enableAdaptive}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              config.adaptiveEnabled
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {config.adaptiveEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>
    </CalmElement>
  );
};

// ============================================================================
// MAIN EXAMPLE COMPONENT
// ============================================================================

export const IntelligentCalmUXExample: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<'learning' | 'dashboard' | 'settings'>('learning');

  return (
    <div className="intelligent-calm-ux-example mx-auto max-w-7xl space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Intelligent Calm UX System
        </h1>
        <p className="mx-auto max-w-4xl text-lg text-gray-600 dark:text-gray-400">
          Sistema UX intelligente che riduce gli stimoli visivi quando l'utente è in modalità focus per l'apprendimento.
          Basato su ricerca 2026: Calm Technology, Neuro-Adaptive Interfaces, Zero-Noise Design.
        </p>
      </div>

      {/* Demo Selection */}
      <div className="demo-selector flex justify-center space-x-4">
        {[
          { key: 'learning', label: 'Learning Interface' },
          { key: 'dashboard', label: 'Dashboard View' },
          { key: 'settings', label: 'Settings Panel' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedDemo(key as 'dashboard' | 'learning' | 'settings')}
            className={`rounded-lg px-6 py-3 font-medium transition-colors ${
              selectedDemo === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Intelligent Calm UX Provider */}
      <IntelligentCalmUX initialMode="off">
        <div className="space-y-8">
          {/* Control Panel */}
          <CalmControlPanel />

          {/* Demo Content */}
          <div className="demo-content">
            {selectedDemo === 'learning' && <LearningInterface />}
            {selectedDemo === 'dashboard' && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <CalmElement priority="essential" className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                  <h3 className="mb-4 text-xl font-semibold">Progress Overview</h3>
                  <BreathingElement intensity="subtle">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Lessons Completed</span>
                        <span className="font-semibold">12/20</span>
                      </div>
                      <div className="progress-bar h-3 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-3 rounded-full bg-emerald-600" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </BreathingElement>
                </CalmElement>

                <CalmElement priority="important" className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                  <h3 className="mb-4 text-xl font-semibold">Recent Activity</h3>
                  <div className="space-y-3">
                    <FocusIndicator className="flex items-center space-x-3">
                      <div className="size-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Completed: Blockchain Basics</span>
                    </FocusIndicator>
                    <FocusIndicator className="flex items-center space-x-3">
                      <div className="size-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Started: Smart Contracts</span>
                    </FocusIndicator>
                  </div>
                </CalmElement>

                <CalmElement priority="optional" className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                  <h3 className="mb-4 text-xl font-semibold">Achievements</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-900">
                      <div className="mb-1 text-2xl">🏆</div>
                      <div className="text-xs">First Lesson</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-900">
                      <div className="mb-1 text-2xl">⚡</div>
                      <div className="text-xs">Quick Learner</div>
                    </div>
                  </div>
                </CalmElement>
              </div>
            )}
            {selectedDemo === 'settings' && (
              <CalmElement priority="essential" className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                <h3 className="mb-6 text-xl font-semibold">Settings</h3>
                <div className="space-y-6">
                  <FocusIndicator className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Receive learning reminders</div>
                    </div>
                    <button className="relative h-6 w-12 rounded-full bg-blue-600">
                      <div className="absolute right-0.5 top-0.5 size-5 rounded-full bg-white"></div>
                    </button>
                  </FocusIndicator>

                  <BreathingElement intensity="subtle" className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Dark Mode</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reduce eye strain</div>
                    </div>
                    <button className="relative h-6 w-12 rounded-full bg-gray-300 dark:bg-gray-600">
                      <div className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white"></div>
                    </button>
                  </BreathingElement>
                </div>
              </CalmElement>
            )}
          </div>
        </div>
      </IntelligentCalmUX>

      {/* Technical Implementation */}
      <div className="technical-implementation rounded-xl bg-gray-50 p-8 dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-semibold">Technical Implementation</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold">2026 Research Integration</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>
                •
                <strong>Calm Technology:</strong>
                {' '}
                Informare senza richiedere focus
              </li>
              <li>
                •
                <strong>Cognitive Load Reduction:</strong>
                {' '}
                Minimizzare sforzo mentale
              </li>
              <li>
                •
                <strong>Neuro-Adaptive:</strong>
                {' '}
                Adattamento allo stato cognitivo
              </li>
              <li>
                •
                <strong>Zero-Noise Interfaces:</strong>
                {' '}
                Eliminare distrazioni
              </li>
              <li>
                •
                <strong>Context-Aware:</strong>
                {' '}
                Risposta al contesto di apprendimento
              </li>
              <li>
                •
                <strong>Progressive Disclosure:</strong>
                {' '}
                Informazioni graduali
              </li>
              <li>
                •
                <strong>Breathing Animations:</strong>
                {' '}
                Ritmi naturali per calma
              </li>
              <li>
                •
                <strong>Focus Preservation:</strong>
                {' '}
                Mantenere concentrazione
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Key Features</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• 5 modalità calm (off → learning → deep-focus → meditation → adaptive)</li>
              <li>• 6 stati cognitivi rilevabili automaticamente</li>
              <li>• 5 livelli di intensità visiva</li>
              <li>• Elementi con priorità (essential → important → optional)</li>
              <li>• Animazioni breathing per calma naturale</li>
              <li>• Focus indicators intelligenti</li>
              <li>• Progressive disclosure automatica</li>
              <li>• Adattamento in tempo reale al comportamento utente</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
          <h4 className="mb-2 font-semibold">Adaptive Behavior Detection</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Il sistema monitora metriche come precisione dei click, tempo di completamento task,
            tasso di errori, velocità di scroll e durata delle pause per rilevare automaticamente
            lo stato cognitivo dell'utente e adattare l'interfaccia di conseguenza.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntelligentCalmUXExample;
