'use client';

import { useEffect, useState } from 'react';

interface ContrastSettings {
  isHighContrast: boolean;
  contrastLevel: 'normal' | 'high' | 'maximum';
  reducedMotion: boolean;
}

/**
 * Hook for high contrast and accessibility support
 * 
 * Features:
 * - Detects system high contrast preferences
 * - Provides contrast level controls
 * - Handles reduced motion preferences
 * - Applies appropriate CSS classes
 * - Maintains accessibility compliance
 */
export const useHighContrast = () => {
  const [contrastSettings, setContrastSettings] = useState<ContrastSettings>({
    isHighContrast: false,
    contrastLevel: 'normal',
    reducedMotion: false,
  });

  // Detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      // Check for high contrast preference
      const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
      const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      setContrastSettings(prev => ({
        ...prev,
        isHighContrast: highContrastQuery.matches,
        reducedMotion: reducedMotionQuery.matches,
        contrastLevel: highContrastQuery.matches ? 'high' : 'normal',
      }));
    };

    // Initial detection
    detectSystemPreferences();

    // Listen for changes
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleContrastChange = () => detectSystemPreferences();
    const handleMotionChange = () => detectSystemPreferences();

    highContrastQuery.addEventListener('change', handleContrastChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleContrastChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Apply contrast classes to document
  useEffect(() => {
    const { isHighContrast, contrastLevel, reducedMotion } = contrastSettings;

    // Remove existing classes
    document.documentElement.classList.remove(
      'high-contrast',
      'contrast-normal',
      'contrast-high',
      'contrast-maximum',
      'reduced-motion'
    );

    // Add appropriate classes
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    }

    document.documentElement.classList.add(`contrast-${contrastLevel}`);

    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    }

    return () => {
      // Cleanup on unmount
      document.documentElement.classList.remove(
        'high-contrast',
        'contrast-normal',
        'contrast-high',
        'contrast-maximum',
        'reduced-motion'
      );
    };
  }, [contrastSettings]);

  // Manual contrast level setting
  const setContrastLevel = (level: ContrastSettings['contrastLevel']) => {
    setContrastSettings(prev => ({
      ...prev,
      contrastLevel: level,
      isHighContrast: level !== 'normal',
    }));
  };

  // Toggle high contrast
  const toggleHighContrast = () => {
    setContrastSettings(prev => ({
      ...prev,
      isHighContrast: !prev.isHighContrast,
      contrastLevel: !prev.isHighContrast ? 'high' : 'normal',
    }));
  };

  // Get contrast-aware colors
  const getContrastColors = () => {
    const { contrastLevel } = contrastSettings;

    const colorSchemes = {
      normal: {
        background: 'bg-background',
        foreground: 'text-foreground',
        muted: 'text-muted-foreground',
        border: 'border-border',
        primary: 'text-primary',
        secondary: 'text-secondary',
      },
      high: {
        background: 'bg-white dark:bg-black',
        foreground: 'text-black dark:text-white',
        muted: 'text-gray-700 dark:text-gray-300',
        border: 'border-gray-900 dark:border-gray-100',
        primary: 'text-blue-700 dark:text-blue-300',
        secondary: 'text-gray-800 dark:text-gray-200',
      },
      maximum: {
        background: 'bg-white dark:bg-black',
        foreground: 'text-black dark:text-white',
        muted: 'text-black dark:text-white',
        border: 'border-black dark:border-white',
        primary: 'text-black dark:text-white',
        secondary: 'text-black dark:text-white',
      },
    };

    return colorSchemes[contrastLevel];
  };

  // Get contrast-aware glassmorphism styles
  const getContrastGlassmorphism = () => {
    const { contrastLevel } = contrastSettings;

    if (contrastLevel === 'maximum') {
      return {
        background: 'bg-white dark:bg-black',
        border: 'border-2 border-black dark:border-white',
        backdrop: '', // No backdrop blur for maximum contrast
      };
    }

    if (contrastLevel === 'high') {
      return {
        background: 'bg-white/95 dark:bg-black/95',
        border: 'border-2 border-gray-900/50 dark:border-gray-100/50',
        backdrop: 'backdrop-blur-sm',
      };
    }

    // Normal contrast - standard glassmorphism
    return {
      background: 'bg-white/40 dark:bg-white/5',
      border: 'border border-white/20 dark:border-white/10',
      backdrop: 'backdrop-blur-sm',
    };
  };

  return {
    contrastSettings,
    setContrastLevel,
    toggleHighContrast,
    getContrastColors,
    getContrastGlassmorphism,
    isHighContrast: contrastSettings.isHighContrast,
    contrastLevel: contrastSettings.contrastLevel,
    reducedMotion: contrastSettings.reducedMotion,
  };
};