/*
 * LANGUAGE SWITCHER DASHBOARD - Performance Optimized 2026
 *
 * Enhanced with:
 * - React.memo + useCallback for 60fps smooth hover
 * - Global useReducedMotion hook prevents unnecessary re-renders
 * - Transform-only animations with GPU optimization
 * - Educational-appropriate micro-interactions
 * - Semantic globe rotation on language change
 * - Mobile bottom sheet pattern (< 768px)
 */

'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';

import { GlobeIcon } from '@/components/icons/unified/UnifiedIconSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTooltip } from '@/hooks/useTooltip';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

import { LanguageSwitcherSkeleton } from './HeaderSkeletons';

export const LanguageSwitcherDashboard = React.memo<{ className?: string }>(({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMobileDetection();

  // Global motion preferences - optimized
  const prefersReducedMotion = useReducedMotion();

  // Tooltip best practices 2026
  const { shouldShowTooltip, tooltipProps, handleClick: handleTooltipClick } = useTooltip();

  // Wait for client-side mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized callbacks - MUST be called before early return (Rules of Hooks)
  const handleOpenChange = useCallback((open: boolean) => {
    // Haptic feedback on open
    if (open && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    setIsOpen(open);
    // Auto-dismiss tooltip when dropdown opens
    if (open) {
      handleTooltipClick();
    }
  }, [handleTooltipClick]);

  const handleChange = useCallback((value: string) => {
    if (value === locale) {
      return;
    }

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    if (!prefersReducedMotion) {
      setIsChangingLanguage(true);
      // Reset animation state after completion
      setTimeout(() => setIsChangingLanguage(false), 800);
    }

    setIsOpen(false);
    router.replace(pathname, { locale: value });
  }, [locale, prefersReducedMotion, pathname, router]);

  // SSR + First Paint: Render skeleton to prevent hydration mismatch
  // IMPORTANT: Early return AFTER all hooks (Rules of Hooks)
  if (!mounted) {
    return <LanguageSwitcherSkeleton />;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip {...tooltipProps}>
        <TooltipTrigger asChild>
          <div>
            <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
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
                    // ONLY design tokens - NO Tailwind transitions
                    'header-icon glass-button',
                    className,
                  )}
                  style={{
                    // Hardware acceleration - GPU optimization
                    willChange: 'transform',
                    transform: 'translateZ(0)', // Force GPU layer
                  }}
                >
                  {/* Icon container - NO transitions */}
                  <div
                    className={cn(
                      'relative',
                      // Globe rotation animation on language change - Educational version
                      isChangingLanguage && !prefersReducedMotion && 'animate-spin',
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
                      <div className="pointer-events-none absolute inset-0 animate-pulse rounded-full border border-green-500/20" />
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                disablePortal={isMobile}
                className={cn(
                  'min-w-48 overflow-hidden p-2',
                  // iOS 26 Liquid Glass dropdown
                  'glass-dropdown',
                  // Mobile: Bottom sheet style
                  isMobile && 'dropdown-mobile',
                  isMobile && isOpen && 'open',
                )}
              >
                <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
                  {AppConfig.locales.map(lang => (
                    <DropdownMenuRadioItem
                      key={lang.id}
                      value={lang.id}
                      className={cn(
                        'dropdown-item',
                        // Selected state handled by dropdown-item CSS
                        locale === lang.id && 'font-semibold',
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
          </div>
        </TooltipTrigger>
        {shouldShowTooltip && (
          <TooltipContent
            side="bottom"
            className={cn(
              'text-xs',
              // Liquid Glass tooltip
              'glass-dropdown',
            )}
          >
            <p className="font-medium">{t('change_language')}</p>
            <p className="text-muted-foreground">Alt+L</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
});

LanguageSwitcherDashboard.displayName = 'LanguageSwitcherDashboard';
