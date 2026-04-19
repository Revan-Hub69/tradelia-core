'use client';

import type { PanInfo } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/utils/Helpers';

import { useFocusTrap } from '../hooks/useFocusTrap';
import { useVisualViewportHeight } from '../hooks/useVisualViewportHeight';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function BottomSheetContent({ isOpen, onClose, children }: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, isOpen);
  const vvHeight = useVisualViewportHeight(isOpen);
  const sheetHeight = vvHeight != null ? `${Math.round(vvHeight * 0.92)}px` : '92dvh';

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDrag = (_: unknown, info: PanInfo) => {
    setDragY(info.offset.y);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
    setDragY(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md"
          />

          {/* Sheet */}
          <motion.div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            initial={{ y: '100%' }}
            animate={{ y: dragY > 0 ? dragY : 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-[101]',
              'rounded-t-3xl',
              'bg-card border-t border-border',
              'shadow-2xl shadow-black/50',
              'pb-[env(safe-area-inset-bottom)]',
              'flex flex-col overflow-hidden',
            )}
            style={{ height: sheetHeight }}
          >
            {/* Handle */}
            <div className="flex shrink-0 justify-center pb-1 pt-3">
              <div className="h-1.5 w-12 rounded-full bg-muted" />
            </div>

            {/* Content */}
            <div className="flex min-h-0 flex-1 flex-col">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function BottomSheet(props: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return createPortal(<BottomSheetContent {...props} />, document.body);
}
