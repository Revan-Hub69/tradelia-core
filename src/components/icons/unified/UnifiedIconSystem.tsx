/*
 * TRADELIA SIGNATURE ICON SYSTEM 2026 - CLEAN & PROFESSIONAL
 *
 * Sistema di icone educative per piattaforma crypto
 * Basato su ricerche tier 1: Apple, Linear, IBM Design
 *
 * SPECIFICHE:
 * - Grid: 24x24px con live area 20x20px
 * - Stroke: 2px uniforme per 24px icons
 * - Coordinate: Snap alla griglia 0.5px
 * - Colori: currentColor + design system
 * - Zero Framer Motion (solo CSS transitions)
 * - Oggetti appropriati per educazione crypto
 */

'use client';

import React, { memo, useCallback } from 'react';

import { cn } from '@/utils/Helpers';

// ============================================================================
// DESIGN TOKENS 2026 - CLEAN & MINIMAL
// ============================================================================

export type IconSize = 16 | 20 | 24 | 28 | 32;
export type IconVariant = 'minimal' | 'signature' | 'premium';
export type IconState = 'default' | 'hover' | 'active' | 'disabled';

// Clean design tokens - no complex animations
export const SIGNATURE_TOKENS = {
  sizes: {
    16: { size: 16, strokeWidth: 1.5, padding: 2 },
    20: { size: 20, strokeWidth: 1.75, padding: 2.5 },
    24: { size: 24, strokeWidth: 2, padding: 3 },
    28: { size: 28, strokeWidth: 2, padding: 3.5 },
    32: { size: 32, strokeWidth: 2.5, padding: 4 },
  },
  transitions: {
    fast: { duration: 0.15, ease: 'ease-out' },
    base: { duration: 0.2, ease: 'ease-out' },
  },
} as const;

// ============================================================================
// SIGNATURE ICON BASE - CLEAN FOUNDATION
// ============================================================================

export type SignatureIconProps = {
  size?: IconSize;
  variant?: IconVariant;
  state?: IconState;
  className?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  children: React.ReactNode;
  onHover?: () => void;
  onPress?: () => void;
};

export const SignatureIconBase = memo<SignatureIconProps>(({
  size = 24,
  variant = 'signature',
  state = 'default',
  className,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
  children,
  onHover,
  onPress,
}) => {
  const sizeToken = SIGNATURE_TOKENS.sizes[size];

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  return (
    <svg
      width={sizeToken.size}
      height={sizeToken.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sizeToken.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cn(
        'flex-shrink-0 select-none',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
        {
          'opacity-60': state === 'disabled',
          'opacity-90': variant === 'minimal',
          'opacity-100': variant === 'signature' || variant === 'premium',
        },
        className,
      )}
      onMouseEnter={onHover}
      onClick={handlePress}
    >
      {children}
    </svg>
  );
});

SignatureIconBase.displayName = 'SignatureIconBase';

// ============================================================================
// TRADELIA SIGNATURE ICONS 2026 - EDUCATIONAL & PROFESSIONAL
// ============================================================================

// HOME ICON - Dashboard home
export const HomeIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path d="M3 12l9-9 9 9" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
    <path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6" />
  </SignatureIconBase>
));

// BELL ICON - Notifications
export const BellIcon = memo<Omit<SignatureIconProps, 'children'> & {
  hasNotifications?: boolean;
  notificationCount?: number;
}>(({
  hasNotifications = false,
  notificationCount = 0,
  ...props
}) => (
  <SignatureIconBase {...props} state={hasNotifications ? 'active' : props.state}>
    <path d="M6 8A6 6 0 0 1 18 8c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    {hasNotifications && (
      <circle
        cx="18"
        cy="6"
        r="3"
        fill="hsl(var(--destructive))"
        stroke="hsl(var(--background))"
        strokeWidth="2"
      />
    )}
    {hasNotifications && notificationCount > 0 && (
      <text
        x="18"
        y="7"
        textAnchor="middle"
        fontSize="6"
        fill="hsl(var(--destructive-foreground))"
        fontWeight="700"
      >
        {notificationCount > 9 ? '9+' : notificationCount}
      </text>
    )}
  </SignatureIconBase>
));

// LIGHT ICON - Light theme (monitor with sun)
export const LightIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <circle cx="12" cy="11" r="3" />
    <path d="M12 5v2" />
    <path d="M12 15v2" />
    <path d="M16.24 7.76l-1.41 1.41" />
    <path d="M9.17 14.83l-1.41 1.41" />
    <path d="M19 11h-2" />
    <path d="M7 11H5" />
    <path d="M16.24 14.24l-1.41-1.41" />
    <path d="M9.17 9.17L7.76 7.76" />
  </SignatureIconBase>
));

// DARK ICON - Dark theme (monitor with moon)
export const DarkIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <rect x="2" y="4" width="20" height="14" rx="2" />
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </SignatureIconBase>
));

// MENU ICON - Hamburger menu
export const MenuIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isOpen?: boolean;
}>(({
  isOpen = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </SignatureIconBase>
));

// CLOSE ICON - X close
export const CloseIcon = memo<Omit<SignatureIconProps, 'children'>>(({
  ...props
}) => (
  <SignatureIconBase {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </SignatureIconBase>
));

// CHEVRON DOWN ICON - Dropdown arrow
export const ChevronDownIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isOpen?: boolean;
}>(({
  isOpen = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    <polyline
      points="6,9 12,15 18,9"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transformOrigin: '12px 12px',
        transition: 'transform 0.2s ease-out',
      }}
    />
  </SignatureIconBase>
));

// SETTINGS ICON - Gear
export const SettingsIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24 4.24M6.74 17.26L2.5 21.5m15-15l-4.24 4.24M6.74 6.74L2.5 2.5" />
  </SignatureIconBase>
));

// LEARN ICON - Open book
export const LearnIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </SignatureIconBase>
));

// CALCULATOR ICON - Crypto calculator tool
export const CalculatorIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="14" x2="16" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </SignatureIconBase>
));

// FORUM ICON - Community discussion
export const ForumIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <path d="M8 9h8" />
    <path d="M8 13h6" />
  </SignatureIconBase>
));

// PROFILE ICON - User profile
export const ProfileIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SignatureIconBase>
));

// GLOBE ICON - Language/internationalization
export const GlobeIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </SignatureIconBase>
));

// LOCK ICON - Security/privacy
export const LockIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <circle cx="12" cy="16" r="1" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </SignatureIconBase>
));

// EXIT ICON - Logout/sign out
export const ExitIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16,17 21,12 16,7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </SignatureIconBase>
));

// MORE VERTICAL ICON - Overflow menu
export const MoreVerticalIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </SignatureIconBase>
));

// Display names for debugging
HomeIcon.displayName = 'TradeliaHomeIcon';
BellIcon.displayName = 'TradeliaBellIcon';
LightIcon.displayName = 'TradeliaLightIcon';
DarkIcon.displayName = 'TradeliaDarkIcon';
MenuIcon.displayName = 'TradeliaMenuIcon';
CloseIcon.displayName = 'TradeliaCloseIcon';
ChevronDownIcon.displayName = 'TradeliaChevronDownIcon';
SettingsIcon.displayName = 'TradeliaSettingsIcon';
LearnIcon.displayName = 'TradeliaLearnIcon';
CalculatorIcon.displayName = 'TradeliaCalculatorIcon';
ForumIcon.displayName = 'TradeliaForumIcon';
ProfileIcon.displayName = 'TradeliaProfileIcon';
GlobeIcon.displayName = 'TradeliaGlobeIcon';
LockIcon.displayName = 'TradeliaLockIcon';
ExitIcon.displayName = 'TradeliaExitIcon';
MoreVerticalIcon.displayName = 'TradeliaMoreVerticalIcon';

// Legacy aliases for compatibility
export const SunIcon = LightIcon;
export const MoonIcon = DarkIcon;
export const ToolsIcon = CalculatorIcon;
export const CommunityIcon = ForumIcon;
export const LogoutIcon = ExitIcon;

SunIcon.displayName = 'TradeliaSunIcon';
MoonIcon.displayName = 'TradeliaMoonIcon';
ToolsIcon.displayName = 'TradeliaToolsIcon';
CommunityIcon.displayName = 'TradeliaCommunityIcon';
LogoutIcon.displayName = 'TradeliaLogoutIcon';