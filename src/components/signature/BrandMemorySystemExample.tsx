/**
 * BRAND MEMORY SYSTEM EXAMPLE - Enterprise 2026
 *
 * Showcase completo del sistema che rinforza il brand Tradelia in ogni interazione
 * Dimostra come ogni momento crea memoria del brand e costruisce fedeltà
 */

import React, { useState } from 'react';

import { BrandConsistencyIndicator, BrandMemorySystem, BrandMoment, type BrandMomentType, type EmotionalTone, useBrandMemory } from './BrandMemorySystem';

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

const BrandMomentTrigger: React.FC = () => {
  const { recordBrandMoment, getLoyaltyIndicators } = useBrandMemory();
  const [selectedMoment, setSelectedMoment] = useState<BrandMomentType>('learning-milestone');
  const [triggerActive, setTriggerActive] = useState(false);

  const brandMoments: { type: BrandMomentType; label: string; description: string }[] = [
    { type: 'first-impression', label: 'First Impression', description: 'Primo contatto con Tradelia' },
    { type: 'learning-milestone', label: 'Learning Milestone', description: 'Traguardo di apprendimento' },
    { type: 'achievement-unlock', label: 'Achievement Unlock', description: 'Sblocco achievement' },
    { type: 'skill-mastery', label: 'Skill Mastery', description: 'Padronanza di una skill' },
    { type: 'community-connect', label: 'Community Connect', description: 'Connessione con la community' },
    { type: 'premium-upgrade', label: 'Premium Upgrade', description: 'Upgrade a premium' },
    { type: 'knowledge-share', label: 'Knowledge Share', description: 'Condivisione conoscenza' },
    { type: 'problem-solved', label: 'Problem Solved', description: 'Risoluzione problema' },
    { type: 'trust-building', label: 'Trust Building', description: 'Costruzione fiducia' },
    { type: 'loyalty-reward', label: 'Loyalty Reward', description: 'Ricompensa fedeltà' },
  ];

  const handleTriggerMoment = () => {
    recordBrandMoment(selectedMoment, 'content');
    setTriggerActive(true);
    setTimeout(() => setTriggerActive(false), 100);
  };

  const loyaltyIndicators = getLoyaltyIndicators();

  return (
    <div className="brand-moment-trigger bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-6">Brand Moment Trigger</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Moment Selection */}
        <div>
          <h4 className="font-medium mb-3">Select Brand Moment</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {brandMoments.map(({ type, label, description }) => (
              <button
                key={type}
                onClick={() => setSelectedMoment(type)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedMoment === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">{label}</div>
                <div className="text-xs opacity-75">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trigger & Metrics */}
        <div>
          <h4 className="font-medium mb-3">Trigger & Metrics</h4>
          
          <BrandMoment
            type={selectedMoment}
            trigger={triggerActive}
            customization={{ intensity: 'memorable' }}
          >
            <button
              onClick={handleTriggerMoment}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-emerald-700 transition-all transform hover:scale-105"
            >
              Trigger Brand Moment
            </button>
          </BrandMoment>

          <div className="mt-6 space-y-3">
            <h5 className="font-medium text-sm">Loyalty Indicators</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(loyaltyIndicators.engagement * 100)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Engagement</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-lg font-bold text-emerald-600">
                  {Math.round(loyaltyIndicators.retention * 100)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Retention</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(loyaltyIndicators.advocacy * 100)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Advocacy</div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-lg font-bold text-amber-600">
                  {Math.round(loyaltyIndicators.satisfaction * 100)}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BrandTouchpointDemo: React.FC = () => {
  const { getBrandStyles } = useBrandMemory();

  return (
    <div className="brand-touchpoint-demo space-y-6">
      <h3 className="text-xl font-semibold">Brand Touchpoint Examples</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Navigation Touchpoint */}
        <div 
          className="brand-enhanced-navigation bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
          style={getBrandStyles('navigation')}
        >
          <h4 className="font-semibold mb-3">Navigation Brand Enhancement</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
              <span>Learn</span>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Community</span>
            </div>
          </div>
        </div>

        {/* Content Touchpoint */}
        <div 
          className="brand-enhanced-content bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
          style={getBrandStyles('content')}
        >
          <h4 className="font-semibold mb-3">Content Brand Enhancement</h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Questo contenuto ha il background gradient signature di Tradelia che rinforza 
            l'identità del brand in modo sottile ma consistente.
          </p>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
            <span className="text-sm text-gray-500">Signature Colors</span>
          </div>
        </div>

        {/* Achievement Touchpoint */}
        <div 
          className="brand-enhanced-achievement bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
          style={getBrandStyles('achievements')}
        >
          <h4 className="font-semibold mb-3">Achievement Brand Enhancement</h4>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">🏆</span>
            </div>
            <div>
              <div className="font-medium">Blockchain Expert</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Achievement unlocked!</div>
            </div>
          </div>
        </div>

        {/* Notification Touchpoint */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <h4 className="font-semibold mb-3">Notification Brand Enhancement</h4>
          <BrandMoment type="trust-building" touchpoint="notifications">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-sm">Lesson Progress Saved</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Your progress is always secure with Tradelia</div>
              </div>
            </div>
          </BrandMoment>
        </div>
      </div>
    </div>
  );
};

const EmotionalToneDemo: React.FC = () => {
  const [selectedTone, setSelectedTone] = useState<EmotionalTone>('confident');
  const [showDemo, setShowDemo] = useState(false);

  const emotionalTones: { tone: EmotionalTone; label: string; description: string; color: string }[] = [
    { tone: 'confident', label: 'Confident', description: 'Fiducia e sicurezza', color: 'blue' },
    { tone: 'encouraging', label: 'Encouraging', description: 'Incoraggiamento e supporto', color: 'emerald' },
    { tone: 'celebratory', label: 'Celebratory', description: 'Celebrazione e gioia', color: 'yellow' },
    { tone: 'reassuring', label: 'Reassuring', description: 'Rassicurazione e calma', color: 'green' },
    { tone: 'inspiring', label: 'Inspiring', description: 'Ispirazione e motivazione', color: 'purple' },
    { tone: 'professional', label: 'Professional', description: 'Professionalità e competenza', color: 'gray' },
    { tone: 'warm', label: 'Warm', description: 'Calore e accoglienza', color: 'orange' },
    { tone: 'empowering', label: 'Empowering', description: 'Empowerment e crescita', color: 'indigo' },
  ];

  const handleShowDemo = () => {
    setShowDemo(true);
    setTimeout(() => setShowDemo(false), 3000);
  };

  return (
    <div className="emotional-tone-demo bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-6">Emotional Tone Demo</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tone Selection */}
        <div>
          <h4 className="font-medium mb-3">Select Emotional Tone</h4>
          <div className="grid grid-cols-2 gap-2">
            {emotionalTones.map(({ tone, label, description, color }) => (
              <button
                key={tone}
                onClick={() => setSelectedTone(tone)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedTone === tone
                    ? `bg-${color}-600 text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="font-medium">{label}</div>
                <div className="text-xs opacity-75">{description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Tone Demo */}
        <div>
          <h4 className="font-medium mb-3">Tone Demonstration</h4>
          
          <BrandMoment
            type="learning-milestone"
            customization={{ 
              tone: selectedTone, 
              intensity: 'memorable',
              personalMessage: `Questo è un esempio di tono ${selectedTone} - ogni interazione rinforza l'identità emotiva di Tradelia`
            }}
            trigger={showDemo}
          >
            <div className={`p-4 rounded-lg border-2 transition-all ${
              showDemo ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'
            }`}>
              <div className="font-medium mb-2">Brand Moment with {selectedTone} tone</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ogni momento del brand è calibrato per evocare emozioni specifiche che costruiscono 
                una connessione duratura con l'utente.
              </p>
              <button
                onClick={handleShowDemo}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Trigger {selectedTone} Moment
              </button>
            </div>
          </BrandMoment>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN EXAMPLE COMPONENT
// ============================================================================

export const BrandMemorySystemExample: React.FC = () => {
  return (
    <div className="brand-memory-system-example max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Brand Memory System
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
          Sistema che assicura che ogni interazione rinforzi il brand Tradelia e crei momenti memorabili 
          che costruiscono la fedeltà dell'utente. Basato su ricerca 2026: Brand Loyalty through UX, 
          Memorable Moments, Emotional Connections.
        </p>
      </div>

      {/* Brand Memory System Provider */}
      <BrandMemorySystem
        config={{
          brandPersonality: {
            primary: ['professionale', 'affidabile', 'innovativo'],
            secondary: ['accessibile', 'supportivo', 'ispirante'],
            voice: 'esperto ma amichevole',
            values: ['educazione di qualità', 'crescita personale', 'trasparenza'],
          },
          emotionalGoals: {
            primary: 'confident',
            secondary: 'empowering',
            avoid: ['professional'], // Use valid EmotionalTone values
          },
        }}
        onBrandMoment={(moment) => console.log('Brand moment recorded:', moment)}
        onLoyaltyChange={(indicators) => console.log('Loyalty indicators updated:', indicators)}
      >
        <div className="space-y-8">
          {/* Brand Consistency Indicator */}
          <div className="flex justify-center">
            <BrandConsistencyIndicator className="max-w-sm" />
          </div>

          {/* Brand Moment Trigger */}
          <BrandMomentTrigger />

          {/* Emotional Tone Demo */}
          <EmotionalToneDemo />

          {/* Brand Touchpoint Demo */}
          <BrandTouchpointDemo />

          {/* Brand Memory Triggers Showcase */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Brand Memory Triggers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Visual Triggers */}
              <div className="space-y-3">
                <h4 className="font-medium">Visual Triggers</h4>
                <div className="space-y-2">
                  <div className="brand-trigger-signature-blue p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Signature Blue</div>
                    <div className="text-sm opacity-75">Primary brand color</div>
                  </div>
                  <div className="brand-trigger-emerald-accent p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Emerald Accent</div>
                    <div className="text-sm opacity-75">Success & growth color</div>
                  </div>
                  <div className="brand-trigger-glass-surface p-3 rounded-lg">
                    <div className="font-medium">Glass Surface</div>
                    <div className="text-sm opacity-75">Premium glass effect</div>
                  </div>
                  <div className="brand-trigger-signature-notch p-3 bg-white dark:bg-gray-700">
                    <div className="font-medium">Signature Notch</div>
                    <div className="text-sm opacity-75">Distinctive shape</div>
                  </div>
                </div>
              </div>

              {/* Interaction Triggers */}
              <div className="space-y-3">
                <h4 className="font-medium">Interaction Triggers</h4>
                <div className="space-y-2">
                  <button className="brand-trigger-elastic-feedback w-full p-3 bg-white dark:bg-gray-700 rounded-lg text-left">
                    <div className="font-medium">Elastic Feedback</div>
                    <div className="text-sm opacity-75">Signature bounce</div>
                  </button>
                  <div className="brand-trigger-breathing-animation p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Breathing Animation</div>
                    <div className="text-sm opacity-75">Calm rhythm</div>
                  </div>
                </div>
              </div>

              {/* Content Triggers */}
              <div className="space-y-3">
                <h4 className="font-medium">Content Triggers</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Clear Explanations</div>
                    <div className="text-sm opacity-75">Easy to understand</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Practical Examples</div>
                    <div className="text-sm opacity-75">Real-world application</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Expert Insights</div>
                    <div className="text-sm opacity-75">Professional knowledge</div>
                  </div>
                </div>
              </div>

              {/* Timing Triggers */}
              <div className="space-y-3">
                <h4 className="font-medium">Timing Triggers</h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Lesson Completion</div>
                    <div className="text-sm opacity-75">Achievement moment</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Skill Unlock</div>
                    <div className="text-sm opacity-75">Progress milestone</div>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                    <div className="font-medium">Problem Solved</div>
                    <div className="text-sm opacity-75">Support success</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Implementation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-semibold mb-6">Technical Implementation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">2026 Research Integration</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• <strong>Emotional UX Design:</strong> Connessioni emotive durature</li>
                  <li>• <strong>Brand Consistency:</strong> Identità coerente in ogni touchpoint</li>
                  <li>• <strong>Memorable Moments:</strong> Momenti che rimangono impressi</li>
                  <li>• <strong>Loyalty Building:</strong> Costruire fedeltà attraverso l'esperienza</li>
                  <li>• <strong>Affective Design:</strong> Risposte emotive intenzionali</li>
                  <li>• <strong>Brand Memory Triggers:</strong> Elementi che attivano ricordi</li>
                  <li>• <strong>Emotional Resonance:</strong> Connessione emotiva profonda</li>
                  <li>• <strong>Trust Building:</strong> Costruzione di fiducia nel tempo</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Key Features</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• 10 tipi di brand moments per ogni occasione</li>
                  <li>• 8 toni emotionali calibrati per Tradelia</li>
                  <li>• 8 touchpoint brand-enhanced</li>
                  <li>• Sistema di tracking della consistenza del brand</li>
                  <li>• Metriche di loyalty in tempo reale</li>
                  <li>• Memory triggers visivi e interattivi</li>
                  <li>• Personalizzazione dei momenti del brand</li>
                  <li>• Analisi dell'emotional resonance</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h5 className="font-semibold mb-2">Brand Memory Psychology</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Il sistema utilizza principi di psicologia cognitiva per creare momenti che si imprimono 
                nella memoria dell'utente. Ogni interazione è progettata per rafforzare l'identità del brand 
                Tradelia attraverso consistenza visiva, tono emotivo appropriato e timing perfetto, 
                costruendo così una connessione duratura che si traduce in fedeltà e advocacy.
              </p>
            </div>
          </div>
        </div>
      </BrandMemorySystem>
    </div>
  );
};

export default BrandMemorySystemExample;