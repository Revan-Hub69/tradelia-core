/*
 * LANGUAGE SWITCHER DASHBOARD - Tradelia 2026 Optimized
 *
 * Clean language selector following 2026 UX best practices:
 * - Removed long-press functionality (accessibility issues)
 * - Simple dropdown menu
 * - Signature Globe icon
 * - Preserves current path
 * - Keyboard accessible
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
import { UiIconButton } from '@/components/ui/UiIconButton';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import { AppConfig } from '@/utils/AppConfig';
import { cn } from '@/utils/Helpers';

export const LanguageSwitcherDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (value: string) => {
    if (value === locale) {
      return;
    }
    setIsOpen(false);
    router.replace(pathname, { locale: value });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <UiIconButton
          label={t('language_switcher_aria_label')}
          icon={<GlobeIcon size={20} isActive={isOpen} variant="signature" />}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className={cn(
            isOpen && 'scale-[0.98]',
            className,
          )}
        />
      </DropdownMenuTrigger>

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
