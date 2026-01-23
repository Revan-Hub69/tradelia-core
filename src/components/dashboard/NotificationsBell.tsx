/*
 * NOTIFICATIONS BELL - Premium Liquid Glass 2026 + Phase 2 Spring Physics
 *
 * Enhanced with:
 * - Apple iOS 26 spring physics animations
 * - Semantic notification arrival/dismiss animations
 * - Dynamic glass effects with environmental response
 * - Premium micro-interactions
 * - 120fps optimization
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
  const [hasNewNotification, setHasNewNotification] = useState(false);

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

  // Simulate notification arrival for demo (Phase 2 enhancement)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!prefersReducedMotion) {
        setHasNewNotification(true);
        // Reset animation state after completion
        setTimeout(() => setHasNewNotification(false), 600);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  const handleNotificationSettings = () => {
    // TODO: Navigate to notification settings page
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('notifications_aria_label')}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            // Base styling
            'relative flex size-11 items-center justify-center rounded-xl',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            // Premium spring physics + glass effects + Educational calm
            'educational-hover educational-focus educational-feedback educational-gpu-optimized',
            // Premium liquid glass surface
            'bg-background/60 hover:bg-background/80',
            'border border-border/20 hover:border-border/40',
            // Signature effects + Visual hierarchy + Educational breathing
            'signature-icon signature-icon--premium header-icon header-icon-primary educational-breathing',
            // Notification arrival animation - Educational version
            hasNewNotification && !prefersReducedMotion && 'notification-arrival-educational',
            className,
          )}
          style={{
            // Hardware acceleration
            willChange: 'transform, backdrop-filter, box-shadow',
            // Educational transition timing instead of premium spring
            transition: prefersReducedMotion
              ? 'all 150ms ease-out'
              : 'all var(--educational-gentle) var(--educational-gentle)',
          }}
          data-gpu="true"
        >
          {/* Premium icon with signature effects */}
          <div className="relative">
            <BellIcon
              size={20}
              hasNotifications={unreadCount > 0}
              notificationCount={unreadCount}
              variant="signature"
              className={cn(
                'text-foreground',
                // Add subtle breathing when notifications present
                unreadCount > 0 && 'educational-breathing-focus',
              )}
            />

            {/* Educational feedback - discrete border instead of glow */}
            {unreadCount > 0 && (
              <div className="pointer-events-none absolute inset-0 rounded-xl border border-destructive/20" />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'w-80 overflow-hidden rounded-2xl border border-border/20 p-0 shadow-2xl',
          // Premium dropdown entrance animation
          'dropdown-entrance glass-dropdown',
        )}
      >
        <DropdownMenuLabel className="border-b border-border/10 px-6 py-4">
          <span className="text-base font-semibold text-foreground">{t('notifications')}</span>
        </DropdownMenuLabel>

        {/* Empty State - Following Nielsen Norman Group guidelines (research) */}
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div
            className="mb-4 rounded-full p-3"
            style={{
              backgroundColor: 'var(--glass-header-hover)',
              backdropFilter: 'blur(4px)',
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
            backgroundColor: 'var(--glass-header-hover)',
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
