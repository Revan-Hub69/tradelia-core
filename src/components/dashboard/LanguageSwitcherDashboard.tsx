/*
 * LANGUAGE SWITCHER DASHBOARD - Tradelia Premium 2026
 *
 * Elegant language selector for dashboard
 * - Homemade Globe icon
 * - Dual-language labels (Italiano / Italian)
 * - Preserves current path
 * - Keyboard accessible
 * - 44px touch target
 */

'use client';

import { useLocale, useTranslations } from 'next-intl';
import React from 'react';

import { GlobeIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
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
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

export const LanguageSwitcherDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Dashboard');

  const handleChange = (value: string) => {
    router.push(pathname, { locale: value });
    router.refresh();
  };

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  // Size & shape
                  'size-9 rounded-xl',
                  // Surface - More visible
                  'bg-muted/60 hover:bg-primary/15',
                  'border border-border/30',
                  // Backdrop
                  'backdrop-blur-sm',
                  // Hover effects
                  'hover:scale-105 hover:shadow-sm',
                  // Transitions
                  'motion-base',
                  // Focus
                  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  className,
                )}
                aria-label={t('language_switcher_aria_label')}
              >
                <div
                  className={cn(
                    'motion-base origin-center',
                    // Subtle rotation on hover
                    'transition-transform duration-200 ease-out',
                    'group-hover:rotate-12',
                    // Respect prefers-reduced-motion
                    'motion-reduce:transition-none',
                  )}
                >
                  <GlobeIcon size={16} />
                </div>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            <p>{t('change_language')}</p>
            <p className="text-muted-foreground">Alt+L</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent
        align="end"
        className={cn(
          'min-w-48',
          // Premium surface
          'bg-surface-primary/95 backdrop-blur-xl',
          'border border-border/20',
          // Shadow
          'shadow-xl',
        )}
      >
        <DropdownMenuRadioGroup value={locale} onValueChange={handleChange}>
          {AppConfig.locales.map(lang => (
            <DropdownMenuRadioItem
              key={lang.id}
              value={lang.id}
              className={cn(
                'cursor-pointer',
                'motion-base',
                // Hover state
                'hover:bg-primary/10',
              )}
            >
              <div className="flex flex-col gap-0.5">
                {/* Native name (primary) */}
                <span className="font-medium">{lang.name}</span>
                {/* English name (secondary) */}
                <span className="text-xs text-muted-foreground">
                  {lang.id === 'it' ? 'Italian' : 'Inglese'}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
