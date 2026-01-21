/**
 * UI PANEL - Signature Primitive v1
 *
 * Sostituisce: Notification panel, Help panel, CommandPalette wrapper
 * 
 * REGOLE:
 * - focus trap
 * - ESC to close
 * - aria-modal
 * - Zero side effects globali
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';

import { cn } from '@/utils/Helpers';

export type UiPanelProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * UiPanel - Modal/Dialog panel with glass surface
 * 
 * Usage:
 * - Notifications: <UiPanel open={open} onClose={close} title="Notifications">...</UiPanel>
 * - Help: <UiPanel open={open} onClose={close} title="Help">...</UiPanel>
 * - Command: <UiPanel open={open} onClose={close}>...</UiPanel>
 * 
 * Features:
 * - Focus trap (Radix Dialog)
 * - ESC to close
 * - aria-modal
 * - Backdrop click to close
 */
export const UiPanel = forwardRef<HTMLDivElement, UiPanelProps>(
  ({ open, onClose, title, description, children, className }, ref) => {
    return (
      <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <Dialog.Portal>
          {/* Backdrop */}
          <Dialog.Overlay
            className={cn(
              'fixed inset-0 z-50',
              'bg-black/50 backdrop-blur-sm',
              'data-[state=open]:animate-in data-[state=open]:fade-in-0',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            )}
          />

          {/* Panel */}
          <Dialog.Content
            ref={ref}
            className={cn(
              'fixed left-1/2 top-1/2 z-50',
              'w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
              'max-h-[85vh] overflow-y-auto',
              
              // Glass surface (from UiSurface)
              'bg-white/12 dark:bg-slate-900/12',
              'border border-white/25 dark:border-white/10',
              'rounded-xl',
              'shadow-[0_24px_64px_rgba(0,0,0,0.2)]',
              'backdrop-blur-[20px] backdrop-saturate-[180%]',
              
              // Animations
              'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
              
              className,
            )}
          >
            {/* Header */}
            {(title || description) && (
              <div className="border-b border-white/10 p-6 pb-4">
                {title && (
                  <Dialog.Title className="text-lg font-semibold text-foreground">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </Dialog.Description>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {children}
            </div>

            {/* Close button */}
            <Dialog.Close
              className={cn(
                'absolute right-4 top-4',
                'inline-flex size-8 items-center justify-center',
                'rounded-lg',
                'text-muted-foreground hover:text-foreground',
                'hover:bg-accent/50',
                'transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              )}
              aria-label="Close"
            >
              <X className="size-4" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);

UiPanel.displayName = 'UiPanel';
