/*
 * TOOLS ICON - Tradelia Signature Premium SVG
 *
 * Design: Wrench + screwdriver with signature animations
 * Optical weight: Bilanciato per 24px navigation
 * Animation: Tools cross and rotate
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + smooth transitions
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type ToolsIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const ToolsIcon: React.FC<ToolsIconProps> = ({
  isActive = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Premium glow filter
  const glowId = `tools-glow-${React.useId()}`;

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
        {/* Wrench */}
        <motion.g
          animate={
            isActive && effectiveMotion === 'full'
              ? { rotate: [0, -5, 5, 0] }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          style={{ transformOrigin: '8px 16px' }}
        >
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      </g>
    </IconBase>
  );
};
