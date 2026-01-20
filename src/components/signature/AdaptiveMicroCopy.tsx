/**
 * ADAPTIVE MICRO-COPY SYSTEM - Enterprise 2026
 *
 * Sistema di micro-copy adattivo basato su ricerca UX 2026:
 * - Context-aware messaging che si adatta al user state
 * - Tone adaptation basato su emotional state e task context
 * - Human-centered language che riduce friction e aumenta trust
 * - Specific action clarity per ridurre ambiguità
 * - Progressive status communication intelligente
 *
 * Implementa:
 * - Context-aware button text e messaging
 * - Tone adaptation per diversi user states
 * - Trust-building reassurance messaging
 * - Progressive status updates con personality
 * - Emotional state-aware micro-copy
 */

import React, { useState, useCallback, useMemo, useContext, createContext } from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type UserState = 'new' | 'returning' | 'engaged' | 'hesitant' | 'expert';
export type EmotionalState = 'confident' | 'uncertain' | 'frustrated' | 'excited' | 'focused';
export type TaskContext = 'learning' | 'trading' | 'onboarding' | 'settings' | 'financial' | 'social';
export type ActionType = 'primary' | 'secondary' | 'destructive' | 'financial' | 'social' | 'educational';
export type ToneStyle = 'professional' | 'friendly' | 'encouraging' | 'reassuring' | 'celebratory';

export type MicroCopyContext = {
  userState: UserState;
  emotionalState: EmotionalState;
  taskContext: TaskContext;
  isFirstTime: boolean;
  hasErrors: boolean;
  isLoading: boolean;
  progressPercentage?: number;
  locale: 'it' | 'en';
};

export type AdaptiveMicroCopyConfig = {
  actionType: ActionType;
  baseText: string;
  context?: Partial<MicroCopyContext>;
  enableToneAdaptation: boolean;
  enableContextAwareness: boolean;
  enableProgressiveMessaging: boolean;
  enableTrustBuilding: boolean;
};

// ============================================================================
// MICRO-COPY CONTEXT
// ============================================================================

const MicroCopyContextProvider = createContext<MicroCopyContext>({
  userState: 'new',
  emotionalState: 'confident',
  taskContext: 'learning',
  isFirstTime: true,
  hasErrors: false,
  isLoading: false,
  locale: 'it',
});

export const useMicroCopyContext = () => useContext(MicroCopyContextProvider);

export const MicroCopyProvider: React.FC<{
  children: React.ReactNode;
  context: MicroCopyContext;
}> = ({ children, context }) => {
  return (
    <MicroCopyContextProvider.Provider value={context}>
      {children}
    </MicroCopyContextProvider.Provider>
  );
};

// ============================================================================
// ADAPTIVE MICRO-COPY ENGINE
// ============================================================================

export const useAdaptiveMicroCopy = () => {
  // Tone adaptation based on user and emotional state
  const getToneStyle = useCallback((
    userState: UserState,
    emotionalState: EmotionalState,
    taskContext: TaskContext
  ): ToneStyle => {
    // Financial contexts require more reassurance
    if (taskContext === 'financial') {
      if (emotionalState === 'uncertain' || emotionalState === 'frustrated') {
        return 'reassuring';
      }
      return 'professional';
    }

    // Learning contexts benefit from encouragement
    if (taskContext === 'learning') {
      if (emotionalState === 'frustrated') {
        return 'encouraging';
      }
      if (emotionalState === 'excited') {
        return 'celebratory';
      }
      return 'friendly';
    }

    // Onboarding needs friendly guidance
    if (taskContext === 'onboarding') {
      return userState === 'new' ? 'friendly' : 'professional';
    }

    // Default professional for settings and other contexts
    return 'professional';
  }, []);

  // Context-aware message adaptation
  const adaptMessage = useCallback((
    baseText: string,
    actionType: ActionType,
    context: MicroCopyContext
  ): string => {
    const tone = getToneStyle(context.userState, context.emotionalState, context.taskContext);
    const locale = context.locale;

    // Message templates by tone and locale
    const messageTemplates = {
      it: {
        professional: {
          primary: (text: string) => text,
          secondary: (text: string) => text,
          destructive: (text: string) => `${text} (irreversibile)`,
          financial: (text: string) => `${text} in sicurezza`,
          social: (text: string) => text,
          educational: (text: string) => text,
        },
        friendly: {
          primary: (text: string) => `${text} 👍`,
          secondary: (text: string) => text,
          destructive: (text: string) => `Attenzione: ${text}`,
          financial: (text: string) => `${text} (protetto)`,
          social: (text: string) => `${text} 🚀`,
          educational: (text: string) => `${text} 📚`,
        },
        encouraging: {
          primary: (text: string) => `Dai, ${text.toLowerCase()}!`,
          secondary: (text: string) => text,
          destructive: (text: string) => `Sicuro di voler ${text.toLowerCase()}?`,
          financial: (text: string) => `${text} con fiducia`,
          social: (text: string) => `${text} insieme`,
          educational: (text: string) => `Continua a ${text.toLowerCase()}`,
        },
        reassuring: {
          primary: (text: string) => `${text} (tutto sotto controllo)`,
          secondary: (text: string) => text,
          destructive: (text: string) => `${text} - possiamo annullare`,
          financial: (text: string) => `${text} - i tuoi dati sono al sicuro`,
          social: (text: string) => `${text} - solo tu puoi vederlo`,
          educational: (text: string) => `${text} - salviamo i progressi`,
        },
        celebratory: {
          primary: (text: string) => `🎉 ${text}!`,
          secondary: (text: string) => text,
          destructive: (text: string) => `Vuoi davvero ${text.toLowerCase()}?`,
          financial: (text: string) => `${text} con successo! 💪`,
          social: (text: string) => `${text} e condividi! 🎊`,
          educational: (text: string) => `${text} - sei sulla strada giusta! ⭐`,
        },
      },
      en: {
        professional: {
          primary: (text: string) => text,
          secondary: (text: string) => text,
          destructive: (text: string) => `${text} (irreversible)`,
          financial: (text: string) => `${text} securely`,
          social: (text: string) => text,
          educational: (text: string) => text,
        },
        friendly: {
          primary: (text: string) => `${text} 👍`,
          secondary: (text: string) => text,
          destructive: (text: string) => `Careful: ${text}`,
          financial: (text: string) => `${text} (protected)`,
          social: (text: string) => `${text} 🚀`,
          educational: (text: string) => `${text} 📚`,
        },
        encouraging: {
          primary: (text: string) => `Go ahead, ${text.toLowerCase()}!`,
          secondary: (text: string) => text,
          destructive: (text: string) => `Sure you want to ${text.toLowerCase()}?`,
          financial: (text: string) => `${text} with confidence`,
          social: (text: string) => `${text} together`,
          educational: (text: string) => `Keep ${text.toLowerCase()}`,
        },
        reassuring: {
          primary: (text: string) => `${text} (all good)`,
          secondary: (text: string) => text,
          destructive: (text: string) => `${text} - we can undo`,
          financial: (text: string) => `${text} - your data is safe`,
          social: (text: string) => `${text} - only you can see`,
          educational: (text: string) => `${text} - we save progress`,
        },
        celebratory: {
          primary: (text: string) => `🎉 ${text}!`,
          secondary: (text: string) => text,
          destructive: (text: string) => `Really ${text.toLowerCase()}?`,
          financial: (text: string) => `${text} successfully! 💪`,
          social: (text: string) => `${text} and share! 🎊`,
          educational: (text: string) => `${text} - you're on track! ⭐`,
        },
      },
    };

    const template = messageTemplates[locale][tone][actionType];
    return template ? template(baseText) : baseText;
  }, [getToneStyle]);

  // Progressive status messaging
  const getProgressMessage = useCallback((
    percentage: number,
    context: MicroCopyContext
  ): string => {
    const { locale, taskContext, emotionalState } = context;

    const progressMessages: Record<string, Record<string, Record<string, string[]>>> = {
      it: {
        learning: {
          confident: [
            'Ottimo inizio! 🌟',
            'Stai andando bene! 📈',
            'Quasi fatto! 🎯',
            'Perfetto! Completato! ✨'
          ],
          uncertain: [
            'Passo dopo passo... 👣',
            'Stai facendo progressi 💪',
            'Ci siamo quasi! 🎯',
            'Fatto! Sei stato bravo! 🎉'
          ],
          frustrated: [
            'Respira, stai andando bene 🧘',
            'Ogni passo conta 💙',
            'Quasi finito, forza! 💪',
            'Ce l\'hai fatta! 🎊'
          ],
        },
        financial: {
          confident: [
            'Verifica in corso... 🔒',
            'Elaborazione sicura... 💳',
            'Finalizzazione... ⚡',
            'Transazione completata! ✅'
          ],
          uncertain: [
            'Tutto sotto controllo... 🛡️',
            'Verifichiamo per te... 🔍',
            'Quasi fatto, tranquillo... 😌',
            'Completato in sicurezza! 🎉'
          ],
        },
        trading: {
          confident: [
            'Analisi in corso... 📊',
            'Elaborazione ordine... 💹',
            'Esecuzione... ⚡',
            'Operazione completata! ✅'
          ],
        },
        onboarding: {
          confident: [
            'Configurazione... ⚙️',
            'Personalizzazione... 🎨',
            'Finalizzazione... ✨',
            'Benvenuto in Tradelia! 🎉'
          ],
        },
        settings: {
          confident: [
            'Aggiornamento... ⚙️',
            'Sincronizzazione... 🔄',
            'Applicazione... ✨',
            'Impostazioni salvate! ✅'
          ],
        },
        social: {
          confident: [
            'Preparazione... 🚀',
            'Condivisione... 📤',
            'Pubblicazione... ✨',
            'Condiviso con successo! 🎊'
          ],
        },
      },
      en: {
        learning: {
          confident: [
            'Great start! 🌟',
            'You\'re doing well! 📈',
            'Almost there! 🎯',
            'Perfect! Complete! ✨'
          ],
          uncertain: [
            'Step by step... 👣',
            'Making progress 💪',
            'Almost there! 🎯',
            'Done! Well done! 🎉'
          ],
          frustrated: [
            'Breathe, you\'re doing fine 🧘',
            'Every step counts 💙',
            'Almost finished, keep going! 💪',
            'You did it! 🎊'
          ],
        },
        financial: {
          confident: [
            'Verifying... 🔒',
            'Processing securely... 💳',
            'Finalizing... ⚡',
            'Transaction complete! ✅'
          ],
          uncertain: [
            'All under control... 🛡️',
            'We\'re checking for you... 🔍',
            'Almost done, relax... 😌',
            'Completed safely! 🎉'
          ],
        },
        trading: {
          confident: [
            'Analyzing... 📊',
            'Processing order... 💹',
            'Executing... ⚡',
            'Operation complete! ✅'
          ],
        },
        onboarding: {
          confident: [
            'Setting up... ⚙️',
            'Personalizing... 🎨',
            'Finalizing... ✨',
            'Welcome to Tradelia! 🎉'
          ],
        },
        settings: {
          confident: [
            'Updating... ⚙️',
            'Syncing... 🔄',
            'Applying... ✨',
            'Settings saved! ✅'
          ],
        },
        social: {
          confident: [
            'Preparing... 🚀',
            'Sharing... 📤',
            'Publishing... ✨',
            'Shared successfully! 🎊'
          ],
        },
      },
    };

    const contextMessages = progressMessages[locale]?.[taskContext] || progressMessages[locale]?.learning || progressMessages[locale]?.learning;
    const emotionalMessages = contextMessages?.[emotionalState] || contextMessages?.confident || ['Loading...', 'Processing...', 'Almost done...', 'Complete!'];

    if (percentage < 25) return emotionalMessages[0] || 'Loading...';
    if (percentage < 50) return emotionalMessages[1] || 'Processing...';
    if (percentage < 100) return emotionalMessages[2] || 'Almost done...';
    return emotionalMessages[3] || 'Complete!';
  }, []);

  return {
    adaptMessage,
    getProgressMessage,
    getToneStyle,
  };
};

// ============================================================================
// ADAPTIVE BUTTON COMPONENT
// ============================================================================

type AdaptiveButtonProps = {
  children: string;
  onClick?: () => void;
  actionType?: ActionType;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  config?: Partial<AdaptiveMicroCopyConfig>;
};

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  children,
  onClick,
  actionType = 'primary',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  config = {},
}) => {
  const context = useMicroCopyContext();
  const { adaptMessage } = useAdaptiveMicroCopy();

  const finalConfig: AdaptiveMicroCopyConfig = {
    actionType,
    baseText: children,
    enableToneAdaptation: true,
    enableContextAwareness: true,
    enableProgressiveMessaging: true,
    enableTrustBuilding: true,
    ...config,
  };

  const adaptedText = useMemo(() => {
    if (!finalConfig.enableToneAdaptation) return children;
    
    const contextWithOverrides = { ...context, ...finalConfig.context };
    return adaptMessage(children, actionType, contextWithOverrides);
  }, [children, actionType, context, finalConfig, adaptMessage]);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative rounded-lg font-medium transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {context.locale === 'it' ? 'Caricamento...' : 'Loading...'}
        </span>
      ) : (
        adaptedText
      )}
    </button>
  );
};

// ============================================================================
// ADAPTIVE STATUS MESSAGE COMPONENT
// ============================================================================

type AdaptiveStatusProps = {
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  progress?: number;
  showProgress?: boolean;
  className?: string;
};

export const AdaptiveStatus: React.FC<AdaptiveStatusProps> = ({
  message,
  type = 'info',
  progress,
  showProgress = false,
  className = '',
}) => {
  const context = useMicroCopyContext();
  const { getProgressMessage } = useAdaptiveMicroCopy();

  const displayMessage = useMemo(() => {
    if (message) return message;
    if (showProgress && typeof progress === 'number') {
      return getProgressMessage(progress, context);
    }
    return '';
  }, [message, showProgress, progress, context, getProgressMessage]);

  const typeClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
  };

  if (!displayMessage) return null;

  return (
    <div className={`
      flex items-center p-3 rounded-lg border text-sm
      ${typeClasses[type]}
      ${className}
    `}>
      <span className="mr-2">{typeIcons[type]}</span>
      <span className="flex-1">{displayMessage}</span>
      {showProgress && typeof progress === 'number' && (
        <div className="ml-3 w-16 bg-white bg-opacity-50 rounded-full h-2">
          <div
            className="bg-current h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};

// ============================================================================
// ADAPTIVE MICRO-COPY SHOWCASE
// ============================================================================

export const AdaptiveMicroCopyShowcase: React.FC = () => {
  const [currentContext, setCurrentContext] = useState<MicroCopyContext>({
    userState: 'new',
    emotionalState: 'confident',
    taskContext: 'learning',
    isFirstTime: true,
    hasErrors: false,
    isLoading: false,
    progressPercentage: 0,
    locale: 'it',
  });

  const [progress, setProgress] = useState(0);

  const contextOptions = {
    userState: ['new', 'returning', 'engaged', 'hesitant', 'expert'] as UserState[],
    emotionalState: ['confident', 'uncertain', 'frustrated', 'excited', 'focused'] as EmotionalState[],
    taskContext: ['learning', 'trading', 'onboarding', 'settings', 'financial', 'social'] as TaskContext[],
  };

  const handleProgressSimulation = useCallback(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  }, []);

  return (
    <MicroCopyProvider context={currentContext}>
      <div className="adaptive-micro-copy-showcase p-8 space-y-8">
        <div className="showcase-header">
          <h2 className="text-3xl font-bold text-gray-900">Adaptive Micro-Copy System</h2>
          <p className="text-lg text-gray-600 mt-2">
            Sistema di micro-copy adattivo che si adatta al context, emotional state e user behavior
          </p>
        </div>

        {/* Context Controls */}
        <div className="context-controls bg-gray-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Context Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User State</label>
              <select
                value={currentContext.userState}
                onChange={(e) => setCurrentContext(prev => ({ ...prev, userState: e.target.value as UserState }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {contextOptions.userState.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Emotional State</label>
              <select
                value={currentContext.emotionalState}
                onChange={(e) => setCurrentContext(prev => ({ ...prev, emotionalState: e.target.value as EmotionalState }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {contextOptions.emotionalState.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Context</label>
              <select
                value={currentContext.taskContext}
                onChange={(e) => setCurrentContext(prev => ({ ...prev, taskContext: e.target.value as TaskContext }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {contextOptions.taskContext.map(context => (
                  <option key={context} value={context}>{context}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Adaptive Buttons Demo */}
        <div className="buttons-demo">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Adaptive Buttons</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <AdaptiveButton actionType="primary">Inizia</AdaptiveButton>
            <AdaptiveButton actionType="financial">Paga</AdaptiveButton>
            <AdaptiveButton actionType="destructive" variant="outline">Elimina</AdaptiveButton>
            <AdaptiveButton actionType="social">Condividi</AdaptiveButton>
            <AdaptiveButton actionType="educational">Studia</AdaptiveButton>
          </div>
        </div>

        {/* Progressive Status Demo */}
        <div className="status-demo">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Progressive Status Messages</h3>
          <div className="space-y-4">
            <AdaptiveStatus
              type="info"
              progress={progress}
              showProgress={true}
            />
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleProgressSimulation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Simula Progresso
              </button>
              <button
                type="button"
                onClick={() => setProgress(0)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="technical-features bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Caratteristiche Tecniche 2026
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="feature bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">🎯 Context-Aware</h4>
              <p className="text-gray-600 text-sm">
                Adattamento automatico basato su user state, emotional state e task context
              </p>
            </div>
            <div className="feature bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">🗣️ Tone Adaptation</h4>
              <p className="text-gray-600 text-sm">
                5 stili di tono: professional, friendly, encouraging, reassuring, celebratory
              </p>
            </div>
            <div className="feature bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">🌍 Multilingual</h4>
              <p className="text-gray-600 text-sm">
                Supporto completo per italiano e inglese con adattamento culturale
              </p>
            </div>
            <div className="feature bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">📈 Progressive</h4>
              <p className="text-gray-600 text-sm">
                Status messaging che si evolve con il progresso dell'utente
              </p>
            </div>
            <div className="feature bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">🛡️ Trust-Building</h4>
              <p className="text-gray-600 text-sm">
                Messaging di sicurezza e privacy context-aware per financial actions
              </p>
            </div>
            <div className="feature bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-2">🧠 Human-Centered</h4>
              <p className="text-gray-600 text-sm">
                Linguaggio umano che riduce friction e aumenta conversions
              </p>
            </div>
          </div>
        </div>
      </div>
    </MicroCopyProvider>
  );
};

export default AdaptiveMicroCopyShowcase;