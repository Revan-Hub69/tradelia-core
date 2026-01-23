/*
 * THEME SWITCHER - Premium Liquid Glass 2026 + Phase 2 Spring Physics
 *
 * Enhanced with:
 * - Apple iOS 26 spring physics animations
 * - Semantic theme transition animations (sun/moon rotation)
 * - Dynamic glass effects with environmental response
 * - Premium micro-interactions
 * - 120fps optimization
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
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    if (!prefersReducedMotion) {
      setIsTransitioning(true);
      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 400);
    }
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleMouseDown = () => {};
  const handleMouseUp = () => {};
  const handleMouseLeave = () => {};

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
              // Premium spring physics + glass effects
              'premium-hover premium-focus glass-interactive gpu-accelerated',
              // Premium liquid glass surface
              'bg-background/60 hover:bg-background/80',
              'border border-border/20 hover:border-border/40',
              // Signature effects + Visual hierarchy + Glow enhancement
              'signature-icon signature-icon--premium header-icon header-icon-secondary glow-enhanced',
              className,
            )}
            style={{
              // Premium glow color based on theme
              ['--glow-color' as any]: isDark ? 'hsl(var(--info))' : 'hsl(var(--warning))',
              // Hardware acceleration
              willChange: 'transform, backdrop-filter, box-shadow',
              // Premium transition timing
              transition: prefersReducedMotion
                ? 'all 150ms ease-out'
                : 'all var(--spring-normal) var(--spring-smooth)',
            }}
            data-gpu="true"
          >
            {/* Premium icon with signature effects */}
            <div
              className={cn(
                'relative',
                // Theme transition animations
                isTransitioning && !prefersReducedMotion && (
                  isDark ? 'theme-sun-to-moon' : 'theme-moon-to-sun'
                ),
              )}
            >
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

              {/* Premium glow effect with theme-based colors */}
              {!prefersReducedMotion && (
                <div
                  className={cn(
                    'absolute inset-0 rounded-full opacity-20 blur-sm',
                    // Active glow when transitioning
                    isTransitioning && 'glow-active',
                  )}
                  style={{
                    background: isDark
                      ? 'var(--glow-theme-dark)'
                      : 'var(--glow-theme-light)',
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
