/*
 * MENU ICON - Tradelia Signature Premium SVG (Hamburger Menu)
 *
 * Design: Hamburger menu elegante con signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Bars slide and rotate on toggle
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + smooth transitions
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type MenuIconProps = IconBaseProps & {
  isOpen?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const MenuIcon: React.FC<MenuIconProps> = ({
  isOpen = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Animation variants based on motion preference
  const getTopBarVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        closed: { rotate: 0, y: 0 },
        open: { rotate: 45, y: 6 },
      };
    }
    return {
      closed: { rotate: 0, y: 0 },
      open: { rotate: 45, y: 6 },
    };
  };

  const getMiddleBarVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        closed: { opacity: 1 },
        open: { opacity: 0 },
      };
    }
    return {
      closed: { opacity: 1 },
      open: { opacity: 0 },
    };
  };

  const getBottomBarVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        closed: { rotate: 0, y: 0 },
        open: { rotate: -45, y: -6 },
      };
    }
    return {
      closed: { rotate: 0, y: 0 },
      open: { rotate: -45, y: -6 },
    };
  };

  const topBarVariants = getTopBarVariants();
  const middleBarVariants = getMiddleBarVariants();
  const bottomBarVariants = getBottomBarVariants();

  const transition
    = effectiveMotion === 'none'
      ? { duration: 0 }
      : effectiveMotion === 'reduced'
        ? { duration: 0.15 }
        : { duration: 0.3 };

  return (
    <IconBase {...props}>
      <g style={{ transformOrigin: 'center' }}>
        {/* Top bar */}
        <motion.line
          x1="3"
          x2="21"
          y1="6"
          y2="6"
          strokeWidth="2"
          strokeLinecap="round"
          variants={topBarVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={transition}
          style={{ transformOrigin: 'center' }}
        />

        {/* Middle bar */}
        <motion.line
          x1="3"
          x2="21"
          y1="12"
          y2="12"
          strokeWidth="2"
          strokeLinecap="round"
          variants={middleBarVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={transition}
        />

        {/* Bottom bar */}
        <motion.line
          x1="3"
          x2="21"
          y1="18"
          y2="18"
          strokeWidth="2"
          strokeLinecap="round"
          variants={bottomBarVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={transition}
          style={{ transformOrigin: 'center' }}
        />
      </g>
    </IconBase>
  );
};
