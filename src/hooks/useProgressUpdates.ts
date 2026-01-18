'use client';

import { useCallback, useEffect, useState } from 'react';

import type { ProgressData } from '@/components/dashboard/types';

/**
 * useProgressUpdates - Real-time progress synchronization hook
 * 
 * Requirements: 3.2, 6.4
 * - Sincronizzare con lesson completion events
 * - Aggiornare visual indicators immediatamente
 * 
 * Features:
 * - Real-time progress updates from lesson completions
 * - Optimistic UI updates for immediate feedback
 * - Automatic sync with backend when lessons complete
 * - XP and streak updates integration
 */

type LessonCompletionEvent = {
  lessonId: string;
  pathId: string;
  xpEarned: number;
  completionTime: number;
  timestamp: Date;
};

type ProgressUpdateHook = {
  progressData: ProgressData | null;
  isLoading: boolean;
  error: string | null;
  updateProgress: (event: LessonCompletionEvent) => Promise<void>;
  refreshProgress: () => Promise<void>;
  isUpdating: boolean;
};

export const useProgressUpdates = (userId: string): ProgressUpdateHook => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial progress data
  const fetchProgressData = useCallback(async (): Promise<ProgressData | null> => {
    try {
      // In a real implementation, this would call your API
      // For now, return mock data that matches the types
      const mockProgressData: ProgressData = {
        overallProgress: 45,
        pathProgress: {
          'fondamenti': {
            pathId: 'fondamenti',
            completionRate: 75,
            currentModule: 2,
            timeSpent: 180, // 3 hours
            lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          },
          'investitore': {
            pathId: 'investitore',
            completionRate: 30,
            currentModule: 1,
            timeSpent: 90, // 1.5 hours
            lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          },
          'trader': {
            pathId: 'trader',
            completionRate: 15,
            currentModule: 0,
            timeSpent: 45, // 45 minutes
            lastAccessed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          },
        },
        currentStreak: 5,
        longestStreak: 12,
        totalXP: 2450,
        level: 8,
        nextRecommendedLesson: 'crypto-wallets-advanced',
      };

      return mockProgressData;
    } catch (err) {
      console.error('Failed to fetch progress data:', err);
      return null;
    }
  }, [userId]);

  // Initialize progress data
  useEffect(() => {
    const initializeProgress = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await fetchProgressData();
        setProgressData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load progress data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeProgress();
  }, [fetchProgressData]);

  // Update progress when lesson is completed
  const updateProgress = useCallback(async (event: LessonCompletionEvent) => {
    if (!progressData) return;

    setIsUpdating(true);
    setError(null);

    try {
      // Optimistic update - immediately update UI
      const updatedProgressData = { ...progressData };
      
      // Update path progress
      const pathProgress = updatedProgressData.pathProgress[event.pathId];
      if (pathProgress) {
        // Increment completion rate (simplified calculation)
        pathProgress.completionRate = Math.min(100, pathProgress.completionRate + 5);
        pathProgress.timeSpent += event.completionTime;
        pathProgress.lastAccessed = event.timestamp;
        
        // Update current module if needed
        if (pathProgress.completionRate > (pathProgress.currentModule + 1) * 25) {
          pathProgress.currentModule += 1;
        }
      }

      // Update overall progress
      const totalProgress = Object.values(updatedProgressData.pathProgress)
        .reduce((sum, path) => sum + path.completionRate, 0) / Object.keys(updatedProgressData.pathProgress).length;
      updatedProgressData.overallProgress = totalProgress;

      // Update XP and level
      updatedProgressData.totalXP += event.xpEarned;
      const newLevel = Math.floor(updatedProgressData.totalXP / 500) + 1;
      if (newLevel > updatedProgressData.level) {
        updatedProgressData.level = newLevel;
        // Could trigger level-up animation here
      }

      // Update streak (simplified - in real app, check if lesson was completed today)
      updatedProgressData.currentStreak += 1;
      if (updatedProgressData.currentStreak > updatedProgressData.longestStreak) {
        updatedProgressData.longestStreak = updatedProgressData.currentStreak;
      }

      // Apply optimistic update
      setProgressData(updatedProgressData);

      // Sync with backend (in real implementation)
      // await syncProgressWithBackend(event, updatedProgressData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      
      // Revert optimistic update on error
      const originalData = await fetchProgressData();
      setProgressData(originalData);
    } finally {
      setIsUpdating(false);
    }
  }, [progressData, fetchProgressData]);

  // Refresh progress data from server
  const refreshProgress = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchProgressData();
      setProgressData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh progress data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchProgressData]);

  // Listen for lesson completion events (in real app, this might be WebSocket or EventSource)
  useEffect(() => {
    const handleLessonCompletion = (event: CustomEvent<LessonCompletionEvent>) => {
      updateProgress(event.detail);
    };

    // Listen for custom lesson completion events
    window.addEventListener('lessonCompleted', handleLessonCompletion as EventListener);
    
    return () => {
      window.removeEventListener('lessonCompleted', handleLessonCompletion as EventListener);
    };
  }, [updateProgress]);

  return {
    progressData,
    isLoading,
    error,
    updateProgress,
    refreshProgress,
    isUpdating,
  };
};

// Utility function to trigger lesson completion events
export const triggerLessonCompletion = (event: LessonCompletionEvent) => {
  const customEvent = new CustomEvent('lessonCompleted', { detail: event });
  window.dispatchEvent(customEvent);
};

// Hook for components that need to trigger progress updates
export const useProgressTrigger = () => {
  const triggerCompletion = useCallback((lessonId: string, pathId: string, xpEarned: number, completionTime: number) => {
    const event: LessonCompletionEvent = {
      lessonId,
      pathId,
      xpEarned,
      completionTime,
      timestamp: new Date(),
    };
    
    triggerLessonCompletion(event);
  }, []);

  return { triggerCompletion };
};