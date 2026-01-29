/*
 * LANGUAGE SWITCHER DASHBOARD - Performance Optimized 2026
 *
 * Enhanced with:
 * - React.memo + useCallback for 60fps smooth hover
 * - Global useReducedMotion hook prevents unnecessary re-renders
 * - Transform-only animations with GPU optimization
 * - Educational-appropriate micro-interactions
 * - Semantic globe rotation on language change
 * - MobileDropdownPopover with 10 enterprise guardrails
 *
 * RESEARCH: docs/research/HEADER_DROPDOWN_DUAL_NAV_RESEARCH_TIER1_2026.md
 */

'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { GlobeIcon } from '@/components/icons/unified/UnifiedIconSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MobileDropdownPopover } from '@/components/ui/MobileDropdownPopover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTooltip } from '@/hooks/useTooltip';
import { logger } from '@/lib/logger';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

import { LanguageSwitcherSkeleton } from './HeaderSkeletons';

type LanguageOptionsProps = {
  locales: typeof AppConfig.locales;
  locale: string;
  onChange: (value: string) => void;
};

const LanguageOptions = ({ locales, locale, onChange }: LanguageOptionsProps) => (
  <div className="flex flex-col gap-1">
    {locales.map(lang => (
      <button
        key={lang.id}
        type="button"
        onClick={() => onChange(lang.id)}
        className={cn(
          'flex flex-col gap-0.5 rounded-lg px-4 py-3 text-left transition-colors',
          'hover:bg-accent/10 focus:bg-accent/10',
          locale === lang.id && 'bg-accent/10',
          'min-h-[44px]',
        )}
      >
        <span className={cn(
          'font-medium text-foreground',
          locale === lang.id && 'font-semibold',
        )}
        >
          {lang.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {lang.id === 'it' ? 'Italian' : 'English'}
        </span>
      </button>
    ))}
  </div>
);

export const LanguageSwitcherDashboard = React.memo<{ className?: string }>(({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Dashboard') as any;
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const isMobile = useMobileDetection();
  const triggerRef = useRef<HTMLButtonElement>(null);

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

    // Capture trigger position for mobile popover
    if (open && isMobile && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      logger.debug('[LanguageSwitcher] triggerRect:', {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
      logger.debug('[LanguageSwitcher] viewport:', {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setTriggerRect(rect);
    }

    setIsOpen(open);
    // Auto-dismiss tooltip when dropdown opens
    if (open) {
      handleTooltipClick();
    }
  }, [handleTooltipClick, isMobile]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

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

    handleClose();
    router.replace(pathname, { locale: value });
  }, [locale, prefersReducedMotion, pathname, router, handleClose]);

  // SSR + First Paint: Render skeleton to prevent hydration mismatch
  // IMPORTANT: Early return AFTER all hooks (Rules of Hooks)
  if (!mounted) {
    return <LanguageSwitcherSkeleton />;
  }

  return (
    <>
      {/* Mobile: Show button with tooltip */}
      {isMobile && (
        <TooltipProvider delayDuration={300}>
          <Tooltip {...tooltipProps}>
            <TooltipTrigger asChild>
              <button
                ref={triggerRef}
                type="button"
                onClick={() => handleOpenChange(!isOpen)}
                aria-label={t('language_switcher_aria_label')}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                data-active={isOpen}
                className={cn(
                  'relative flex size-11 items-center justify-center rounded-xl',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  'header-icon',
                  className,
                )}
                style={{
                  willChange: 'transform',
                  transform: 'translateZ(0)',
                }}
              >
                <div
                  className={cn(
                    'relative',
                    isChangingLanguage && !prefersReducedMotion && 'animate-spin',
                  )}
                >
                  <GlobeIcon
                    size={20}
                    isActive={isOpen}
                    variant="signature"
                    className="text-foreground"
                  />
                  {!prefersReducedMotion && (isChangingLanguage || isOpen) && (
                    <div className="pointer-events-none absolute inset-0 animate-pulse rounded-full border border-green-500/20" />
                  )}
                </div>
              </button>
            </TooltipTrigger>
            {shouldShowTooltip && (
              <TooltipContent
                side="bottom"
                className={cn(
                  'text-xs',
                  'glass-tooltip',
                )}
              >
                <p className="font-medium">{t('change_language')}</p>
                <p className="text-muted-foreground">Alt+L</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )}

      {/* Mobile: Inline Popover */}
      {isMobile ? (
        <MobileDropdownPopover
          isOpen={isOpen}
          onClose={handleClose}
          title={t('change_language')}
          triggerRect={triggerRect}
          triggerRef={triggerRef}
          className="w-64"
        >
          <LanguageOptions locales={AppConfig.locales} locale={locale} onChange={handleChange} />
        </MobileDropdownPopover>
      ) : (
        /* Desktop: Standard Dropdown */
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
          <DropdownMenuTrigger asChild>
            <button
              ref={triggerRef}
              type="button"
              onClick={() => handleOpenChange(!isOpen)}
              aria-label={t('language_switcher_aria_label')}
              aria-haspopup="menu"
              aria-expanded={isOpen}
              data-active={isOpen}
              className={cn(
                'relative flex size-11 items-center justify-center rounded-xl',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'header-icon',
                className,
              )}
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            >
              <div
                className={cn(
                  'relative',
                  isChangingLanguage && !prefersReducedMotion && 'animate-spin',
                )}
              >
                <GlobeIcon
                  size={20}
                  isActive={isOpen}
                  variant="signature"
                  className="text-foreground"
                />
                {!prefersReducedMotion && (isChangingLanguage || isOpen) && (
                  <div className="pointer-events-none absolute inset-0 animate-pulse rounded-full border border-green-500/20" />
                )}
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            variant="premium"
            align="end"
            sideOffset={12}
            collisionPadding={32}
            className={cn(
              'min-w-48 overflow-hidden p-2',
              // iOS 26 Liquid Glass dropdown
              'glass-dropdown',
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
      )}
    </>
  );
});

LanguageSwitcherDashboard.displayName = 'LanguageSwitcherDashboard';
