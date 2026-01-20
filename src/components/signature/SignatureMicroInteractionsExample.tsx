/**
 * SIGNATURE MICRO-INTERACTIONS EXAMPLE - Integration Demo
 *
 * Esempio di integrazione delle signature micro-interactions nel sistema Tradelia
 * Dimostra come utilizzare press feedback, elastic response e haptic-like visual feedback
 */

import React, { useState } from 'react';

import {
  type DeviceType,
  type PressDepth,
  SignatureButton,
  SignatureCard,
  SignatureMicroInteractionsShowcase,
} from './SignatureMicroInteractions';

export const SignatureMicroInteractionsExample: React.FC = () => {
  const [selectedConfig, setSelectedConfig] = useState<string>('default');
  const [actionCount, setActionCount] = useState(0);

  const configOptions = [
    {
      id: 'default',
      name: 'Default Desktop',
      config: { deviceType: 'desktop' as DeviceType, depth: 'medium' as PressDepth },
    },
    {
      id: 'mobile',
      name: 'Mobile Optimized',
      config: { deviceType: 'mobile' as DeviceType, depth: 'subtle' as PressDepth },
    },
    {
      id: 'dramatic',
      name: 'Dramatic Press',
      config: { deviceType: 'desktop' as DeviceType, depth: 'dramatic' as PressDepth, elasticity: 0.6 },
    },
    {
      id: 'haptic-strong',
      name: 'Strong Haptic',
      config: { hapticIntensity: 'strong' as 'light' | 'medium' | 'strong', enableHapticVisual: true },
    },
  ];

  const currentConfig = configOptions.find(opt => opt.id === selectedConfig)?.config || {};

  return (
    <div className="signature-micro-interactions-example">
      <div className="example-header mb-8">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Signature Micro-Interactions System
        </h1>
        <p className="max-w-3xl text-lg text-gray-600">
          Sistema di micro-interazioni enterprise 2026 con press feedback signature,
          elastic response e haptic-like visual feedback. Basato su Microsoft Fluent Design
          e Apple Liquid Glass principles.
        </p>
      </div>

      {/* Configuration Selector */}
      <div className="config-selector mb-8 rounded-xl bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Configurazione Micro-Interactions
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {configOptions.map(option => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedConfig(option.id)}
              className={`
                rounded-lg px-4 py-2 text-sm font-medium transition-colors
                ${selectedConfig === option.id
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
            }
              `}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="interactive-demo mb-8">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">Demo Interattivo</h2>

        <div className="demo-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Button Variants */}
          <div className="demo-section">
            <h3 className="mb-4 text-lg font-medium text-gray-700">Signature Buttons</h3>
            <div className="space-y-3">
              <SignatureButton
                config={currentConfig}
                variant="primary"
                onClick={() => setActionCount(prev => prev + 1)}
              >
                Primary Action
              </SignatureButton>
              <SignatureButton
                config={currentConfig}
                variant="secondary"
                onClick={() => setActionCount(prev => prev + 1)}
              >
                Secondary Action
              </SignatureButton>
              <SignatureButton
                config={currentConfig}
                variant="success"
                size="lg"
                onClick={() => setActionCount(prev => prev + 1)}
              >
                Success Large
              </SignatureButton>
            </div>
          </div>

          {/* Card Interactions */}
          <div className="demo-section">
            <h3 className="mb-4 text-lg font-medium text-gray-700">Signature Cards</h3>
            <div className="space-y-4">
              <SignatureCard
                config={currentConfig}
                onClick={() => setActionCount(prev => prev + 1)}
              >
                <h4 className="font-semibold text-gray-900">Interactive Card</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Clicca per testare il signature press feedback
                </p>
              </SignatureCard>
              <SignatureCard
                config={currentConfig}
                onClick={() => setActionCount(prev => prev + 1)}
              >
                <h4 className="font-semibold text-gray-900">Elastic Response</h4>
                <p className="mt-2 text-sm text-gray-600">
                  Animazione elastica con controlled imperfection
                </p>
              </SignatureCard>
            </div>
          </div>

          {/* Stats & Feedback */}
          <div className="demo-section">
            <h3 className="mb-4 text-lg font-medium text-gray-700">Feedback Stats</h3>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{actionCount}</div>
                <div className="text-sm text-gray-600">Interazioni Totali</div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                <div>
                  Config:
                  {' '}
                  {configOptions.find(opt => opt.id === selectedConfig)?.name}
                </div>
                <div>
                  Device:
                  {' '}
                  {(currentConfig as any).deviceType || 'desktop'}
                </div>
                <div>
                  Depth:
                  {' '}
                  {(currentConfig as any).depth || 'medium'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Features */}
      <div className="technical-features mb-8 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Caratteristiche Tecniche Enterprise 2026
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="feature-card rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">🎯</div>
            <h3 className="mb-2 font-semibold text-gray-900">Press Depth Variations</h3>
            <p className="text-sm text-gray-600">
              Adattamento automatico della profondità di pressione basato su device type,
              context e user preferences.
            </p>
          </div>
          <div className="feature-card rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">🌊</div>
            <h3 className="mb-2 font-semibold text-gray-900">Elastic Response</h3>
            <p className="text-sm text-gray-600">
              Animazioni elastiche con controlled imperfection per aggiungere
              personalità umana alle interazioni.
            </p>
          </div>
          <div className="feature-card rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">📱</div>
            <h3 className="mb-2 font-semibold text-gray-900">Haptic-like Visual</h3>
            <p className="text-sm text-gray-600">
              Feedback visivo che simula sensazioni tattili attraverso
              ripple effects e visual cues.
            </p>
          </div>
          <div className="feature-card rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">⚡</div>
            <h3 className="mb-2 font-semibold text-gray-900">GPU Accelerated</h3>
            <p className="text-sm text-gray-600">
              Ottimizzato per 60fps con transform3d, will-change properties
              e GPU acceleration.
            </p>
          </div>
          <div className="feature-card rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">🎨</div>
            <h3 className="mb-2 font-semibold text-gray-900">Context-Aware</h3>
            <p className="text-sm text-gray-600">
              Adattamento automatico basato su context (primary, danger, success)
              e device capabilities.
            </p>
          </div>
          <div className="feature-card rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-2 text-2xl">♿</div>
            <h3 className="mb-2 font-semibold text-gray-900">Accessible</h3>
            <p className="text-sm text-gray-600">
              Supporto completo per prefers-reduced-motion, high-contrast
              e screen readers.
            </p>
          </div>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="implementation-guide mb-8 rounded-xl bg-gray-50 p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Guida all'Implementazione
        </h2>
        <div className="prose prose-gray max-w-none">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900">Basic Usage</h3>
              <div className="rounded-lg bg-gray-900 p-4 text-sm">
                <pre className="text-green-400">
                  {`import { SignatureButton } from '@/components/signature';

<SignatureButton
  config={{
    deviceType: 'desktop',
    depth: 'medium',
    elasticity: 0.3
  }}
  variant="primary"
  onClick={handleClick}
>
  Click Me
</SignatureButton>`}
                </pre>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-medium text-gray-900">Advanced Config</h3>
              <div className="rounded-lg bg-gray-900 p-4 text-sm">
                <pre className="text-green-400">
                  {`const config = {
  depth: 'dramatic',
  hapticIntensity: 'strong',
  enableHapticVisual: true,
  enableElasticResponse: true,
  elasticity: 0.6,
  duration: 200
};`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Showcase */}
      <div className="full-showcase">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Showcase Completo
        </h2>
        <SignatureMicroInteractionsShowcase />
      </div>
    </div>
  );
};

export default SignatureMicroInteractionsExample;
