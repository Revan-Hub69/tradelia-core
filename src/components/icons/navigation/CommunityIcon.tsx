/*
 * COMMUNITY ICON - Tradelia Signature Premium SVG
 *
 * Design: Users icon (lucide-react style)
 * Clean, professional, well-proportioned
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

  const getVariants = () => {
    if (effectiveMotion === 'none') {
      return { initial: { scale: 1 }, active: { scale: 1 }, hover: { scale: 1 } };
    }
    if (effectiveMotion === 'reduced') {
      return { initial: { scale: 1 }, active: { scale: 1.05 }, hover: { scale: 1.05 } };
    }
    return {
      initial: { scale: 1 },
      active: { scale: 1.05 },
      hover: { scale: 1.1, y: -2 },
    };
  };

  const variants = getVariants();
  const transition = effectiveMotion === 'none' ? { duration: 0 } : { duration: 0.2 };

  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        animate={isActive ? 'active' : 'initial'}
        whileHover="hover"
        transition={transition}
        style={{ transformOrigin: 'center' }}
      >
        {/* Users icon - lucide style */}
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="9" cy="7" r="4" strokeWidth="2" fill="none" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </motion.g>
    </IconBase>
  );
};
