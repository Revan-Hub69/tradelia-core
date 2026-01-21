/*
 * TOOLS ICON - Tradelia Signature Premium SVG
 *
 * Design: Settings/sliders icon (lucide-react style)
 * Clean, professional, well-proportioned
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
        {/* Sliders icon - lucide style */}
        <line x1="4" x2="4" y1="21" y2="14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="4" x2="4" y1="10" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" x2="12" y1="21" y2="12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" x2="12" y1="8" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" x2="20" y1="21" y2="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="20" x2="20" y1="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="1" x2="7" y1="14" y2="14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="9" x2="15" y1="8" y2="8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="17" x2="23" y1="16" y2="16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
    </IconBase>
  );
};
