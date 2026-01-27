/**
 * SKIP LINKS - Accessibility Navigation
 * Best Practice 2026: WCAG 2.1 bypass blocks
 */

'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { cn } from '@/utils/Helpers';

type SkipLinksProps = {
  className?: string;
};

export function SkipLinks({ className }: SkipLinksProps) {
  const t = useTranslations('Challenges.a11y');

  const skipTo = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-[9999] flex flex-col gap-2 p-4',
        className,
      )}
    >
      {/* Skip to Content */}
      <a
        href="#challenge-list"
        onClick={(e) => {
          e.preventDefault();
          skipTo('challenge-list');
        }}
        className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all focus:not-sr-only focus:absolute"
      >
        {t('skipToContent')}
      </a>

      {/* Skip to Filters */}
      <a
        href="#challenge-filters"
        onClick={(e) => {
          e.preventDefault();
          skipTo('challenge-filters');
        }}
        className="sr-only rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-lg transition-all focus:not-sr-only focus:absolute"
      >
        {t('skipToFilters')}
      </a>
    </div>
  );
}
