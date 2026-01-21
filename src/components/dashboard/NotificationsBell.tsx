/*
 * NOTIFICATIONS BELL - Tradelia Signature Premium 2026
 *
 * Premium notification bell with signature animations
 * - Signature Bell icon with ring animation
 * - Badge count with pulse
 * - Long-press for quick actions
 * - Dropdown menu with notifications
 * - 44px touch target
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { BellIcon } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuAnchor,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UiButton, UiIconButton } from '@/components/ui';
import { QuickActionsMenu } from '@/components/navigation/QuickActionsMenu';
import type { QuickAction } from '@/hooks/useLongPress';
import { useLongPress } from '@/hooks/useLongPress';
import { cn } from '@/utils/Helpers';

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
};

export const NotificationsBell: React.FC<{ className?: string }> = ({ className }) => {
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [quickMenuPosition, setQuickMenuPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const longPressTriggeredRef = useRef(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nuova lezione disponibile',
      message: 'Blockchain Basics è ora disponibile',
      timestamp: new Date(),
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Obiettivo raggiunto',
      message: 'Hai completato 5 lezioni questa settimana!',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      type: 'success',
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const quickActions: QuickAction[] = [
    {
      id: 'notifications-open',
      labelKey: 'Dashboard.notifications',
      onClick: () => setIsOpen(true),
    },
    {
      id: 'notifications-read',
      labelKey: 'Dashboard.mark_all_read',
      onClick: () => setNotifications(prev => prev.map(n => ({ ...n, read: true }))),
      variant: 'primary',
    },
  ];

  // Long-press handler for quick actions
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

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleMenu = () => {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }
    setIsOpen(prev => !prev);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuAnchor asChild>
        <UiIconButton
          ref={triggerRef}
          label={t('notifications_aria_label')}
          icon={(
            <>
              <BellIcon size={20} hasNewNotification={unreadCount > 0} />
              {unreadCount > 0 && (
                <span
                  className={cn(
                    'absolute -right-2 -top-2',
                    'flex size-5 items-center justify-center',
                    'rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground',
                    'ring-2 ring-background',
                    'animate-pulse',
                  )}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </>
          )}
          onClick={handleToggleMenu}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            isOpen && 'scale-[0.98]',
            className,
          )}
          {...longPressHandlers}
        />
      </DropdownMenuAnchor>

      <DropdownMenuContent
        align="end"
        className={cn(
          'w-80',
          // Premium surface
          'bg-surface-primary/95 backdrop-blur-xl',
          'border border-border/20',
          // Shadow
          'shadow-xl',
        )}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>{t('notifications')}</span>
          {unreadCount > 0 && (
            <UiButton
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-6 px-2 text-xs"
            >
              {t('mark_all_read')}
            </UiButton>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0
          ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t('no_notifications')}
              </div>
            )
          : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notification => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'cursor-pointer flex-col items-start gap-1 p-3',
                      'motion-base',
                      // Hover state
                      'hover:bg-primary/10',
                      // Unread state
                      !notification.read && 'bg-primary/5',
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <span className="size-2 rounded-full bg-primary" />
                          )}
                          <span className="font-medium">{notification.title}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp.toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}
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
