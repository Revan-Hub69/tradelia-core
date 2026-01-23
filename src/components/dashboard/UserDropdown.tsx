/*
 * USER DROPDOWN - Modern Liquid Glass Avatar 2026 + Performance Optimized
 *
 * Enhanced with:
 * - Tier-1 research based Liquid Glass design (Pixelmatters, UXStudioTeam, Entrepreneur)
 * - React.memo + useMemo performance optimizations
 * - Modern status indicators and role badges
 * - 60fps smooth hover interactions
 * - Educational-appropriate animations
 */

import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ChevronDownIcon, LogoutIcon, ProfileIcon } from '@/components/icons/unified/UnifiedIconSystem';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFocusTrap } from '@/hooks/useFocusManagement';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useRouter } from '@/libs/i18nNavigation';
import { createClient } from '@/libs/supabase/client';
import { cn } from '@/utils/Helpers';

type UserDropdownProps = {
  userName: string;
  userEmail: string;
  status?: 'online' | 'away' | 'busy' | 'offline';
  role?: 'admin' | 'user' | 'premium';
};

export const UserDropdown = React.memo<UserDropdownProps>(({
  userName,
  userEmail,
  status = 'online',
  role,
}) => {
  const router = useRouter();
  const t = useTranslations('Dashboard');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const focusTrapRef = useFocusTrap(isOpen);

  // Global motion preferences - optimized
  useReducedMotion(); // Hook ensures global motion preferences are detected

  // Wait for client-side hydration to complete before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoized initials calculation - performance optimization
  const initials = useMemo(() => {
    return userName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  // Memoized callbacks - prevent unnecessary re-renders
  const handleSignOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }, [router]);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Render placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div
        className={cn(
          'flex h-11 items-center gap-3 px-3 rounded-xl',
          'header-icon glass-button',
        )}
        aria-hidden="true"
      >
        <div className="size-8 rounded-full bg-muted/50" /> {/* Avatar placeholder */}
        <div className="hidden sm:block h-4 w-20 bg-muted/50 rounded" /> {/* Name placeholder */}
        <div className="size-4" /> {/* Chevron placeholder */}
      </div>
    );
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
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
            // ONLY design tokens - NO Tailwind transitions
            'header-icon glass-button',
          )}
          style={{
            // Hardware acceleration - GPU optimization
            willChange: 'transform',
            transform: 'translateZ(0)', // Force GPU layer
          }}
        >
          {/* Modern Liquid Glass Avatar 2026 */}
          <div className="relative">
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white',
                // NO transitions - let parent button handle hover
              )}
              style={{
                // Liquid Glass Avatar - Tier-1 research based
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 50%, hsl(var(--primary)) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 12px hsl(var(--primary) / 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                willChange: 'transform',
                transform: 'translateZ(0)',
              }}
            >
              {initials}
            </div>

            {/* Status Indicator - Modern 2026 */}
            {status !== 'offline' && (
              <div
                className={cn(
                  'absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background',
                  'transition-all duration-200 ease-out',
                  {
                    'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]': status === 'online',
                    'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]': status === 'away',
                    'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]': status === 'busy',
                  },
                )}
              />
            )}

            {/* Role Badge - Enterprise Professional */}
            {role && role !== 'user' && (
              <div
                className={cn(
                  'absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white',
                  'transition-all duration-200 ease-out',
                  {
                    'bg-gradient-to-br from-purple-500 to-purple-600 shadow-[0_0_8px_rgba(147,51,234,0.6)]': role === 'admin',
                    'bg-gradient-to-br from-amber-500 to-amber-600 shadow-[0_0_8px_rgba(245,158,11,0.6)]': role === 'premium',
                  },
                )}
              >
                {role === 'admin' ? 'A' : 'P'}
              </div>
            )}
          </div>

          {/* User Info - Hidden on mobile (research-based) */}
          <div className="hidden text-left sm:block">
            <div className="max-w-32 truncate text-sm font-medium text-foreground">
              {userName}
            </div>
          </div>

          {/* Optimized chevron */}
          <div className="relative">
            <ChevronDownIcon
              size={16}
              isOpen={isOpen}
              variant="signature"
              className="text-muted-foreground transition-transform duration-200 ease-out"
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={focusTrapRef as React.RefObject<HTMLDivElement>}
        align="end"
        className={cn(
          'w-56 overflow-hidden rounded-2xl border border-border/20 p-2',
          // Liquid Glass dropdown
          'glass-dropdown',
          // Performance optimized entrance
          'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200',
        )}
        onCloseAutoFocus={(e) => {
          // Prevent default to handle focus restoration manually
          e.preventDefault();
        }}
      >
        {/* User Info Header */}
        <div
          className="mb-2 rounded-xl p-3 transition-colors duration-200"
          role="presentation"
          style={{
            backgroundColor: 'var(--glass-header-hover)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="truncate text-sm font-medium text-foreground">
              {userName}
            </div>
            {/* Status indicator in header */}
            {status !== 'offline' && (
              <div
                className={cn(
                  'size-2 rounded-full',
                  {
                    'bg-green-500': status === 'online',
                    'bg-yellow-500': status === 'away',
                    'bg-red-500': status === 'busy',
                  },
                )}
              />
            )}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {userEmail}
          </div>
          {role && role !== 'user' && (
            <div className="mt-1 text-xs font-medium text-primary">
              {role === 'admin' ? 'Administrator' : 'Premium User'}
            </div>
          )}
        </div>

        {/* Menu Items with optimized styling */}
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/profile')}
          className={cn(
            'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5',
            // Performance optimized hover
            'transition-colors duration-200 ease-out',
            'hover:bg-primary/10 focus:bg-primary/10',
          )}
        >
          <ProfileIcon size={16} variant="signature" />
          <span className="font-medium">{t('profile')}</span>
        </DropdownMenuItem>

        {/* Separator with modern styling */}
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
            // Performance optimized hover
            'transition-colors duration-200 ease-out',
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
});
