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
import React, { useEffect, useRef, useState } from 'react';

import { MoonIcon, SunIcon } from '@/components/icons';
import { UiIconButton } from '@/components/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { QuickAction } from '@/hooks/useLongPress';
import { useLongPress } from '@/hooks/useLongPress';
import { QuickActionsMenu } from '@/components/navigation/QuickActionsMenu';
import { cn } from '@/utils/Helpers';

export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Dashboard');
  const [mounted, setMounted] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [quickMenuPosition, setQuickMenuPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const longPressTriggeredRef = useRef(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn('size-11 animate-pulse rounded-xl bg-muted/20', className)} />
    );
  }

  const isDark = theme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  const quickActions: QuickAction[] = [
    {
      id: 'theme-light',
      labelKey: 'Dashboard.switch_to_light',
      icon: <SunIcon size={16} />,
      onClick: () => setTheme('light'),
    },
    {
      id: 'theme-dark',
      labelKey: 'Dashboard.switch_to_dark',
      icon: <MoonIcon size={16} />,
      onClick: () => setTheme('dark'),
    },
  ];

  const openQuickMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setQuickMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
    longPressTriggeredRef.current = true;
    setIsQuickMenuOpen(true);
  };

  const closeQuickMenu = () => {
    setIsQuickMenuOpen(false);
    longPressTriggeredRef.current = false;
  };

  const {
    isLongPressing: _isLongPressing,
    isPressed: _isPressed,
    ...longPressHandlers
  } = useLongPress(openQuickMenu, {
    threshold: 500,
    moveThreshold: 10,
  });

  const handleToggle = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    setTheme(nextTheme);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <UiIconButton
            ref={triggerRef}
            label={t('theme_toggle_aria_label')}
            icon={isDark
              ? <MoonIcon size={20} isActive />
              : <SunIcon size={20} isActive />}
            onClick={handleToggle}
            className={cn(className)}
            {...longPressHandlers}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          <p>{isDark ? t('switch_to_light') : t('switch_to_dark')}</p>
          <p className="text-muted-foreground">Alt+T</p>
        </TooltipContent>
      </Tooltip>
      <QuickActionsMenu
        isOpen={isQuickMenuOpen}
        position={quickMenuPosition}
        actions={quickActions}
        onClose={closeQuickMenu}
        onAction={(action) => {
          action.onClick();
        }}
      />
    </TooltipProvider>
  );
};
