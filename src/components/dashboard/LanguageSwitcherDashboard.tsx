/*
 * LANGUAGE SWITCHER DASHBOARD - Premium Liquid Glass 2026 + Phase 2 Spring Physics
 *
 * Enhanced with:
 * - Apple iOS 26 spring physics animations
 * - Semantic globe rotation on language change
 * - Dynamic glass effects with environmental response
 * - Premium micro-interactions
 * - 120fps optimization
 */

'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { GlobeIcon } from '@/components/icons/unified/UnifiedIconSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

export const LanguageSwitcherDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Premium motion preferences detection
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleChange = (value: string) => {
    if (value === locale) {
      return;
    }

    if (!prefersReducedMotion) {
      setIsChangingLanguage(true);
      // Reset animation state after completion
      setTimeout(() => setIsChangingLanguage(false), 800);
    }

    setIsOpen(false);
    router.replace(pathname, { locale: value });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('language_switcher_aria_label')}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            // Base styling
            'relative flex size-11 items-center justify-center rounded-xl',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            // Educational calm animations instead of premium spring physics
            'educational-hover educational-focus educational-feedback educational-gpu-optimized',
            // Premium liquid glass surface
            'bg-background/60 hover:bg-background/80',
            'border border-border/20 hover:border-border/40',
            // Signature effects + Visual hierarchy
            'signature-icon signature-icon--premium header-icon header-icon-secondary',
            className,
          )}
          style={{
            // Hardware acceleration
            willChange: 'transform, backdrop-filter, box-shadow',
            // Educational transition timing instead of premium spring
            transition: prefersReducedMotion
              ? 'all 150ms ease-out'
              : 'all var(--educational-gentle) var(--educational-gentle)',
          }}
          data-gpu="true"
        >
          {/* Premium icon with signature effects + globe rotation */}
          <div
            className={cn(
              'relative',
              // Globe rotation animation on language change - Educational version
              isChangingLanguage && !prefersReducedMotion && 'globe-rotation-educational',
            )}
          >
            <GlobeIcon
              size={20}
              isActive={isOpen}
              variant="signature"
              className="text-foreground"
            />

            {/* Educational feedback - discrete border instead of glow */}
            {!prefersReducedMotion && (isChangingLanguage || isOpen) && (
              <div className="absolute inset-0 rounded-full border border-success/20 pointer-events-none" />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'min-w-48',
          // Educational dropdown entrance animation
          'border border-border/20 shadow-2xl rounded-2xl p-2',
          'dropdown-entrance-educational educational-gpu-optimized',
        )}
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {AppConfig.locales.map(lang => (
            <DropdownMenuRadioItem
              key={lang.id}
              value={lang.id}
              className={cn(
                'cursor-pointer rounded-xl px-3 py-2.5',
                // Educational calm animations instead of premium spring physics
                'educational-hover educational-gpu-optimized',
                'hover:bg-primary/10 focus:bg-primary/10',
                // Active state
                locale === lang.id && 'bg-primary/5',
              )}
            >
              <div className="flex flex-col gap-0.5">
                {/* Native name (primary) */}
                <span className="font-medium text-foreground">{lang.name}</span>
                {/* English name (secondary) */}
                <span className="text-xs text-muted-foreground">
                  {lang.id === 'it' ? 'Italian' : 'English'}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
