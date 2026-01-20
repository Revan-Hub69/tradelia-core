/**
 * SOFT REASSURANCE SYSTEM v2.0 - Enterprise 2026
 * 
 * Sistema di messaggi rassicuranti per contesti educativi e finanziari
 * Basato su ricerca UX 2026 e psicologia educativa:
 * - Riduzione dell'ansia in contesti crypto/finanziari
 * - Rinforzo positivo per l'apprendimento
 * - Tono professionale ma umano (signature Tradelia)
 * - Messaggi contestuali e adattivi
 */

'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/Helpers';
import { EnterAnimation } from '../motion/SemanticAnimations';

// Tipi per i messaggi di rassicurazione
export type ReassuranceType = 
  | 'auto_save'           // Salvataggio automatico
  | 'safe_action'         // Azione sicura completata
  | 'no_action_needed'    // Nessuna azione richiesta
  | 'progress_secure'     // Progressi al sicuro
  | 'learning_on_track'   // Apprendimento in linea
  | 'data_protected'      // Dati protetti
  | 'no_rush'            // Nessuna fretta
  | 'safe_to_explore'    // Sicuro esplorare
  | 'backup_complete'    // Backup completato
  | 'connection_stable'; // Connessione stabile

export type ReassuranceContext = 
  | 'financial'    // Contesto finanziario/crypto
  | 'educational'  // Contesto educativo
  | 'technical'    // Contesto tecnico
  | 'personal'     // Dati personali
  | 'progress';    // Progressi di apprendimento

export type ReassuranceTone = 
  | 'gentle'       // Tono gentile e rassicurante
  | 'confident'    // Tono sicuro e professionale
  | 'supportive'   // Tono di supporto
  | 'informative'; // Tono informativo

// Props per il componente di rassicurazione
interface ReassuranceMessageProps {
  type: ReassuranceType;
  context?: ReassuranceContext;
  tone?: ReassuranceTone;
  customMessage?: string;
  duration?: number;
  persistent?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Configurazione dei messaggi di rassicurazione
 * Basata su ricerca UX educativa e psicologia della fiducia
 */
const reassuranceConfig = {
  auto_save: {
    icon: '💾',
    message: {
      it: 'Salvato automaticamente',
      en: 'Saved automatically'
    },
    tone: 'gentle' as ReassuranceTone,
    duration: 2000,
    color: 'green',
  },
  safe_action: {
    icon: '✅',
    message: {
      it: 'Sei a posto',
      en: 'You\'re all set'
    },
    tone: 'confident' as ReassuranceTone,
    duration: 1500,
    color: 'emerald',
  },
  no_action_needed: {
    icon: '😌',
    message: {
      it: 'Nessuna azione richiesta',
      en: 'No action needed'
    },
    tone: 'gentle' as ReassuranceTone,
    duration: 2500,
    color: 'blue',
  },
  progress_secure: {
    icon: '🔒',
    message: {
      it: 'I tuoi progressi sono al sicuro',
      en: 'Your progress is secure'
    },
    tone: 'confident' as ReassuranceTone,
    duration: 2200,
    color: 'indigo',
  },
  learning_on_track: {
    icon: '📚',
    message: {
      it: 'Stai andando bene',
      en: 'You\'re doing great'
    },
    tone: 'supportive' as ReassuranceTone,
    duration: 2000,
    color: 'purple',
  },
  data_protected: {
    icon: '🛡️',
    message: {
      it: 'I tuoi dati sono protetti',
      en: 'Your data is protected'
    },
    tone: 'confident' as ReassuranceTone,
    duration: 2500,
    color: 'slate',
  },
  no_rush: {
    icon: '⏰',
    message: {
      it: 'Prenditi il tempo che ti serve',
      en: 'Take your time'
    },
    tone: 'gentle' as ReassuranceTone,
    duration: 3000,
    color: 'amber',
  },
  safe_to_explore: {
    icon: '🧭',
    message: {
      it: 'Sicuro esplorare',
      en: 'Safe to explore'
    },
    tone: 'supportive' as ReassuranceTone,
    duration: 2000,
    color: 'teal',
  },
  backup_complete: {
    icon: '☁️',
    message: {
      it: 'Backup completato',
      en: 'Backup complete'
    },
    tone: 'informative' as ReassuranceTone,
    duration: 1800,
    color: 'sky',
  },
  connection_stable: {
    icon: '📶',
    message: {
      it: 'Connessione stabile',
      en: 'Connection stable'
    },
    tone: 'informative' as ReassuranceTone,
    duration: 1500,
    color: 'green',
  },
} as const;

/**
 * Componente principale per i messaggi di rassicurazione
 */
export const ReassuranceMessage: React.FC<ReassuranceMessageProps> = ({
  type,
  tone,
  customMessage,
  duration,
  persistent = false,
  onDismiss,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [locale, setLocale] = useState<'it' | 'en'>('it');
  
  const config = reassuranceConfig[type];
  const finalTone = tone || config.tone;
  const finalDuration = duration || config.duration;
  
  // Detect locale (simplified - in real app would use next-intl)
  useEffect(() => {
    const detectedLocale = navigator.language.startsWith('it') ? 'it' : 'en';
    setLocale(detectedLocale);
  }, []);

  // Auto-dismiss se non persistente
  useEffect(() => {
    if (!persistent) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onDismiss?.(), 300);
      }, finalDuration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [persistent, finalDuration, onDismiss]);

  if (!isVisible) return null;

  const message = customMessage || config.message[locale];

  const containerClasses = cn(
    // Base styles
    'inline-flex items-center gap-2 px-3 py-2 rounded-lg',
    'glass-surface border backdrop-blur-sm',
    'text-sm font-medium',
    
    // Color theming
    config.color === 'green' && 'bg-green-50/80 border-green-200/50 text-green-800 dark:bg-green-950/30 dark:border-green-800/50 dark:text-green-200',
    config.color === 'emerald' && 'bg-emerald-50/80 border-emerald-200/50 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800/50 dark:text-emerald-200',
    config.color === 'blue' && 'bg-blue-50/80 border-blue-200/50 text-blue-800 dark:bg-blue-950/30 dark:border-blue-800/50 dark:text-blue-200',
    config.color === 'indigo' && 'bg-indigo-50/80 border-indigo-200/50 text-indigo-800 dark:bg-indigo-950/30 dark:border-indigo-800/50 dark:text-indigo-200',
    config.color === 'purple' && 'bg-purple-50/80 border-purple-200/50 text-purple-800 dark:bg-purple-950/30 dark:border-purple-800/50 dark:text-purple-200',
    config.color === 'slate' && 'bg-slate-50/80 border-slate-200/50 text-slate-800 dark:bg-slate-950/30 dark:border-slate-800/50 dark:text-slate-200',
    config.color === 'amber' && 'bg-amber-50/80 border-amber-200/50 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-200',
    config.color === 'teal' && 'bg-teal-50/80 border-teal-200/50 text-teal-800 dark:bg-teal-950/30 dark:border-teal-800/50 dark:text-teal-200',
    config.color === 'sky' && 'bg-sky-50/80 border-sky-200/50 text-sky-800 dark:bg-sky-950/30 dark:border-sky-800/50 dark:text-sky-200',
    
    // Tone variations
    finalTone === 'gentle' && 'shadow-sm',
    finalTone === 'confident' && 'shadow-md font-semibold',
    finalTone === 'supportive' && 'shadow-sm',
    finalTone === 'informative' && 'shadow-sm opacity-90',
    
    className,
  );

  return (
    <EnterAnimation context="feedback">
      <div className={containerClasses}>
        <span className="text-base flex-shrink-0">{config.icon}</span>
        <span>{message}</span>
        {persistent && (
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onDismiss?.(), 300);
            }}
            className="ml-2 text-current/60 hover:text-current/80 transition-colors"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </EnterAnimation>
  );
};

/**
 * Hook per gestire i messaggi di rassicurazione
 */
export const useReassurance = () => {
  const [activeMessages, setActiveMessages] = useState<Array<{
    id: string;
    type: ReassuranceType;
    context: ReassuranceContext;
    tone?: ReassuranceTone;
    customMessage?: string;
    persistent?: boolean;
  }>>([]);

  const showReassurance = (
    type: ReassuranceType,
    options: {
      context?: ReassuranceContext;
      tone?: ReassuranceTone;
      customMessage?: string;
      persistent?: boolean;
    } = {}
  ) => {
    const id = `${type}-${Date.now()}`;
    const newMessage = {
      id,
      type,
      context: options.context || 'educational',
      tone: options.tone,
      customMessage: options.customMessage,
      persistent: options.persistent || false,
    };

    setActiveMessages(prev => [...prev, newMessage]);

    // Auto-remove se non persistente
    if (!options.persistent) {
      const config = reassuranceConfig[type];
      setTimeout(() => {
        setActiveMessages(prev => prev.filter(msg => msg.id !== id));
      }, config.duration + 500);
    }
  };

  const dismissMessage = (id: string) => {
    setActiveMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const clearAllMessages = () => {
    setActiveMessages([]);
  };

  return {
    activeMessages,
    showReassurance,
    dismissMessage,
    clearAllMessages,
  };
};

/**
 * Componenti di convenienza per casi d'uso comuni
 */

// Auto-save indicator
export const AutoSaveIndicator: React.FC<{
  visible: boolean;
  context?: ReassuranceContext;
}> = ({ visible, context = 'educational' }) => {
  if (!visible) return null;
  
  return (
    <ReassuranceMessage
      type="auto_save"
      context={context}
      duration={1500}
    />
  );
};

// Progress security message
export const ProgressSecurityMessage: React.FC<{
  context?: ReassuranceContext;
  onDismiss?: () => void;
}> = ({ context = 'progress', onDismiss }) => (
  <ReassuranceMessage
    type="progress_secure"
    context={context}
    onDismiss={onDismiss}
  />
);

// Learning encouragement
export const LearningEncouragement: React.FC<{
  customMessage?: string;
  onDismiss?: () => void;
}> = ({ customMessage, onDismiss }) => (
  <ReassuranceMessage
    type="learning_on_track"
    context="educational"
    customMessage={customMessage}
    onDismiss={onDismiss}
  />
);

// Safe exploration message
export const SafeExplorationMessage: React.FC<{
  context?: ReassuranceContext;
}> = ({ context = 'educational' }) => (
  <ReassuranceMessage
    type="safe_to_explore"
    context={context}
    tone="supportive"
  />
);

/**
 * Provider per messaggi di rassicurazione globali
 */
export const ReassuranceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeMessages, dismissMessage } = useReassurance();

  return (
    <>
      {children}
      {/* Render active reassurance messages */}
      <div className="fixed bottom-4 left-4 z-40 space-y-2">
        {activeMessages.map(message => (
          <ReassuranceMessage
            key={message.id}
            type={message.type}
            context={message.context}
            tone={message.tone}
            customMessage={message.customMessage}
            persistent={message.persistent}
            onDismiss={() => dismissMessage(message.id)}
          />
        ))}
      </div>
    </>
  );
};

/**
 * Componente per testare i messaggi di rassicurazione
 */
export const ReassuranceTester: React.FC = () => {
  const { showReassurance } = useReassurance();

  const testMessages = [
    {
      label: 'Auto Save',
      action: () => showReassurance('auto_save', { context: 'educational' })
    },
    {
      label: 'Sei a posto',
      action: () => showReassurance('safe_action', { context: 'financial' })
    },
    {
      label: 'Progressi sicuri',
      action: () => showReassurance('progress_secure', { context: 'progress' })
    },
    {
      label: 'Stai andando bene',
      action: () => showReassurance('learning_on_track', { context: 'educational' })
    },
    {
      label: 'Nessuna fretta',
      action: () => showReassurance('no_rush', { context: 'educational' })
    },
    {
      label: 'Sicuro esplorare',
      action: () => showReassurance('safe_to_explore', { context: 'educational' })
    },
  ];

  return (
    <div className="space-y-4 p-6 rounded-lg border bg-card">
      <h3 className="text-lg font-semibold">Test Reassurance Messages</h3>
      <div className="grid grid-cols-2 gap-2">
        {testMessages.map((test, index) => (
          <button
            key={index}
            onClick={test.action}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
          >
            {test.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default {
  ReassuranceMessage,
  useReassurance,
  ReassuranceProvider,
  AutoSaveIndicator,
  ProgressSecurityMessage,
  LearningEncouragement,
  SafeExplorationMessage,
  ReassuranceTester,
};