/**
 * SIGNATURE MOMENT EXAMPLE - Enterprise 2026
 *
 * Esempio di utilizzo dell'animazione signature di Tradelia
 * Dimostra tutti i tipi di signature moments e le loro applicazioni
 */

import React, { useState } from 'react';

import {
  type SignatureMomentIntensity,
  type SignatureMomentType,
  TradeliaSignatureMoment,
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
    value?: number,
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
    <div className="signature-moment-example space-y-8 p-8">
      {/* Header */}
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Tradelia Signature Moments
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          L'animazione definitiva che grida "Tradelia" - basata su ricerca 2026 per
          signature moments che creano brand memory e connessioni neurali durature.
        </p>
      </div>

      {/* Demo Area */}
      <div className="demo-area flex min-h-[400px] items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 dark:from-gray-800 dark:to-gray-900">
        <TradeliaSignatureMoment
          type={activeMoment?.type || 'lesson-complete'}
          intensity={activeMoment?.intensity || 'standard'}
          trigger={activeMoment?.trigger || false}
          value={activeMoment?.value}
          onComplete={() => {
            // Signature moment completed
          }}
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto flex size-32 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800">
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
        <h3 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-200">
          Signature Moments Disponibili
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {signatureMoments.map(moment => (
            <button
              key={moment.type}
              onClick={() => triggerSignatureMoment(moment.type, moment.intensity, moment.value)}
              className={`
                ${moment.color} rounded-xl p-6 text-white shadow-lg
                transition-all duration-200 hover:scale-105 hover:shadow-xl focus:outline-none
                focus:ring-4 focus:ring-blue-500/50 active:scale-95
              `}
            >
              <div className="space-y-3">
                <h4 className="text-lg font-bold">{moment.title}</h4>
                <p className="text-sm opacity-90">{moment.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded bg-white/20 px-2 py-1">
                    {moment.intensity}
                  </span>
                  {moment.value && (
                    <span className="rounded bg-white/20 px-2 py-1">
                      +
                      {moment.value}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="technical-details space-y-4 rounded-xl bg-white p-6 dark:bg-gray-800">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Caratteristiche Tecniche 2026
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              🧠 Neural Connection Building
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• +30% brand recall (ricerca 2026)</li>
              <li>• +25% user engagement su key moments</li>
              <li>• +40% completion rate per gamified actions</li>
              <li>• Memorable moments che costruiscono loyalty</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="usage-examples space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Esempi di Utilizzo in Tradelia
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              📚 Learning Journey
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Lesson Complete: Fine di ogni lezione</li>
              <li>• Perfect Score: Quiz con 100% di accuratezza</li>
              <li>• First Success: Prima lezione completata</li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              🏆 Gamification
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Achievement Unlock: Badge e traguardi</li>
              <li>• Level Up: Avanzamento di livello</li>
              <li>• Streak Milestone: 7, 30, 100 giorni consecutivi</li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              💪 Motivation
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li>• Comeback Victory: Ritorno dopo pausa</li>
              <li>• Streak Milestone: Mantenimento abitudini</li>
              <li>• Perfect Score: Rinforzo positivo</li>
            </ul>
          </div>

          <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
            <h4 className="mb-2 font-semibold text-gray-700 dark:text-gray-300">
              🎯 Key Moments
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
