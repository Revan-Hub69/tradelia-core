/**
 * SEMANTIC LOADING STATES - Enterprise 2026
 */

import React, { useCallback, useState } from 'react';

import { cn } from '@/utils/Helpers';

export type SemanticContext =
  | 'crypto-analysis'
  | 'portfolio-sync'
  | 'lesson-load'
  | 'progress-save'
  | 'auth-verify'
  | 'data-export'
  | 'content-generate'
  | 'community-load'
  | 'settings-save'
  | 'trade-execution';

export type LoadingIntensity = 'subtle' | 'medium' | 'prominent';
export type LoadingPersonality = 'calm' | 'energetic' | 'professional';

export type SemanticLoadingConfig = {
  context: SemanticContext;
  intensity?: LoadingIntensity;
  personality?: LoadingPersonality;
  showProgress?: boolean;
  estimatedDuration?: number;
  customMessage?: string;
};

export const useSemanticLoading = (config: SemanticLoadingConfig) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  const getContextMessage = useCallback((context: SemanticContext): string => {
    const messages: Record<SemanticContext, string> = {
      'crypto-analysis': 'Analizzando dati crypto...',
      'portfolio-sync': 'Sincronizzazione portafoglio...',
      'lesson-load': 'Caricamento lezione...',
      'progress-save': 'Salvataggio progressi...',
      'auth-verify': 'Verifica identita...',
      'data-export': 'Esportazione dati...',
      'content-generate': 'Generazione contenuto...',
      'community-load': 'Caricamento community...',
      'settings-save': 'Salvataggio impostazioni...',
      'trade-execution': 'Esecuzione operazione...',
    };
    return messages[context] || 'Elaborazione...';
  }, []);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setProgress(0);
    setMessage(config.customMessage || getContextMessage(config.context));
  }, [config, getContextMessage]);

  const stopLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  return {
    isLoading,
    progress,
    message,
    startLoading,
    stopLoading,
  };
};

export const SemanticSpinner: React.FC<{
  context: SemanticContext;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ context, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        sizeClasses[size],
        className,
      )}
      role="status"
      aria-label={`Loading ${context}`}
    >
      <svg className="animate-spin text-primary" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export const SemanticProgress: React.FC<{
  context: SemanticContext;
  progress: number;
  message?: string;
  className?: string;
}> = ({ context, progress, message, className }) => {
  return (
    <div className={cn('space-y-2', className)}>
      {message && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {message}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(progress)}
            %
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${context} progress: ${Math.round(progress)}%`}
        />
      </div>
    </div>
  );
};

export const SemanticSkeleton: React.FC<{
  context: SemanticContext;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  lines?: number;
  className?: string;
}> = ({ context, variant = 'text', lines = 3, className }) => {
  const getSkeletonContent = () => {
    switch (variant) {
      case 'avatar':
        return <div className="size-10 animate-pulse rounded-full bg-muted" />;
      case 'button':
        return <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />;
      case 'card':
        return (
          <div className="space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
          </div>
        );
      case 'text':
      default:
        return (
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
              <div
                key={`skeleton-${context}-${variant}-${index}`}
                className={cn(
                  'h-4 animate-pulse rounded bg-muted',
                  index === lines - 1 ? 'w-2/3' : 'w-full',
                )}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div
      className={cn('animate-pulse', className)}
      role="status"
      aria-label={`Loading ${context} content`}
    >
      {getSkeletonContent()}
    </div>
  );
};

export const MorseCodeLoader: React.FC<{
  message?: string;
  className?: string;
}> = ({ message = 'TRADELIA', className }) => {
  const morseCode: Record<string, string> = {
    T: '-',
    R: '.-.',
    A: '.-',
    D: '-..',
    E: '.',
    L: '.-..',
    I: '..',
  };

  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <div className="flex space-x-1">
        {message.split('').map((char, charIndex) => (
          <div
            key={`morse-${char}-${charIndex}-${message.length}`}
            className="flex space-x-0.5 opacity-100"
          >
            {morseCode[char]?.split('').map((dot, dotIndex) => (
              <div
                key={`dot-${char}-${charIndex}-${dotIndex}-${message}`}
                className={cn(
                  'animate-pulse rounded-full bg-primary',
                  dot === '.' ? 'size-1' : 'h-1 w-3',
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="font-mono text-sm text-muted-foreground">
        {message}
      </span>
    </div>
  );
};

export const SemanticToast: React.FC<{
  context: SemanticContext;
  type?: 'loading' | 'success' | 'error';
  message: string;
  isVisible: boolean;
  onClose?: () => void;
  className?: string;
}> = ({
  context,
  type = 'loading',
  message,
  isVisible,
  onClose,
  className,
}) => {
  const typeClasses = {
    loading: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex items-center space-x-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        typeClasses[type],
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {type === 'loading' && <SemanticSpinner context={context} size="sm" />}
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-current hover:opacity-70"
          aria-label="Close"
        >
          &times;
        </button>
      )}
    </div>
  );
};
