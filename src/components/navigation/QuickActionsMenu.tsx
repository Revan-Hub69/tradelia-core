/*
 * QUICK ACTIONS MENU - Apple/Linear/Stripe Level 2026
 * 
 * Context menu premium per long press navigation
 * Animazioni spring + glassmorphism + haptic feedback
 */

'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/Helpers';
import type { QuickAction } from '@/hooks/useLongPress';

export interface QuickActionsMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  actions: QuickAction[];
  onClose: () => void;
  onAction: (action: QuickAction) => void;
}

export const QuickActionsMenu: React.FC<QuickActionsMenuProps> = ({
  isOpen,
  position,
  actions,
  onClose,
  onAction,
}) => {
  const t = useTranslations();

  // Close on escape or outside click
  useEffect(() => {
    if (!isOpen) return;

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

  if (!isOpen) return null;

  const handleAction = (action: QuickAction) => {
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    onAction(action);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop */}
      <div 
        className={cn(
          'absolute inset-0 bg-black/20 backdrop-blur-sm',
          'animate-in fade-in duration-200',
          'pointer-events-auto'
        )}
        onClick={onClose}
      />

      {/* Quick Actions Menu */}
      <div
        className={cn(
          'quick-actions-menu absolute',
          'glass-surface border border-border/50',
          'rounded-2xl shadow-2xl',
          'min-w-48 py-2',
          'animate-in zoom-in-95 slide-in-from-bottom-2 duration-200',
          'pointer-events-auto'
        )}
        style={{
          left: position.x - 96, // Center horizontally (min-w-48 / 2)
          top: position.y - 10,
          transform: 'translateY(-100%)',
        }}
      >
        {/* Arrow pointer */}
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-border/50"
          style={{ filter: 'drop-shadow(0 1px 0 hsl(var(--background)))' }}
        />

        {/* Actions */}
        {actions.map((action) => (
          <button
            key={action.id}
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
              }
            )}
          >
            {action.icon && (
              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {action.icon}
              </div>
            )}
            <span className="font-medium text-sm">
              {t(action.labelKey as any)}
            </span>
          </button>
        ))}

        {/* Hint text */}
        <div className="px-4 py-2 border-t border-border/20 mt-1">
          <p className="text-xs text-muted-foreground text-center">
            {t('Dashboard.quick_actions_hint' as any)}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};