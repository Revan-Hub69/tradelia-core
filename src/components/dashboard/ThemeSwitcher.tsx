/*
 * THEME SWITCHER - Premium Liquid Glass 2026
 *
 * Premium theme switcher with Apple iOS 26 Liquid Glass effects:
 * - Premium micro-interactions with spring physics
 * - Liquid glass backdrop effects
 * - Motion preferences compliance
 * - Signature icon system integration
 * - Professional accessibility
 */

'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/icons/unified/UnifiedIconSystem';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/Helpers';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations('Dashboard');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Premium motion preferences detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  if (!mounted) {
    return (
      <div
        className={cn('size-11 animate-pulse rounded-xl bg-muted/20', className)}
        style={{
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      />
    );
  }

  const isDark = theme === 'dark';

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={handleToggle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            aria-label={t('theme_toggle_aria_label')}
            className={cn(
              // Base styling
              'relative flex size-11 items-center justify-center rounded-xl',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              'transition-all duration-300 ease-out',
              // Premium liquid glass surface
              'bg-background/60 hover:bg-background/80',
              'border border-border/20 hover:border-border/40',
              // Signature effects + Visual hierarchy
              'signature-icon signature-icon--premium header-icon header-icon-secondary',
              className,
            )}
            style={{
              // Premium liquid glass effects
              backdropFilter: prefersReducedMotion
                ? 'blur(4px)'
                : 'blur(12px) saturate(180%)',
              // Premium spring physics
              transform: isPressed && !prefersReducedMotion
                ? 'scale(0.95) translateZ(0)'
                : 'scale(1) translateZ(0)',
              // Enhanced shadow with depth
              boxShadow: isPressed
                ? '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                : '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
              // Hardware acceleration
              willChange: 'transform, backdrop-filter, box-shadow',
              // Premium transition timing
              transition: prefersReducedMotion
                ? 'all 150ms ease-out'
                : 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            data-gpu="true"
          >
            {/* Premium icon with signature effects */}
            <div className="relative">
              {isDark
                ? (
                    <MoonIcon
                      size={20}
                      isActive
                      variant="signature"
                      className="text-foreground"
                    />
                  )
                : (
                    <SunIcon
                      size={20}
                      isActive
                      variant="signature"
                      className="text-foreground"
                    />
                  )}

              {/* Premium glow effect */}
              {!prefersReducedMotion && (
                <div
                  className="absolute inset-0 rounded-full opacity-20 blur-sm"
                  style={{
                    background: isDark
                      ? 'var(--glow-theme-dark)'
                      : 'var(--glow-theme-light)',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                />
              )}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className={cn(
            'text-xs',
            // Premium tooltip styling
            'bg-background/95 backdrop-blur-xl',
            'border border-border/20',
            'shadow-xl',
          )}
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <p className="font-medium">{isDark ? t('switch_to_light') : t('switch_to_dark')}</p>
          <p className="text-muted-foreground">Alt+T</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
