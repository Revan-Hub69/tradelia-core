/**
 * HAPTIC VISUAL FEEDBACK EXAMPLE - Enterprise 2026
 *
 * Showcase completo del sistema di feedback visivo tattile
 * Dimostra tutte le tipologie, intensità e texture disponibili
 */

import React, { useState } from 'react';

import { type HapticFeedbackType, type HapticIntensity, type HapticTexture, HapticVisualFeedback } from './HapticVisualFeedback';

// ============================================================================
// HAPTIC VISUAL FEEDBACK EXAMPLE
// ============================================================================

export const HapticVisualFeedbackExample: React.FC = () => {
  const [selectedType, setSelectedType] = useState<HapticFeedbackType>('tap');
  const [selectedIntensity, setSelectedIntensity] = useState<HapticIntensity>('medium');
  const [selectedTexture, setSelectedTexture] = useState<HapticTexture>('smooth');
  const [triggerDemo, setTriggerDemo] = useState(false);

  const feedbackTypes: HapticFeedbackType[] = [
    'press',
    'tap',
    'stroke',
    'pulse',
    'ripple',
    'friction',
    'magnetic',
    'elastic',
    'texture',
    'breath',
  ];

  const intensityLevels: HapticIntensity[] = ['subtle', 'medium', 'strong', 'premium'];

  const textureTypes: HapticTexture[] = [
    'smooth',
    'grain',
    'fabric',
    'metal',
    'liquid',
    'rubber',
    'velvet',
    'glass',
  ];

  const handleTriggerDemo = () => {
    setTriggerDemo(true);
    setTimeout(() => setTriggerDemo(false), 100);
  };

  return (
    <div className="haptic-visual-feedback-example mx-auto max-w-6xl space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Haptic Visual Feedback System
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          Sistema di feedback visivo che simula sensazioni tattili attraverso micro-animazioni precise,
          texture visive e movimenti che "parlano al sistema nervoso" senza hardware aggiuntivo.
        </p>
      </div>

      {/* Interactive Demo */}
      <div className="demo-area rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 dark:from-gray-800 dark:to-gray-900">
        <h2 className="mb-6 text-center text-2xl font-semibold">Interactive Demo</h2>

        <div className="mb-8 flex justify-center">
          <HapticVisualFeedback
            type={selectedType}
            intensity={selectedIntensity}
            texture={selectedTexture}
            trigger={triggerDemo}
            className="rounded-xl bg-white px-8 py-4 shadow-lg dark:bg-gray-800"
          >
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                Demo Button
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedType}
                {' '}
                •
                {selectedIntensity}
                {' '}
                •
                {selectedTexture}
              </div>
            </div>
          </HapticVisualFeedback>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleTriggerDemo}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Trigger Haptic Feedback
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="controls grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Feedback Type */}
        <div className="control-section">
          <h3 className="mb-4 text-xl font-semibold">Feedback Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {feedbackTypes.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div className="control-section">
          <h3 className="mb-4 text-xl font-semibold">Intensity</h3>
          <div className="space-y-2">
            {intensityLevels.map(intensity => (
              <button
                key={intensity}
                onClick={() => setSelectedIntensity(intensity)}
                className={`w-full rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedIntensity === intensity
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>

        {/* Texture */}
        <div className="control-section">
          <h3 className="mb-4 text-xl font-semibold">Texture</h3>
          <div className="grid grid-cols-2 gap-2">
            {textureTypes.map(texture => (
              <button
                key={texture}
                onClick={() => setSelectedTexture(texture)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedTexture === texture
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {texture}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preset Examples */}
      <div className="preset-examples">
        <h2 className="mb-6 text-center text-2xl font-semibold">Preset Examples</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Button Press */}
          <div className="example-card rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Button Press</h3>
            <HapticVisualFeedback
              type="press"
              intensity="medium"
              texture="smooth"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white"
            >
              Press Me
            </HapticVisualFeedback>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Simula la pressione di un pulsante fisico con feedback elastico
            </p>
          </div>

          {/* Card Tap */}
          <div className="example-card rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Card Tap</h3>
            <HapticVisualFeedback
              type="tap"
              intensity="subtle"
              texture="glass"
              className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-white"
            >
              Tap Card
            </HapticVisualFeedback>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Tocco leggero con texture vetro per interazioni delicate
            </p>
          </div>

          {/* Premium Action */}
          <div className="example-card rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Premium Action</h3>
            <HapticVisualFeedback
              type="magnetic"
              intensity="premium"
              texture="velvet"
              className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-white"
            >
              Premium
            </HapticVisualFeedback>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Attrazione magnetica con texture velluto per azioni premium
            </p>
          </div>

          {/* Calm Breath */}
          <div className="example-card rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Calm Breath</h3>
            <HapticVisualFeedback
              type="breath"
              intensity="subtle"
              texture="smooth"
              duration={2000}
              className="w-full rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 text-white"
            >
              Breathe
            </HapticVisualFeedback>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Respirazione organica per momenti di calma e focus
            </p>
          </div>
        </div>
      </div>

      {/* Texture Showcase */}
      <div className="texture-showcase">
        <h2 className="mb-6 text-center text-2xl font-semibold">Texture Showcase</h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {textureTypes.map(texture => (
            <div key={texture} className="texture-demo text-center">
              <HapticVisualFeedback
                type="texture"
                intensity="medium"
                texture={texture}
                className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-gray-200 dark:border-gray-700"
              >
                <span className="text-sm font-medium capitalize">{texture}</span>
              </HapticVisualFeedback>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="technical-implementation rounded-xl bg-gray-50 p-8 dark:bg-gray-800">
        <h2 className="mb-6 text-2xl font-semibold">Technical Implementation</h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Key Features</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• 10 tipi di feedback tattile simulato</li>
              <li>• 4 livelli di intensità (subtle → premium)</li>
              <li>• 8 texture visive realistiche</li>
              <li>• Animazioni ottimizzate per 60fps</li>
              <li>• Supporto completo per accessibilità</li>
              <li>• Rispetto per prefers-reduced-motion</li>
              <li>• GPU acceleration per performance</li>
              <li>• Zero dipendenze hardware</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">2026 Research Insights</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Visual tactility che inganna il cervello</li>
              <li>• Micro-movements che creano mood emotivo</li>
              <li>• Feedback che "parla al sistema nervoso"</li>
              <li>• Texture senza hardware aggiuntivo</li>
              <li>• Ritmo e tempo per connessione emotiva</li>
              <li>• Multi-sensory design per immersione</li>
              <li>• Haptic design principles 2026</li>
              <li>• Sensory web design evolution</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="usage-examples">
        <h2 className="mb-6 text-center text-2xl font-semibold">Usage Examples</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="usage-card rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Learning Interface</h3>
            <div className="space-y-3">
              <HapticVisualFeedback type="pulse" intensity="medium" texture="smooth" className="w-full rounded bg-green-600 px-3 py-2 text-sm text-white">
                Lesson Complete ✓
              </HapticVisualFeedback>
              <HapticVisualFeedback type="tap" intensity="subtle" texture="glass" className="w-full rounded bg-blue-600 px-3 py-2 text-sm text-white">
                Next Chapter →
              </HapticVisualFeedback>
              <HapticVisualFeedback type="breath" intensity="subtle" texture="smooth" className="w-full rounded bg-purple-600 px-3 py-2 text-sm text-white">
                Focus Mode
              </HapticVisualFeedback>
            </div>
          </div>

          <div className="usage-card rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Premium Actions</h3>
            <div className="space-y-3">
              <HapticVisualFeedback type="magnetic" intensity="premium" texture="velvet" className="w-full rounded bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2 text-sm text-white">
                Upgrade to Pro
              </HapticVisualFeedback>
              <HapticVisualFeedback type="elastic" intensity="strong" texture="metal" className="w-full rounded bg-gradient-to-r from-purple-500 to-pink-600 px-3 py-2 text-sm text-white">
                Unlock Feature
              </HapticVisualFeedback>
              <HapticVisualFeedback type="ripple" intensity="premium" texture="glass" className="w-full rounded bg-gradient-to-r from-blue-500 to-cyan-600 px-3 py-2 text-sm text-white">
                Premium Content
              </HapticVisualFeedback>
            </div>
          </div>

          <div className="usage-card rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-semibold">Calm UX</h3>
            <div className="space-y-3">
              <HapticVisualFeedback type="breath" intensity="subtle" texture="fabric" className="w-full rounded bg-green-500 px-3 py-2 text-sm text-white">
                Meditation Mode
              </HapticVisualFeedback>
              <HapticVisualFeedback type="stroke" intensity="subtle" texture="smooth" className="w-full rounded bg-teal-500 px-3 py-2 text-sm text-white">
                Gentle Reminder
              </HapticVisualFeedback>
              <HapticVisualFeedback type="texture" intensity="subtle" texture="rubber" className="w-full rounded bg-indigo-500 px-3 py-2 text-sm text-white">
                Soft Interaction
              </HapticVisualFeedback>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HapticVisualFeedbackExample;
