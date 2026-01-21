/*
 * LANGUAGE SWITCHER DASHBOARD - Tradelia Signature Premium 2026
 *
 * Elegant language selector for dashboard
 * - Signature Globe icon with continuous rotation
 * - Equator pulse + continent dots (full motion)
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
  const [isOpen, setIsOpen] = React.useState(false);

  const handleChange = (value: string) => {
    router.push(pathname, { locale: value });
    router.refresh();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  // Size & shape - LARGER for better visibility
                  'size-11 rounded-xl',
                  // Surface - MUCH more visible with stronger background
                  'bg-primary/10 hover:bg-primary/20',
                  'border-2 border-primary/20 hover:border-primary/30',
                  // Backdrop
                  'backdrop-blur-md',
                  // Hover effects - MORE dramatic
                  'hover:scale-110 hover:shadow-lg hover:shadow-primary/20',
                  // Open state
                  isOpen && 'scale-95 bg-primary/25',
                  // Transitions
                  'motion-base',
                  // Focus - STRONGER ring
                  'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                  className,
                )}
                aria-label={t('language_switcher_aria_label')}
              >
                {/* Signature Globe icon with continuous rotation - LARGER 20px */}
                <GlobeIcon
                  size={20}
                  isActive={isOpen}
                />
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
