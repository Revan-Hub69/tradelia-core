/*
 * LANGUAGE SWITCHER DASHBOARD - Performance Optimized 2026
 *
 * Enhanced with:
 * - React.memo + useCallback for 60fps smooth hover
 * - Global useReducedMotion hook prevents unnecessary re-renders
 * - Transform-only animations with GPU optimization
 * - Educational-appropriate micro-interactions
 * - Semantic globe rotation on language change
 */

'use client';

import { useLocale, useTranslations } from 'next-intl';
import React, { useCallback, useState } from 'react';

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
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

export const LanguageSwitcherDashboard = React.memo<{ className?: string }>(({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  // Global motion preferences - optimized
  const prefersReducedMotion = useReducedMotion();

  // Memoized callbacks - prevent unnecessary re-renders
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const handleChange = useCallback((value: string) => {
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
  }, [locale, prefersReducedMotion, pathname, router]);

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
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
                    // Optimized animation system with explicit transitions
                    'header-icon glass-button transition-all duration-300 ease-out',
                    className,
                  )}
                  style={{
                    // Hardware acceleration - GPU optimization
                    willChange: 'transform',
                    transform: 'translateZ(0)', // Force GPU layer
                  }}
                >
                  {/* Optimized globe icon with semantic rotation */}
                  <div
                    className={cn(
                      'relative transition-transform duration-200 ease-out',
                      // Globe rotation animation on language change - Educational version
                      isChangingLanguage && !prefersReducedMotion && 'animate-spin',
                    )}
                  >
                    <GlobeIcon
                      size={20}
                      isActive={isOpen}
                      variant="signature"
                      className="text-foreground transition-colors duration-200"
                    />

                    {/* Educational feedback - discrete border instead of glow */}
                    {!prefersReducedMotion && (isChangingLanguage || isOpen) && (
                      <div className="absolute inset-0 rounded-full border border-green-500/20 pointer-events-none animate-pulse" />
                    )}
                  </div>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className={cn(
                  'min-w-48 overflow-hidden rounded-2xl border border-border/20 p-2',
                  // Liquid Glass dropdown
                  'glass-dropdown',
                  // Performance optimized entrance
                  'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200',
                )}
              >
                <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
                  {AppConfig.locales.map(lang => (
                    <DropdownMenuRadioItem
                      key={lang.id}
                      value={lang.id}
                      className={cn(
                        'cursor-pointer rounded-xl px-3 py-2.5',
                        // Performance optimized hover
                        'transition-colors duration-200 ease-out',
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
          </div>
        </TooltipTrigger>
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
      </Tooltip>
    </TooltipProvider>
  );
});
