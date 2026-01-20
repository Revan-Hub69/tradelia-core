/**
 * EDUCATIONAL EMPTY STATES SYSTEM v2.0 - Enterprise 2026
 * 
 * Sistema di stati vuoti educativi che guidano e incoraggiano
 * Basato su ricerca UX educativa 2026:
 * - Trasforma "nessun dato" in opportunità di apprendimento
 * - Tono incoraggiante e di supporto
 * - Azioni chiare e motivanti
 * - Personalità Tradelia: professionale ma umana
 */

'use client';

import React from 'react';
import { cn } from '../../utils/Helpers';
import { EnterAnimation, SuccessAnimation } from '../motion/SemanticAnimations';
import { PressAnticipatory } from '../motion/AnticipatoryFeedback';

// Tipi per gli empty states
export type EmptyStateType = 
  | 'no_dashboard_data'    // Nessun dato dashboard
  | 'no_progress'          // Nessun progresso
  | 'completed_path'       // Percorso completato
  | 'no_lessons'          // Nessuna lezione
  | 'no_achievements'     // Nessun achievement
  | 'no_community'        // Nessuna attività community
  | 'no_tools_unlocked'   // Nessun tool sbloccato
  | 'no_search_results'   // Nessun risultato ricerca
  | 'connection_error'    // Errore di connessione
  | 'maintenance_mode';   // Modalità manutenzione

export type EmptyStateTone = 
  | 'encouraging'   // Incoraggiante per principianti
  | 'supportive'    // Di supporto per chi è in difficoltà
  | 'celebratory'   // Celebrativo per completamenti
  | 'motivational'  // Motivazionale per continuare
  | 'informative';  // Informativo per stati tecnici

export type EmptyStateContext = 
  | 'dashboard'     // Dashboard principale
  | 'learning'      // Sezione apprendimento
  | 'progress'      // Pagina progressi
  | 'community'     // Sezione community
  | 'tools'         // Sezione strumenti
  | 'search'        // Risultati ricerca
  | 'profile';      // Profilo utente

// Props per il componente empty state
interface EducationalEmptyStateProps {
  type: EmptyStateType;
  tone?: EmptyStateTone;
  context?: EmptyStateContext;
  customTitle?: string;
  customDescription?: string;
  customAction?: string;
  onAction?: () => void;
  showIllustration?: boolean;
  className?: string;
}

/**
 * Configurazione degli empty states educativi
 * Basata su ricerca UX educativa e psicologia motivazionale
 */
const emptyStateConfig = {
  no_dashboard_data: {
    illustration: '🌟',
    title: {
      it: 'Il tuo percorso inizia qui',
      en: 'Your journey starts here'
    },
    description: {
      it: 'Perfetto! Sei all\'inizio. Iniziamo con le basi del mondo crypto.',
      en: 'Perfect! You\'re at the beginning. Let\'s start with crypto basics.'
    },
    action: {
      it: 'Inizia la prima lezione',
      en: 'Start first lesson'
    },
    tone: 'encouraging' as EmptyStateTone,
    color: 'blue',
  },
  no_progress: {
    illustration: '🚀',
    title: {
      it: 'Ogni esperto è stato un principiante',
      en: 'Every expert was once a beginner'
    },
    description: {
      it: 'Il primo passo è sempre il più importante. Inizia il tuo percorso di apprendimento oggi.',
      en: 'The first step is always the most important. Start your learning journey today.'
    },
    action: {
      it: 'Fai il primo passo',
      en: 'Take the first step'
    },
    tone: 'supportive' as EmptyStateTone,
    color: 'emerald',
  },
  completed_path: {
    illustration: '🏆',
    title: {
      it: 'Incredibile! Hai completato tutto',
      en: 'Amazing! You\'ve completed everything'
    },
    description: {
      it: 'Ora sei pronto per i percorsi avanzati e specialistici. Continua a crescere!',
      en: 'Now you\'re ready for advanced and specialized paths. Keep growing!'
    },
    action: {
      it: 'Esplora percorsi specialistici',
      en: 'Explore specialist paths'
    },
    tone: 'celebratory' as EmptyStateTone,
    color: 'gold',
  },
  no_lessons: {
    illustration: '📚',
    title: {
      it: 'Le tue lezioni ti aspettano',
      en: 'Your lessons are waiting'
    },
    description: {
      it: 'Abbiamo preparato un percorso personalizzato per te. Ogni lezione è progettata per il tuo livello.',
      en: 'We\'ve prepared a personalized path for you. Each lesson is designed for your level.'
    },
    action: {
      it: 'Inizia a imparare',
      en: 'Start learning'
    },
    tone: 'encouraging' as EmptyStateTone,
    color: 'purple',
  },
  no_achievements: {
    illustration: '🎯',
    title: {
      it: 'I tuoi primi achievement sono vicini',
      en: 'Your first achievements are close'
    },
    description: {
      it: 'Completa le prime lezioni per sbloccare i tuoi primi riconoscimenti.',
      en: 'Complete the first lessons to unlock your first achievements.'
    },
    action: {
      it: 'Guadagna il primo achievement',
      en: 'Earn your first achievement'
    },
    tone: 'motivational' as EmptyStateTone,
    color: 'amber',
  },
  no_community: {
    illustration: '👥',
    title: {
      it: 'La community ti aspetta',
      en: 'The community awaits you'
    },
    description: {
      it: 'Connettiti con altri studenti, condividi esperienze e impara insieme.',
      en: 'Connect with other students, share experiences and learn together.'
    },
    action: {
      it: 'Unisciti alla community',
      en: 'Join the community'
    },
    tone: 'encouraging' as EmptyStateTone,
    color: 'teal',
  },
  no_tools_unlocked: {
    illustration: '🛠️',
    title: {
      it: 'Gli strumenti si sbloccano con il progresso',
      en: 'Tools unlock with progress'
    },
    description: {
      it: 'Continua il tuo percorso di apprendimento per accedere a strumenti avanzati.',
      en: 'Continue your learning journey to access advanced tools.'
    },
    action: {
      it: 'Continua a imparare',
      en: 'Continue learning'
    },
    tone: 'motivational' as EmptyStateTone,
    color: 'indigo',
  },
  no_search_results: {
    illustration: '🔍',
    title: {
      it: 'Nessun risultato trovato',
      en: 'No results found'
    },
    description: {
      it: 'Prova con termini diversi o esplora i contenuti suggeriti.',
      en: 'Try different terms or explore suggested content.'
    },
    action: {
      it: 'Esplora contenuti',
      en: 'Explore content'
    },
    tone: 'supportive' as EmptyStateTone,
    color: 'slate',
  },
  connection_error: {
    illustration: '📶',
    title: {
      it: 'Problema di connessione',
      en: 'Connection issue'
    },
    description: {
      it: 'Controlla la tua connessione internet e riprova. I tuoi progressi sono al sicuro.',
      en: 'Check your internet connection and try again. Your progress is safe.'
    },
    action: {
      it: 'Riprova',
      en: 'Try again'
    },
    tone: 'informative' as EmptyStateTone,
    color: 'orange',
  },
  maintenance_mode: {
    illustration: '🔧',
    title: {
      it: 'Stiamo migliorando l\'esperienza',
      en: 'We\'re improving the experience'
    },
    description: {
      it: 'Torneremo presto con nuove funzionalità. Grazie per la pazienza!',
      en: 'We\'ll be back soon with new features. Thanks for your patience!'
    },
    action: {
      it: 'Torna più tardi',
      en: 'Come back later'
    },
    tone: 'informative' as EmptyStateTone,
    color: 'blue',
  },
} as const;

/**
 * Componente principale per gli empty states educativi
 */
export const EducationalEmptyState: React.FC<EducationalEmptyStateProps> = ({
  type,
  tone,
  context = 'dashboard',
  customTitle,
  customDescription,
  customAction,
  onAction,
  showIllustration = true,
  className,
}) => {
  const [locale, setLocale] = React.useState<'it' | 'en'>('it');
  
  const config = emptyStateConfig[type];
  const finalTone = tone || config.tone;
  
  // Detect locale (simplified)
  React.useEffect(() => {
    const detectedLocale = navigator.language.startsWith('it') ? 'it' : 'en';
    setLocale(detectedLocale);
  }, []);

  const title = customTitle || config.title[locale];
  const description = customDescription || config.description[locale];
  const actionText = customAction || config.action[locale];

  const containerClasses = cn(
    // Base styles
    'flex flex-col items-center justify-center text-center p-8 space-y-6',
    'min-h-[400px] max-w-md mx-auto',
    
    // Context-specific adjustments
    context === 'dashboard' && 'min-h-[300px]',
    context === 'search' && 'min-h-[200px] p-6',
    
    className,
  );

  const illustrationClasses = cn(
    'text-6xl mb-4',
    
    // Tone-based animations
    finalTone === 'encouraging' && 'animate-bounce',
    finalTone === 'celebratory' && 'animate-pulse',
    finalTone === 'motivational' && 'animate-pulse',
  );

  const titleClasses = cn(
    'text-xl font-semibold mb-3',
    
    // Color theming
    config.color === 'blue' && 'text-blue-900 dark:text-blue-100',
    config.color === 'emerald' && 'text-emerald-900 dark:text-emerald-100',
    config.color === 'gold' && 'text-yellow-900 dark:text-yellow-100',
    config.color === 'purple' && 'text-purple-900 dark:text-purple-100',
    config.color === 'amber' && 'text-amber-900 dark:text-amber-100',
    config.color === 'teal' && 'text-teal-900 dark:text-teal-100',
    config.color === 'indigo' && 'text-indigo-900 dark:text-indigo-100',
    config.color === 'slate' && 'text-slate-900 dark:text-slate-100',
    config.color === 'orange' && 'text-orange-900 dark:text-orange-100',
  );

  const descriptionClasses = cn(
    'text-muted-foreground leading-relaxed mb-6',
    
    // Tone adjustments
    finalTone === 'celebratory' && 'text-lg',
    finalTone === 'encouraging' && 'text-base',
  );

  return (
    <EnterAnimation context="content">
      <div className={containerClasses}>
        {/* Illustration */}
        {showIllustration && (
          <SuccessAnimation context="ui" prominent={finalTone === 'celebratory'}>
            <div className={illustrationClasses}>
              {config.illustration}
            </div>
          </SuccessAnimation>
        )}

        {/* Content */}
        <div className="space-y-4">
          <h2 className={titleClasses}>
            {title}
          </h2>
          
          <p className={descriptionClasses}>
            {description}
          </p>
        </div>

        {/* Action Button */}
        {onAction && (
          <PressAnticipatory
            intensity="normal"
            hapticPattern="medium"
            onPress={onAction}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-all duration-200',
              'hover:shadow-md active:scale-95',
              
              // Color theming for button
              config.color === 'blue' && 'bg-blue-600 text-white hover:bg-blue-700',
              config.color === 'emerald' && 'bg-emerald-600 text-white hover:bg-emerald-700',
              config.color === 'gold' && 'bg-yellow-600 text-white hover:bg-yellow-700',
              config.color === 'purple' && 'bg-purple-600 text-white hover:bg-purple-700',
              config.color === 'amber' && 'bg-amber-600 text-white hover:bg-amber-700',
              config.color === 'teal' && 'bg-teal-600 text-white hover:bg-teal-700',
              config.color === 'indigo' && 'bg-indigo-600 text-white hover:bg-indigo-700',
              config.color === 'slate' && 'bg-slate-600 text-white hover:bg-slate-700',
              config.color === 'orange' && 'bg-orange-600 text-white hover:bg-orange-700',
            )}
          >
            {actionText}
          </PressAnticipatory>
        )}
      </div>
    </EnterAnimation>
  );
};

/**
 * Componenti di convenienza per casi d'uso comuni
 */

// Empty state per dashboard nuovo utente
export const NewUserDashboard: React.FC<{
  onStartLearning: () => void;
}> = ({ onStartLearning }) => (
  <EducationalEmptyState
    type="no_dashboard_data"
    context="dashboard"
    onAction={onStartLearning}
  />
);

// Empty state per nessun progresso
export const NoProgressState: React.FC<{
  onStartJourney: () => void;
}> = ({ onStartJourney }) => (
  <EducationalEmptyState
    type="no_progress"
    context="progress"
    onAction={onStartJourney}
  />
);

// Empty state per percorso completato
export const CompletedPathState: React.FC<{
  onExploreAdvanced: () => void;
}> = ({ onExploreAdvanced }) => (
  <EducationalEmptyState
    type="completed_path"
    context="learning"
    onAction={onExploreAdvanced}
  />
);

// Empty state per ricerca senza risultati
export const NoSearchResults: React.FC<{
  searchTerm: string;
  onExploreContent: () => void;
}> = ({ searchTerm, onExploreContent }) => (
  <EducationalEmptyState
    type="no_search_results"
    context="search"
    customDescription={`Nessun risultato per "${searchTerm}". Prova con termini diversi o esplora i contenuti suggeriti.`}
    onAction={onExploreContent}
  />
);

// Empty state per errore di connessione
export const ConnectionErrorState: React.FC<{
  onRetry: () => void;
}> = ({ onRetry }) => (
  <EducationalEmptyState
    type="connection_error"
    context="dashboard"
    onAction={onRetry}
  />
);

/**
 * Componente per testare gli empty states
 */
export const EmptyStateTester: React.FC = () => {
  const [currentState, setCurrentState] = React.useState<EmptyStateType>('no_dashboard_data');

  const states: Array<{ type: EmptyStateType; label: string }> = [
    { type: 'no_dashboard_data', label: 'Nuovo Utente' },
    { type: 'no_progress', label: 'Nessun Progresso' },
    { type: 'completed_path', label: 'Percorso Completato' },
    { type: 'no_lessons', label: 'Nessuna Lezione' },
    { type: 'no_achievements', label: 'Nessun Achievement' },
    { type: 'no_community', label: 'Nessuna Community' },
    { type: 'no_tools_unlocked', label: 'Tool Bloccati' },
    { type: 'no_search_results', label: 'Nessun Risultato' },
    { type: 'connection_error', label: 'Errore Connessione' },
    { type: 'maintenance_mode', label: 'Manutenzione' },
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-4 rounded-lg border bg-card">
        <h3 className="text-lg font-semibold mb-4">Test Empty States</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {states.map(state => (
            <button
              key={state.type}
              onClick={() => setCurrentState(state.type)}
              className={cn(
                'px-3 py-2 rounded text-sm transition-colors',
                currentState === state.type
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {state.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="border rounded-lg bg-background">
        <EducationalEmptyState
          type={currentState}
          onAction={() => console.log(`Action triggered for ${currentState}`)}
        />
      </div>
    </div>
  );
};

export default {
  EducationalEmptyState,
  NewUserDashboard,
  NoProgressState,
  CompletedPathState,
  NoSearchResults,
  ConnectionErrorState,
  EmptyStateTester,
};