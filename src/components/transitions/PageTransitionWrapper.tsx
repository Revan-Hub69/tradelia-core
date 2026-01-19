/*
 * PAGE TRANSITION WRAPPER - Enterprise 2026
 * 
 * Wrapper per gestire enter animations e layout stability
 * Previene CLS e garantisce smooth transitions
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from '@/libs/i18nNavigation';
import { cn } from '@/utils/Helpers';

type PageTransitionWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
  children,
  className,
}) => {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    // Only animate if pathname actually changed
    if (previousPathnameRef.current !== pathname) {
      const element = contentRef.current;
      if (element) {
        // Enter animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(12px) scale(0.98)';
        element.style.transition = 'none';

        // Force reflow
        element.offsetHeight;

        // Animate in with spring physics
        requestAnimationFrame(() => {
          element.style.transition = 'opacity 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275), transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0) scale(1)';
        });

        // Cleanup after animation
        const cleanup = setTimeout(() => {
          element.style.transition = '';
          element.style.transform = '';
          element.style.opacity = '';
        }, 300);

        previousPathnameRef.current = pathname;

        return () => clearTimeout(cleanup);
      }
    }
    return undefined;
  }, [pathname]);

  return (
    <div
      ref={contentRef}
      className={cn(
        'transition-wrapper',
        'min-h-0', // Prevent flex issues
        className,
      )}
      data-pathname={pathname}
    >
      {children}
    </div>
  );
};