'use client';

import { ArrowRight, BookOpen, Clock, RefreshCw, TrendingUp, Trophy } from 'lucide-react';
import React from 'react';

import { useProgressUpdates } from '@/_legacy/hooks/useProgressUpdates';
import { cn } from '@/utils/Helpers';

import type { Lesson, PathProgress } from './types';

/**
 * ProgressTracker - Progress overview dashboard component with real-time updates
 *
 * Requirements: 1.2, 6.2, 6.3, 3.2, 6.4
 * - Riutilizzare progress bar styling da LessonHeader
 * - Implementare overall progress calculation
 * - Mostrare next recommended lesson
 * - Real-time progress updates from lesson completions
 * - Immediate visual indicator updates
 *
 * Features:
 * - Glass card styling consistent with existing design system
 * - Same progress bar patterns as LessonHeader
 * - Real-time progress synchronization
 * - Optimistic UI updates for immediate feedback
 * - Loading states and error handling
 */

type ProgressTrackerWithUpdatesProps = {
  userId: string;
  onLessonClick?: (lessonId: string) => void;
};

export const ProgressTracker: React.FC<ProgressTrackerWithUpdatesProps> = ({
  userId,
  onLessonClick,
}) => {
  const {
    progressData,
    isLoading,
    error,
    refreshProgress,
    isUpdating,
  } = useProgressUpdates(userId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-48 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-4">
          <div className="h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !progressData) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950/50">
        <p className="text-red-600 dark:text-red-400">
          {error || 'Errore nel caricamento dei dati di progresso'}
        </p>
        <button
          type="button"
          onClick={refreshProgress}
          className="mt-3 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <RefreshCw className="size-4" />
          Riprova
        </button>
      </div>
    );
  }

  // Convert progressData to the format expected by the component
  const pathProgressArray: PathProgress[] = Object.values(progressData.pathProgress);
  const nextRecommendedLesson: Lesson | undefined = progressData.nextRecommendedLesson
    ? {
        id: progressData.nextRecommendedLesson,
        title: 'Crypto Wallets Avanzati',
        type: 'interactive' as const,
        duration: 25,
        xpReward: 150,
        isCompleted: false,
        isUnlocked: true,
      }
    : undefined;

  // Calculate total estimated time remaining
  const totalTimeRemaining = pathProgressArray.reduce((total, path) => {
    const remainingProgress = 100 - path.completionRate;
    const estimatedTimePerPercent = path.timeSpent / Math.max(path.completionRate, 1);
    return total + (remainingProgress * estimatedTimePerPercent);
  }, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    if (hours > 0) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${remainingMinutes}m`;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) {
      return 'bg-green-500';
    }
    if (progress >= 50) {
      return 'bg-blue-500';
    }
    if (progress >= 20) {
      return 'bg-yellow-500';
    }
    return 'bg-primary';
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Il Tuo Progresso</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            {Object.values(progressData.pathProgress).filter(p => p.completionRate === 100).length}
            /
            {pathProgressArray.length}
            {' '}
            percorsi completati
          </div>
          <button
            type="button"
            onClick={refreshProgress}
            disabled={isUpdating}
            className={cn(
              'flex items-center gap-2 rounded-lg border border-white/20 bg-white/60 px-3 py-2 text-sm font-medium backdrop-blur-sm transition-all',
              'dark:border-white/10 dark:bg-white/10',
              'hover:bg-white/80 dark:hover:bg-white/20',
              isUpdating && 'cursor-not-allowed opacity-50',
            )}
          >
            <RefreshCw className={cn('size-4', isUpdating && 'animate-spin')} />
            <span className="hidden sm:inline">
              {isUpdating ? 'Aggiornamento...' : 'Aggiorna'}
            </span>
          </button>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className={cn(
        'relative overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm p-6 shadow-sm shadow-black/5',
        'dark:border-white/10 dark:bg-white/10 dark:shadow-black/20',
        isUpdating && 'ring-2 ring-primary/20 ring-offset-2',
      )}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/20">
            <TrendingUp className="size-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Progresso Complessivo</h3>
            <p className="text-sm text-muted-foreground">
              Il tuo percorso di apprendimento crypto
            </p>
          </div>
        </div>

        {/* Progress Bar - Same styling as LessonHeader */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Completamento</span>
            <span className="font-semibold tabular-nums">
              {Math.round(progressData.overallProgress)}
              %
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
            <div
              className={cn(
                'relative h-2.5 overflow-hidden rounded-full transition-all duration-700 ease-out',
                getProgressColor(progressData.overallProgress),
              )}
              style={{ width: `${progressData.overallProgress}%` }}
              role="progressbar"
              aria-valuenow={progressData.overallProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progresso complessivo: ${Math.round(progressData.overallProgress)}%`}
            >
              {/* Shimmer effect for active progress */}
              {progressData.overallProgress > 0 && progressData.overallProgress < 100 && (
                <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Tempo rimanente:</span>
            <span className="font-medium tabular-nums">
              {formatTime(totalTimeRemaining)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Percorsi attivi:</span>
            <span className="font-medium tabular-nums">
              {pathProgressArray.length}
            </span>
          </div>
        </div>

        {/* XP and Level Display */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-primary/10 p-3">
          <div className="flex items-center gap-3">
            <Trophy className="size-5 text-primary" />
            <div>
              <div className="text-sm font-medium">
                Livello
                {' '}
                {progressData.level}
              </div>
              <div className="text-xs text-muted-foreground">
                {progressData.totalXP}
                {' '}
                XP totali
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              Streak:
              {' '}
              {progressData.currentStreak}
              {' '}
              giorni
            </div>
            <div className="text-xs text-muted-foreground">
              Record:
              {' '}
              {progressData.longestStreak}
            </div>
          </div>
        </div>
      </div>

      {/* Path Progress Section */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <Trophy className="size-5 text-primary" />
          Progresso per Percorso
        </h3>

        <div className="grid gap-4">
          {pathProgressArray.map((path) => {
            const timeSpentHours = Math.round(path.timeSpent / 60 * 10) / 10;
            const lastAccessedDays = Math.floor((Date.now() - path.lastAccessed.getTime()) / (1000 * 60 * 60 * 24));

            return (
              <div
                key={path.pathId}
                className={cn(
                  'relative overflow-hidden rounded-xl border border-white/20 bg-white/60 backdrop-blur-sm p-4 shadow-sm shadow-black/5 transition-all duration-300',
                  'dark:border-white/10 dark:bg-white/10 dark:shadow-black/20',
                  'hover:scale-[1.01] hover:bg-white/80 hover:shadow-md dark:hover:bg-white/20',
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium capitalize">
                      {path.pathId.replace('-', ' ')}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Modulo
                      {' '}
                      {path.currentModule + 1}
                      {' '}
                      •
                      {timeSpentHours}
                      h studiate
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold tabular-nums">
                      {Math.round(path.completionRate)}
                      %
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lastAccessedDays === 0 ? 'Oggi' : `${lastAccessedDays}g fa`}
                    </div>
                  </div>
                </div>

                {/* Progress Bar - Same pattern as LessonHeader */}
                <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/60">
                  <div
                    className={cn(
                      'relative h-2 overflow-hidden rounded-full transition-all duration-700 ease-out',
                      getProgressColor(path.completionRate),
                    )}
                    style={{ width: `${path.completionRate}%` }}
                  >
                    {/* Shimmer effect */}
                    {path.completionRate > 0 && path.completionRate < 100 && (
                      <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Recommended Lesson */}
      {nextRecommendedLesson && (
        <div className={cn(
          'relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-6 shadow-sm shadow-black/5',
          'dark:border-primary/30 dark:from-primary/20 dark:to-primary/10',
        )}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/20">
              <BookOpen className="size-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Prossima Lezione Consigliata</h3>
              <p className="text-sm text-muted-foreground">
                Continua il tuo percorso di apprendimento
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-medium">{nextRecommendedLesson.title}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span className="tabular-nums">
                    {nextRecommendedLesson.duration}
                    {' '}
                    min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="size-3" />
                  <span className="tabular-nums">
                    {nextRecommendedLesson.xpReward}
                    {' '}
                    XP
                  </span>
                </div>
                <div className="rounded-full bg-primary/20 px-2 py-1 text-xs capitalize text-primary">
                  {nextRecommendedLesson.type}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onLessonClick?.(nextRecommendedLesson.id)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
            >
              <span>Inizia Lezione</span>
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* Decorative gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        </div>
      )}
    </div>
  );
};
