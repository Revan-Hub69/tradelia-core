/*
 * QUICK ACTIONS MENU - Apple/Linear/Stripe Level 2026
 *
 * Context menu premium per long press navigation
 * Animazioni spring + glassmorphism + haptic feedback
 */

'use client';

import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

import type { QuickAction } from '@/hooks/useLongPress';
import { cn } from '@/utils/Helpers';

export type QuickActionsMenuProps = {
  isOpen: boolean;
  position: { x: number; y: number };
  actions: QuickAction[];
  onClose: () => void;
  onAction: (action: QuickAction) => void;
};

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  isOpen,
  position,
  actions,
  onClose,
  onAction,
}) => {
  const t = useTranslations('Dashboard');

  // Close on escape or outside click
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: Event) => {
      const target = e.target as Element;
      if (!target.closest('.quick-actions-menu')) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  // Calculate safe position within viewport
  const calculateSafePosition = () => {
    const menuWidth = 192; // min-w-48 = 192px
    const menuHeight = actions.length * 48 + 80; // Approximate height
    const padding = 16;

    let safeX = position.x - menuWidth / 2;
    let safeY = position.y - menuHeight - 10;

    // Keep within horizontal bounds
    if (safeX < padding) {
      safeX = padding;
    } else if (safeX + menuWidth > window.innerWidth - padding) {
      safeX = window.innerWidth - menuWidth - padding;
    }

    // Keep within vertical bounds
    if (safeY < padding) {
      safeY = position.y + 10; // Show below if not enough space above
    }

    return { x: safeX, y: safeY };
  };

  const safePosition = calculateSafePosition();

  const handleAction = (action: QuickAction) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    onAction(action);
    onClose();
  };

  return createPortal(
    <div className="pointer-events-none fixed inset-0 layer-modal">
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/20 backdrop-blur-sm',
          'animate-in fade-in duration-200',
          'pointer-events-auto',
        )}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        role="button"
        tabIndex={0}
      />

      {/* Quick Actions Menu */}
      <div
        className={cn(
          'quick-actions-menu absolute',
          'glass-surface border border-border/50',
          'rounded-2xl shadow-2xl',
          'min-w-48 py-2',
          'animate-in zoom-in-95 slide-in-from-bottom-2 duration-200',
          'pointer-events-auto',
        )}
        style={{
          left: safePosition.x,
          top: safePosition.y,
        }}
      >
        {/* Arrow pointer */}
        <div
          className="absolute left-1/2 top-full size-0 -translate-x-1/2 border-x-8 border-t-8 border-transparent border-t-border/50"
          style={{ filter: 'drop-shadow(0 1px 0 hsl(var(--background)))' }}
        />

        {/* Actions */}
        {actions.map(action => (
          <button
            key={action.id}
            type="button"
            onClick={() => handleAction(action)}
            className={cn(
              'w-full px-4 py-3 text-left',
              'flex items-center gap-3',
              'hover:bg-white/10 dark:hover:bg-white/5',
              'press-depth focus-ring',
              'motion-fast',
              {
                'text-primary': action.variant === 'primary',
                'text-destructive': action.variant === 'destructive',
                'text-foreground': action.variant === 'default' || !action.variant,
              },
            )}
          >
            {action.icon && (
              <div className="flex size-5 shrink-0 items-center justify-center">
                {action.icon}
              </div>
            )}
            <span className="text-sm font-medium">
              {action.label || t(action.labelKey.replace('Dashboard.', '') as 'nav_home')}
            </span>
          </button>
        ))}

        {/* Hint text */}
        <div className="mt-1 border-t border-border/20 px-4 py-2">
          <p className="text-center text-xs text-muted-foreground">
            {t('quick_actions_hint')}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
};
