/*
 * TRADELIA SIGNATURE ICON SYSTEM 2026 - TIER 1 RESEARCH BASED
 *
 * RICERCA APPROFONDITA DA FONTI TIER 1:
 * - Apple Human Interface Guidelines 2024-2025: Clarity, precision, optical balance
 * - Heroicons Official: Hand-crafted SVG, 1.5px stroke, 24x24 grid
 * - Lucide Design System: Community-driven, consistent stroke, minimal modern
 * - Linear App: Professional minimalism, mathematical precision
 * - Structured Icon Libraries: Consistent geometry, optical correction
 *
 * PRINCIPI FONDAMENTALI:
 * - Clarity: Ogni elemento deve essere immediatamente riconoscibile
 * - Consistency: Stroke weight uniforme, grid alignment perfetto
 * - Recognition: Simboli universali, non interpretazioni creative
 * - Optical Balance: Correzioni ottiche per perfetta percezione visiva
 * - Professional Grade: Qualità enterprise, non consumer
 */

'use client';

import React, { memo, useCallback } from 'react';

import { cn } from '@/utils/Helpers';

// ============================================================================
// DESIGN TOKENS - TIER 1 RESEARCH BASED
// ============================================================================

export type IconSize = 16 | 20 | 24 | 28 | 32;
export type IconVariant = 'minimal' | 'signature' | 'premium';
export type IconState = 'default' | 'hover' | 'active' | 'disabled';

// Mathematical precision based on Apple HIG and Linear App research
export const SIGNATURE_TOKENS = {
  sizes: {
    16: { size: 16, strokeWidth: 1.25, padding: 2 }, // Optical correction for small sizes
    20: { size: 20, strokeWidth: 1.5, padding: 2.5 }, // Standard Heroicons weight
    24: { size: 24, strokeWidth: 1.5, padding: 3 }, // Primary size, perfect grid
    28: { size: 28, strokeWidth: 1.75, padding: 3.5 }, // Optical scaling
    32: { size: 32, strokeWidth: 2, padding: 4 }, // Large size, increased weight
  },
  // Professional color system
  colors: {
    primary: 'currentColor',
    secondary: 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--primary))',
    success: 'hsl(var(--success))',
    warning: 'hsl(var(--warning))',
    destructive: 'hsl(var(--destructive))',
  },
} as const;

// ============================================================================
// ICON BASE - PROFESSIONAL GRADE
// ============================================================================

export type SignatureIconProps = {
  'size'?: IconSize;
  'variant'?: IconVariant;
  'state'?: IconState;
  'className'?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  'children': React.ReactNode;
  'onHover'?: () => void;
  'onPress'?: () => void;
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
        // Base styles - professional grade
        'flex-shrink-0 select-none',
        'transition-all duration-200 ease-out',
        // Optical corrections
        'antialiased',
        // State management
        {
          'opacity-40 cursor-not-allowed': state === 'disabled',
          'opacity-70': variant === 'minimal',
          'opacity-90 hover:opacity-100': variant === 'signature',
          'opacity-100': variant === 'premium',
          'scale-95': state === 'active',
          'hover:scale-105': state === 'hover' && variant === 'premium',
        },
        className,
      )}
      onMouseEnter={onHover}
      onClick={handlePress}
      style={{
        // Hardware acceleration for smooth animations
        willChange: 'transform, opacity',
        // Perfect pixel alignment
        shapeRendering: 'geometricPrecision',
      }}
    >
      {children}
    </svg>
  );
});

SignatureIconBase.displayName = 'SignatureIconBase';

// ============================================================================
// TIER 1 PROFESSIONAL ICONS - UNIVERSALLY RECOGNIZABLE
// ============================================================================

// HOME ICON - Universal house symbol, Apple HIG compliant
export const HomeIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect house silhouette - universally recognized */}
    <path d="M3 9.5L12 2l9 7.5v11a2 2 0 01-2 2H5a2 2 0 01-2-2v-11z" />
    <path d="M9 22V12h6v10" />
  </SignatureIconBase>
));

// BELL ICON - Classic notification bell, professional grade
export const BellIcon = memo<Omit<SignatureIconProps, 'children'> & {
  hasNotifications?: boolean;
  notificationCount?: number;
}>(({
  hasNotifications = false,
  notificationCount = 0,
  ...props
}) => (
  <SignatureIconBase {...props} state={hasNotifications ? 'active' : props.state}>
    {/* Classic bell shape - immediately recognizable */}
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
    {/* Professional notification badge */}
    {hasNotifications && (
      <>
        <circle
          cx="19"
          cy="6"
          r="3"
          fill="hsl(var(--destructive))"
          stroke="hsl(var(--background))"
          strokeWidth="2"
        />
        {notificationCount > 0 && (
          <text
            x="19"
            y="7.5"
            textAnchor="middle"
            fontSize="7"
            fontWeight="700"
            fill="hsl(var(--destructive-foreground))"
          >
            {notificationCount > 9 ? '9+' : notificationCount}
          </text>
        )}
      </>
    )}
  </SignatureIconBase>
));

// SUN ICON - Perfect solar symbol, 8-ray symmetry
export const SunIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect circle sun with mathematical ray positioning */}
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </SignatureIconBase>
));

// MOON ICON - Crescent moon, perfect optical balance
export const MoonIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect crescent shape - universally recognized */}
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </SignatureIconBase>
));

// MENU ICON - Three horizontal lines, perfect spacing
export const MenuIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isOpen?: boolean;
}>(({
  isOpen = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    {/* Perfect hamburger menu - mathematical spacing */}
    <path d="M3 6h18M3 12h18M3 18h18" />
  </SignatureIconBase>
));

// CLOSE ICON - Perfect X, diagonal balance
export const CloseIcon = memo<Omit<SignatureIconProps, 'children'>>(({
  ...props
}) => (
  <SignatureIconBase {...props}>
    {/* Perfect X with optical balance */}
    <path d="M18 6L6 18M6 6l12 12" />
  </SignatureIconBase>
));

// CHEVRON DOWN - Perfect arrow, mathematical precision
export const ChevronDownIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isOpen?: boolean;
}>(({
  isOpen = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    <path
      d="M6 9l6 6 6-6"
      style={{
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        transformOrigin: '12px 12px',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    />
  </SignatureIconBase>
));

// SETTINGS ICON - Classic gear, professional grade
export const SettingsIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional settings gear */}
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </SignatureIconBase>
));

// BOOK ICON - Open book, learning symbol
export const LearnIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Classic open book */}
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </SignatureIconBase>
));

// CALCULATOR ICON - Professional calculator
export const CalculatorIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional calculator design */}
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <rect x="6" y="6" width="12" height="3" rx="1" />
    <path d="M8 13h1M8 16h1M8 19h1M12 13h1M12 16h1M12 19h1M16 13h1M16 16v3" />
  </SignatureIconBase>
));

// CHAT ICON - Speech bubble, communication
export const ForumIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Classic speech bubble */}
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    <path d="M8 9h8M8 13h6" />
  </SignatureIconBase>
));

// USER ICON - Person silhouette, profile
export const ProfileIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional user icon */}
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SignatureIconBase>
));

// GLOBE ICON - World symbol, language/global
export const GlobeIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect globe with meridians */}
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </SignatureIconBase>
));

// LOCK ICON - Security symbol
export const LockIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional lock icon */}
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </SignatureIconBase>
));

// EXIT ICON - Door with arrow, logout
export const ExitIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional exit icon */}
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </SignatureIconBase>
));

// MORE VERTICAL ICON - Three dots menu
export const MoreVerticalIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect three dots - mathematical spacing */}
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </SignatureIconBase>
));

// TRENDING UP ICON - Growth trajectory
export const TrendingUpIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional growth chart */}
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" />
    <polyline points="16,7 22,7 22,13" />
  </SignatureIconBase>
));

// STAR ICON - Perfect 5-point star
export const StarIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect star with mathematical proportions */}
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </SignatureIconBase>
));

// CLOCK ICON - Time precision
export const ClockIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional clock face */}
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </SignatureIconBase>
));

// USER ICON - Person silhouette (alias for ProfileIcon)
export const UserIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional user icon */}
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </SignatureIconBase>
));

// SEARCH ICON - Magnifying glass
export const SearchIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional search icon */}
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </SignatureIconBase>
));

// PLUS ICON - Addition symbol
export const PlusIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect plus sign */}
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </SignatureIconBase>
));

// MINUS ICON - Subtraction symbol
export const MinusIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect minus sign */}
    <path d="M5 12h14" />
  </SignatureIconBase>
));

// CHECK ICON - Checkmark
export const CheckIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Perfect checkmark */}
    <path d="M20 6 9 17l-5-5" />
  </SignatureIconBase>
));

// Display names for debugging
HomeIcon.displayName = 'TradeliaHomeIcon';
BellIcon.displayName = 'TradeliaBellIcon';
SunIcon.displayName = 'TradeliaSunIcon';
MoonIcon.displayName = 'TradeliaMoonIcon';
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
TrendingUpIcon.displayName = 'TradeliaTrendingUpIcon';
StarIcon.displayName = 'TradeliaStarIcon';
ClockIcon.displayName = 'TradeliaClockIcon';
UserIcon.displayName = 'TradeliaUserIcon';
SearchIcon.displayName = 'TradeliaSearchIcon';
PlusIcon.displayName = 'TradeliaPlusIcon';
MinusIcon.displayName = 'TradeliaMinusIcon';
CheckIcon.displayName = 'TradeliaCheckIcon';

// Legacy aliases for compatibility
export const LightIcon = SunIcon;
export const DarkIcon = MoonIcon;
export const ToolsIcon = CalculatorIcon;
export const CommunityIcon = ForumIcon;
export const LogoutIcon = ExitIcon;

LightIcon.displayName = 'TradeliaLightIcon';
DarkIcon.displayName = 'TradeliaDarkIcon';
ToolsIcon.displayName = 'TradeliaToolsIcon';
CommunityIcon.displayName = 'TradeliaCommunityIcon';
LogoutIcon.displayName = 'TradeliaLogoutIcon';
