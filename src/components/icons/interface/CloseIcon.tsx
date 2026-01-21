/*
 * CLOSE ICON - Tradelia Signature Premium SVG (X Close Button)
 *
 * Design: X elegante con signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Rotate and scale on hover
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + smooth transitions
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type CloseIconProps = IconBaseProps & {
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const CloseIcon: React.FC<CloseIconProps> = ({
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Animation variants based on motion preference
  const getVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        initial: { rotate: 0, scale: 1 },
        hover: { rotate: 0, scale: 1 },
      };
    }
    if (effectiveMotion === 'reduced') {
      return {
        initial: { rotate: 0, scale: 1 },
        hover: { scale: 1.05 },
      };
    }
    return {
      initial: { rotate: 0, scale: 1 },
      hover: { rotate: 90, scale: 1.1 },
    };
  };

  const variants = getVariants();
  const transition
    = effectiveMotion === 'none'
      ? { duration: 0 }
      : effectiveMotion === 'reduced'
        ? { duration: 0.15 }
        : { duration: 0.2 };

  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        whileHover="hover"
        transition={transition}
        style={{ transformOrigin: 'center' }}
      >
        {/* First line (top-left to bottom-right) */}
        <line
          x1="18"
          x2="6"
          y1="6"
          y2="18"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Second line (top-right to bottom-left) */}
        <line
          x1="6"
          x2="18"
          y1="6"
          y2="18"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.g>
    </IconBase>
  );
};
