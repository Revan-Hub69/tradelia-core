'use client';

import { useState, useEffect } from 'react';
import { UserProgress, ApproachType } from '@/types/learning';

const STORAGE_KEY = 'tradelia_learning_progress';

const defaultProgress: UserProgress = {
  currentStreak: 0,
  longestStreak: 0,
  totalXP: 0,
  level: 1,
  completedLessons: [],
  approachesExplored: new Set(),
  lastActivity: new Date(),
  badges: []
};

export const useLearningProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert Set back from array
        parsed.approachesExplored = new Set(parsed.approachesExplored || []);
        parsed.lastActivity = new Date(parsed.lastActivity);
        setProgress(parsed);
      }
    } catch (error) {
      console.error('Error loading learning progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  const saveProgress = (newProgress: UserProgress) => {
    try {
      // Convert Set to array for JSON serialization
      const toSave = {
        ...newProgress,
        approachesExplored: Array.from(newProgress.approachesExplored)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      setProgress(newProgress);
    } catch (error) {
      console.error('Error saving learning progress:', error);
    }
  };

  // Update streak based on last activity
  const updateStreak = () => {
    const now = new Date();
    const lastActivity = new Date(progress.lastActivity);
    const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    let newStreak = progress.currentStreak;
    
    if (daysDiff === 1) {
      // Consecutive day - increment streak
      newStreak = progress.currentStreak + 1;
    } else if (daysDiff > 1) {
      // Missed days - reset streak
      newStreak = 1;
    }
    // Same day - keep current streak

    const newProgress = {
      ...progress,
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      lastActivity: now
    };

    saveProgress(newProgress);
    return newProgress;
  };

  // Complete a lesson
  const completeLesson = (lessonId: string, xpGained: number, approachesUsed: ApproachType[]) => {
    const updatedProgress = updateStreak();
    
    const newProgress: UserProgress = {
      ...updatedProgress,
      totalXP: updatedProgress.totalXP + xpGained,
      level: calculateLevel(updatedProgress.totalXP + xpGained),
      completedLessons: [...new Set([...updatedProgress.completedLessons, lessonId])],
      approachesExplored: new Set([...updatedProgress.approachesExplored, ...approachesUsed])
    };

    // Check for new badges
    const newBadges = checkForNewBadges(newProgress);
    newProgress.badges = [...newProgress.badges, ...newBadges];

    saveProgress(newProgress);
    return newProgress;
  };

  // Calculate level based on XP
  const calculateLevel = (xp: number): number => {
    // Simple level calculation: 100 XP per level
    return Math.floor(xp / 100) + 1;
  };

  // Check for new badges
  const checkForNewBadges = (newProgress: UserProgress) => {
    const newBadges = [];
    const existingBadgeIds = new Set(newProgress.badges.map(b => b.id));

    // First lesson badge
    if (newProgress.completedLessons.length >= 1 && !existingBadgeIds.has('first-lesson')) {
      newBadges.push({
        id: 'first-lesson',
        name: 'Primo Passo',
        description: 'Hai completato la tua prima lezione!',
        icon: '🎯',
        unlockedAt: new Date(),
        rarity: 'common' as const
      });
    }

    // Cognitive flexibility badge
    if (newProgress.approachesExplored.size >= 3 && !existingBadgeIds.has('cognitive-flexible')) {
      newBadges.push({
        id: 'cognitive-flexible',
        name: 'Flessibilità Cognitiva',
        description: 'Hai esplorato tutti e 3 gli approcci di apprendimento!',
        icon: '🧠',
        unlockedAt: new Date(),
        rarity: 'rare' as const
      });
    }

    // Streak badges
    if (newProgress.currentStreak >= 7 && !existingBadgeIds.has('week-streak')) {
      newBadges.push({
        id: 'week-streak',
        name: 'Settimana di Fuoco',
        description: 'Hai mantenuto una streak di 7 giorni!',
        icon: '🔥',
        unlockedAt: new Date(),
        rarity: 'rare' as const
      });
    }

    return newBadges;
  };

  // Reset progress (for testing)
  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
  };

  return {
    progress,
    isLoading,
    completeLesson,
    updateStreak,
    resetProgress,
    saveProgress
  };
};