/*
 * MOBILE FULLSCREEN MENU - Enterprise Standard Pattern
 *
 * RESEARCH-BASED (Tier-1 Sources):
 * - Gmail, Slack, Notion, Linear, Figma: All use fullscreen overlay
 * - CSSScript (2026): "Off-canvas navigation - go-to design pattern"
 * - Joyco Studio: "Full-screen overlay mobile menu"
 * - Flyriver: "Overlay menu covers entire browser window"
 *
 * PATTERN: Fullscreen Overlay (NOT positioned dropdown)
 * - Full width/height (not limited by trigger)
 * - Slide-in animation (off-canvas style)
 * - Sticky header with close button
 * - Scrollable content area
 * - Backdrop dismissal
 *
 * WHY THIS PATTERN:
 * ✅ Unlimited space (no width constraints)
 * ✅ Touch-friendly (large targets)
 * ✅ Consistent (same as Gmail, Slack, etc.)
 * ✅ Accessible (focus trap, ESC key)
 * ✅ No overflow issues
 *
 * SOURCES:
 * - docs/TASK3_PHASE2_ENTERPRISE_PATTERN_RESEARCH_2026.md
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import React, { useEffect } from 'react';

import { CloseIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { cn } from '@/utils/Helpers';

export type MobileFullscreenMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  slideFrom?: 'right' | 'left' | 'bottom'; // Animation direction
};

export const MobileFullscreenMenu = React.memo<MobileFullscreenMenuProps>(({
  isOpen,
  onClose,
  children,
  title,
  className,
  slideFrom = 'right', // Default: slide from right (Gmail style)
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

  // Animation classes based on slide direction
  const slideAnimations = {
    right: {
      open: 'slide-in-from-right',
      closed: 'slide-out-to-right',
    },
    left: {
      open: 'slide-in-from-left',
      closed: 'slide-out-to-left',
    },
    bottom: {
      open: 'slide-in-from-bottom',
      closed: 'slide-out-to-bottom',
    },
  };

  const animations = slideAnimations[slideFrom];

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop - tap to dismiss */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[150]',
            'bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'duration-300',
          )}
        />

        {/* Fullscreen Content - Enterprise Standard */}
        <Dialog.Content
          className={cn(
            // FULLSCREEN - not limited by trigger width
            'fixed inset-0 z-[151]',
            // Background
            'bg-background',
            // Scrollable
            'overflow-y-auto',
            // Slide animations (off-canvas style)
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            `data-[state=open]:${animations.open}`,
            `data-[state=closed]:${animations.closed}`,
            'duration-300',
            // iOS safe area
            'pb-[env(safe-area-inset-bottom)]',
            className,
          )}
        >
          {/* Sticky Header - Always visible */}
          <div
            className={cn(
              'sticky top-0 z-10',
              'flex items-center justify-between',
              'h-14 px-4',
              'bg-background/95 backdrop-blur-sm',
              'border-b border-border/50',
            )}
          >
            {/* Title */}
            {title && (
              <Dialog.Title className="text-lg font-semibold text-foreground">
                {title}
              </Dialog.Title>
            )}

            {/* Close Button - Always visible */}
            <Dialog.Close
              className={cn(
                'ml-auto', // Push to right if no title
                'flex size-10 items-center justify-center',
                'rounded-lg',
                'bg-foreground/5 hover:bg-foreground/10',
                'transition-colors duration-200',
                'touch-action-manipulation',
                '-webkit-tap-highlight-color-transparent',
              )}
              aria-label="Close"
            >
              <CloseIcon size={20} variant="premium" />
            </Dialog.Close>
          </div>

          {/* Content - Full width, scrollable */}
          <div className="p-4">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

MobileFullscreenMenu.displayName = 'MobileFullscreenMenu';
