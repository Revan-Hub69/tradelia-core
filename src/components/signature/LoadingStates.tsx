/**
 * LOADING STATES SYSTEM - Enterprise 2026
 */

import React from 'react';

export type LoadingContext =
  | 'financial-analysis'
  | 'portfolio-sync'
  | 'trade-execution'
  | 'learning-content'
  | 'progress-save'
  | 'lesson-load'
  | 'social-share'
  | 'community-load'
  | 'settings-save'
  | 'data-export'
  | 'auth-verify'
  | 'content-generate';

export type LoadingType = 'spinner' | 'progress' | 'skeleton';

export interface LoadingConfig {
  context: LoadingContext;
  type?: LoadingType;
  showProgress?: boolean;
  customMessage?: string;
}

const LoadingStates: React.FC<{
  config: LoadingConfig;
  children?: React.ReactNode;
}> = ({ config, children }) => {
  const getContextMessage = (context: LoadingContext): string => {
    const messages: Record<LoadingContext, string> = {
      'financial-analysis': 'Analizzando il portafoglio...',
      'portfolio-sync': 'Sincronizzazione portafoglio...',
      'trade-execution': 'Esecuzione ordine...',
      'learning-content': 'Caricamento lezione...',
      'progress-save': 'Salvataggio progressi...',
      'lesson-load': 'Preparazione lezione...',
      'social-share': 'Condivisione in corso...',
      'community-load': 'Caricamento community...',
      'settings-save': 'Salvataggio impostazioni...',
      'data-export': 'Esportazione dati...',
      'auth-verify': 'Verifica identità...',
      'content-generate': 'Generazione contenuto...',
    };
    return messages[context] || 'Caricamento...';
  };

  const message = config.customMessage || getContextMessage(config.context);

  if (children) {
    return <>{children}</>;
  }

  if (config.type === 'progress') {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {message}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
          <div className="h-2 rounded-full bg-blue-600 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <svg className="size-6 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
    </div>
  );
};

export default LoadingStates;