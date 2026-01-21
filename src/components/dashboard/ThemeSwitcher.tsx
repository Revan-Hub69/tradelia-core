/*
 * THEME SWITCHER - Tradelia Signature Premium 2026
 *
 * Elegant theme toggle with signature animations
 * - Signature Sun/Moon icons with premium animations
 * - 180deg rotation on toggle
 * - Ray pulse + glow effects (full motion)
 * - Respects motion preferences
 * - Keyboard accessible (Space/Enter)
 * - Tooltip on hover
 * - 44px touch target
 */

'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/Helpers';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Dashboard');
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('size-9 animate-pulse rounded-xl bg-muted/20', className)} />
    );
  }

  const isDark = theme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(nextTheme)}
            className={cn(
              // Size & shape - LARGER for better visibility
              'size-11 rounded-xl',
              // Surface - MUCH more visible with stronger background
              'bg-primary/10 hover:bg-primary/20',
              'border-2 border-primary/20 hover:border-primary/30',
              // Backdrop
              'backdrop-blur-md',
              // Hover effects - MORE dramatic
              'hover:scale-110 hover:shadow-lg hover:shadow-primary/20',
              // Transitions
              'motion-base',
              // Focus - STRONGER ring
              'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              className,
            )}
            aria-label={t('theme_toggle_aria_label')}
          >
            {/* Signature icons with premium animations - LARGER 20px */}
            {isDark
              ? (
                  <MoonIcon
                    size={20}
                    isActive
                  />
                )
              : (
                  <SunIcon
                    size={20}
                    isActive
                  />
                )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{isDark ? t('switch_to_light') : t('switch_to_dark')}</p>
          <p className="text-muted-foreground">Alt+T</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
