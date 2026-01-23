/*
 * USER DROPDOWN - Premium Liquid Glass 2026
 *
 * Premium user dropdown con Apple iOS 26 Liquid Glass effects:
 * - Ricerca Tier 1: Modern app patterns (Linear, Figma, Slack)
 * - Avatar premium con gradient background
 * - Liquid glass dropdown con enhanced backdrop
 * - Focus trap implementation per accessibility
 * - Motion preferences compliance
 * - Professional keyboard navigation (WCAG 2.1 AA)
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
  const [isPressed, setIsPressed] = useState(false);
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          aria-label={t('nav_open_user_menu')}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={cn(
            // Base styling
            'flex h-11 items-center gap-3 px-3 rounded-xl',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            'transition-all duration-300 ease-out',
            // Premium liquid glass surface
            'bg-background/60 hover:bg-background/80',
            'border border-border/20 hover:border-border/40',
            // Visual hierarchy
            'header-icon header-icon-primary',
          )}
          style={{
            // Premium liquid glass effects (iOS 26 research)
            backdropFilter: prefersReducedMotion
              ? 'blur(4px)'
              : 'blur(12px) saturate(180%)',
            // Premium spring physics
            transform: (isPressed || isOpen) && !prefersReducedMotion
              ? 'scale(0.98) translateZ(0)'
              : 'scale(1) translateZ(0)',
            // Enhanced shadow with depth
            boxShadow: (isPressed || isOpen)
              ? '0 2px 8px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(0, 0, 0, 0.1)'
              : '0 4px 16px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
            // Hardware acceleration
            willChange: 'transform, backdrop-filter, box-shadow',
            // Premium transition timing (Apple iOS 26)
            transition: prefersReducedMotion
              ? 'all 150ms ease-out'
              : 'all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          data-gpu="true"
        >
          {/* Premium Avatar with gradient background */}
          <div
            className="flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white shadow-lg"
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
        )}
        style={{
          // Premium liquid glass backdrop (Apple iOS 26)
          backgroundColor: 'var(--glass-dropdown-bg)',
          backdropFilter: prefersReducedMotion
            ? 'blur(8px)'
            : `blur(var(--glass-dropdown-blur)) saturate(var(--glass-dropdown-saturate))`,
          // Enhanced shadow with depth (research-based)
          boxShadow: 'var(--glass-dropdown-shadow)',
        }}
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
            'transition-all duration-200 ease-out',
            'hover:bg-primary/10 hover:scale-[1.02]',
            'focus:bg-primary/10 focus:scale-[1.02]',
          )}
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform, background-color',
          }}
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
            'transition-all duration-200 ease-out',
            'hover:bg-destructive/10 hover:scale-[1.02]',
            'focus:bg-destructive/10 focus:scale-[1.02]',
            'text-destructive hover:text-destructive focus:text-destructive',
          )}
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform, background-color',
          }}
        >
          <LogoutIcon size={16} variant="signature" />
          <span className="font-medium">{t('logout')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
