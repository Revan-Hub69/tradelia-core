/**
 * HAPTIC VISUAL FEEDBACK EXAMPLE - Enterprise 2026
 *
 * Showcase completo del sistema di feedback visivo tattile
 * Dimostra tutte le tipologie, intensità e texture disponibili
 */

import React, { useState } from 'react';

import { HapticVisualFeedback, type HapticFeedbackType, type HapticIntensity, type HapticTexture } from './HapticVisualFeedback';

// ============================================================================
// HAPTIC VISUAL FEEDBACK EXAMPLE
// ============================================================================

export const HapticVisualFeedbackExample: React.FC = () => {
  const [selectedType, setSelectedType] = useState<HapticFeedbackType>('tap');
  const [selectedIntensity, setSelectedIntensity] = useState<HapticIntensity>('medium');
  const [selectedTexture, setSelectedTexture] = useState<HapticTexture>('smooth');
  const [triggerDemo, setTriggerDemo] = useState(false);

  const feedbackTypes: HapticFeedbackType[] = [
    'press', 'tap', 'stroke', 'pulse', 'ripple', 
    'friction', 'magnetic', 'elastic', 'texture', 'breath'
  ];

  const intensityLevels: HapticIntensity[] = ['subtle', 'medium', 'strong', 'premium'];
  
  const textureTypes: HapticTexture[] = [
    'smooth', 'grain', 'fabric', 'metal', 'liquid', 'rubber', 'velvet', 'glass'
  ];

  const handleTriggerDemo = () => {
    setTriggerDemo(true);
    setTimeout(() => setTriggerDemo(false), 100);
  };

  return (
    <div className="haptic-visual-feedback-example max-w-6xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Haptic Visual Feedback System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Sistema di feedback visivo che simula sensazioni tattili attraverso micro-animazioni precise, 
          texture visive e movimenti che "parlano al sistema nervoso" senza hardware aggiuntivo.
        </p>
      </div>

      {/* Interactive Demo */}
      <div className="demo-area bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Interactive Demo</h2>
        
        <div className="flex justify-center mb-8">
          <HapticVisualFeedback
            type={selectedType}
            intensity={selectedIntensity}
            texture={selectedTexture}
            trigger={triggerDemo}
            className="px-8 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Demo Button
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedType} • {selectedIntensity} • {selectedTexture}
              </div>
            </div>
          </HapticVisualFeedback>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleTriggerDemo}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Trigger Haptic Feedback
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="controls grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feedback Type */}
        <div className="control-section">
          <h3 className="text-xl font-semibold mb-4">Feedback Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {feedbackTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div className="control-section">
          <h3 className="text-xl font-semibold mb-4">Intensity</h3>
          <div className="space-y-2">
            {intensityLevels.map((intensity) => (
              <button
                key={intensity}
                onClick={() => setSelectedIntensity(intensity)}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedIntensity === intensity
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {intensity}
              </button>
            ))}
          </div>
        </div>

        {/* Texture */}
        <div className="control-section">
          <h3 className="text-xl font-semibold mb-4">Texture</h3>
          <div className="grid grid-cols-2 gap-2">
            {textureTypes.map((texture) => (
              <button
                key={texture}
                onClick={() => setSelectedTexture(texture)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTexture === texture
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Preset Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Button Press */}
          <div className="example-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Button Press</h3>
            <HapticVisualFeedback
              type="press"
              intensity="medium"
              texture="smooth"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg"
            >
              Press Me
            </HapticVisualFeedback>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Simula la pressione di un pulsante fisico con feedback elastico
            </p>
          </div>

          {/* Card Tap */}
          <div className="example-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Card Tap</h3>
            <HapticVisualFeedback
              type="tap"
              intensity="subtle"
              texture="glass"
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg"
            >
              Tap Card
            </HapticVisualFeedback>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Tocco leggero con texture vetro per interazioni delicate
            </p>
          </div>

          {/* Premium Action */}
          <div className="example-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Premium Action</h3>
            <HapticVisualFeedback
              type="magnetic"
              intensity="premium"
              texture="velvet"
              className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg"
            >
              Premium
            </HapticVisualFeedback>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Attrazione magnetica con texture velluto per azioni premium
            </p>
          </div>

          {/* Calm Breath */}
          <div className="example-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Calm Breath</h3>
            <HapticVisualFeedback
              type="breath"
              intensity="subtle"
              texture="smooth"
              duration={2000}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg"
            >
              Breathe
            </HapticVisualFeedback>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Respirazione organica per momenti di calma e focus
            </p>
          </div>
        </div>
      </div>

      {/* Texture Showcase */}
      <div className="texture-showcase">
        <h2 className="text-2xl font-semibold mb-6 text-center">Texture Showcase</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {textureTypes.map((texture) => (
            <div key={texture} className="texture-demo text-center">
              <HapticVisualFeedback
                type="texture"
                intensity="medium"
                texture={texture}
                className="w-full h-24 rounded-lg border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center"
              >
                <span className="text-sm font-medium capitalize">{texture}</span>
              </HapticVisualFeedback>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="technical-implementation bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Technical Implementation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Key Features</h3>
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
            <h3 className="text-lg font-semibold mb-4">2026 Research Insights</h3>
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Usage Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="usage-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Learning Interface</h3>
            <div className="space-y-3">
              <HapticVisualFeedback type="pulse" intensity="medium" texture="smooth" className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm">
                Lesson Complete ✓
              </HapticVisualFeedback>
              <HapticVisualFeedback type="tap" intensity="subtle" texture="glass" className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm">
                Next Chapter →
              </HapticVisualFeedback>
              <HapticVisualFeedback type="breath" intensity="subtle" texture="smooth" className="w-full px-3 py-2 bg-purple-600 text-white rounded text-sm">
                Focus Mode
              </HapticVisualFeedback>
            </div>
          </div>

          <div className="usage-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Premium Actions</h3>
            <div className="space-y-3">
              <HapticVisualFeedback type="magnetic" intensity="premium" texture="velvet" className="w-full px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded text-sm">
                Upgrade to Pro
              </HapticVisualFeedback>
              <HapticVisualFeedback type="elastic" intensity="strong" texture="metal" className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded text-sm">
                Unlock Feature
              </HapticVisualFeedback>
              <HapticVisualFeedback type="ripple" intensity="premium" texture="glass" className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded text-sm">
                Premium Content
              </HapticVisualFeedback>
            </div>
          </div>

          <div className="usage-card bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Calm UX</h3>
            <div className="space-y-3">
              <HapticVisualFeedback type="breath" intensity="subtle" texture="fabric" className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm">
                Meditation Mode
              </HapticVisualFeedback>
              <HapticVisualFeedback type="stroke" intensity="subtle" texture="smooth" className="w-full px-3 py-2 bg-teal-500 text-white rounded text-sm">
                Gentle Reminder
              </HapticVisualFeedback>
              <HapticVisualFeedback type="texture" intensity="subtle" texture="rubber" className="w-full px-3 py-2 bg-indigo-500 text-white rounded text-sm">
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