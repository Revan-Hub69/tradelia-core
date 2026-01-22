/*
 * LANGUAGE SWITCHER DASHBOARD - Premium Liquid Glass 2026
 *
 * Premium language selector with Apple iOS 26 Liquid Glass effects:
 * - Premium micro-interactions with spring physics
 * - Liquid glass dropdown with enhanced backdrop
 * - Motion preferences compliance
 * - Signature Globe icon with premium effects
 * - Professional accessibility and keyboard navigation
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
  const [isPressed, setIsPressed] = useState(false);

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
    setIsOpen(false);
    router.replace(pathname, { locale: value });
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          aria-label={t('language_switcher_aria_label')}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            // Base styling
            'relative flex size-11 items-center justify-center rounded-xl',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'transition-all duration-300 ease-out',
            // Premium liquid glass surface
            'bg-background/60 hover:bg-background/80',
            'border border-border/20 hover:border-border/40',
            // Signature effects
            'signature-icon signature-icon--premium',
            className,
          )}
          style={{
            // Premium liquid glass effects
            backdropFilter: prefersReducedMotion
              ? 'blur(4px)'
              : 'blur(12px) saturate(180%)',
            // Premium spring physics
            transform: (isPressed || isOpen) && !prefersReducedMotion
              ? 'scale(0.95) translateZ(0)'
              : 'scale(1) translateZ(0)',
            // Enhanced shadow with depth
            boxShadow: (isPressed || isOpen)
              ? '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.1)'
              : '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
            // Hardware acceleration
            willChange: 'transform, backdrop-filter, box-shadow',
            // Premium transition timing
            transition: prefersReducedMotion
              ? 'all 150ms ease-out'
              : 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          data-gpu="true"
        >
          {/* Premium icon with signature effects */}
          <div className="relative">
            <GlobeIcon
              size={20}
              isActive={isOpen}
              variant="premium"
              className="text-foreground"
            />

            {/* Premium glow effect */}
            {!prefersReducedMotion && (
              <div
                className="absolute inset-0 rounded-full opacity-20 blur-sm"
                style={{
                  background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
                  animation: isOpen ? 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none',
                }}
              />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'min-w-48',
          // Premium liquid glass surface
          'border border-border/20',
          'shadow-2xl',
          'rounded-2xl',
          'p-2',
        )}
        style={{
          // Premium liquid glass backdrop
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: prefersReducedMotion
            ? 'blur(8px)'
            : 'blur(20px) saturate(180%)',
          // Enhanced shadow with depth
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
        }}
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {AppConfig.locales.map(lang => (
            <DropdownMenuRadioItem
              key={lang.id}
              value={lang.id}
              className={cn(
                'cursor-pointer rounded-xl px-3 py-2.5',
                'transition-all duration-200 ease-out',
                // Premium hover state
                'hover:bg-primary/10 hover:scale-[1.02]',
                'focus:bg-primary/10 focus:scale-[1.02]',
                // Active state
                locale === lang.id && 'bg-primary/5',
              )}
              style={{
                // Premium micro-interaction
                transform: 'translateZ(0)',
                willChange: 'transform, background-color',
              }}
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
