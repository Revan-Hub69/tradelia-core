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
      <CalmElement priority="essential" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Blockchain Fundamentals</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Learn the core concepts of blockchain technology in this focused lesson.
        </p>
        <BreathingElement intensity="subtle" className="w-full">
          <div className="progress-bar bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
          </div>
        </BreathingElement>
      </CalmElement>

      {/* Important Content - Visible in most calm modes */}
      <CalmElement priority="important" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FocusIndicator className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-2">Key Concepts</h3>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>• Decentralization</li>
            <li>• Cryptographic Hashing</li>
            <li>• Consensus Mechanisms</li>
          </ul>
        </FocusIndicator>

        <BreathingElement intensity="medium" className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="font-semibold mb-2">Progress</h3>
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
      <CalmElement priority="optional" className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Additional Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
            <div className="font-medium">Video Tutorial</div>
            <div className="text-gray-500">15 min</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
            <div className="font-medium">Practice Quiz</div>
            <div className="text-gray-500">10 questions</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
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
    disableAdaptive 
  } = useCalmUX();

  const calmModes: CalmMode[] = ['off', 'learning', 'deep-focus', 'meditation', 'adaptive'];
  const cognitiveStates: CognitiveState[] = ['fresh', 'focused', 'tired', 'stressed', 'distracted', 'overwhelmed'];
  const visualIntensities: VisualIntensity[] = ['minimal', 'reduced', 'moderate', 'standard', 'enhanced'];

  return (
    <CalmElement priority="important" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-6">Calm UX Controls</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calm Mode Selection */}
        <div>
          <h4 className="font-medium mb-3">Calm Mode</h4>
          <div className="space-y-2">
            {calmModes.map((mode) => (
              <button
                key={mode}
                onClick={() => updateMode(mode)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  config.mode === mode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Cognitive State Simulation */}
        <div>
          <h4 className="font-medium mb-3">Cognitive State</h4>
          <div className="space-y-2">
            {cognitiveStates.map((state) => (
              <button
                key={state}
                onClick={() => updateCognitiveState(state)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  config.cognitiveState === state
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Intensity */}
        <div>
          <h4 className="font-medium mb-3">Visual Intensity</h4>
          <div className="space-y-2">
            {visualIntensities.map((intensity) => (
              <button
                key={intensity}
                onClick={() => updateVisualIntensity(intensity)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  config.visualIntensity === intensity
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Adaptive Mode Toggle */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Adaptive Mode</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatically adjust based on user behavior
            </p>
          </div>
          <button
            onClick={config.adaptiveEnabled ? disableAdaptive : enableAdaptive}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              config.adaptiveEnabled
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
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
    <div className="intelligent-calm-ux-example max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Intelligent Calm UX System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
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
            onClick={() => setSelectedDemo(key as any)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedDemo === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CalmElement priority="essential" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Progress Overview</h3>
                  <BreathingElement intensity="subtle">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Lessons Completed</span>
                        <span className="font-semibold">12/20</span>
                      </div>
                      <div className="progress-bar bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className="bg-emerald-600 h-3 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </BreathingElement>
                </CalmElement>

                <CalmElement priority="important" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <FocusIndicator className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed: Blockchain Basics</span>
                    </FocusIndicator>
                    <FocusIndicator className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Started: Smart Contracts</span>
                    </FocusIndicator>
                  </div>
                </CalmElement>

                <CalmElement priority="optional" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Achievements</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xs">First Lesson</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-2xl mb-1">⚡</div>
                      <div className="text-xs">Quick Learner</div>
                    </div>
                  </div>
                </CalmElement>
              </div>
            )}
            {selectedDemo === 'settings' && (
              <CalmElement priority="essential" className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold mb-6">Settings</h3>
                <div className="space-y-6">
                  <FocusIndicator className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Receive learning reminders</div>
                    </div>
                    <button className="w-12 h-6 bg-blue-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                    </button>
                  </FocusIndicator>
                  
                  <BreathingElement intensity="subtle" className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Dark Mode</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reduce eye strain</div>
                    </div>
                    <button className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative">
                      <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                    </button>
                  </BreathingElement>
                </div>
              </CalmElement>
            )}
          </div>
        </div>
      </IntelligentCalmUX>

      {/* Technical Implementation */}
      <div className="technical-implementation bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Technical Implementation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">2026 Research Integration</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• <strong>Calm Technology:</strong> Informare senza richiedere focus</li>
              <li>• <strong>Cognitive Load Reduction:</strong> Minimizzare sforzo mentale</li>
              <li>• <strong>Neuro-Adaptive:</strong> Adattamento allo stato cognitivo</li>
              <li>• <strong>Zero-Noise Interfaces:</strong> Eliminare distrazioni</li>
              <li>• <strong>Context-Aware:</strong> Risposta al contesto di apprendimento</li>
              <li>• <strong>Progressive Disclosure:</strong> Informazioni graduali</li>
              <li>• <strong>Breathing Animations:</strong> Ritmi naturali per calma</li>
              <li>• <strong>Focus Preservation:</strong> Mantenere concentrazione</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
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

        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-semibold mb-2">Adaptive Behavior Detection</h4>
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