/**
 * Theme Toggle - Tradelia 2026
 * 
 * Componente per cambiare tema (light/dark/auto)
 * Accessibile e con transizioni fluide
 */

'use client';

import React from 'react';
import { useTheme, useThemeMounted } from '../config/theme-provider';
import { cn } from './utils';
import type { Theme } from './types';

interface ThemeToggleProps {
  className?: string;
  /** Show labels instead of icons */
  showLabels?: boolean;
  /** Compact mode - only light/dark toggle */
  compact?: boolean;
}

// Icons inline per evitare dipendenze esterne
const SunIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" 
    />
  </svg>
);

const MoonIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" 
    />
  </svg>
);

const ComputerIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" 
    />
  </svg>
);

const themeOptions: { value: Theme; label: string; icon: typeof SunIcon }[] = [
  { value: 'light', label: 'Chiaro', icon: SunIcon },
  { value: 'dark', label: 'Scuro', icon: MoonIcon },
  { value: 'auto', label: 'Sistema', icon: ComputerIcon },
];

export function ThemeToggle({ 
  className, 
  showLabels = false,
  compact = false 
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useThemeMounted();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div 
        className={cn(
          'flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1',
          className
        )}
        aria-hidden="true"
      >
        {(compact ? themeOptions.slice(0, 2) : themeOptions).map((option) => (
          <div
            key={option.value}
            className="h-8 w-8 rounded-md bg-transparent"
          />
        ))}
      </div>
    );
  }

  const options = compact ? themeOptions.slice(0, 2) : themeOptions;

  // For compact mode, toggle between light and dark
  const handleCompactToggle = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  if (compact) {
    return (
      <button
        onClick={handleCompactToggle}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          'border border-border bg-background',
          'transition-subtle hover:bg-muted/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
          className
        )}
        aria-label={`Passa al tema ${resolvedTheme === 'light' ? 'scuro' : 'chiaro'}`}
      >
        {resolvedTheme === 'light' ? (
          <MoonIcon className="h-4 w-4" />
        ) : (
          <SunIcon className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <div 
      className={cn(
        'flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-1',
        className
      )}
      role="radiogroup"
      aria-label="Seleziona tema"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isSelected = theme === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-md px-3 py-1.5',
              'transition-subtle',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1',
              isSelected 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
            role="radio"
            aria-checked={isSelected}
            aria-label={option.label}
          >
            <Icon className="h-4 w-4" />
            {showLabels && (
              <span className="text-sm font-medium">{option.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
