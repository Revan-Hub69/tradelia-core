'use client';

import React from 'react';
import { Lock, Crown, CheckCircle, Clock } from 'lucide-react';

import { cn } from '@/utils/Helpers';
import type { LearningPath } from './types';

export type LearningPathCardProps = {
  path: LearningPath;
  progress: number;
  isLocked: boolean;
  isPremium: boolean;
  onPathClick: (pathId: string) => void;
  className?: string;
};

/**
 * LearningPathCard - Individual learning path card component
 * 
 * Features:
 * - Glass card styling consistent with existing design system
 * - States: locked, premium, completed
 * - Progress indicators using same patterns as LessonHeader
 * - Hover effects and micro-interactions
 * 
 * Requirements: 2.1, 2.2, 6.1
 */
export const LearningPathCard: React.FC<LearningPathCardProps> = ({
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 dark:text-green-400';
      case 'intermediate':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'advanced':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-muted-foreground';
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

  return (
    <div
      onClick={handleClick}
      className={cn(
        // Base glassmorphism styling - consistent with existing system
        'group relative overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm shadow-sm shadow-black/5 transition-all duration-300',
        'dark:border-white/10 dark:bg-white/10 dark:shadow-black/20',
        
        // Interactive states
        isClickable && 'cursor-pointer hover:bg-white/80 hover:shadow-md hover:scale-[1.02] dark:hover:bg-white/20',
        isLocked && 'cursor-not-allowed opacity-60',
        
        // Completed state
        isCompleted && 'ring-2 ring-green-500/20 bg-green-50/60 dark:bg-green-900/10',
        
        className
      )}
    >
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
          <Crown className="size-3" />
          <span>Premium</span>
        </div>
      )}

      {/* Completed Badge */}
      {isCompleted && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white shadow-sm">
          <CheckCircle className="size-3" />
          <span>Completato</span>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
            {path.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {path.description}
          </p>
        </div>

        {/* Progress Section - Using same pattern as LessonHeader */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-medium">Progresso</span>
            <span className="font-semibold tabular-nums">{Math.round(progress)}%</span>
          </div>
          
          {/* Progress Bar - Same styling as LessonHeader */}
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
            <div
              className="h-2.5 rounded-full bg-primary transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect for active progress */}
              {progress > 0 && progress < 100 && (
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              )}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className={cn('capitalize font-medium', getDifficultyColor(path.difficulty))}>
              {path.difficulty}
            </span>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              <span className="tabular-nums">{formatDuration(path.estimatedDuration)}</span>
            </div>
          </div>
          
          <div className="text-muted-foreground">
            {path.modules.length} moduli
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

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
          <div className="text-center space-y-2">
            <Lock className="size-8 mx-auto text-muted-foreground" />
            <div className="text-sm font-medium text-foreground">
              {isPremium ? 'Premium Richiesto' : 'Bloccato'}
            </div>
            {isPremium && (
              <div className="text-xs text-muted-foreground">
                Aggiorna per accedere
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hover Effect Overlay */}
      {isClickable && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      )}
    </div>
  );
};