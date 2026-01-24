/*
 * MOBILE DROPDOWN DIALOG - iOS 26 Bottom Sheet
 *
 * Wrapper per trasformare dropdown in bottom sheet su mobile
 * Usa Dialog di Radix UI per rendering corretto
 *
 * Best Practices 2026:
 * - Dialog invece di Portal disabilitato
 * - Bottom sheet pattern (< 768px)
 * - iOS safe area insets
 * - Backdrop overlay
 * - Spring physics animations
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React from 'react';

import { CloseIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { cn } from '@/utils/Helpers';

export type MobileDropdownDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export const MobileDropdownDialog = React.memo<MobileDropdownDialogProps>(({
  isOpen,
  onClose,
  children,
  title,
  className,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[70]',
            'bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          )}
        />

        {/* Bottom Sheet Content */}
        <Dialog.Content
          className={cn(
            // Fixed positioning
            'fixed bottom-0 left-0 right-0 z-[71]',
            // Rounded top corners
            'rounded-t-3xl',
            // Liquid Glass
            'glass-dropdown',
            // Max height
            'max-h-[80vh] overflow-y-auto',
            // iOS Safe Area
            'pb-[calc(16px+env(safe-area-inset-bottom))]',
            // Animations
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
            'duration-300',
            className,
          )}
        >
          {/* Grab handle */}
          <div className="flex justify-center pb-2 pt-3">
            <div className="h-1 w-10 rounded-full bg-foreground/20" />
          </div>

          {/* Close button */}
          <Dialog.Close
            className={cn(
              'absolute top-4 right-4 z-10',
              'flex size-11 items-center justify-center',
              'rounded-xl',
              'bg-foreground/5 hover:bg-foreground/10',
              'transition-colors duration-200',
              'touch-action-manipulation',
              '-webkit-tap-highlight-color-transparent',
            )}
            aria-label="Close"
          >
            <CloseIcon size={20} variant="signature" />
          </Dialog.Close>

          {/* Title */}
          {title && (
            <Dialog.Title className="px-6 pb-4 text-lg font-semibold text-foreground">
              {title}
            </Dialog.Title>
          )}

          {/* Content */}
          <div className="px-6 pb-6">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

MobileDropdownDialog.displayName = 'MobileDropdownDialog';
