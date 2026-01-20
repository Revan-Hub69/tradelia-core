'use client';

import { CheckCircle, Clock, Crown, Lock } from 'lucide-react';
import type React from 'react';

import { cn } from '@/utils/Helpers';
import { GlassCard, SignatureShape, VisualWeight } from './index';

/**
 * Signature Integration Example
 *
 * Shows how to upgrade existing components with Tradelia's signature visual fingerprint
 * This demonstrates the transformation from generic to enterprise memorable
 */

type ExampleLearningPath = {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  modules: string[];
  prerequisites: string[];
};

type SignatureLearningPathCardProps = {
  path: ExampleLearningPath;
  progress: number;
  isLocked: boolean;
  isPremium: boolean;
  onPathClick: (pathId: string) => void;
  className?: string;
};

export const SignatureLearningPathCard: React.FC<SignatureLearningPathCardProps> = ({
  path,
  progress,
  isLocked,
  isPremium,
  onPathClick,
  className = '',
}) => {
  const isCompleted = progress >= 100;
  const isClickable = !isLocked;

  const handleClick = () => {
    if (isClickable) {
      onPathClick(path.id);
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': {
        return 'accent';
      }
      case 'intermediate': {
        return 'secondary';
      }
      case 'advanced': {
        return 'primary';
      }
      default: {
        return 'secondary';
      }
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  // Determine visual weight based on importance
  const getVisualWeight = () => {
    if (isCompleted) {
      return 'primary';
    } // Completed paths get primary attention
    if (isPremium) {
      return 'secondary';
    } // Premium paths are important
    return 'tertiary'; // Regular paths are supporting
  };

  return (
    <VisualWeight
      weight={getVisualWeight()}
      interactive={isClickable}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isLocked && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      {/* Premium Badge with Signature Shape */}
      {isPremium && (
        <div className="absolute right-3 top-3 z-10">
          <SignatureShape shape="pill" variant="primary" size="sm">
            <Crown className="mr-1 size-3" />
            Premium
          </SignatureShape>
        </div>
      )}

      {/* Completed Badge with Signature Shape */}
      {isCompleted && (
        <div className="absolute left-3 top-3 z-10">
          <SignatureShape shape="notch" variant="accent" size="sm">
            <CheckCircle className="mr-1 size-3" />
            Completato
          </SignatureShape>
        </div>
      )}

      {/* Card Content */}
      <div className="space-y-4 p-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
            {path.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {path.description}
          </p>
        </div>

        {/* Progress Section with Signature Glass Treatment */}
        <GlassCard variant="tertiary" className="p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">Progresso</span>
              <span className="tabular-nums font-semibold">
                {Math.round(progress)}
                %
              </span>
            </div>

            {/* Progress Bar with Signature Enhancement */}
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
              <div
                className="relative h-2.5 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              >
                {/* Signature shimmer effect */}
                {progress > 0 && progress < 100 && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Metadata with Signature Shapes */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <SignatureShape shape="cut" variant={getDifficultyVariant(path.difficulty)} size="sm">
              {path.difficulty}
            </SignatureShape>

            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              <span className="tabular-nums">{formatDuration(path.estimatedDuration)}</span>
            </div>
          </div>

          <div className="text-muted-foreground">
            {path.modules.length}
            {' '}
            moduli
          </div>
        </div>

        {/* Prerequisites */}
        {path.prerequisites.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Prerequisiti: </span>
            <span>{path.prerequisites.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Lock Overlay with Signature Glass */}
      {isLocked && (
        <GlassCard variant="secondary" className="absolute inset-0 flex items-center justify-center">
          <div className="space-y-2 text-center">
            <Lock className="mx-auto size-8 text-muted-foreground" />
            <div className="text-sm font-medium text-foreground">
              {isPremium ? 'Premium Richiesto' : 'Bloccato'}
            </div>
            {isPremium && (
              <div className="text-xs text-muted-foreground">
                Aggiorna per accedere
              </div>
            )}
          </div>
        </GlassCard>
      )}
    </VisualWeight>
  );
};

/**
 * Comparison Showcase
 *
 * Shows before/after of signature integration
 */
export function SignatureComparisonShowcase() {
  const examplePath: ExampleLearningPath = {
    id: '1',
    title: 'Crypto Fundamentals',
    description: 'Learn the basics of cryptocurrency and blockchain technology',
    difficulty: 'beginner',
    estimatedDuration: 120,
    modules: ['Introduction', 'Wallets', 'Trading'],
    prerequisites: [],
  };

  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Signature Integration Example</h2>
        <p className="text-muted-foreground">
          From generic to enterprise memorable with Tradelia's signature visual fingerprint
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Before: Generic Design</h3>
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Standard glass card - could be any SaaS platform
            </p>
            {/* Original component would go here */}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">After: Signature Tradelia</h3>
          <SignatureLearningPathCard
            path={examplePath}
            progress={65}
            isLocked={false}
            isPremium
            onPathClick={() => {}}
          />
          <p className="text-sm text-muted-foreground">
            Signature shapes, visual hierarchy, and glass treatments create instant brand recognition
          </p>
        </div>
      </div>
    </div>
  );
}