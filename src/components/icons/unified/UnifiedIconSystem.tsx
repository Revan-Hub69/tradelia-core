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
 * - Professional Grade: Qualita enterprise, non consumer
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

// BOOK ICON - Open book, knowledge symbol
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

// ============================================================================
// CHALLENGE METRIC ICONS - Premium Feature Icons
// ============================================================================

// PROFIT TARGET ICON - Vertical line with dollar sign
const ProfitTargetIconInner = () => (
  <>
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </>
);

export const ProfitTargetIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <ProfitTargetIconInner />
  </SignatureIconBase>
));

// DRAWDOWN ICON - Chart with downward bars
const DrawdownIconInner = () => (
  <>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </>
);

export const DrawdownIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <DrawdownIconInner />
  </SignatureIconBase>
));

// DAILY LOSS ICON - Downward indicator
const DailyLossIconInner = () => (
  <>
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
    <path d="M3.34 7A10 10 0 1 1 7 3.34" />
  </>
);

export const DailyLossIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <DailyLossIconInner />
  </SignatureIconBase>
));

// PAYOUT ICON - Credit card design
const PayoutIconInner = () => (
  <>
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </>
);

export const PayoutIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <PayoutIconInner />
  </SignatureIconBase>
));

// SCALING ICON - 3D cube scaling representation
const ScalingIconInner = () => (
  <>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
    <polyline points="7.5 19.79 7.5 14.6 3 12" />
    <polyline points="21 12 16.5 14.6 16.5 19.79" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" x2="12" y1="22.08" y2="12" />
  </>
);

export const ScalingIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <ScalingIconInner />
  </SignatureIconBase>
));

// TIME LIMIT ICON - Clock with time markers
const TimeLimitIconInner = () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
);

export const TimeLimitIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <TimeLimitIconInner />
  </SignatureIconBase>
));

// MIN DAYS ICON - Calendar with checkmark
const MinDaysIconInner = () => (
  <>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="m9 16 2 2 4-4" />
  </>
);

export const MinDaysIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <MinDaysIconInner />
  </SignatureIconBase>
));

// REFUND ICON - Circular refund arrow
const RefundIconInner = () => (
  <>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </>
);

export const RefundIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <RefundIconInner />
  </SignatureIconBase>
));

// ============================================================================
// BADGE ICONS - Status & Quality Indicators
// ============================================================================

// VERIFIED ICON - Checkmark badge
const VerifiedIconInner = () => (
  <>
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </>
);

export const VerifiedIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <VerifiedIconInner />
  </SignatureIconBase>
));

// FEATURED ICON - Star polygon
const FeaturedIconInner = () => (
  <>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </>
);

export const FeaturedIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <FeaturedIconInner />
  </SignatureIconBase>
));

// NEW BADGE ICON - Lightning bolt
const NewBadgeIconInner = () => (
  <>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </>
);

export const NewBadgeIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <NewBadgeIconInner />
  </SignatureIconBase>
));

// FRESHNESS ICON - Sparkles
const FreshnessIconInner = () => (
  <>
    <path d="M12 2v4" />
    <path d="m16.2 7.8 2.9-2.9" />
    <path d="M18 12h4" />
    <path d="m16.2 16.2 2.9 2.9" />
    <path d="M12 18v4" />
    <path d="m4.9 19.1 2.9-2.9" />
    <path d="M2 12h4" />
    <path d="m4.9 4.9 2.9 2.9" />
  </>
);

export const FreshnessIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <FreshnessIconInner />
  </SignatureIconBase>
));

// ============================================================================
// PLATFORM ICONS - Trading Platforms
// ============================================================================

// MT4 ICON - MetaTrader 4 logo representation
const MT4IconInner = () => (
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 7h10" />
    <path d="M10 7v10" />
    <path d="M14 7v10" />
  </>
);

export const MT4Icon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <MT4IconInner />
  </SignatureIconBase>
));

// MT5 ICON - MetaTrader 5 logo representation
const MT5IconInner = () => (
  <>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 7h10" />
    <path d="M7 12h10" />
    <path d="M7 17h10" />
  </>
);

export const MT5Icon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <MT5IconInner />
  </SignatureIconBase>
));

// CTRADER ICON - cTrader platform representation
const CTraderIconInner = () => (
  <>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" x2="12" y1="22.08" y2="12" />
  </>
);

export const CTraderIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <CTraderIconInner />
  </SignatureIconBase>
));

// DXTRADE ICON - DXtrade platform representation
const DXTradeIconInner = () => (
  <>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </>
);

export const DXTradeIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <DXTradeIconInner />
  </SignatureIconBase>
));

// TRADINGVIEW ICON - TradingView chart representation
const TradingViewIconInner = () => (
  <>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </>
);

export const TradingViewIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <TradingViewIconInner />
  </SignatureIconBase>
));

// ============================================================================
// ADDITIONAL UTILITY ICONS
// ============================================================================

// TROPHY ICON - Competition/Achievement
const TrophyIconInner = () => (
  <>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </>
);

export const TrophyIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <TrophyIconInner />
  </SignatureIconBase>
));

// TARGET ICON - Goal/Aim
const TargetIconInner = () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </>
);

export const TargetIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <TargetIconInner />
  </SignatureIconBase>
));

// BOT ICON - AI/Robot
const BotIconInner = () => (
  <>
    <rect width="18" height="10" x="3" y="11" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" />
    <line x1="8" x2="8" y1="16" y2="16" />
    <line x1="16" x2="16" y1="16" y2="16" />
  </>
);

export const BotIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <BotIconInner />
  </SignatureIconBase>
));

// NEWS ICON - News/Articles
const NewsIconInner = () => (
  <>
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8V6Z" />
  </>
);

export const NewsIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <NewsIconInner />
  </SignatureIconBase>
));

// WEEKEND ICON - Calendar with weekend markers
const WeekendIconInner = () => (
  <>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
    <path d="M8 14h.01" />
    <path d="M12 14h.01" />
    <path d="M16 14h.01" />
    <path d="M8 18h.01" />
    <path d="M12 18h.01" />
    <path d="M16 18h.01" />
  </>
);

export const WeekendIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <WeekendIconInner />
  </SignatureIconBase>
));

// LIVE ACCOUNT ICON - User with live indicator
const LiveAccountIconInner = () => (
  <>
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </>
);

export const LiveAccountIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <LiveAccountIconInner />
  </SignatureIconBase>
));

// PAPER TRADING ICON - Document with practice lines
const PaperTradingIconInner = () => (
  <>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" x2="8" y1="13" y2="13" />
    <line x1="16" x2="8" y1="17" y2="17" />
    <line x1="10" x2="8" y1="9" y2="9" />
  </>
);

export const PaperTradingIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <PaperTradingIconInner />
  </SignatureIconBase>
));

// LEVERAGE ICON - Chart with leverage marker
const LeverageIconInner = () => (
  <>
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
    <circle cx="19" cy="9" r="2" />
  </>
);

export const LeverageIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <LeverageIconInner />
  </SignatureIconBase>
));

// COMMISSION ICON - Dollar with commission lines
const CommissionIconInner = () => (
  <>
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </>
);

export const CommissionIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <CommissionIconInner />
  </SignatureIconBase>
));

// USERS ICON - Group of users
const UsersIconInner = () => (
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
);

export const UsersIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <UsersIconInner />
  </SignatureIconBase>
));

// ============================================================================
// ENROLLMENT & STATUS ICONS
// ============================================================================

// PENDING ICON - Clock circle for pending status
const PendingIconInner = () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
);

export const PendingIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <PendingIconInner />
  </SignatureIconBase>
));

// HELP CIRCLE ICON - Question mark in circle
const HelpCircleIconInner = () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </>
);

export const HelpCircleIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <HelpCircleIconInner />
  </SignatureIconBase>
));

// PLAY ICON - Triangle play button
const PlayIconInner = () => (
  <>
    <polygon points="5 3 19 12 5 21 5 3" />
  </>
);

export const PlayIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <PlayIconInner />
  </SignatureIconBase>
));

// X CIRCLE ICON - X in circle for rejection/close
const XCircleIconInner = () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" x2="9" y1="9" y2="15" />
    <line x1="9" x2="15" y1="9" y2="15" />
  </>
);

export const XCircleIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <XCircleIconInner />
  </SignatureIconBase>
));

// ARCHIVE ICON - Archive box
const ArchiveIconInner = () => (
  <>
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" x2="14" y1="12" y2="12" />
  </>
);

export const ArchiveIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <ArchiveIconInner />
  </SignatureIconBase>
));

// REDIRECT ICON - External link arrow
const RedirectIconInner = () => (
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </>
);

export const RedirectIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <RedirectIconInner />
  </SignatureIconBase>
));

// WARNING ICON - Warning triangle
const WarningIconInner = () => (
  <>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" x2="12" y1="9" y2="13" />
    <line x1="12" x2="12.01" y1="17" y2="17" />
  </>
);

export const WarningIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <WarningIconInner />
  </SignatureIconBase>
));

// DELETE ICON - Trash can
const DeleteIconInner = () => (
  <>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </>
);

export const DeleteIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <DeleteIconInner />
  </SignatureIconBase>
));

// LIGHTBULB ICON - Idea/Tip
const LightbulbIconInner = () => (
  <>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </>
);

export const LightbulbIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <LightbulbIconInner />
  </SignatureIconBase>
));

// INFO ICON - Information circle
const InfoIconInner = () => (
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </>
);

export const InfoIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <InfoIconInner />
  </SignatureIconBase>
));

// EXTERNAL LINK ICON - Open in new tab
const ExternalLinkIconInner = () => (
  <>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </>
);

export const ExternalLinkIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <ExternalLinkIconInner />
  </SignatureIconBase>
));

// CALENDAR ICON - Calendar date
const CalendarIconInner = () => (
  <>
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </>
);

export const CalendarIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <CalendarIconInner />
  </SignatureIconBase>
));

// CHECK CIRCLE ICON - Verified checkmark circle
const CheckCircleIconInner = () => (
  <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </>
);

export const CheckCircleIcon = memo<Omit<SignatureIconProps, 'children'>>((props) => (
  <SignatureIconBase {...props}>
    <CheckCircleIconInner />
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

// Challenge Premium Icons - Aliases to new unified icons
export const ProfitTarget = ProfitTargetIcon;
export const Drawdown = DrawdownIcon;
export const DailyLoss = DailyLossIcon;
export const Payout = PayoutIcon;
export const Scaling = ScalingIcon;
export const TimeLimit = TimeLimitIcon;
export const MinDays = MinDaysIcon;
export const Refund = RefundIcon;
export const Verified = VerifiedIcon;
export const Featured = FeaturedIcon;
export const NewBadge = NewBadgeIcon;
export const Freshness = FreshnessIcon;
export const MT4 = MT4Icon;
export const MT5 = MT5Icon;
export const CTrader = CTraderIcon;
export const DXTrade = DXTradeIcon;
export const TradingView = TradingViewIcon;
export const LiveAccount = LiveAccountIcon;
export const PaperTrading = PaperTradingIcon;
export const Leverage = LeverageIcon;
export const Commission = CommissionIcon;
export const Pending = PendingIcon;
export const HelpCircle = HelpCircleIcon;
export const XCircle = XCircleIcon;
export const Redirect = RedirectIcon;
export const Warning = WarningIcon;
export const Delete = DeleteIcon;
export const Lightbulb = LightbulbIcon;

// Additional useful aliases
export const Calendar = CalendarIcon;
export const CheckCircle = CheckCircleIcon;
export const ExternalLink = ExternalLinkIcon;
export const Info = InfoIcon;
export const Users = UsersIcon;
export const Trophy = TrophyIcon;
export const Target = TargetIcon;
export const Bot = BotIcon;
export const News = NewsIcon;
export const Weekend = WeekendIcon;

LightIcon.displayName = 'TradeliaLightIcon';
DarkIcon.displayName = 'TradeliaDarkIcon';
ToolsIcon.displayName = 'TradeliaToolsIcon';
CommunityIcon.displayName = 'TradeliaCommunityIcon';
ExitIcon.displayName = 'TradeliaExitIcon';

// Display names for new icons
ProfitTargetIcon.displayName = 'TradeliaProfitTargetIcon';
DrawdownIcon.displayName = 'TradeliaDrawdownIcon';
DailyLossIcon.displayName = 'TradeliaDailyLossIcon';
PayoutIcon.displayName = 'TradeliaPayoutIcon';
ScalingIcon.displayName = 'TradeliaScalingIcon';
TimeLimitIcon.displayName = 'TradeliaTimeLimitIcon';
MinDaysIcon.displayName = 'TradeliaMinDaysIcon';
RefundIcon.displayName = 'TradeliaRefundIcon';
VerifiedIcon.displayName = 'TradeliaVerifiedIcon';
FeaturedIcon.displayName = 'TradeliaFeaturedIcon';
NewBadgeIcon.displayName = 'TradeliaNewBadgeIcon';
FreshnessIcon.displayName = 'TradeliaFreshnessIcon';
MT4Icon.displayName = 'TradeliaMT4Icon';
MT5Icon.displayName = 'TradeliaMT5Icon';
CTraderIcon.displayName = 'TradeliaCTraderIcon';
DXTradeIcon.displayName = 'TradeliaDXTradeIcon';
TradingViewIcon.displayName = 'TradeliaTradingViewIcon';
TrophyIcon.displayName = 'TradeliaTrophyIcon';
TargetIcon.displayName = 'TradeliaTargetIcon';
BotIcon.displayName = 'TradeliaBotIcon';
NewsIcon.displayName = 'TradeliaNewsIcon';
WeekendIcon.displayName = 'TradeliaWeekendIcon';
LiveAccountIcon.displayName = 'TradeliaLiveAccountIcon';
PaperTradingIcon.displayName = 'TradeliaPaperTradingIcon';
LeverageIcon.displayName = 'TradeliaLeverageIcon';
CommissionIcon.displayName = 'TradeliaCommissionIcon';
UsersIcon.displayName = 'TradeliaUsersIcon';
PendingIcon.displayName = 'TradeliaPendingIcon';
HelpCircleIcon.displayName = 'TradeliaHelpCircleIcon';
PlayIcon.displayName = 'TradeliaPlayIcon';
XCircleIcon.displayName = 'TradeliaXCircleIcon';
ArchiveIcon.displayName = 'TradeliaArchiveIcon';
RedirectIcon.displayName = 'TradeliaRedirectIcon';
WarningIcon.displayName = 'TradeliaWarningIcon';
DeleteIcon.displayName = 'TradeliaDeleteIcon';
LightbulbIcon.displayName = 'TradeliaLightbulbIcon';
InfoIcon.displayName = 'TradeliaInfoIcon';
ExternalLinkIcon.displayName = 'TradeliaExternalLinkIcon';
CalendarIcon.displayName = 'TradeliaCalendarIcon';
CheckCircleIcon.displayName = 'TradeliaCheckCircleIcon';
