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

// Golden ratio and mathematical precision
const PHI = 1.618033988749;
const SIGNATURE_RADIUS = 0.618; // 1/φ for perfect curves

export const SIGNATURE_TOKENS = {
  // Mathematically precise sizes based on 8px grid + golden ratio
  sizes: {
    16: { size: 16, strokeWidth: 1.5, padding: 2 },
    20: { size: 20, strokeWidth: 1.618, padding: 2.5 }, // φ stroke
    24: { size: 24, strokeWidth: 1.75, padding: 3 },
    28: { size: 28, strokeWidth: 2, padding: 3.5 },
    32: { size: 32, strokeWidth: 2.236, padding: 4 }, // √5 stroke for harmony
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
      filter: 'blur(0px) brightness(1) saturate(1)',
    },
    hover: {
      scale: 1.05,
      opacity: 0.95,
      filter: 'blur(0px) brightness(1.1) saturate(1.1)',
      backdropFilter: 'blur(8px)',
    },
    active: {
      scale: 1.1,
      opacity: 1,
      filter: 'blur(0px) brightness(1.2) saturate(1.2)',
      backdropFilter: 'blur(12px)',
    },
    disabled: {
      scale: 1,
      opacity: 0.4,
      filter: 'blur(0.5px) brightness(0.8) saturate(0.5)',
    },
  },

  // Signature glass effects
  glass: {
    subtle: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1)) drop-shadow(0 0 8px rgba(255,255,255,0.1))',
    medium: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15)) drop-shadow(0 0 12px rgba(255,255,255,0.15))',
    strong: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2)) drop-shadow(0 0 16px rgba(255,255,255,0.2))',
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
  // Signature features
  'glassEffect'?: boolean;
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
  glassEffect = true,
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
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      className={cn(
        // Signature base styles
        'flex-shrink-0 select-none cursor-pointer',
        // Liquid glass foundation
        'transform-gpu will-change-transform',
        // Professional accessibility
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2',
        'focus-visible:ring-primary/50',
        // Variant-specific styles
        {
          'opacity-90': variant === 'minimal',
          'opacity-100 transition-all duration-200': variant === 'signature',
          'opacity-100': variant === 'premium',
        },
        // Glass effect
        glassEffect && variant !== 'minimal' && 'backdrop-blur-sm',
        className,
      )}
      style={{
        filter: glassEffect && variant !== 'minimal'
          ? SIGNATURE_TOKENS.glass.subtle
          : undefined,
        borderRadius: `${SIGNATURE_RADIUS}px`,
      }}
      // Liquid glass animations
      animate={shouldAnimate ? SIGNATURE_TOKENS.states[state] : undefined}
      transition={SIGNATURE_TOKENS.transitions.liquid}
      whileHover={shouldAnimate ? SIGNATURE_TOKENS.states.hover : undefined}
      whileTap={shouldAnimate
        ? {
            scale: 0.95,
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
  showDetails = true,
  ...props
}) => (
  <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
    {/* Architectural foundation - golden ratio proportions */}
    <path
      d="M3 12l9-9 9 9"
      strokeWidth={isActive ? 2.5 : undefined}
      opacity={isActive ? 1 : 0.9}
      style={{
        filter: isActive ? SIGNATURE_TOKENS.glass.medium : undefined,
      }}
    />

    {/* Main structure with liquid glass effect */}
    <path
      d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
      strokeWidth={isActive ? 2.5 : undefined}
      opacity={isActive ? 1 : 0.9}
      style={{
        filter: isActive ? SIGNATURE_TOKENS.glass.medium : undefined,
      }}
    />

    {/* Door with perfect proportions (φ ratio) */}
    <rect
      x="9.5"
      y="15.5"
      width="5"
      height={5 * PHI}
      rx={SIGNATURE_RADIUS}
      strokeWidth="1.618"
      opacity="0.85"
    />

    {/* Signature details - only when meaningful */}
    {showDetails && props.variant !== 'minimal' && (
      <>
        {/* Windows with mathematical spacing */}
        <rect
          x="6.5"
          y="13.5"
          width="1.618"
          height="1.618"
          rx={SIGNATURE_RADIUS * 0.5}
          strokeWidth="1"
          opacity="0.7"
        />
        <rect
          x="15.882"
          y="13.5"
          width="1.618"
          height="1.618"
          rx={SIGNATURE_RADIUS * 0.5}
          strokeWidth="1"
          opacity="0.7"
        />

        {/* Door handle - subtle but professional */}
        <circle
          cx="13.5"
          cy="18"
          r="0.309"
          fill="currentColor"
          opacity="0.8"
          style={{
            filter: isActive ? SIGNATURE_TOKENS.glass.subtle : undefined,
          }}
        />
      </>
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
        strokeWidth={hasNotifications ? 2.5 : 2}
        opacity={hasNotifications ? 1 : 0.9}
        animate={isRinging
          ? {
              rotate: [0, -3, 3, -2, 2, -1, 1, 0],
              transition: { duration: 0.6, ease: 'easeInOut' },
            }
          : {}}
        style={{
          filter: hasNotifications ? SIGNATURE_TOKENS.glass.medium : SIGNATURE_TOKENS.glass.subtle,
          transformOrigin: '12px 8px',
        }}
      />

      {/* Bell clapper */}
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        strokeWidth="1.618"
        opacity="0.8"
      />

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
            style={{
              filter: SIGNATURE_TOKENS.glass.strong,
            }}
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
    { x1: 12, y1: 1, x2: 12, y2: 3, angle: 0 },
    { x1: 21, y1: 12, x2: 19, y2: 12, angle: 90 },
    { x1: 12, y1: 23, x2: 12, y2: 21, angle: 180 },
    { x1: 3, y1: 12, x2: 5, y2: 12, angle: 270 },
    { x1: 18.364, y1: 5.636, x2: 17.071, y2: 6.929, angle: 45 },
    { x1: 18.364, y1: 18.364, x2: 17.071, y2: 17.071, angle: 135 },
    { x1: 5.636, y1: 18.364, x2: 6.929, y2: 17.071, angle: 225 },
    { x1: 5.636, y1: 5.636, x2: 6.929, y2: 6.929, angle: 315 },
  ], []);

  const intensityMap = {
    low: { opacity: 0.6, glow: SIGNATURE_TOKENS.glass.subtle },
    medium: { opacity: 0.8, glow: SIGNATURE_TOKENS.glass.medium },
    high: { opacity: 1, glow: SIGNATURE_TOKENS.glass.strong },
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
          strokeWidth={isActive ? 2.5 : 2}
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
          style={{
            filter: isActive ? currentIntensity.glow : undefined,
            transformOrigin: '12px 12px',
          }}
        />
      ))}

      {/* Solar core with liquid glass */}
      <motion.circle
        cx="12"
        cy="12"
        r="4"
        strokeWidth={isActive ? 2.5 : 2}
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
        style={{
          filter: isActive ? currentIntensity.glow : SIGNATURE_TOKENS.glass.subtle,
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
          style={{
            filter: SIGNATURE_TOKENS.glass.subtle,
          }}
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
  showStars = true,
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
    { x: 6, y: 4, size: 0.4, delay: 0 },
    { x: 18.5, y: 6.5, size: 0.3, delay: 0.5 },
    { x: 20, y: 16, size: 0.35, delay: 1 },
    { x: 4.5, y: 18.5, size: 0.25, delay: 1.5 },
  ], []);

  return (
    <SignatureIconBase {...props} state={isActive ? 'active' : props.state}>
      {/* Lunar body with phase-accurate geometry */}
      <motion.path
        d={getMoonPath()}
        strokeWidth={isActive ? 2.5 : 2}
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
        style={{
          filter: isActive ? SIGNATURE_TOKENS.glass.medium : SIGNATURE_TOKENS.glass.subtle,
        }}
      />

      {/* Lunar surface details for premium */}
      {props.variant === 'premium' && isActive && (
        <>
          {/* Craters with mathematical positioning */}
          <circle
            cx="10"
            cy="8"
            r="1"
            strokeWidth="0.8"
            opacity="0.3"
            style={{ filter: SIGNATURE_TOKENS.glass.subtle }}
          />
          <circle
            cx="14"
            cy="14"
            r="0.7"
            strokeWidth="0.8"
            opacity="0.25"
            style={{ filter: SIGNATURE_TOKENS.glass.subtle }}
          />
        </>
      )}

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
                style={{ filter: SIGNATURE_TOKENS.glass.subtle }}
              />
              {/* Star sparkle lines */}
              <line
                x1={star.x - star.size * 2}
                y1={star.y}
                x2={star.x + star.size * 2}
                y2={star.y}
                strokeWidth="0.3"
                opacity="0.4"
              />
              <line
                x1={star.x}
                y1={star.y - star.size * 2}
                x2={star.x}
                y2={star.y + star.size * 2}
                strokeWidth="0.3"
                opacity="0.4"
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
    <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24 4.24M6.74 17.26L2.5 21.5m15-15l-4.24 4.24M6.74 6.74L2.5 2.5" />
  </SignatureIconBase>
));

// Display names for professional debugging
MenuIcon.displayName = 'TradeliaSignatureMenuIcon';
CloseIcon.displayName = 'TradeliaSignatureCloseIcon';
ChevronDownIcon.displayName = 'TradeliaSignatureChevronDownIcon';
SettingsIcon.displayName = 'TradeliaSignatureSettingsIcon';
