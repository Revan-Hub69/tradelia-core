/*
 * TRADELIA SIGNATURE ICON SYSTEM 2026
 *
 * Sistema di icone signature basato su ricerche approfondite delle best practices 2026:
 * - Apple iOS 26 "Liquid Glass" aesthetic (translucent, glass-inspired)
 * - Linear's professional minimalism
 * - Microinterazioni meaningful, not decorative
 * - Single focal point, clarity, consistency
 *
 * SIGNATURE ELEMENTS:
 * - Liquid glass morphism with subtle translucency
 * - Mathematical precision (golden ratio, perfect geometry)
 * - Contextual microinteractions (only when meaningful)
 * - Professional memorability
 * - Innovation through restraint
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React, { memo, useCallback } from 'react';

import { cn } from '@/utils/Helpers';

// ============================================================================
// SIGNATURE DESIGN TOKENS 2026
// ============================================================================

export type IconSize = 16 | 20 | 24 | 28 | 32;
export type IconVariant = 'minimal' | 'signature' | 'premium';
export type IconState = 'default' | 'hover' | 'active' | 'disabled';

export const SIGNATURE_TOKENS = {
  // Mathematically precise sizes based on 8px grid + golden ratio
  sizes: {
    16: { size: 16, strokeWidth: 1.5, padding: 2 },
    20: { size: 20, strokeWidth: 1.75, padding: 2.5 },
    24: { size: 24, strokeWidth: 2, padding: 3 },
    28: { size: 28, strokeWidth: 2, padding: 3.5 },
    32: { size: 32, strokeWidth: 2.25, padding: 4 },
  },

  // Liquid glass transitions (inspired by iOS 26)
  transitions: {
    liquid: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94], // Apple's signature easing
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
    glass: {
      duration: 0.2,
      ease: [0.4, 0, 0.2, 1], // Material Design 3 emphasis
    },
  },

  // Signature states with liquid glass morphism
  states: {
    default: {
      scale: 1,
      opacity: 1,
    },
    hover: {
      scale: 1.02,
      opacity: 0.96,
    },
    active: {
      scale: 1.04,
      opacity: 1,
    },
    disabled: {
      scale: 1,
      opacity: 0.4,
    },
  },
} as const;

// ============================================================================
// SIGNATURE ICON BASE - LIQUID GLASS FOUNDATION
// ============================================================================

export type SignatureIconProps = {
  'size'?: IconSize;
  'variant'?: IconVariant;
  'state'?: IconState;
  'className'?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  'children': React.ReactNode;
  // Contextual interactions (only when meaningful)
  'onHover'?: () => void;
  'onPress'?: () => void;
  'contextualAnimation'?: boolean;
};

export const SignatureIconBase = memo<SignatureIconProps>(({
  size = 20,
  variant = 'signature',
  state = 'default',
  className,
  'aria-hidden': ariaHidden = true,
  'aria-label': ariaLabel,
  children,
  onHover,
  onPress,
  contextualAnimation = true,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const sizeToken = SIGNATURE_TOKENS.sizes[size];

  // Contextual animations only when meaningful
  const shouldAnimate = !prefersReducedMotion && contextualAnimation && variant !== 'minimal';

  // Haptic feedback for meaningful interactions
  const handlePress = useCallback(() => {
    if ('vibrate' in navigator && contextualAnimation) {
      navigator.vibrate(25); // Subtle haptic
    }
    onPress?.();
  }, [onPress, contextualAnimation]);

  return (
    <motion.svg
      width={sizeToken.size}
      height={sizeToken.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sizeToken.strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      shapeRendering="geometricPrecision"
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cn(
        // Signature base styles
        'flex-shrink-0 select-none',
        // Liquid glass foundation
        'transform-gpu will-change-transform',
        // Variant-specific styles
        {
          'opacity-90': variant === 'minimal',
          'opacity-100 transition-all duration-200': variant === 'signature',
          'opacity-100': variant === 'premium',
        },
        className,
      )}
      // Liquid glass animations
      animate={shouldAnimate ? SIGNATURE_TOKENS.states[state] : undefined}
      transition={SIGNATURE_TOKENS.transitions.liquid}
      whileHover={shouldAnimate ? SIGNATURE_TOKENS.states.hover : undefined}
      whileTap={shouldAnimate
        ? {
            scale: 0.98,
            transition: SIGNATURE_TOKENS.transitions.glass,
          }
        : undefined}
      // Contextual event handlers
      onHoverStart={onHover}
      onTapStart={handlePress}
    >
      {children}
    </motion.svg>
  );
});

SignatureIconBase.displayName = 'SignatureIconBase';

// ============================================================================
// SIGNATURE ICONS 2026 - MEMORABLE, PROFESSIONAL, INNOVATIVE
// ============================================================================

// HOME ICON - Architectural precision with liquid glass
export const HomeIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  showDetails?: boolean;
}>(({
  isActive = false,
  showDetails = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Architectural foundation */}
    <path
      d="M3 12l9-9 9 9"
      opacity={isActive ? 1 : 0.9}
    />

    {/* Main structure */}
    <path
      d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
      opacity={isActive ? 1 : 0.9}
    />

    {showDetails && props.variant !== 'minimal' && (
      <rect
        x="9"
        y="14"
        width="6"
        height="7"
        rx="1"
        opacity={isActive ? 0.9 : 0.7}
      />
    )}
  </SignatureIconBase>
));

// BELL ICON - Notification excellence with contextual animation
export const BellIcon = memo<Omit<SignatureIconProps, 'children'> & {
  hasNotifications?: boolean;
  notificationCount?: number;
  ringOnHover?: boolean;
}>(({
  hasNotifications = false,
  notificationCount = 0,
  ringOnHover = true,
  ...props
}) => {
  const [isRinging, setIsRinging] = React.useState(false);

  const handleRing = useCallback(() => {
    if (ringOnHover && hasNotifications) {
      setIsRinging(true);
      setTimeout(() => setIsRinging(false), 600);
    }
  }, [ringOnHover, hasNotifications]);

  return (
    <SignatureIconBase
      {...props}
      state={hasNotifications ? 'active' : props.state}
      onHover={handleRing}
      contextualAnimation={ringOnHover}
    >
      {/* Bell body with liquid glass morphism */}
      <motion.path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        opacity={hasNotifications ? 1 : 0.9}
        animate={isRinging
          ? {
              rotate: [0, -3, 3, -2, 2, -1, 1, 0],
              transition: { duration: 0.6, ease: 'easeInOut' },
            }
          : {}}
        style={{
          transformOrigin: '12px 8px',
        }}
      />

      {/* Bell clapper */}
      <path d="M14 21a2 2 0 0 1-4 0" opacity="0.8" />

      {/* Signature notification badge - mathematically positioned */}
      {hasNotifications && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SIGNATURE_TOKENS.transitions.liquid}
        >
          <circle
            cx="18.5"
            cy="5.5"
            r="4"
            fill="hsl(var(--destructive))"
            stroke="hsl(var(--background))"
            strokeWidth="2"
          />

          {notificationCount > 0 && (
            <text
              x="18.5"
              y="6"
              textAnchor="middle"
              fontSize="5.5"
              fill="hsl(var(--destructive-foreground))"
              fontWeight="700"
              fontFamily="system-ui, -apple-system"
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </text>
          )}
        </motion.g>
      )}
    </SignatureIconBase>
  );
});

// SUN ICON - Solar precision with signature glow
export const SunIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}>(({
  isActive = false,
  intensity = 'medium',
  ...props
}) => {
  // Perfect 8-ray symmetry (45° intervals)
  const rayPositions = React.useMemo(() => [
    { x1: 12, y1: 2, x2: 12, y2: 4, angle: 0 },
    { x1: 20, y1: 12, x2: 22, y2: 12, angle: 90 },
    { x1: 12, y1: 20, x2: 12, y2: 22, angle: 180 },
    { x1: 2, y1: 12, x2: 4, y2: 12, angle: 270 },
    { x1: 16.5, y1: 7.5, x2: 18, y2: 6, angle: 45 },
    { x1: 16.5, y1: 16.5, x2: 18, y2: 18, angle: 135 },
    { x1: 7.5, y1: 16.5, x2: 6, y2: 18, angle: 225 },
    { x1: 7.5, y1: 7.5, x2: 6, y2: 6, angle: 315 },
  ], []);

  const intensityMap = {
    low: { opacity: 0.6 },
    medium: { opacity: 0.8 },
    high: { opacity: 1 },
  };

  const currentIntensity = intensityMap[intensity];

  return (
    <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
      {/* Solar rays with staggered animation */}
      {rayPositions.map((ray, index) => (
        <motion.line
          key={`ray-${index}`}
          x1={ray.x1}
          y1={ray.y1}
          x2={ray.x2}
          y2={ray.y2}
          strokeLinecap="round"
          opacity={isActive ? currentIntensity.opacity : 0.7}
          animate={isActive && props.variant === 'premium'
            ? {
                opacity: [0.7, currentIntensity.opacity, 0.7],
                scale: [1, 1.05, 1],
              }
            : {}}
          transition={{
            duration: 2,
            delay: index * 0.1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '12px 12px' }}
        />
      ))}

      {/* Solar core with liquid glass */}
      <motion.circle
        cx="12"
        cy="12"
        r="4"
        opacity={isActive ? 1 : 0.9}
        animate={isActive
          ? {
              scale: [1, 1.02, 1],
            }
          : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner core for premium variant */}
      {props.variant === 'premium' && (
        <circle
          cx="12"
          cy="12"
          r="2.5"
          strokeWidth="1"
          opacity="0.4"
        />
      )}
    </SignatureIconBase>
  );
});

// MOON ICON - Lunar poetry with signature elegance
export const MoonIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
  phase?: 'new' | 'crescent' | 'half' | 'gibbous' | 'full';
  showStars?: boolean;
}>(({
  isActive = false,
  phase = 'crescent',
  showStars = false,
  ...props
}) => {
  const getMoonPath = useCallback(() => {
    switch (phase) {
      case 'new':
        return 'M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20z';
      case 'crescent':
        return 'M12 2a10 10 0 0 0 0 20 8 8 0 0 1 0-16 8 8 0 0 1 0-4z';
      case 'half':
        return 'M12 2a10 10 0 0 1 0 20z';
      case 'gibbous':
        return 'M12 2a10 10 0 0 1 0 20 6 6 0 0 0 0-12 6 6 0 0 0 0-8z';
      case 'full':
        return 'M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z';
      default:
        return 'M12 2a10 10 0 0 0 0 20 8 8 0 0 1 0-16 8 8 0 0 1 0-4z';
    }
  }, [phase]);

  // Signature star positions (golden ratio spacing)
  const starPositions = React.useMemo(() => [
    { x: 6.5, y: 5, size: 0.5, delay: 0 },
    { x: 17.5, y: 7, size: 0.5, delay: 0.5 },
    { x: 19, y: 16, size: 0.5, delay: 1 },
    { x: 5, y: 18, size: 0.5, delay: 1.5 },
  ], []);

  return (
    <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
      {/* Lunar body with phase-accurate geometry */}
      <motion.path
        d={getMoonPath()}
        opacity={isActive ? 1 : 0.9}
        animate={isActive
          ? {
              opacity: [0.9, 1, 0.9],
            }
          : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Signature stars with contextual sparkle */}
      {showStars && isActive && props.variant !== 'minimal' && (
        <>
          {starPositions.map((star, index) => (
            <motion.g
              key={`star-${index}`}
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                delay: star.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <circle
                cx={star.x}
                cy={star.y}
                r={star.size}
                fill="currentColor"
                opacity="0.6"
              />
            </motion.g>
          ))}
        </>
      )}
    </SignatureIconBase>
  );
});

// MENU ICON - Hamburger menu with signature animation
export const MenuIcon = memo<Omit<SignatureIconProps, 'children'> & { 
  isOpen?: boolean;
}>(({
  isOpen = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    {/* Top line */}
    <motion.line
      x1="3"
      y1="6"
      x2="21"
      y2="6"
      animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
      transition={SIGNATURE_TOKENS.transitions.liquid}
      style={{ transformOrigin: '12px 12px' }}
    />
    
    {/* Middle line */}
    <motion.line
      x1="3"
      y1="12"
      x2="21"
      y2="12"
      animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
      transition={SIGNATURE_TOKENS.transitions.glass}
    />
    
    {/* Bottom line */}
    <motion.line
      x1="3"
      y1="18"
      x2="21"
      y2="18"
      animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
      transition={SIGNATURE_TOKENS.transitions.liquid}
      style={{ transformOrigin: '12px 12px' }}
    />
  </SignatureIconBase>
));

// CLOSE ICON - X with signature animation
export const CloseIcon = memo<Omit<SignatureIconProps, 'children'>>(({
  ...props
}) => (
  <SignatureIconBase {...props}>
    <motion.line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    />
    <motion.line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
    />
  </SignatureIconBase>
));

// CHEVRON DOWN ICON - Directional with signature animation
export const ChevronDownIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isOpen?: boolean;
}>(({
  isOpen = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isOpen ? 'active' : props.state}>
    <motion.polyline
      points="6,9 12,15 18,9"
      animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
      transition={SIGNATURE_TOKENS.transitions.liquid}
      style={{ transformOrigin: '12px 12px' }}
    />
  </SignatureIconBase>
));

// SETTINGS ICON - Gear with signature precision
export const SettingsIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Outer gear */}
    <motion.circle
      cx="12"
      cy="12"
      r="3"
      animate={isActive ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
      style={{ transformOrigin: '12px 12px' }}
    />
    
    {/* Gear teeth */}
    <path d="M12 2v3m0 14v3M19 12h3M2 12h3M16.5 7.5l2-2M5.5 16.5l-2 2M16.5 16.5l2 2M5.5 7.5l-2-2" />
  </SignatureIconBase>
));

// LEARN ICON - Open book with signature clarity
export const LearnIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path
      d="M4 6h6a3 3 0 0 1 3 3v11a3 3 0 0 0-3-3H4z"
      opacity={isActive ? 1 : 0.9}
    />
    <path
      d="M20 6h-6a3 3 0 0 0-3 3v11a3 3 0 0 1 3-3h6z"
      opacity={isActive ? 1 : 0.9}
    />
    <line
      x1="12"
      y1="9"
      x2="12"
      y2="18"
      opacity={isActive ? 0.8 : 0.6}
    />
  </SignatureIconBase>
));

// TOOLS ICON - Wrench silhouette for utilities
export const ToolsIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path
      d="M14.5 6.5a3.5 3.5 0 0 0-5 5l-6 6a2 2 0 0 0 3 3l6-6a3.5 3.5 0 0 0 5-5l-2 2-3-3z"
      opacity={isActive ? 1 : 0.9}
    />
  </SignatureIconBase>
));

// COMMUNITY ICON - People group for social areas
export const CommunityIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <circle
      cx="9"
      cy="8"
      r="3"
      opacity={isActive ? 1 : 0.85}
    />
    <circle
      cx="17"
      cy="10"
      r="2.5"
      opacity={isActive ? 1 : 0.8}
    />
    <path
      d="M3.5 19a5.5 5.5 0 0 1 11 0"
      opacity={isActive ? 1 : 0.9}
    />
    <path
      d="M13.5 19a4.5 4.5 0 0 1 9 0"
      opacity={isActive ? 0.9 : 0.7}
    />
  </SignatureIconBase>
));

// PROFILE ICON - User silhouette
export const ProfileIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <circle
      cx="12"
      cy="8"
      r="3.5"
      opacity={isActive ? 1 : 0.9}
    />
    <path
      d="M4 20a8 8 0 0 1 16 0"
      opacity={isActive ? 1 : 0.85}
    />
  </SignatureIconBase>
));

// GLOBE ICON - Language and internationalization
export const GlobeIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <circle
      cx="12"
      cy="12"
      r="9"
      opacity={isActive ? 1 : 0.9}
    />
    <path d="M3 12h18" opacity={isActive ? 0.9 : 0.7} />
    <path d="M4.5 8.5h15" opacity={isActive ? 0.7 : 0.5} />
    <path d="M4.5 15.5h15" opacity={isActive ? 0.7 : 0.5} />
    <path
      d="M12 3c-2.5 2-4 5.5-4 9s1.5 7 4 9"
      opacity={isActive ? 0.9 : 0.7}
    />
    <path
      d="M12 3c2.5 2 4 5.5 4 9s-1.5 7-4 9"
      opacity={isActive ? 0.9 : 0.7}
    />
  </SignatureIconBase>
));

// LOCK ICON - Security access
export const LockIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <rect
      x="5"
      y="11"
      width="14"
      height="9"
      rx="2"
      opacity={isActive ? 1 : 0.9}
    />
    <path
      d="M8 11V8a4 4 0 1 1 8 0v3"
      opacity={isActive ? 1 : 0.85}
    />
  </SignatureIconBase>
));

// LOGOUT ICON - Sign out action
export const LogoutIcon = memo<Omit<SignatureIconProps, 'children'> & {
  isActive?: boolean;
}>(({
  isActive = false,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    <path
      d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"
      opacity={isActive ? 1 : 0.85}
    />
    <path d="M10 12H4" opacity={isActive ? 1 : 0.9} />
    <path d="M7 9l-3 3 3 3" opacity={isActive ? 1 : 0.9} />
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
    <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" opacity={isActive ? 1 : 0.7} />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" opacity={isActive ? 1 : 0.8} />
    <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" opacity={isActive ? 1 : 0.7} />
  </SignatureIconBase>
));

// Display names for professional debugging
MenuIcon.displayName = 'TradeliaSignatureMenuIcon';
CloseIcon.displayName = 'TradeliaSignatureCloseIcon';
ChevronDownIcon.displayName = 'TradeliaSignatureChevronDownIcon';
SettingsIcon.displayName = 'TradeliaSignatureSettingsIcon';
LearnIcon.displayName = 'TradeliaSignatureLearnIcon';
ToolsIcon.displayName = 'TradeliaSignatureToolsIcon';
CommunityIcon.displayName = 'TradeliaSignatureCommunityIcon';
ProfileIcon.displayName = 'TradeliaSignatureProfileIcon';
GlobeIcon.displayName = 'TradeliaSignatureGlobeIcon';
LockIcon.displayName = 'TradeliaSignatureLockIcon';
LogoutIcon.displayName = 'TradeliaSignatureLogoutIcon';
MoreVerticalIcon.displayName = 'TradeliaSignatureMoreVerticalIcon';
