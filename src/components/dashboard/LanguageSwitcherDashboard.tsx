/*
 * LANGUAGE SWITCHER DASHBOARD - Tradelia Signature Premium 2026
 *
 * Elegant language selector for dashboard
 * - Signature Globe icon with continuous rotation
 * - Equator pulse + continent dots (full motion)
 * - Dual-language labels (Italiano / Italian)
 * - Preserves current path
 * - Keyboard accessible
 * - 44px touch target
 */

'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { GlobeIcon } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UiIconButton } from '@/components/ui';
import { QuickActionsMenu } from '@/components/navigation/QuickActionsMenu';
import type { QuickAction } from '@/hooks/useLongPress';
import { useLongPress } from '@/hooks/useLongPress';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

export const LanguageSwitcherDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [quickMenuPosition, setQuickMenuPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const longPressTriggeredRef = useRef(false);

  const handleChange = (value: string) => {
    if (value === locale) {
      return;
    }
    setIsOpen(false);
    router.replace(pathname, { locale: value });
  };

  const quickLocales = [
    AppConfig.locales.find(lang => lang.id === locale),
    ...AppConfig.locales.filter(lang => lang.id !== locale),
  ]
    .filter((lang): lang is (typeof AppConfig.locales)[number] => Boolean(lang))
    .slice(0, 3);

  const quickActions: QuickAction[] = quickLocales.map(lang => ({
    id: `lang-${lang.id}`,
    labelKey: 'Dashboard.change_language',
    label: lang.name,
    onClick: () => handleChange(lang.id),
  }));

  const openQuickMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setQuickMenuPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      });
    }
    longPressTriggeredRef.current = true;
    setIsOpen(false);
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

  const handleOpenChange = (nextOpen: boolean) => {
    if (longPressTriggeredRef.current && nextOpen) {
      return;
    }
    setIsOpen(nextOpen);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <UiIconButton
          ref={triggerRef}
          label={t('language_switcher_aria_label')}
          icon={<GlobeIcon size={20} isActive={isOpen} />}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            isOpen && 'scale-[0.98]',
            className,
          )}
          {...longPressHandlers}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'min-w-48',
          // Premium surface
          'bg-surface-primary/95 backdrop-blur-xl',
          'border border-border/20',
          // Shadow
          'shadow-xl',
        )}
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {AppConfig.locales.map(lang => (
            <DropdownMenuRadioItem
              key={lang.id}
              value={lang.id}
              className={cn(
                'cursor-pointer',
                'motion-base',
                // Hover state
                'hover:bg-primary/10',
              )}
            >
              <div className="flex flex-col gap-0.5">
                {/* Native name (primary) */}
                <span className="font-medium">{lang.name}</span>
                {/* English name (secondary) */}
                <span className="text-xs text-muted-foreground">
                  {lang.id === 'it' ? 'Italian' : 'Inglese'}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
      <QuickActionsMenu
        isOpen={isQuickMenuOpen}
        position={quickMenuPosition}
        actions={quickActions}
        onClose={closeQuickMenu}
        onAction={(action) => {
          action.onClick();
        }}
      />
    </DropdownMenu>
  );
};
