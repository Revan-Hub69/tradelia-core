/**
 * Theme Provider - Tradelia 2026
 * 
 * Provider per la gestione del tema seguendo i principi Tradelia 2026
 * Supporta: light/dark/auto mode, density modes, transizioni fluide
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Theme, ThemeContextType, Density, DensityContextType } from '../ui/types';

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Density Context
const DensityContext = createContext<DensityContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultDensity?: Density;
  /** Disable transitions on initial load to prevent flash */
  disableTransitionOnLoad?: boolean;
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'auto',
  defaultDensity = 'comfortable',
  disableTransitionOnLoad = true
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [density, setDensityState] = useState<Density>(defaultDensity);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Load saved preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('tradelia-theme') as Theme;
    const savedDensity = localStorage.getItem('tradelia-density') as Density;
    
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
    
    if (savedDensity && ['compact', 'comfortable', 'spacious'].includes(savedDensity)) {
      setDensityState(savedDensity);
    }

    // Disable transitions on initial load
    if (disableTransitionOnLoad) {
      document.documentElement.classList.add('no-transition');
      // Re-enable after a short delay
      const timeout = setTimeout(() => {
        document.documentElement.classList.remove('no-transition');
      }, 100);
      return () => clearTimeout(timeout);
    }
    
    setMounted(true);
  }, [disableTransitionOnLoad]);

  // Resolve theme based on system preference
  useEffect(() => {
    const resolveTheme = () => {
      if (theme === 'auto') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setResolvedTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    resolveTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        resolveTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        resolvedTheme === 'dark' ? 'hsl(220, 15%, 8%)' : 'hsl(0, 0%, 99%)'
      );
    }
    
    // Save theme preference
    localStorage.setItem('tradelia-theme', theme);
  }, [theme, resolvedTheme]);

  // Apply density to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-density', density);
    localStorage.setItem('tradelia-density', density);
  }, [density]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const setDensity = useCallback((newDensity: Density) => {
    setDensityState(newDensity);
  }, []);

  const themeValue: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  };

  const densityValue: DensityContextType = {
    density,
    setDensity,
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <DensityContext.Provider value={densityValue}>
        {children}
      </DensityContext.Provider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useDensity(): DensityContextType {
  const context = useContext(DensityContext);
  if (!context) {
    throw new Error('useDensity must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Hook to check if component is mounted (for SSR hydration)
 */
export function useThemeMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
