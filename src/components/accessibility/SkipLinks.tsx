/*
 * SKIP LINKS - Enterprise Accessibility 2026
 * 
 * Skip navigation per keyboard users
 * Standard WCAG AAA compliance
 */

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/utils/Helpers';

export const SkipLinks: React.FC = () => {
  const t = useTranslations();

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className={cn(
          // Visually hidden by default
          'sr-only focus:not-sr-only',
          // Styling when focused
          'focus:absolute focus:top-4 focus:left-4 focus:z-[9999]',
          'focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground',
          'focus:rounded-md focus:font-medium focus:text-sm',
          'focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring',
          // Motion
          'motion-fast',
        )}
      >
        {t('Dashboard.skip_to_content' as any)}
      </a>
      <a
        href="#navigation"
        className={cn(
          'sr-only focus:not-sr-only',
          'focus:absolute focus:top-4 focus:left-32 focus:z-[9999]',
          'focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground',
          'focus:rounded-md focus:font-medium focus:text-sm',
          'focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring',
          'motion-fast',
        )}
      >
        {t('Dashboard.skip_to_navigation' as any)}
      </a>
    </div>
  );
};