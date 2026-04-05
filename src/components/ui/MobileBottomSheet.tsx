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

export const MobileBottomSheet = React.memo<MobileBottomSheetProps>((
  { isOpen, onClose, children, title, showHandle = true, className }
) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // ESC key
  useEffect(() => {
    if (!isOpen) return;
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  // Body scroll lock senza position:fixed (evita layout shift su iOS)
  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.classList.add('bottom-sheet-open');
    return () => {
      document.body.classList.remove('bottom-sheet-open');
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Focus trap + scrollIntoView
  // Porta in vista il primo elemento interattivo: fix autoscroll quando
  // il dropdown / input e in fondo al contenuto del sheet
  useEffect(() => {
    if (!isOpen || !sheetRef.current) return;
    const delay = prefersReducedMotion ? 0 : 330;
    const timer = setTimeout(() => {
      if (!sheetRef.current) return;
      const els = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = els[0];
      if (first) {
        first.focus({ preventScroll: false });
        first.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion ? 'instant' : 'smooth' });
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [isOpen, prefersReducedMotion]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={cn('dropdown-backdrop', isOpen && 'open')}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Bottom sheet'}
        className={cn('dropdown-mobile', isOpen && 'open', className)}
        style={{
          // Fallback bg inline: garantisce colore anche se il CSS globale
          // non e ancora caricato o le CSS vars del tema non sono risolte
          backgroundColor: 'var(--sheet-bg, #ffffff)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Chiudi"
          className="bottom-sheet-close"
        >
          <CloseIcon size={18} variant="signature" />
        </button>

        {title && (
          <div className="px-5 pb-3 pt-10">
            <h2
              className="text-base font-semibold"
              style={{ color: 'var(--sheet-text, #18181b)' }}
            >
              {title}
            </h2>
          </div>
        )}

        <div className={cn('px-5', title ? 'pb-6' : 'py-8 pt-12')}>
          {children}
        </div>
      </div>

      {/* CSS vars dark mode inline - fallback se il foglio globale non copre */}
      <style>{`
        :root { --sheet-bg: #ffffff; --sheet-text: #18181b; }
        .dark { --sheet-bg: #18181b; --sheet-text: #f4f4f5; }
      `}</style>
    </>
  );
});

MobileBottomSheet.displayName = 'MobileBottomSheet';
