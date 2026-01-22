/*
 * NOTIFICATIONS BELL - Tradelia 2026 Optimized
 *
 * Optimized notification bell following 2026 UX best practices:
 * - Removed long-press functionality (accessibility issues)
 * - Clean empty state with proper messaging
 * - Footer buttons: "Mark All Read" + "Notification Settings"
 * - Always visible during scroll (different from header behavior)
 * - 44px touch target compliance
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { BellIcon, SettingsIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { UiButton } from '@/components/ui/UiButton';
import { UiIconButton } from '@/components/ui/UiIconButton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/utils/Helpers';

export const NotificationsBell: React.FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);

  // Empty notifications array - no mock data
  const notifications: never[] = [];
  const unreadCount = 0;

  const handleNotificationSettings = () => {
    // TODO: Navigate to notification settings page
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <UiIconButton
          label={t('notifications_aria_label')}
          icon={(
            <BellIcon
              size={20}
              hasNotifications={unreadCount > 0}
              notificationCount={unreadCount}
              variant="signature"
            />
          )}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            // Always visible - different from header scroll behavior
            'relative z-50',
            isOpen && 'scale-[0.98]',
            className,
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'w-80',
          // Premium surface
          'bg-surface-primary/95 backdrop-blur-xl',
          'border border-border/20',
          // Shadow
          'shadow-xl',
          // Rounded corners
          'rounded-2xl',
        )}
      >
        <DropdownMenuLabel className="px-4 py-3">
          <span className="text-base font-semibold">{t('notifications')}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Empty State - Following Nielsen Norman Group guidelines */}
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-4 rounded-full bg-muted/50 p-3">
            <BellIcon size={24} className="text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-sm font-medium text-foreground">
            {t('no_notifications_title')}
          </h3>
          <p className="max-w-xs text-xs text-muted-foreground">
            {t('no_notifications_description')}
          </p>
        </div>

        <DropdownMenuSeparator />

        {/* Footer Actions - Following PatternFly pattern */}
        <div className="flex items-center justify-between bg-muted/20 p-3">
          <UiButton
            variant="ghost"
            size="sm"
            onClick={() => {
              // Mark all as read functionality (when notifications exist)
              setIsOpen(false);
            }}
            className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground"
            disabled={notifications.length === 0}
          >
            {t('mark_all_read')}
          </UiButton>

          <UiButton
            variant="ghost"
            size="sm"
            onClick={handleNotificationSettings}
            className="flex h-8 items-center gap-1.5 px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <SettingsIcon size={16} />
            {t('notification_settings')}
          </UiButton>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
