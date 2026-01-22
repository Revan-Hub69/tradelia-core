/*
 * BELL ICON PREMIUM - Tradelia Signature 2026
 *
 * Icona Bell con microinterazioni premium:
 * - Animazione "ring" con physics realistiche
 * - Notification badge animato
 * - Sound wave effects
 * - Haptic feedback sincronizzato
 */

'use client';

import { motion, type Variants } from 'framer-motion';
import React from 'react';

import { PremiumIconBase, type PremiumIconProps, ICON_TOKENS } from '../PremiumIconBase';

export type BellIconPremiumProps = Omit<PremiumIconProps, 'children'> & {
  hasNotifications?: boolean;
  notificationCount?: number;
  isRinging?: boolean;
};

// Animation variants
const bellVariants: Variants = {
  default: { rotate: 0, scale: 1 },
  hover: { rotate: [0, -5, 5, -3, 3, 0], scale: 1.05 },
  active: { rotate: [0, -8, 8, -5, 5, -3, 3, 0], scale: 1.1 },
  ringing: { 
    rotate: [0, -10, 10, -8, 8, -5, 5, -3, 3, 0],
    scale: [1, 1.05, 1, 1.03, 1],
  },
};

const clapperVariants: Variants = {
  default: { x: 0, rotate: 0 },
  hover: { x: [0, 1, -1, 0], rotate: [0, 5, -5, 0] },
  active: { x: [0, 2, -2, 1, -1, 0], rotate: [0, 10, -10, 5, -5, 0] },
  ringing: { 
    x: [0, 3, -3, 2, -2, 1, -1, 0],
    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
  },
};

const waveVariants: Variants = {
  default: { scale: 0, opacity: 0 },
  active: { 
    scale: [0, 1.5, 2.5],
    opacity: [0, 0.6, 0],
  },
};

export const BellIconPremium: React.FC<BellIconPremiumProps> = ({
  hasNotifications = false,
  notificationCount = 0,
  isRinging = false,
  motionLevel = 'full',
  ...props
}) => {
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Trigger ringing animation
  React.useEffect(() => {
    if (isRinging) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isRinging]);

  const currentState = isAnimating ? 'ringing' : (hasNotifications ? 'active' : 'default');

  return (
    <PremiumIconBase
      {...props}
      motionLevel={motionLevel}
      state={hasNotifications ? 'active' : 'default'}
    >
      {/* Premium SVG Filters */}
      <defs>
        <filter id="bell-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <radialGradient id="notification-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4444" />
          <stop offset="100%" stopColor="#cc0000" />
        </radialGradient>
      </defs>

      {/* Sound waves (only when ringing) */}
      {isAnimating && motionLevel === 'full' && (
        <g>
          {[1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx="12"
              cy="12"
              r={8 + (i * 3)}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0"
              variants={waveVariants}
              animate="active"
              transition={{
                duration: 1,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            />
          ))}
        </g>
      )}

      {/* Bell body */}
      <motion.path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        variants={bellVariants}
        animate={currentState}
        transition={ICON_TOKENS.springs.bouncy}
        style={{ transformOrigin: '12px 12px' }}
        filter={hasNotifications ? 'url(#bell-glow)' : undefined}
      />

      {/* Bell clapper */}
      <motion.path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        variants={clapperVariants}
        animate={currentState}
        transition={{ ...ICON_TOKENS.springs.snappy, delay: 0.05 }}
        style={{ transformOrigin: '12px 21px' }}
      />

      {/* Bell clapper ball */}
      <motion.circle
        cx="12"
        cy="15"
        r="1"
        fill="currentColor"
        variants={clapperVariants}
        animate={currentState}
        transition={{ ...ICON_TOKENS.springs.snappy, delay: 0.1 }}
        style={{ transformOrigin: '12px 15px' }}
      />

      {/* Notification badge */}
      {hasNotifications && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={ICON_TOKENS.springs.bouncy}
        >
          {/* Badge background */}
          <motion.circle
            cx="18"
            cy="6"
            r="4"
            fill="url(#notification-gradient)"
            stroke="white"
            strokeWidth="1"
            animate={isAnimating ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 0.3,
              repeat: isAnimating ? 2 : 0,
            }}
          />
          
          {/* Badge count */}
          {notificationCount > 0 && (
            <motion.text
              x="18"
              y="6.5"
              textAnchor="middle"
              fontSize="6"
              fill="white"
              fontWeight="bold"
              animate={isAnimating ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 0.3,
                repeat: isAnimating ? 2 : 0,
                delay: 0.1,
              }}
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </motion.text>
          )}
        </motion.g>
      )}

      {/* Highlight effect for premium feel */}
      <motion.path
        d="M8 8c0-2.5 1.5-4.5 4-4.5s4 2 4 4.5"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.3"
        fill="none"
        animate={hasNotifications ? {
          opacity: [0.3, 0.6, 0.3],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </PremiumIconBase>
  );
};