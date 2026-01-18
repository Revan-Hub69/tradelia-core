'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * useXPSystem - XP and level management hook
 * 
 * Requirements: 3.2
 * - Mostrare XP corrente e progress verso next level
 * - Implementare level-up animations
 * 
 * Features:
 * - XP calculation and level progression
 * - Level-up detection and animations
 * - XP gain animations and feedback
 * - Persistent XP tracking
 */

type XPSystemState = {
  currentXP: number;
  level: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progressToNextLevel: number;
  isLevelingUp: boolean;
  recentXPGain: number | null;
};

type XPSystemHook = {
  xpState: XPSystemState;
  addXP: (amount: number, source?: string) => Promise<void>;
  triggerLevelUpAnimation: () => void;
  clearRecentXPGain: () => void;
  isAnimating: boolean;
};

// XP calculation constants
const BASE_XP_PER_LEVEL = 500;
const XP_MULTIPLIER = 1.1; // Each level requires 10% more XP

// Calculate XP required for a specific level
const calculateXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += Math.floor(BASE_XP_PER_LEVEL * Math.pow(XP_MULTIPLIER, i - 1));
  }
  return totalXP;
};

// Calculate level from total XP
const calculateLevelFromXP = (totalXP: number): number => {
  let level = 1;
  let xpNeeded = 0;
  
  while (xpNeeded <= totalXP) {
    level++;
    xpNeeded = calculateXPForLevel(level);
  }
  
  return level - 1;
};

export const useXPSystem = (initialXP: number = 0): XPSystemHook => {
  const [currentXP, setCurrentXP] = useState(initialXP);
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [recentXPGain, setRecentXPGain] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate current level and progress
  const level = calculateLevelFromXP(currentXP);
  const xpForCurrentLevel = calculateXPForLevel(level);
  const xpForNextLevel = calculateXPForLevel(level + 1);
  const progressToNextLevel = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  const xpState: XPSystemState = {
    currentXP,
    level,
    xpForCurrentLevel,
    xpForNextLevel,
    progressToNextLevel,
    isLevelingUp,
    recentXPGain,
  };

  // Add XP with level-up detection
  const addXP = useCallback(async (amount: number, source: string = 'lesson') => {
    const previousLevel = calculateLevelFromXP(currentXP);
    const newXP = currentXP + amount;
    const newLevel = calculateLevelFromXP(newXP);
    
    // Show XP gain animation
    setRecentXPGain(amount);
    setIsAnimating(true);
    
    // Update XP with animation delay
    setTimeout(() => {
      setCurrentXP(newXP);
      
      // Check for level up
      if (newLevel > previousLevel) {
        setTimeout(() => {
          setIsLevelingUp(true);
          
          // Trigger level-up celebration
          triggerLevelUpCelebration(newLevel);
          
          // Clear level-up state after animation
          setTimeout(() => {
            setIsLevelingUp(false);
          }, 3000);
        }, 500);
      }
      
      // Clear XP gain indicator
      setTimeout(() => {
        setRecentXPGain(null);
        setIsAnimating(false);
      }, 2000);
    }, 300);

    // In a real app, sync with backend
    try {
      // await syncXPWithBackend(newXP, source);
      console.log(`XP updated: +${amount} from ${source}, total: ${newXP}`);
    } catch (error) {
      console.error('Failed to sync XP:', error);
      // Could implement retry logic here
    }
  }, [currentXP]);

  // Trigger level-up celebration effects
  const triggerLevelUpCelebration = (newLevel: number) => {
    // Dispatch custom event for other components to listen to
    const levelUpEvent = new CustomEvent('levelUp', {
      detail: { newLevel, previousLevel: newLevel - 1 }
    });
    window.dispatchEvent(levelUpEvent);

    // Create confetti effect (if available)
    if (typeof window !== 'undefined' && 'confetti' in window) {
      // @ts-ignore - confetti library
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Play level-up sound (if available)
    try {
      const audio = new Audio('/sounds/level-up.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors (user interaction required)
      });
    } catch (error) {
      // Audio not available
    }
  };

  // Manual level-up animation trigger
  const triggerLevelUpAnimation = useCallback(() => {
    setIsLevelingUp(true);
    triggerLevelUpCelebration(level);
    
    setTimeout(() => {
      setIsLevelingUp(false);
    }, 3000);
  }, [level]);

  // Clear recent XP gain indicator
  const clearRecentXPGain = useCallback(() => {
    setRecentXPGain(null);
    setIsAnimating(false);
  }, []);

  // Listen for XP gain events from other components
  useEffect(() => {
    const handleXPGain = (event: CustomEvent<{ amount: number; source: string }>) => {
      addXP(event.detail.amount, event.detail.source);
    };

    window.addEventListener('xpGain', handleXPGain as EventListener);
    
    return () => {
      window.removeEventListener('xpGain', handleXPGain as EventListener);
    };
  }, [addXP]);

  return {
    xpState,
    addXP,
    triggerLevelUpAnimation,
    clearRecentXPGain,
    isAnimating,
  };
};

// Utility function to trigger XP gain from other components
export const triggerXPGain = (amount: number, source: string = 'lesson') => {
  const xpGainEvent = new CustomEvent('xpGain', {
    detail: { amount, source }
  });
  window.dispatchEvent(xpGainEvent);
};

// Hook for components that need to award XP
export const useXPTrigger = () => {
  const awardXP = useCallback((amount: number, source: string = 'lesson') => {
    triggerXPGain(amount, source);
  }, []);

  return { awardXP };
};