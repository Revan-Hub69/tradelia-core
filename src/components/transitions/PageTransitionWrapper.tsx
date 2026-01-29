/*
 * PAGE TRANSITION WRAPPER - Simplified 2026
 *
 * Simple enter animations without interfering with Next.js routing
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
        // Slower, more deliberate enter animation to balance with faster loading
        element.style.opacity = '0';
        element.style.transform = 'translateY(24px)';
        element.style.transition = 'none';

        // Force reflow - accessing offsetHeight triggers layout
        // eslint-disable-next-line ts/no-unused-expressions
        element.offsetHeight;

        // Animate in with slower, more premium timing
        requestAnimationFrame(() => {
          element.style.transition = 'opacity 600ms cubic-bezier(0.4, 0.0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0.0, 0.2, 1)';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        });

        // Cleanup after animation
        const cleanup = setTimeout(() => {
          element.style.transition = '';
          element.style.transform = '';
          element.style.opacity = '';
        }, 600);

        previousPathnameRef.current = pathname;

        return () => clearTimeout(cleanup);
      }
    }
    return undefined;
  }, [pathname]);

  return (
    <div
      ref={contentRef}
      className={cn('transition-wrapper', className)}
      data-pathname={pathname}
    >
      {children}
    </div>
  );
};
