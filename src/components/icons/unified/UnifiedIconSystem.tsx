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
      onFocus={onHover}
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

// BELL ICON - Enhanced notification bell with professional details
export const BellIcon = memo<Omit<SignatureIconProps, 'children'> & {
  hasNotifications?: boolean;
  notificationCount?: number;
  isRinging?: boolean;
}>(({
  hasNotifications = false,
  notificationCount = 0,
  isRinging = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={hasNotifications ? 'active' : props.state}>
    {/* Enhanced bell with better proportions and details */}
    <g style={{
      transform: isRinging ? 'rotate(15deg)' : 'rotate(0deg)',
      transformOrigin: '12px 8px',
      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* Bell body - enhanced curve for better visual appeal */}
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bell clapper - subtle detail */}
      <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bell top - small detail for realism */}
      <path d="M12 2v2" strokeLinecap="round" />
    </g>
    {/* Enhanced notification badge with better positioning */}
    {hasNotifications && (
      <>
        <circle
          cx="18.5"
          cy="5.5"
          r="3.5"
          fill="hsl(var(--destructive))"
          stroke="hsl(var(--background))"
          strokeWidth="2"
        />
        {notificationCount > 0 && (
          <text
            x="18.5"
            y="7"
            textAnchor="middle"
            fontSize="8"
            fontWeight="700"
            fill="hsl(var(--destructive-foreground))"
          >
            {notificationCount > 99 ? '99+' : notificationCount}
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

// MENU ICON - Enhanced hamburger with perfect optical balance
export const MenuIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isOpen?: boolean;
}>(({
  isOpen = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    {/* Enhanced hamburger menu with optical corrections */}
    <g style={{
      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
      transformOrigin: '12px 12px',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* Top line - slightly shorter for optical balance */}
      <path d="M4 6h16" strokeLinecap="round" />
      {/* Middle line - full width for stability */}
      <path d="M3 12h18" strokeLinecap="round" />
      {/* Bottom line - slightly shorter, mirroring top */}
      <path d="M4 18h16" strokeLinecap="round" />
    </g>
  </SignatureIconBase>
));

// CLOSE ICON - Enhanced X with perfect diagonal balance and animation
export const CloseIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isAnimated?: boolean;
}>(({
  isAnimated = false,
  ...props
}) => (
  <SignatureIconBase {...props}>
    {/* Enhanced X with perfect optical balance and smooth animation */}
    <g style={{
      transform: isAnimated ? 'rotate(180deg)' : 'rotate(0deg)',
      transformOrigin: '12px 12px',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* First diagonal - precise positioning */}
      <path d="M17.5 6.5L6.5 17.5" strokeLinecap="round" />
      {/* Second diagonal - perfect cross */}
      <path d="M6.5 6.5L17.5 17.5" strokeLinecap="round" />
    </g>
  </SignatureIconBase>
));

// CHEVRON DOWN - Enhanced arrow with perfect animation
export const ChevronDownIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isOpen?: boolean;
  animationDuration?: number;
}>(({
  isOpen = false,
  animationDuration = 300,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    {/* Enhanced chevron with smooth rotation and optical corrections */}
    <g style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transformOrigin: '12px 12px',
      transition: `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    }}
    >
      {/* Perfect chevron with rounded caps for elegance */}
      <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </SignatureIconBase>
));

// SETTINGS ICON - Enhanced gear with professional details
export const SettingsIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  showRotation?: boolean;
}>(({
  isActive = false,
  showRotation = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Enhanced settings gear with smooth rotation */}
    <g style={{
      transform: showRotation ? 'rotate(45deg)' : 'rotate(0deg)',
      transformOrigin: '12px 12px',
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* Center circle - enhanced size */}
      <circle cx="12" cy="12" r="3.5" strokeLinecap="round" />
      {/* Gear teeth - refined positioning for better balance */}
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
    </g>
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

// USER ICON - Enhanced profile with professional details
export const ProfileIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  showStatus?: boolean;
}>(({
  isActive = false,
  showStatus = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Enhanced professional user icon with better proportions */}
    {/* Head - perfect circle with optical corrections */}
    <circle cx="12" cy="8" r="4.5" strokeWidth="1.5" />
    {/* Body - professional silhouette with rounded shoulders */}
    <path d="M4 21v-1.5c0-2.5 2-4.5 4.5-4.5h7c2.5 0 4.5 2 4.5 4.5V21" strokeLinecap="round" />
    {/* Optional status indicator for active state */}
    {showStatus && isActive && (
      <circle
        cx="18"
        cy="6"
        r="2.5"
        fill="hsl(var(--success))"
        stroke="hsl(var(--background))"
        strokeWidth="1.5"
      />
    )}
  </SignatureIconBase>
));

// GLOBE ICON - Enhanced world symbol with refined meridians
export const GlobeIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  showRotation?: boolean;
}>(({
  isActive = false,
  showRotation = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Enhanced globe with refined details */}
    <g style={{
      transform: showRotation ? 'rotateY(15deg)' : 'rotateY(0deg)',
      transformOrigin: '12px 12px',
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* Main globe circle */}
      <circle cx="12" cy="12" r="10" strokeLinecap="round" />
      {/* Equator line */}
      <path d="M2 12h20" strokeLinecap="round" />
      {/* Meridian lines - enhanced for better visual balance */}
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeLinecap="round" />
      {/* Additional meridian for depth */}
      <path d="M8 4.5c2 3 2 13 0 15M16 4.5c-2 3-2 13 0 15" strokeLinecap="round" opacity="0.6" />
    </g>
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

// LOGOUT ICON - Enhanced exit with professional door and arrow
export const LogoutIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  showAnimation?: boolean;
}>(({
  isActive = false,
  showAnimation = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Enhanced professional logout icon */}
    <g style={{
      transform: showAnimation ? 'translateX(2px)' : 'translateX(0px)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* Door frame - professional design */}
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Exit arrow - enhanced with better proportions */}
      <path d="M16 17l4-5-4-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12H9" strokeLinecap="round" />
      {/* Door handle - subtle detail for professionalism */}
      <circle cx="7" cy="12" r="0.5" fill="currentColor" />
    </g>
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

// SIDEBAR SPECIFIC ICONS - Premium Design 2026

// SIDEBAR EXPAND ICON - Enhanced double chevron with depth
export const SidebarExpandIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isAnimated?: boolean;
}>(({
  isAnimated = false,
  ...props
}) => (
  <SignatureIconBase {...props}>
    {/* Enhanced double chevron for sidebar expansion */}
    <g style={{
      transform: isAnimated ? 'translateX(2px)' : 'translateX(0px)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* First chevron - primary */}
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      {/* Second chevron - depth indicator */}
      <path d="M15 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.6" />
    </g>
  </SignatureIconBase>
));

// SIDEBAR COLLAPSE ICON - Enhanced double chevron reversed
export const SidebarCollapseIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isAnimated?: boolean;
}>(({
  isAnimated = false,
  ...props
}) => (
  <SignatureIconBase {...props}>
    {/* Enhanced double chevron for sidebar collapse */}
    <g style={{
      transform: isAnimated ? 'translateX(-2px)' : 'translateX(0px)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* First chevron - primary */}
      <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
      {/* Second chevron - depth indicator */}
      <path d="M9 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" opacity="0.6" />
    </g>
  </SignatureIconBase>
));

// SIDEBAR TOGGLE ICON - Unified icon that morphs between states
export const SidebarToggleIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isExpanded?: boolean;
  showAnimation?: boolean;
}>(({
  isExpanded = false,
  showAnimation = false,
  ...props
}) => (
  <SignatureIconBase {...props}>
    {/* Morphing sidebar toggle icon */}
    <g style={{
      transform: showAnimation
        ? (isExpanded ? 'rotate(180deg)' : 'rotate(0deg)')
        : 'rotate(0deg)',
      transformOrigin: '12px 12px',
      transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }}
    >
      {/* Sidebar representation */}
      <rect
        x="3"
        y="4"
        width="6"
        height="16"
        rx="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={isExpanded ? '1' : '0.6'}
      />
      {/* Content area representation */}
      <rect
        x="11"
        y="4"
        width="10"
        height="16"
        rx="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
      />
      {/* Toggle indicator */}
      <path
        d={isExpanded ? 'M9 10l-2 2 2 2' : 'M7 10l2 2-2 2'}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </g>
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
LogoutIcon.displayName = 'TradeliaLogoutIcon';
MoreVerticalIcon.displayName = 'TradeliaMoreVerticalIcon';
TrendingUpIcon.displayName = 'TradeliaTrendingUpIcon';
StarIcon.displayName = 'TradeliaStarIcon';
ClockIcon.displayName = 'TradeliaClockIcon';
UserIcon.displayName = 'TradeliaUserIcon';
SearchIcon.displayName = 'TradeliaSearchIcon';
PlusIcon.displayName = 'TradeliaPlusIcon';
MinusIcon.displayName = 'TradeliaMinusIcon';
CheckIcon.displayName = 'TradeliaCheckIcon';
SidebarExpandIcon.displayName = 'TradeliaSidebarExpandIcon';
SidebarCollapseIcon.displayName = 'TradeliaSidebarCollapseIcon';
SidebarToggleIcon.displayName = 'TradeliaSidebarToggleIcon';

// HELP ICON - Question mark in circle, universal help symbol
export const HelpIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Circle with question mark - universally recognized help symbol */}
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </SignatureIconBase>
));

HelpIcon.displayName = 'TradeliaHelpIcon';

// MAIL ICON - Envelope symbol for email/contact
export const MailIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Envelope - universal email symbol */}
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </SignatureIconBase>
));

MailIcon.displayName = 'TradeliaMailIcon';

// ============================================================================
// CHALLENGE DASHBOARD ICONS - TIER 1 PROFESSIONAL 2026
// ============================================================================

// CHALLENGES ICON - Trophy with star, represents competitions/challenges
export const ChallengesIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional trophy design - universally recognized achievement symbol */}
    {/* Trophy cup */}
    <path d="M6 9H4.5a2.5 2.5 0 010-5H6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 9h1.5a2.5 2.5 0 000-5H18" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 9a6 6 0 0012 0V4H6v5z" strokeLinecap="round" strokeLinejoin="round" />
    {/* Trophy base */}
    <path d="M12 15v3" strokeLinecap="round" />
    <path d="M8 22h8" strokeLinecap="round" />
    <path d="M10 18h4" strokeLinecap="round" />
    {/* Star accent for challenge/competition */}
    <path d="M12 2l1 2 2 .5-2 .5-1 2-1-2-2-.5 2-.5z" fill="currentColor" opacity="0.3" />
  </SignatureIconBase>
));

// MY CHARTS ICON - Bar chart with upward trend, represents personal performance
export const MyChartsIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  showTrend?: boolean;
}>(({
  isActive = false,
  showTrend = true,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional bar chart with trend line */}
    {/* Chart bars - ascending pattern */}
    <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="15" width="3" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="14" y="11" width="3" height="10" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="21" y="7" width="3" height="14" rx="1" strokeLinecap="round" strokeLinejoin="round" />
    {/* Optional trend line overlay */}
    {showTrend && (
      <path 
        d="M6 17l4-4 4 2 6-6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        opacity="0.5"
        strokeDasharray="2 2"
      />
    )}
  </SignatureIconBase>
));

// SIGNALS ICON - Radar/broadcast waves, represents AI signals
export const SignalsIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  isPulsing?: boolean;
}>(({
  isActive = false,
  isPulsing = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Professional signal/broadcast icon with radar waves */}
    <g style={{
      transform: isPulsing ? 'scale(1.1)' : 'scale(1)',
      transformOrigin: '12px 12px',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
    >
      {/* Center point - signal source */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      {/* Inner wave */}
      <path d="M8.5 8.5a5 5 0 017 0M8.5 15.5a5 5 0 007 0" strokeLinecap="round" />
      {/* Outer wave */}
      <path d="M5 5a10 10 0 0114 0M5 19a10 10 0 0014 0" strokeLinecap="round" opacity="0.6" />
      {/* Directional indicators */}
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeLinecap="round" opacity="0.3" />
    </g>
  </SignatureIconBase>
));

ChallengesIcon.displayName = 'TradeliaChallengesIcon';
MyChartsIcon.displayName = 'TradeliaMyChartsIcon';
SignalsIcon.displayName = 'TradeliaSignalsIcon';

// Legacy aliases for compatibility - Updated with enhanced versions
export const LightIcon = SunIcon;
export const DarkIcon = MoonIcon;
export const ToolsIcon = CalculatorIcon;
export const CommunityIcon = ForumIcon;
export const ExitIcon = LogoutIcon; // Use the enhanced LogoutIcon

LightIcon.displayName = 'TradeliaLightIcon';
DarkIcon.displayName = 'TradeliaDarkIcon';
ToolsIcon.displayName = 'TradeliaToolsIcon';
CommunityIcon.displayName = 'TradeliaCommunityIcon';
ExitIcon.displayName = 'TradeliaExitIcon';
