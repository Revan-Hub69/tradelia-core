/*
 * SUN ICON PREMIUM - Tradelia Signature 2026
 *
 * Icona Sun con microinterazioni premium:
 * - Rotazione fluida con spring physics
 * - Raggi animati con stagger effect
 * - Glow dinamico basato su stato
 * - Pulsazione del core solare
 */

'use client';

import React from 'react';
import { motion, type Variants } from 'framer-motion';

import { PremiumIconBase, type PremiumIconProps, ICON_TOKENS } from '../PremiumIconBase';

export type SunIconPremiumProps = Omit<PremiumIconProps, 'children'> & {
  isActive?: boolean;
  intensity?: 'low' | 'medium' | 'high';
};

// Animation variants
const sunVariants: Variants = {
  default: { rotate: 0, scale: 1 },
  hover: { rotate: 15, scale: 1.05 },
  active: { rotate: 180, scale: 1.1 },
};

const coreVariants: Variants = {
  default: { scale: 1, opacity: 0.9 },
  hover: { scale: 1.1, opacity: 1 },
  active: { scale: 1.2, opacity: 1 },
};

const rayVariants: Variants = {
  default: { scale: 1, opacity: 0.7 },
  hover: { scale: 1.1, opacity: 0.9 },
  active: { scale: 1.2, opacity: 1 },
};

export const SunIconPremium: React.FC<SunIconPremiumProps> = ({
  isActive = false,
  intensity = 'medium',
  motionLevel = 'full',
  ...props
}) => {
  const currentState = isActive ? 'active' : 'default';
  
  // Ray positions (8 rays at 45° intervals)
  const rayPositions = [
    { x1: 12, y1: 1, x2: 12, y2: 3, angle: 0 },
    { x1: 21, y1: 12, x2: 19, y2: 12, angle: 90 },
    { x1: 12, y1: 23, x2: 12, y2: 21, angle: 180 },
    { x1: 3, y1: 12, x2: 5, y2: 12, angle: 270 },
    { x1: 18.36, y1: 5.64, x2: 17.07, y2: 6.93, angle: 45 },
    { x1: 18.36, y1: 18.36, x2: 17.07, y2: 17.07, angle: 135 },
    { x1: 5.64, y1: 18.36, x2: 6.93, y2: 17.07, angle: 225 },
    { x1: 5.64, y1: 5.64, x2: 6.93, y2: 6.93, angle: 315 },
  ];

  const getIntensityValues = () => {
    switch (intensity) {
      case 'low':
        return { glowRadius: 1, pulseScale: [1, 1.05, 1], pulseDuration: 3 };
      case 'high':
        return { glowRadius: 3, pulseScale: [1, 1.15, 1], pulseDuration: 1.5 };
      default:
        return { glowRadius: 2, pulseScale: [1, 1.1, 1], pulseDuration: 2 };
    }
  };

  const { glowRadius, pulseScale, pulseDuration } = getIntensityValues();

  return (
    <PremiumIconBase
      {...props}
      motionLevel={motionLevel}
      state={currentState}
    >
      {/* Premium SVG Filters */}
      <defs>
        <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={glowRadius} result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </radialGradient>
      </defs>

      {/* Rotating container for rays */}
      <motion.g
        variants={sunVariants}
        animate={currentState}
        transition={ICON_TOKENS.springs.gentle}
        style={{ transformOrigin: '12px 12px' }}
      >
        {/* Sun rays with stagger animation */}
        {rayPositions.map((ray, index) => (
          <motion.line
            key={index}
            x1={ray.x1}
            y1={ray.y1}
            x2={ray.x2}
            y2={ray.y2}
            strokeWidth="2"
            strokeLinecap="round"
            variants={rayVariants}
            animate={motionLevel === 'full' 
              ? {
                  ...rayVariants[currentState] as object,
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.1, 1],
                }
              : currentState}
            transition={{
              ...ICON_TOKENS.springs.gentle,
              delay: index * 0.05,
              repeat: motionLevel === 'full' ? Infinity : 0,
              repeatType: 'reverse',
              duration: pulseDuration,
            }}
            style={{ transformOrigin: '12px 12px' }}
          />
        ))}
      </motion.g>

      {/* Sun core with pulsing animation */}
      <motion.circle
        cx="12"
        cy="12"
        r="4"
        fill="url(#sun-gradient)"
        stroke="currentColor"
        strokeWidth="1.5"
        variants={coreVariants}
        animate={motionLevel === 'full' 
          ? {
              ...coreVariants[currentState] as object,
              scale: pulseScale,
            }
          : currentState}
        transition={{
          ...ICON_TOKENS.springs.gentle,
          repeat: motionLevel === 'full' ? Infinity : 0,
          repeatType: 'reverse',
          duration: pulseDuration,
        }}
        filter={isActive ? 'url(#sun-glow)' : undefined}
      />

      {/* Inner core highlight */}
      <motion.circle
        cx="10"
        cy="10"
        r="1.5"
        fill="currentColor"
        opacity="0.4"
        animate={motionLevel === 'full' 
          ? {
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.2, 1],
            }
          : {}}
        transition={{
          duration: pulseDuration * 0.8,
          repeat: motionLevel === 'full' ? Infinity : 0,
          repeatType: 'reverse',
          delay: 0.2,
        }}
      />

      {/* Heat waves effect (only when active and full motion) */}
      {isActive && motionLevel === 'full' && (
        <motion.g opacity="0.3">
          {[1, 2, 3].map((i) => (
            <motion.circle
              key={i}
              cx="12"
              cy="12"
              r={6 + (i * 2)}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.g>
      )}
    </PremiumIconBase>
  );
};