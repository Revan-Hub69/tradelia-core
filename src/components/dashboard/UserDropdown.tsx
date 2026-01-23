/*
 * USER DROPDOWN - Premium Liquid Glass 2026 + Phase 2 Spring Physics
 *
 * Enhanced with:
 * - Apple iOS 26 spring physics animations
 * - Premium avatar hover effects with gradient borders
 * - Dynamic glass effects with environmental response
 * - Premium dropdown entrance animations
 * - 120fps optimization
 */

import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { ChevronDownIcon, LogoutIcon, ProfileIcon } from '@/components/icons/unified/UnifiedIconSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFocusTrap } from '@/hooks/useFocusManagement';
import { useRouter } from '@/libs/i18nNavigation';
import { createClient } from '@/libs/supabase/client';
import { cn } from '@/utils/Helpers';

type UserDropdownProps = {
  userName: string;
  userEmail: string;
};

export const UserDropdown: React.FC<UserDropdownProps> = ({
  userName,
  userEmail,
}) => {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);

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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t('nav_open_user_menu')}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={cn(
            // Base styling
            'flex h-11 items-center gap-3 px-3 rounded-xl',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            // Premium spring physics + glass effects
            'premium-hover premium-focus glass-interactive gpu-accelerated',
            // Premium liquid glass surface
            'bg-background/60 hover:bg-background/80',
            'border border-border/20 hover:border-border/40',
            // Visual hierarchy
            'header-icon header-icon-primary',
          )}
          style={{
            // Hardware acceleration
            willChange: 'transform, backdrop-filter, box-shadow',
            // Premium transition timing
            transition: prefersReducedMotion
              ? 'all 150ms ease-out'
              : 'all var(--spring-normal) var(--spring-smooth)',
          }}
          data-gpu="true"
        >
          {/* Premium Avatar with gradient background + Phase 2 enhancements */}
          <div
            className={cn(
              'flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg',
              // Premium avatar effects
              'avatar-premium gpu-accelerated',
            )}
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
            }}
          >
            {getInitials(userName)}
          </div>

          {/* User Info - Hidden on mobile (research-based) */}
          <div className="hidden text-left sm:block">
            <div className="max-w-32 truncate text-sm font-medium text-foreground">
              {userName}
            </div>
          </div>

          {/* Premium chevron with signature effects */}
          <div className="relative">
            <ChevronDownIcon
              size={16}
              isOpen={isOpen}
              variant="signature"
              className="text-muted-foreground"
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={focusTrapRef as React.RefObject<HTMLDivElement>}
        align="end"
        className={cn(
          'w-56 overflow-hidden rounded-2xl border border-border/20 p-2 shadow-2xl',
          // Premium dropdown entrance animation + glass effects
          'dropdown-entrance glass-dropdown gpu-accelerated',
        )}
        onCloseAutoFocus={(e) => {
          // Prevent default to handle focus restoration manually
          e.preventDefault();
        }}
      >
        {/* User Info Header */}
        <div
          className="mb-2 rounded-xl p-3"
          role="presentation"
          style={{
            backgroundColor: 'var(--glass-header-hover)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="truncate text-sm font-medium text-foreground">
            {userName}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {userEmail}
          </div>
        </div>

        {/* Menu Items with premium styling */}
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/profile')}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5',
            // Premium spring physics
            'premium-hover gpu-accelerated',
            'hover:bg-primary/10 focus:bg-primary/10',
          )}
        >
          <ProfileIcon size={16} variant="signature" />
          <span className="font-medium">{t('profile')}</span>
        </DropdownMenuItem>

        {/* Separator with premium styling */}
        <div
          className="my-2 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(156, 163, 175, 0.2) 50%, transparent 100%)',
          }}
        />

        <DropdownMenuItem
          onClick={handleSignOut}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5',
            // Premium spring physics
            'premium-hover gpu-accelerated',
            'hover:bg-destructive/10 focus:bg-destructive/10',
            'text-destructive hover:text-destructive focus:text-destructive',
          )}
        >
          <LogoutIcon size={16} variant="signature" />
          <span className="font-medium">{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
