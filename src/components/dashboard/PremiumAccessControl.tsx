'use client';

import React from 'react';
import { ArrowRight, Check, Crown } from 'lucide-react';

import { cn } from '@/utils/Helpers';
import type { LearningPath } from './types';

export type PremiumAccessControlProps = {
  userSubscription: 'free' | 'premium';
  onUpgradeClick: () => void;
  className?: string;
};

export type UpgradePromptProps = {
  path: LearningPath;
  onUpgradeClick: () => void;
  onClose?: () => void;
  className?: string;
};

/**
 * Premium Access Control Logic
 *
 * Requirements: 2.3, 2.4
 * - Garantire accesso gratuito a Fondamenti
 * - Mostrare upgrade prompts per utenti free
 */

export const isPremiumRequired = (path: LearningPath): boolean => {
  // Fondamenti path is always free (Requirement 2.3)
  if (path.id === 'fondamenti' || path.title.toLowerCase().includes('fondamenti')) {
    return false;
  }

  return path.isPremium;
};

export const canAccessPath = (
  path: LearningPath,
  userSubscription: 'free' | 'premium',
): boolean => {
  // Premium users can access everything
  if (userSubscription === 'premium') {
    return true;
  }

  // Free users can access non-premium paths and Fondamenti
  return !isPremiumRequired(path);
};

export const shouldShowUpgradePrompt = (
  path: LearningPath,
  userSubscription: 'free' | 'premium',
): boolean => {
  return userSubscription === 'free' && isPremiumRequired(path);
};

/**
 * UpgradePrompt - Modal/Card component for premium upgrade
 */
export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  path,
  onUpgradeClick,
  onClose,
  className = '',
}) => {
  const premiumFeatures = [
    'Accesso a tutti i percorsi avanzati',
    'Analytics dettagliati del progresso',
    'Contenuti esclusivi e aggiornamenti',
    'Supporto prioritario',
    'Certificati di completamento',
  ];

  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-xl shadow-black/10',
      'dark:border-white/10 dark:bg-slate-900/80 dark:shadow-black/20',
      className,
    )}
    >
      {/* Premium Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <Crown className="size-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Accesso Premium Richiesto</h3>
          <p className="text-sm text-muted-foreground">
            Sblocca
            {' '}
            {path.title}
            {' '}
            e molto altro
          </p>
        </div>
      </div>

      {/* Path Preview */}
      <div className="mb-6 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/20">
            <span className="text-lg">📚</span>
          </div>
          <div>
            <h4 className="font-medium">{path.title}</h4>
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {path.description}
            </p>
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="mb-6">
        <h4 className="mb-3 font-medium">Con Premium ottieni:</h4>
        <div className="space-y-2">
          {premiumFeatures.map((feature, index) => (
            <div key={`feature-${index}`} className="flex items-center gap-3 text-sm">
              <Check className="size-4 shrink-0 text-green-500" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onUpgradeClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary/80 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        >
          <Crown className="size-4" />
          <span>Aggiorna a Premium</span>
          <ArrowRight className="size-4" />
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Più tardi
          </button>
        )}
      </div>

      {/* Trust Signal */}
      <div className="mt-4 text-center text-xs text-muted-foreground">
        <span>✨ Garanzia soddisfatti o rimborsati 30 giorni</span>
      </div>
    </div>
  );
};

/**
 * PremiumBanner - Inline banner for premium features
 */
export const PremiumBanner: React.FC<PremiumAccessControlProps> = ({
  userSubscription,
  onUpgradeClick,
  className = '',
}) => {
  if (userSubscription === 'premium') {
    return null;
  }

  return (
    <div className={cn(
      'flex items-center justify-between rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4',
      'dark:border-amber-800 dark:from-amber-950/50 dark:to-orange-950/50',
      className,
    )}
    >
      <div className="flex items-center gap-3">
        <Crown className="size-5 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="font-medium text-amber-900 dark:text-amber-100">
            Sblocca tutti i percorsi
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Accedi a contenuti avanzati e funzionalità premium
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onUpgradeClick}
        className="flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-amber-700 hover:shadow-md"
      >
        <span>Aggiorna</span>
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
};