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
import React, { useState } from 'react';

import { BellIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

  // Long-press handler for quick actions
  const longPressHandlers = useLongPress(
    () => {
      // Mark all as read on long-press
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    },
    {
      threshold: 500,
    },
  );

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
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
                  // Open state
                  isOpen && 'scale-95 bg-primary/25',
                  // Transitions
                  'motion-base',
                  // Focus - STRONGER ring
                  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  // Relative for badge positioning
                  'relative',
                  className,
                )}
                aria-label={t('notifications_aria_label')}
                {...longPressHandlers}
              >
                {/* Signature Bell icon with ring animation - LARGER 20px */}
                <BellIcon size={20} hasNewNotification={unreadCount > 0} />

                {/* Badge count - PREMIUM PULSE */}
                {unreadCount > 0 && (
                  <span
                    className={cn(
                      'absolute -right-1 -top-1',
                      'flex size-5 items-center justify-center',
                      'rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground',
                      'ring-2 ring-background',
                      'animate-pulse',
                    )}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p>{t('notifications')}</p>
            {unreadCount > 0 && (
              <p className="text-muted-foreground">
                {unreadCount}
                {' '}
                {t('unread')}
              </p>
            )}
            <p className="text-muted-foreground">
              {t('long_press_mark_all_read')}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-6 px-2 text-xs"
            >
              {t('mark_all_read')}
            </Button>
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
    </DropdownMenu>
  );
};
