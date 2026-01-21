/*
 * SETTINGS ICON - Tradelia Signature Premium SVG
 *
 * Design: Gear with signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Continuous rotation on active
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + smooth transitions
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type SettingsIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const SettingsIcon: React.FC<SettingsIconProps> = ({
  isActive = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Premium glow filter
  const glowId = `settings-glow-${React.useId()}`;

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

      <motion.g
        animate={
          isActive && effectiveMotion === 'full'
            ? { rotate: 360 }
            : {}
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformOrigin: 'center' }}
        filter={isActive && effectiveMotion !== 'none' ? `url(#${glowId})` : undefined}
      >
        {/* Gear outer ring */}
        <path
          d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </motion.g>
    </IconBase>
  );
};
