'use client';

import { useCallback, useEffect, useRef } from 'react';

import type { ProgressData } from '@/components/dashboard/types';
import type { UserProgress } from '@/types/learning';

type LessonCompletionEvent = {
  lessonId: string;
  pathId: string;
  xpGained: number;
  timeSpent: number;
  completionPercentage: number;
  achievements?: string[];
};

type ProgressSyncOptions = {
  onProgressUpdate?: (progress: Partial<ProgressData>) => void;
  onXPGained?: (xp: number, source: string) => void;
  onStreakUpdate?: (streak: number) => void;
  onAchievementUnlocked?: (achievement: string) => void;
};

/**
 * Hook for syncing progress updates from lesson completions
 *
 * Features:
 * - Real-time progress synchronization
 * - XP and streak updates
 * - Achievement notifications
 * - Dashboard state updates
 * - Event-driven architecture
 */
export const useLessonProgressSync = (
  currentProgress: ProgressData,
  options: ProgressSyncOptions = {},
) => {
  const {
    onProgressUpdate,
    onXPGained,
    onStreakUpdate,
    onAchievementUnlocked,
  } = options;

  const progressRef = useRef(currentProgress);
  const lastSyncRef = useRef<Date>(new Date());

  // Update ref when progress changes
  useEffect(() => {
    progressRef.current = currentProgress;
  }, [currentProgress]);

  // Handle lesson completion event
  const handleLessonCompletion = useCallback((event: LessonCompletionEvent) => {
    const {
      lessonId,
      xpGained,
      timeSpent,
      achievements = [],
    } = event;

    const currentProgress = progressRef.current;
    const now = new Date();

    // Calculate new progress values
    const newTotalXP = currentProgress.totalXP + xpGained;
    const newTotalStudyTime = (currentProgress.totalStudyTime || 0) + timeSpent;

    // Update streak logic
    const lastActivity = new Date(currentProgress.lastActivity || now);
    const daysSinceLastActivity = Math.floor(
      (now.getTime() - lastActivity.getTime()) / (24 * 60 * 60 * 1000),
    );

    let newStreak = currentProgress.currentStreak;
    if (daysSinceLastActivity === 0) {
      // Same day, maintain streak
      newStreak = currentProgress.currentStreak;
    } else if (daysSinceLastActivity === 1) {
      // Next day, increment streak
      newStreak = currentProgress.currentStreak + 1;
    } else {
      // Gap in activity, reset streak
      newStreak = 1;
    }

    // Calculate new level
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    const leveledUp = newLevel > currentProgress.level;

    // Update completed lessons
    const newCompletedLessons = [...(currentProgress.completedLessons || [])];
    if (!newCompletedLessons.includes(lessonId)) {
      newCompletedLessons.push(lessonId);
    }

    // Create updated progress object
    const updatedProgress: Partial<UserProgress> = {
      totalXP: newTotalXP,
      level: newLevel,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentProgress.longestStreak || 0),
      totalStudyTime: newTotalStudyTime,
      lastActivity: now,
      completedLessons: newCompletedLessons,
    };

    // Trigger callbacks
    if (onProgressUpdate) {
      onProgressUpdate(updatedProgress);
    }

    if (onXPGained) {
      onXPGained(xpGained, `lesson-${lessonId}`);
    }

    if (onStreakUpdate && newStreak !== currentProgress.currentStreak) {
      onStreakUpdate(newStreak);
    }

    // Handle achievements
    achievements.forEach((achievement) => {
      if (onAchievementUnlocked) {
        onAchievementUnlocked(achievement);
      }
    });

    // Level up achievement
    if (leveledUp && onAchievementUnlocked) {
      onAchievementUnlocked(`level-${newLevel}`);
    }

    // Streak achievements
    if (newStreak > currentProgress.currentStreak) {
      const streakMilestones = [7, 14, 30, 60, 100];
      streakMilestones.forEach((milestone) => {
        if (newStreak === milestone && onAchievementUnlocked) {
          onAchievementUnlocked(`streak-${milestone}`);
        }
      });
    }

    lastSyncRef.current = now;
  }, [onProgressUpdate, onXPGained, onStreakUpdate, onAchievementUnlocked]);

  // Listen for lesson completion events
  useEffect(() => {
    const handleCustomEvent = (event: CustomEvent<LessonCompletionEvent>) => {
      handleLessonCompletion(event.detail);
    };

    // Listen for custom events from lesson components
    window.addEventListener('lessonCompleted', handleCustomEvent as EventListener);
    window.addEventListener('lessonProgressUpdated', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('lessonCompleted', handleCustomEvent as EventListener);
      window.removeEventListener('lessonProgressUpdated', handleCustomEvent as EventListener);
    };
  }, [handleLessonCompletion]);

  // Sync with localStorage/sessionStorage for persistence
  useEffect(() => {
    const syncWithStorage = () => {
      try {
        const storedProgress = localStorage.getItem('userProgress');
        if (storedProgress) {
          const parsed = JSON.parse(storedProgress);
          const storedDate = new Date(parsed.lastSync || 0);

          // Only sync if stored data is newer
          if (storedDate > lastSyncRef.current) {
            if (onProgressUpdate) {
              onProgressUpdate(parsed);
            }
            lastSyncRef.current = storedDate;
          }
        }
      } catch (error) {
        console.error('Failed to sync progress from storage:', error);
      }
    };

    // Sync on focus (when user returns to tab)
    window.addEventListener('focus', syncWithStorage);

    // Sync periodically
    const interval = setInterval(syncWithStorage, 30000); // Every 30 seconds

    return () => {
      window.removeEventListener('focus', syncWithStorage);
      clearInterval(interval);
    };
  }, [onProgressUpdate]);

  // Utility function to trigger lesson completion manually
  const triggerLessonCompletion = useCallback((event: LessonCompletionEvent) => {
    handleLessonCompletion(event);
  }, [handleLessonCompletion]);

  // Utility function to sync progress to storage
  const syncToStorage = useCallback((progress: ProgressData) => {
    try {
      const progressWithSync = {
        ...progress,
        lastSync: new Date().toISOString(),
      };
      localStorage.setItem('userProgress', JSON.stringify(progressWithSync));
    } catch (error) {
      console.error('Failed to sync progress to storage:', error);
    }
  }, []);

  return {
    triggerLessonCompletion,
    syncToStorage,
    lastSync: lastSyncRef.current,
  };
};
