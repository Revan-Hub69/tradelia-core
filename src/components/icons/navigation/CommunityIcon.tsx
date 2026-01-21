/*
 * COMMUNITY ICON - Tradelia Signature Premium SVG
 *
 * Design: Group of people with signature animations
 * Optical weight: Bilanciato per 24px navigation
 * Animation: Group pulse + individual avatar bounce
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + smooth transitions
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type CommunityIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const CommunityIcon: React.FC<CommunityIconProps> = ({
  isActive = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Premium glow filter
  const glowId = `community-glow-${React.useId()}`;

  return (
    <IconBase {...props}>
      <defs>
        {/* Premium glow effect */}
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={isActive && effectiveMotion !== 'none' ? `url(#${glowId})` : undefined}>
        {/* Center person (larger) */}
        <motion.g
          animate={
            isActive && effectiveMotion === 'full'
              ? { scale: [1, 1.05, 1], y: [0, -1, 0] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        >
          <circle cx="12" cy="10" r="3" strokeWidth="2" fill="none" />
          <path
            d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Left person (smaller) */}
        <motion.g
          animate={
            isActive && effectiveMotion === 'full'
              ? { scale: [1, 1.05, 1], y: [0, -1, 0] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
            delay: 0.2,
          }}
        >
          <circle cx="5" cy="8" r="2" strokeWidth="2" fill="none" />
          <path
            d="M2 18c0-1.657 1.343-3 3-3 .768 0 1.47.289 2 .764"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>

        {/* Right person (smaller) */}
        <motion.g
          animate={
            isActive && effectiveMotion === 'full'
              ? { scale: [1, 1.05, 1], y: [0, -1, 0] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5,
            delay: 0.4,
          }}
        >
          <circle cx="19" cy="8" r="2" strokeWidth="2" fill="none" />
          <path
            d="M17 15.236A2.993 2.993 0 0 1 19 15c1.657 0 3 1.343 3 3"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>
      </g>
    </IconBase>
  );
};
