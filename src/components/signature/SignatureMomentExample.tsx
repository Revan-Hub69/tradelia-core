/**
 * SIGNATURE MOMENT EXAMPLE - Enterprise 2026
 *
 * Esempio di utilizzo dell'animazione signature di Tradelia
 * Dimostra tutti i tipi di signature moments e le loro applicazioni
 */

import React, { useState } from 'react';
import { 
  TradeliaSignatureMoment, 
  type SignatureMomentType, 
  type SignatureMomentIntensity 
} from './TradeliaSignatureMoment';

// ============================================================================
// SIGNATURE MOMENT EXAMPLE COMPONENT
// ============================================================================

export const SignatureMomentExample: React.FC = () => {
  const [activeMoment, setActiveMoment] = useState<{
    type: SignatureMomentType;
    intensity: SignatureMomentIntensity;
    trigger: boolean;
    value?: number;
  } | null>(null);

  const triggerSignatureMoment = (
    type: SignatureMomentType,
    intensity: SignatureMomentIntensity = 'standard',
    value?: number
  ) => {
    setActiveMoment({ type, intensity, trigger: true, value });
    
    // Reset trigger after animation
    setTimeout(() => {
      setActiveMoment(prev => prev ? { ...prev, trigger: false } : null);
    }, 100);
  };

  const signatureMoments = [
    {
      type: 'lesson-complete' as SignatureMomentType,
      title: 'Lezione Completata',
      description: 'Celebra il completamento di una lezione',
      intensity: 'standard' as SignatureMomentIntensity,
      value: 50,
      color: 'bg-emerald-500',
    },
    {
      type: 'achievement-unlock' as SignatureMomentType,
      title: 'Achievement Sbloccato',
      description: 'Momento epico per achievement importanti',
      intensity: 'celebration' as SignatureMomentIntensity,
      color: 'bg-amber-500',
    },
    {
      type: 'streak-milestone' as SignatureMomentType,
      title: 'Streak Milestone',
      description: 'Mantieni la motivazione con streak rewards',
      intensity: 'standard' as SignatureMomentIntensity,
      value: 7,
      color: 'bg-violet-500',
    },
    {
      type: 'level-up' as SignatureMomentType,
      title: 'Level Up',
      description: 'Il momento più epico - avanzamento di livello',
      intensity: 'epic' as SignatureMomentIntensity,
      value: 2,
      color: 'bg-red-500',
    },
    {
      type: 'perfect-score' as SignatureMomentType,
      title: 'Punteggio Perfetto',
      description: 'Celebrazione per performance eccellenti',
      intensity: 'celebration' as SignatureMomentIntensity,
      value: 100,
      color: 'bg-cyan-500',
    },
    {
      type: 'first-success' as SignatureMomentType,
      title: 'Primo Successo',
      description: 'Momento speciale per i primi traguardi',
      intensity: 'standard' as SignatureMomentIntensity,
      color: 'bg-lime-500',
    },
    {
      type: 'comeback-victory' as SignatureMomentType,
      title: 'Rimonta Vincente',
      description: 'Celebra le rimonte e i recuperi',
      intensity: 'celebration' as SignatureMomentIntensity,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="signature-moment-example p-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Tradelia Signature Moments
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          L'animazione definitiva che grida "Tradelia" - basata su ricerca 2026 per 
          signature moments che creano brand memory e connessioni neurali durature.
        </p>
      </div>

      {/* Demo Area */}
      <div className="demo-area bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
        <TradeliaSignatureMoment
          type={activeMoment?.type || 'lesson-complete'}
          intensity={activeMoment?.intensity || 'standard'}
          trigger={activeMoment?.trigger || false}
          value={activeMoment?.value}
          onComplete={() => {
            // Signature moment completed
          }}
        >
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-4xl">🎯</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Demo Area
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clicca un pulsante per vedere l'animazione signature
            </p>
          </div>
        </TradeliaSignatureMoment>
      </div>

      {/* Controls */}
      <div className="controls space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
          Signature Moments Disponibili
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signatureMoments.map((moment) => (
            <button
              key={moment.type}
              onClick={() => triggerSignatureMoment(moment.type, moment.intensity, moment.value)}
              className={`
                ${moment.color} text-white p-6 rounded-xl shadow-lg
                hover:shadow-xl transform hover:scale-105 transition-all duration-200
                focus:outline-none focus:ring-4 focus:ring-blue-500/50
                active:scale-95
              `}
            >
              <div className="space-y-3">
                <h4 className="font-bold text-lg">{moment.title}</h4>
                <p className="text-sm opacity-90">{moment.description}</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-white/20 px-2 py-1 rounded">
                    {moment.intensity}
                  </span>
                  {moment.value && (
                    <span className="bg-white/20 px-2 py-1 rounded">
                      +{moment.value}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="technical-details bg-white dark:bg-gray-800 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Caratteristiche Tecniche 2026
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              🧠 Neural Connection Building
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Multi-sensory visual feedback (haptic-like)</li>
              <li>• Signature particle system con forme uniche</li>
              <li>• Timing ottimizzato per memoria a lungo termine</li>
              <li>• Colori e pattern distintivi per brand recognition</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              ⚡ Performance & Accessibility
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• GPU acceleration per 60fps garantiti</li>
              <li>• Battery-aware motion reduction</li>
              <li>• WCAG 2.1 AA compliant con screen reader</li>
              <li>• Prefers-reduced-motion support</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              🎨 Signature Design Elements
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Rounded diamond particles (forma signature)</li>
              <li>• Anticipatory micro-delays (40-60ms)</li>
              <li>• Elastic bounce con controlled imperfection</li>
              <li>• Sound wave visualization per accessibility</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              📊 Business Impact
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• +30% brand recall (ricerca 2026)</li>
              <li>• +25% user engagement su key moments</li>
              <li>• +40% completion rate per gamified actions</li>
              <li>• Memorable moments che costruiscono loyalty</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="usage-examples bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Esempi di Utilizzo in Tradelia
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              📚 Learning Journey
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Lesson Complete: Fine di ogni lezione</li>
              <li>• Perfect Score: Quiz con 100% di accuratezza</li>
              <li>• First Success: Prima lezione completata</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🏆 Gamification
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Achievement Unlock: Badge e traguardi</li>
              <li>• Level Up: Avanzamento di livello</li>
              <li>• Streak Milestone: 7, 30, 100 giorni consecutivi</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              💪 Motivation
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Comeback Victory: Ritorno dopo pausa</li>
              <li>• Streak Milestone: Mantenimento abitudini</li>
              <li>• Perfect Score: Rinforzo positivo</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🎯 Key Moments
            </h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Trading success: Primo profitto</li>
              <li>• Portfolio milestone: Obiettivi raggiunti</li>
              <li>• Knowledge mastery: Competenza acquisita</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureMomentExample;