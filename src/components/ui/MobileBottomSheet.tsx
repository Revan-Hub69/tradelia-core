/*
 * MOBILE BOTTOM SHEET - iOS 26 Pattern
 *
 * Based on Tier-1 Research:
 * - Nielsen Norman Group: Bottom Sheets Guidelines
 * - Apple HIG: Modal Presentations
 * - Mozilla MDN: CSS env() Function
 *
 * Features:
 * - Bottom sheet pattern for mobile (< 768px)
 * - iOS safe area insets support
 * - Visible close button (44px minimum)
 * - Backdrop overlay with click-to-close
 * - ESC key support
 * - Body scroll prevention
 * - Spring physics animations
 * - Accessibility compliant
 *
 * RESEARCH DOCUMENT:
 * docs/research/LOADING_EMPTY_STATES_MOBILE_TIER1_2026.md
 */

'use client';

import React, { useCallback, useEffect, useRef } from 'react';

import { CloseIcon } from '@/components/icons/unified/UnifiedIconSystem';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/utils/Helpers';

export type MobileBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showHandle?: boolean;
  className?: string;
};

export const MobileBottomSheet = React.memo<MobileBottomSheetProps>(({
  isOpen,
  onClose,
  children,
  title,
  showHandle = true,
  className,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // ESC key support
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Body scroll prevention
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Add class to body
    document.body.classList.add('bottom-sheet-open');

    // Cleanup
    return () => {
      document.body.classList.remove('bottom-sheet-open');
    };
  }, [isOpen]);

  // Focus trap - focus first focusable element
  useEffect(() => {
    if (!isOpen || !sheetRef.current) {
      return;
    }

    const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length > 0) {
      // Focus first element after animation
      setTimeout(() => {
        focusableElements[0]?.focus();
      }, prefersReducedMotion ? 0 : 300);
    }
  }, [isOpen, prefersReducedMotion]);

  // Backdrop click handler
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  // Don't render if not open (performance)
  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'dropdown-backdrop',
          isOpen && 'open',
        )}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Bottom sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Bottom sheet'}
        className={cn(
          'dropdown-mobile',
          isOpen && 'open',
          className,
        )}
      >
        {/* Grab handle (optional visual indicator) */}
        {showHandle && (
          <div className="bottom-sheet-handle" aria-hidden="true" />
        )}

        {/* Close button - visible and accessible */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="bottom-sheet-close"
        >
          <CloseIcon size={20} variant="signature" />
        </button>

        {/* Title (optional) */}
        {title && (
          <div className="px-6 pb-4 pt-8">
            <h2 className="text-lg font-semibold text-foreground">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className={cn(
          'px-6',
          title ? 'pb-6' : 'py-8',
        )}
        >
          {children}
        </div>
      </div>
    </>
  );
});

MobileBottomSheet.displayName = 'MobileBottomSheet';
