/*
 * LOGOUT ICON - Tradelia Signature Premium SVG (Exit/Sign Out)
 *
 * Design: Porta con freccia elegante + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Door slides and arrow moves on hover
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + smooth transitions
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type LogoutIconProps = IconBaseProps & {
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const LogoutIcon: React.FC<LogoutIconProps> = ({
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Animation variants based on motion preference
  const getDoorVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        initial: { x: 0 },
        hover: { x: 0 },
      };
    }
    if (effectiveMotion === 'reduced') {
      return {
        initial: { x: 0 },
        hover: { x: -2 },
      };
    }
    return {
      initial: { x: 0 },
      hover: { x: -3 },
    };
  };

  const getArrowVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        initial: { x: 0 },
        hover: { x: 0 },
      };
    }
    if (effectiveMotion === 'reduced') {
      return {
        initial: { x: 0 },
        hover: { x: 2 },
      };
    }
    return {
      initial: { x: 0 },
      hover: { x: 3 },
    };
  };

  const doorVariants = getDoorVariants();
  const arrowVariants = getArrowVariants();

  const transition
    = effectiveMotion === 'none'
      ? { duration: 0 }
      : effectiveMotion === 'reduced'
        ? { duration: 0.15 }
        : { duration: 0.2 };

  return (
    <IconBase {...props}>
      <g>
        {/* Door frame (static) */}
        <path
          d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Door (slides left on hover) */}
        <motion.g
          variants={doorVariants}
          initial="initial"
          whileHover="hover"
          transition={transition}
        >
          <line
            x1="9"
            x2="9"
            y1="3"
            y2="21"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>

        {/* Arrow (moves right on hover) */}
        <motion.g
          variants={arrowVariants}
          initial="initial"
          whileHover="hover"
          transition={transition}
        >
          {/* Arrow line */}
          <line
            x1="16"
            x2="21"
            y1="12"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Arrow head */}
          <polyline
            points="18 9 21 12 18 15"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </g>
    </IconBase>
  );
};
