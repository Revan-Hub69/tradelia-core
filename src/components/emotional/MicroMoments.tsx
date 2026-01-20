/**
 * SUCCESS MICRO-MOMENTS SYSTEM v2.0 - Enterprise 2026
 * 
 * Sistema di micro-momenti emotivi per celebrare i successi dell'utente
 * Basato su ricerca UX 2026 e best practice da:
 * - Apple Human Interface Guidelines (celebrazioni discrete)
 * - Microsoft Fluent Design (emotional resonance)
 * - Educational psychology (positive reinforcement)
 * 
 * Principi chiave:
 * - Celebrazione appropriata al contesto educativo
 * - Rinforzo positivo senza essere eccessivo
 * - Personalità Tradelia: professionale ma umana
 * - Accessibilità e rispetto per prefers-reduced-motion
 */

'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/Helpers';
import { CompleteAnimation, SuccessAnimation } from '../motion/SemanticAnimations';
import { PressAnticipatory } from '../motion/AnticipatoryFeedback';

// Tipi per i micro-momenti
export type MicroMomentType = 
  | 'lesson_complete'     // Lezione completata
  | 'streak_saved'        // Streak mantenuto
  | 'progress_milestone'  // Milestone raggiunto
  | 'xp_gained'          // XP guadagnato
  | 'path_unlocked'      // Nuovo percorso sbloccato
  | 'achievement_earned' // Achievement ottenuto
  | 'daily_goal_met'     // Obiettivo giornaliero raggiunto
  | 'concept_mastered';  // Concetto padroneggiato

export type MicroMomentIntensity = 'subtle' | 'normal' | 'celebration';

export type MicroMomentContext = 
  | 'lesson'      // Durante una lezione
  | 'dashboard'   // Nella dashboard
  | 'progress'    // Nella pagina progressi
  | 'profile'     // Nel profilo
  | 'global';     // Notifica globale

// Props per il componente principale
interface MicroMomentProps {
  type: MicroMomentType;
  intensity?: MicroMomentIntensity;
  context?: MicroMomentContext;
  data?: {
    xp?: number;
    streakDays?: number;
    lessonTitle?: string;
    achievementName?: string;
    progressPercentage?: number;
    conceptName?: string;
  };
  onComplete?: () => void;
  className?: string;
}

/**
 * Configurazione dei micro-momenti basata su ricerca UX educativa 2026
 */
const microMomentConfig = {
  lesson_complete: {
    icon: '✨',
    title: 'Lezione completata!',
    subtitle: 'Ottimo lavoro, continua così',
    duration: 2500,
    sound: 'soft-success',
    color: 'emerald',
    animation: 'celebration',
  },
  streak_saved: {
    icon: '🔥',
    title: 'Streak mantenuto!',
    subtitle: '{streakDays} giorni consecutivi',
    duration: 2000,
    sound: 'warm-chime',
    color: 'orange',
    animation: 'pulse',
  },
  progress_milestone: {
    icon: '📈',
    title: 'Traguardo raggiunto!',
    subtitle: '{progressPercentage}% completato',
    duration: 2200,
    sound: 'achievement',
    color: 'blue',
    animation: 'scale-bounce',
  },
  xp_gained: {
    icon: '⭐',
    title: '+{xp} XP',
    subtitle: 'Esperienza guadagnata',
    duration: 1800,
    sound: 'coin-collect',
    color: 'amber',
    animation: 'float-up',
  },
  path_unlocked: {
    icon: '🚀',
    title: 'Nuovo percorso sbloccato!',
    subtitle: 'Esplora nuove opportunità',
    duration: 3000,
    sound: 'unlock-fanfare',
    color: 'purple',
    animation: 'celebration',
  },
  achievement_earned: {
    icon: '🏆',
    title: 'Achievement ottenuto!',
    subtitle: '{achievementName}',
    duration: 3500,
    sound: 'trophy-fanfare',
    color: 'gold',
    animation: 'celebration',
  },
  daily_goal_met: {
    icon: '✅',
    title: 'Obiettivo giornaliero raggiunto!',
    subtitle: 'Sei in perfetto orario',
    duration: 2000,
    sound: 'gentle-success',
    color: 'green',
    animation: 'check-mark',
  },
  concept_mastered: {
    icon: '🧠',
    title: 'Concetto padroneggiato!',
    subtitle: '{conceptName}',
    duration: 2300,
    sound: 'knowledge-chime',
    color: 'indigo',
    animation: 'understanding',
  },
} as const;

/**
 * Componente principale per i micro-momenti di successo
 */
export const MicroMoment: React.FC<MicroMomentProps> = ({
  type,
  intensity = 'normal',
  context = 'global',
  data = {},
  onComplete,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const config = microMomentConfig[type];
  
  // Interpola i dati nel testo
  const interpolateText = (text: string) => {
    return text
      .replace('{xp}', data.xp?.toString() || '0')
      .replace('{streakDays}', data.streakDays?.toString() || '0')
      .replace('{lessonTitle}', data.lessonTitle || '')
      .replace('{achievementName}', data.achievementName || '')
      .replace('{progressPercentage}', data.progressPercentage?.toString() || '0')
      .replace('{conceptName}', data.conceptName || '');
  };

  // Avvia l'animazione al mount
  useEffect(() => {
    setIsVisible(true);
    setIsAnimating(true);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 300); // Fade out duration
    }, config.duration);

    return () => clearTimeout(timer);
  }, [config.duration, onComplete]);

  if (!isVisible) return null;

  const containerClasses = cn(
    // Base styles
    'fixed z-50 pointer-events-none',
    
    // Positioning based on context
    context === 'global' && 'top-4 right-4',
    context === 'lesson' && 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    context === 'dashboard' && 'top-6 right-6',
    context === 'progress' && 'bottom-6 right-6',
    context === 'profile' && 'top-4 left-4',
    
    // Animation classes
    isAnimating ? 'animate-in' : 'animate-out',
    
    className,
  );

  const cardClasses = cn(
    // Base card styles
    'glass-surface rounded-lg p-4 shadow-lg border',
    'backdrop-blur-md bg-white/10 dark:bg-black/10',
    
    // Color theming based on micro-moment type
    config.color === 'emerald' && 'border-emerald-200/30 bg-emerald-50/10',
    config.color === 'orange' && 'border-orange-200/30 bg-orange-50/10',
    config.color === 'blue' && 'border-blue-200/30 bg-blue-50/10',
    config.color === 'amber' && 'border-amber-200/30 bg-amber-50/10',
    config.color === 'purple' && 'border-purple-200/30 bg-purple-50/10',
    config.color === 'gold' && 'border-yellow-200/30 bg-yellow-50/10',
    config.color === 'green' && 'border-green-200/30 bg-green-50/10',
    config.color === 'indigo' && 'border-indigo-200/30 bg-indigo-50/10',
    
    // Intensity variations
    intensity === 'subtle' && 'scale-95 opacity-80',
    intensity === 'celebration' && 'scale-105 shadow-xl',
  );

  return (
    <div className={containerClasses}>
      <CompleteAnimation context="feedback">
        <div className={cardClasses}>
          <div className="flex items-start gap-3">
            {/* Icon with animation */}
            <div className="text-2xl flex-shrink-0">
              <SuccessAnimation context="feedback" prominent={intensity === 'celebration'}>
                <span className="block">{config.icon}</span>
              </SuccessAnimation>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-foreground">
                {interpolateText(config.title)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {interpolateText(config.subtitle)}
              </div>
            </div>
          </div>
        </div>
      </CompleteAnimation>
    </div>
  );
};

/**
 * Hook per gestire i micro-momenti
 */
export const useMicroMoments = () => {
  const [activeMoments, setActiveMoments] = useState<Array<{
    id: string;
    type: MicroMomentType;
    intensity: MicroMomentIntensity;
    context: MicroMomentContext;
    data: any;
  }>>([]);

  const triggerMicroMoment = (
    type: MicroMomentType,
    options: {
      intensity?: MicroMomentIntensity;
      context?: MicroMomentContext;
      data?: any;
    } = {}
  ) => {
    const id = `${type}-${Date.now()}`;
    const newMoment = {
      id,
      type,
      intensity: options.intensity || 'normal',
      context: options.context || 'global',
      data: options.data || {},
    };

    setActiveMoments(prev => [...prev, newMoment]);

    // Auto-remove after duration
    const config = microMomentConfig[type];
    setTimeout(() => {
      setActiveMoments(prev => prev.filter(moment => moment.id !== id));
    }, config.duration + 500);
  };

  const clearAllMoments = () => {
    setActiveMoments([]);
  };

  return {
    activeMoments,
    triggerMicroMoment,
    clearAllMoments,
  };
};

/**
 * Provider per i micro-momenti globali
 */
export const MicroMomentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeMoments } = useMicroMoments();

  return (
    <>
      {children}
      {/* Render active micro-moments */}
      {activeMoments.map(moment => (
        <MicroMoment
          key={moment.id}
          type={moment.type}
          intensity={moment.intensity}
          context={moment.context}
          data={moment.data}
        />
      ))}
    </>
  );
};

/**
 * Componenti di convenienza per casi d'uso comuni
 */

// Celebrazione completamento lezione
export const LessonCompleteMoment: React.FC<{
  lessonTitle: string;
  xp: number;
  onComplete?: () => void;
}> = ({ lessonTitle, xp, onComplete }) => (
  <MicroMoment
    type="lesson_complete"
    intensity="celebration"
    context="lesson"
    data={{ lessonTitle, xp }}
    onComplete={onComplete}
  />
);

// Notifica streak mantenuto
export const StreakSavedMoment: React.FC<{
  streakDays: number;
  context?: MicroMomentContext;
  onComplete?: () => void;
}> = ({ streakDays, context = 'dashboard', onComplete }) => (
  <MicroMoment
    type="streak_saved"
    intensity="normal"
    context={context}
    data={{ streakDays }}
    onComplete={onComplete}
  />
);

// Notifica XP guadagnato
export const XPGainedMoment: React.FC<{
  xp: number;
  context?: MicroMomentContext;
  onComplete?: () => void;
}> = ({ xp, context = 'global', onComplete }) => (
  <MicroMoment
    type="xp_gained"
    intensity="subtle"
    context={context}
    data={{ xp }}
    onComplete={onComplete}
  />
);

// Celebrazione achievement
export const AchievementMoment: React.FC<{
  achievementName: string;
  onComplete?: () => void;
}> = ({ achievementName, onComplete }) => (
  <MicroMoment
    type="achievement_earned"
    intensity="celebration"
    context="global"
    data={{ achievementName }}
    onComplete={onComplete}
  />
);

/**
 * Componente interattivo per testare i micro-momenti
 */
export const MicroMomentTester: React.FC = () => {
  const { triggerMicroMoment } = useMicroMoments();

  const testMoments = [
    {
      label: 'Lezione Completata',
      action: () => triggerMicroMoment('lesson_complete', {
        intensity: 'celebration',
        data: { lessonTitle: 'Blockchain Basics', xp: 50 }
      })
    },
    {
      label: 'Streak Salvato',
      action: () => triggerMicroMoment('streak_saved', {
        data: { streakDays: 7 }
      })
    },
    {
      label: 'XP Guadagnato',
      action: () => triggerMicroMoment('xp_gained', {
        intensity: 'subtle',
        data: { xp: 25 }
      })
    },
    {
      label: 'Achievement',
      action: () => triggerMicroMoment('achievement_earned', {
        intensity: 'celebration',
        data: { achievementName: 'First Week Complete' }
      })
    },
  ];

  return (
    <div className="space-y-4 p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold">Test Micro-Moments</h3>
      <div className="grid grid-cols-2 gap-2">
        {testMoments.map((test, index) => (
          <PressAnticipatory
            key={index}
            intensity="normal"
            hapticPattern="light"
            onPress={test.action}
            className="px-3 py-2 bg-primary text-primary-foreground rounded text-sm text-center cursor-pointer"
          >
            {test.label}
          </PressAnticipatory>
        ))}
      </div>
    </div>
  );
};

export default {
  MicroMoment,
  useMicroMoments,
  MicroMomentsProvider,
  LessonCompleteMoment,
  StreakSavedMoment,
  XPGainedMoment,
  AchievementMoment,
  MicroMomentTester,
};