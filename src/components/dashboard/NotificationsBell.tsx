/*
 * NOTIFICATIONS BELL - Premium Liquid Glass 2026
 *
 * Premium notification bell con Apple iOS 26 Liquid Glass effects:
 * - Ricerca Tier 1: SetProduct.com + Smart Interface Design Patterns
 * - Liquid glass dropdown con enhanced backdrop
 * - Signature icon effects con GPU acceleration
 * - Empty state educativo seguendo Nielsen Norman Group
 * - Motion preferences compliance
 * - Professional accessibility (WCAG 2.1 AA)
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { BellIcon, SettingsIcon } from '@/components/icons/unified/UnifiedIconSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UiButton } from '@/components/ui/UiButton';
import { cn } from '@/utils/Helpers';

export const NotificationsBell: React.FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Premium motion preferences detection
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Empty notifications array - no mock data (following research best practices)
  const notifications: never[] = [];
  const unreadCount = 0;

  const handleNotificationSettings = () => {
    // TODO: Navigate to notification settings page
    setIsOpen(false);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          aria-label={t('notifications_aria_label')}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            // Base styling
            'relative flex size-11 items-center justify-center rounded-xl',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'transition-all duration-300 ease-out',
            // Premium liquid glass surface
            'bg-background/60 hover:bg-background/80',
            'border border-border/20 hover:border-border/40',
            // Signature effects
            'signature-icon signature-icon--premium',
            className,
          )}
          style={{
            // Premium liquid glass effects (iOS 26 research)
            backdropFilter: prefersReducedMotion
              ? 'blur(4px)'
              : 'blur(12px) saturate(180%)',
            // Premium spring physics
            transform: (isPressed || isOpen) && !prefersReducedMotion
              ? 'scale(0.95) translateZ(0)'
              : 'scale(1) translateZ(0)',
            // Enhanced shadow with depth
            boxShadow: (isPressed || isOpen)
              ? '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.1)'
              : '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
            // Hardware acceleration
            willChange: 'transform, backdrop-filter, box-shadow',
            // Premium transition timing (Apple iOS 26)
            transition: prefersReducedMotion
              ? 'all 150ms ease-out'
              : 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          data-gpu="true"
        >
          {/* Premium icon with signature effects */}
          <div className="relative">
            <BellIcon
              size={20}
              hasNotifications={unreadCount > 0}
              notificationCount={unreadCount}
              variant="premium"
              className="text-foreground"
            />

            {/* Premium glow effect (research-based) */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-0 rounded-full opacity-20 blur-sm"
                style={{
                  background: 'radial-gradient(circle, #ef4444 0%, transparent 70%)',
                  animation: unreadCount > 0 ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                }}
              />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'w-80 overflow-hidden rounded-2xl border border-border/20 p-0 shadow-2xl',
        )}
        style={{
          // Premium liquid glass backdrop (Apple iOS 26)
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: prefersReducedMotion
            ? 'blur(8px)'
            : 'blur(20px) saturate(180%)',
          // Enhanced shadow with depth (research-based)
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <DropdownMenuLabel className="border-b border-border/10 px-6 py-4">
          <span className="text-base font-semibold text-foreground">{t('notifications')}</span>
        </DropdownMenuLabel>

        {/* Empty State - Following Nielsen Norman Group guidelines (research) */}
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div
            className="mb-4 rounded-full p-3"
            style={{
              backgroundColor: 'rgba(156, 163, 175, 0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <BellIcon size={24} className="text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-sm font-medium text-foreground">
            {t('no_notifications_title')}
          </h3>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {t('no_notifications_description')}
          </p>
        </div>

        {/* Footer Actions - Following PatternFly pattern (research) */}
        <div
          className="flex items-center justify-between border-t border-border/10 p-4"
          style={{
            backgroundColor: 'rgba(156, 163, 175, 0.05)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <UiButton
            variant="ghost"
            size="sm"
            onClick={() => {
              // Mark all as read functionality (when notifications exist)
              setIsOpen(false);
            }}
            className={cn(
              'h-8 px-3 text-xs text-muted-foreground transition-all duration-200 hover:scale-105 hover:text-foreground',
            )}
            disabled={notifications.length === 0}
          >
            {t('mark_all_read')}
          </UiButton>

          <UiButton
            variant="ghost"
            size="sm"
            onClick={handleNotificationSettings}
            className={cn(
              'flex h-8 items-center gap-1.5 px-3 text-xs text-muted-foreground transition-all duration-200 hover:scale-105 hover:text-foreground',
            )}
          >
            <SettingsIcon size={16} />
            {t('notification_settings')}
          </UiButton>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
