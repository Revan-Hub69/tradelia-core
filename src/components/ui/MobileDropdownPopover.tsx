/*
 * MOBILE DROPDOWN POPOVER - Enterprise-Grade Implementation
 *
 * CONTEXT-AWARE SOLUTION:
 * - For SMALL menus (2-3 items): Compact dropdown near trigger
 * - For LARGE menus (5+ items): Use MobileFullscreenMenu instead
 *
 * ENTERPRISE GUARDRAILS (10 Rules):
 * 1. Scroll & Layout Shift: Auto-dismiss when trigger exits viewport
 * 2. Focus Management: WCAG 2.2 AA with preventScroll
 * 3. Collision Handling: Placement priority cascade + viewport clamping
 * 4. Cognitive Load: Max 3 items OR 260px (measurable threshold)
 * 5. Empty/Error States: Inline only, never fullscreen
 * 6. Gesture Conflicts: Swipe only on popover, no global capture
 * 7. State Persistence: Reflects persisted state, no optimistic UI
 * 8. Layout Thrash: Measure once per open, no continuous measurement
 * 9. Pointer Capability: 44px touch, 36px mouse, hover on fine pointer
 * 10. Pattern Governance: Content-driven, non-negotiable
 *
 * RESEARCH:
 * - docs/research/HEADER_DROPDOWN_DUAL_NAV_RESEARCH_TIER1_2026.md
 * - iOS 14+ Menu system (Apple HIG)
 * - Gmail mobile pattern (gold standard)
 * - WCAG 2.2 AA compliance
 *
 * SOURCES:
 * - Fitts's Law (Paul Fitts, 1954)
 * - JustinMind: Complete guide dropdown menu design (2026)
 * - Eleken: Dropdown Menu UI Best Practices (2026)
 */

'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { CloseIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { cn } from '@/utils/Helpers';

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type Placement = 'bottom-end' | 'top-end' | 'bottom-start' | 'top-start';

type Position = {
  top: number;
  right?: number; // Use right for natural alignment
  left?: number; // Use left for fallback
};

// Cognitive load threshold (Rule 4) - Updated based on tier-1 research 2026
const MAX_PREVIEW_HEIGHT_MOBILE = 400; // px - allows 5-7 notification items
const MAX_PREVIEW_HEIGHT_DESKTOP = 480; // px - more vertical space on desktop

// Viewport clamping (Rule 3)
const EDGE_PADDING = 16; // px from viewport edges (increased from 8px)
const TRIGGER_GAP = 8; // px gap between trigger and popover
const HEADER_HEIGHT = 64; // px - header height to avoid overlap
const BOTTOM_NAV_HEIGHT = 80; // px - bottom navbar height (64px + 16px inset)
const SAFE_AREA_TOP = 20; // px - iOS status bar / notch
const SAFE_AREA_BOTTOM = 34; // px - iOS home indicator

// Placement priority cascade (Rule 3)
const PLACEMENT_PRIORITY: Placement[] = [
  'bottom-end', // Default: below trigger, right-aligned
  'top-end', // Fallback 1: above trigger, right-aligned
  'bottom-start', // Fallback 2: below trigger, left-aligned
  'top-start', // Fallback 3: above trigger, left-aligned
];

// Performance monitoring (Rule 8)
let _measureCount = 0;

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export type MobileDropdownPopoverProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode; // Fixed footer (always visible)
  className?: string;
  triggerRect?: DOMRect | null; // Position of trigger button
  triggerRef?: React.RefObject<HTMLElement>; // Ref to trigger (for focus return)
};

// ============================================================================
// UTILITY FUNCTIONS (Enterprise Guardrails)
// ============================================================================

// Rule 1: Check if trigger is in viewport
function isTriggerInViewport(rect: DOMRect | null): boolean {
  if (!rect) {
    return false;
  }
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= window.innerHeight
    && rect.right <= window.innerWidth
  );
}

// Rule 3: Calculate placement with collision handling (viewport-aware)
function calculatePlacement(
  triggerRect: DOMRect,
  popoverWidth: number,
  popoverHeight: number,
): { placement: Placement; position: Position } {
  // Calculate safe viewport bounds (avoid header and bottom navbar)
  const safeViewport = {
    top: HEADER_HEIGHT + SAFE_AREA_TOP,
    bottom: window.innerHeight - BOTTOM_NAV_HEIGHT - SAFE_AREA_BOTTOM,
    left: EDGE_PADDING,
    right: window.innerWidth - EDGE_PADDING,
  };

  for (const placement of PLACEMENT_PRIORITY) {
    const position = getPositionForPlacement(placement, triggerRect, popoverWidth, popoverHeight);

    if (fitsInSafeViewport(position, popoverWidth, popoverHeight, safeViewport)) {
      return { placement, position };
    }
  }

  // Last resort: clamp to safe viewport
  const fallbackPosition = getPositionForPlacement('bottom-end', triggerRect, popoverWidth, popoverHeight);
  return {
    placement: 'bottom-end',
    position: clampToSafeViewport(fallbackPosition, popoverWidth, popoverHeight, safeViewport),
  };
}

function getPositionForPlacement(
  placement: Placement,
  triggerRect: DOMRect,
  _popoverWidth: number, // Prefixed with _ to indicate intentionally unused
  popoverHeight: number,
): Position {
  // Calculate distance from right edge for natural alignment
  const rightEdgeDistance = window.innerWidth - triggerRect.right;

  const positions: Record<Placement, Position> = {
    'bottom-end': {
      top: triggerRect.bottom + TRIGGER_GAP,
      right: rightEdgeDistance, // Align to right edge of trigger
    },
    'top-end': {
      top: triggerRect.top - popoverHeight - TRIGGER_GAP,
      right: rightEdgeDistance, // Align to right edge of trigger
    },
    'bottom-start': {
      top: triggerRect.bottom + TRIGGER_GAP,
      left: triggerRect.left, // Align to left edge of trigger
    },
    'top-start': {
      top: triggerRect.top - popoverHeight - TRIGGER_GAP,
      left: triggerRect.left, // Align to left edge of trigger
    },
  };

  return positions[placement];
}

function fitsInSafeViewport(
  position: Position,
  width: number,
  height: number,
  safeViewport: { top: number; bottom: number; left: number; right: number },
): boolean {
  const left = position.left ?? (window.innerWidth - (position.right ?? 0) - width);
  const right = left + width;

  return (
    position.top >= safeViewport.top
    && left >= safeViewport.left
    && position.top + height <= safeViewport.bottom
    && right <= safeViewport.right
  );
}

function clampToSafeViewport(
  position: Position,
  width: number,
  height: number,
  safeViewport: { top: number; bottom: number; left: number; right: number },
): Position {
  if (position.right !== undefined) {
    // Using right positioning
    return {
      top: Math.max(
        safeViewport.top,
        Math.min(position.top, safeViewport.bottom - height),
      ),
      right: Math.max(
        EDGE_PADDING,
        Math.min(position.right, window.innerWidth - width - EDGE_PADDING),
      ),
    };
  }

  // Using left positioning
  return {
    top: Math.max(
      safeViewport.top,
      Math.min(position.top, safeViewport.bottom - height),
    ),
    left: Math.max(
      safeViewport.left,
      Math.min(position.left ?? 0, safeViewport.right - width),
    ),
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const MobileDropdownPopover = React.memo<MobileDropdownPopoverProps>(({
  isOpen,
  onClose,
  children,
  title,
  footer,
  className,
  triggerRect,
  triggerRef,
}) => {
  const t = useTranslations('Common');
  
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
  const [placement, setPlacement] = useState<Placement>('bottom-end');
  const isTouchOnPopoverRef = useRef(false);
  const touchStartYRef = useRef(0);
  
  // Responsive max height based on viewport (tier-1 research 2026)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const MAX_PREVIEW_HEIGHT = isMobile ? MAX_PREVIEW_HEIGHT_MOBILE : MAX_PREVIEW_HEIGHT_DESKTOP;

  // Rule 8: Measure once per open (layout thrash prevention)
  useEffect(() => {
    if (!isOpen || !triggerRect) {
      return;
    }

    // Wait for next frame to ensure popoverRef is mounted
    requestAnimationFrame(() => {
      if (!popoverRef.current) {
        return;
      }

      _measureCount += 1;

      // CRITICAL FIX: Better fallback if triggerRect is invalid
      if (triggerRect.width === 0 || triggerRect.height === 0) {
        // Smart fallback: position below header, right-aligned
        const fallbackPosition: Position = {
          top: HEADER_HEIGHT + SAFE_AREA_TOP + TRIGGER_GAP,
          right: EDGE_PADDING,
        };

        setPosition(fallbackPosition);
        setPlacement('bottom-end');
        return;
      }

      const popoverElement = popoverRef.current;
      const popoverWidth = Math.max(200, Math.min(popoverElement.offsetWidth, window.innerWidth - 32));
      const popoverHeight = Math.min(popoverElement.offsetHeight, MAX_PREVIEW_HEIGHT);

      // Performance P0: Removed console.log for production
      // Debug info available via React DevTools if needed

      const { placement: calculatedPlacement, position: calculatedPosition } = calculatePlacement(
        triggerRect,
        popoverWidth,
        popoverHeight,
      );

      // Performance P0: Removed console.log for production

      setPlacement(calculatedPlacement);
      setPosition(calculatedPosition);
    });
  }, [isOpen, triggerRect]);

  // Rule 1: Scroll & Layout Shift - Auto-dismiss
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleScroll = () => {
      if (!isTriggerInViewport(triggerRect ?? null)) {
        onClose();
      }
    };

    const handleOrientationChange = () => {
      onClose(); // Layout shift = dismiss
    };

    const handleResize = () => {
      onClose(); // Significant layout shift = dismiss
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, triggerRect, onClose]);

  // Rule 2: Focus Management - Return focus to trigger on close
  const handleClose = useCallback(() => {
    onClose();

    // WCAG 2.2 AA: Return focus to trigger with preventScroll
    requestAnimationFrame(() => {
      if (triggerRef?.current) {
        triggerRef.current.focus({ preventScroll: true });
      }
    });
  }, [onClose, triggerRef]);

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

  // Rule 6: Gesture Conflict Prevention - Swipe only on popover
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;

      // Only capture if touch starts on popover
      if (!popoverRef.current?.contains(target)) {
        return; // Ignore - let other handlers process
      }

      if (e.touches[0]) {
        touchStartYRef.current = e.touches[0].clientY;
        isTouchOnPopoverRef.current = true;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isTouchOnPopoverRef.current || !e.touches[0]) {
        return;
      } // Not our gesture

      const deltaY = e.touches[0].clientY - touchStartYRef.current;

      // Swipe down to dismiss (only if started on popover)
      if (deltaY > 50) {
        handleClose();
      }
    };

    const handleTouchEnd = () => {
      isTouchOnPopoverRef.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isOpen, handleClose]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={open => !open && handleClose()}>
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
          onClick={handleClose}
        />

        {/* Popover Content - NEAR TRIGGER (Rule 3: Collision handling) */}
        <Dialog.Content
          ref={popoverRef}
          className={cn(
            // Fixed positioning NEAR trigger
            'fixed z-[151]',
            // Rounded corners
            'rounded-2xl',
            // Liquid Glass
            'popover-premium-container',
            // Animations - slide based on placement
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            placement.startsWith('bottom')
              ? 'data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2'
              : 'data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2',
            'duration-200',
            // Shadow
            'shadow-2xl',
            className,
          )}
          style={{
            top: `${position.top}px`,
            ...(position.right !== undefined
              ? { right: `${position.right}px` }
              : { left: `${position.left}px` }),
            minWidth: '200px',
            maxWidth: 'calc(90vw - 32px)',
            maxHeight: `${MAX_PREVIEW_HEIGHT}px`,
            width: 'auto', // Auto width based on content
          }}
          onOpenAutoFocus={(e) => {
            // Prevent auto-focus on open (keep focus on trigger)
            e.preventDefault();
          }}
          onCloseAutoFocus={(e) => {
            // Prevent default to handle focus restoration manually (Rule 2)
            e.preventDefault();
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
              // Rule 9: Pointer capability
              'min-h-[44px] min-w-[44px]', // Touch target (coarse pointer)
              'touch-action-manipulation',
              '-webkit-tap-highlight-color-transparent',
            )}
            aria-label={t('close')}
            onClick={handleClose}
          >
            <CloseIcon size={16} variant="premium" />
          </Dialog.Close>

          {/* Title */}
          {title && (
            <Dialog.Title className="popover-premium-header">
              {title}
            </Dialog.Title>
          )}

          {/* Content - SCROLLABLE */}
          <div className="popover-premium-content">
            {children}
          </div>

          {/* Footer - FIXED (Always Visible) */}
          {footer && (
            <div className="popover-premium-footer">
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});

MobileDropdownPopover.displayName = 'MobileDropdownPopover';
