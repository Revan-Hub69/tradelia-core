/*
 * MOBILE DROPDOWN POPOVER - Fitts's Law Compliant
 *
 * RESEARCH-BASED SOLUTION:
 * - Fitts's Law: Dropdown MUST appear near trigger (not far away)
 * - Proximity reduces interaction time
 * - Maintains spatial relationship
 * - No cognitive disconnect
 *
 * DESIGN PRINCIPLES:
 * - Appears BELOW trigger button (natural flow)
 * - Full width on mobile (easy to tap)
 * - High z-index (above navbar: 150)
 * - Backdrop for dismissal
 * - Smooth slide-down animation
 *
 * SOURCES:
 * - Fitts's Law (Paul Fitts, 1954)
 * - LogRocket: Fitts's Law UI Examples (2024)
 * - Interaction Design Foundation: Fitts's Law (2026)
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, { useEffect } from 'react';

import { CloseIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { cn } from '@/utils/Helpers';

export type MobileDropdownPopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  triggerRect?: DOMRect | null; // Position of trigger button
};

export const MobileDropdownPopover = React.memo<MobileDropdownPopoverProps>(({
  isOpen,
  onClose,
  children,
  title,
  className,
  triggerRect,
}) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [isOpen]);

  // Calculate position below trigger
  const topPosition = triggerRect
    ? `${triggerRect.bottom + 8}px` // 8px gap below trigger
    : '80px'; // Fallback if no triggerRect

  const leftPosition = triggerRect
    ? `${triggerRect.left}px`
    : '16px'; // Fallback

  const width = triggerRect
    ? `${triggerRect.width}px`
    : 'calc(100vw - 32px)'; // Fallback

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop - tap to dismiss */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[150]',
            'bg-black/30 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'duration-200',
          )}
        />

        {/* Popover Content - NEAR TRIGGER */}
        <Dialog.Content
          className={cn(
            // Fixed positioning NEAR trigger
            'fixed z-[151]',
            // Rounded corners
            'rounded-2xl',
            // Liquid Glass
            'glass-dropdown',
            // Max height - don't cover whole screen
            'max-h-[60vh] overflow-y-auto',
            // Animations - slide down from trigger
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'duration-200',
            // Shadow
            'shadow-2xl',
            className,
          )}
          style={{
            top: topPosition,
            left: leftPosition,
            width,
            minWidth: '280px', // Minimum readable width
          }}
        >
          {/* Close button - top right */}
          <Dialog.Close
            className={cn(
              'absolute top-2 right-2 z-10',
              'flex size-9 items-center justify-center',
              'rounded-lg',
              'bg-foreground/5 hover:bg-foreground/10',
              'transition-colors duration-200',
              'touch-action-manipulation',
              '-webkit-tap-highlight-color-transparent',
            )}
            aria-label="Close"
          >
            <CloseIcon size={16} variant="premium" />
          </Dialog.Close>

          {/* Title */}
          {title && (
            <Dialog.Title className="px-4 pt-4 pb-2 pr-12 text-base font-semibold text-foreground">
              {title}
            </Dialog.Title>
          )}

          {/* Content */}
          <div className={cn(title ? 'px-4 pb-4 pt-2' : 'px-4 pb-4 pt-4')}>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

MobileDropdownPopover.displayName = 'MobileDropdownPopover';
