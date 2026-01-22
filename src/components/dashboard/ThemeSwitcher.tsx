/*
 * THEME SWITCHER - Tradelia 2026 Optimized
 *
 * Clean theme switcher following 2026 UX best practices:
 * - Removed long-press functionality (accessibility issues)
 * - Simple click to toggle
 * - Tooltip for clarity
 * - Signature icon effects
 */

'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { UiIconButton } from '@/components/ui/UiIconButton';
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

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <div className={cn('size-11 animate-pulse rounded-xl bg-muted/20', className)} />
    );
  }

  const isDark = theme === 'dark';

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <UiIconButton
            label={t('theme_toggle_aria_label')}
            icon={isDark
              ? <MoonIcon size={20} isActive variant="signature" />
              : <SunIcon size={20} isActive variant="signature" />}
            onClick={handleToggle}
            className={cn(className)}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{isDark ? t('switch_to_light') : t('switch_to_dark')}</p>
          <p className="text-muted-foreground">Alt+T</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};