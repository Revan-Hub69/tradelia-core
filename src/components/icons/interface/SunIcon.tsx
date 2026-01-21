/*
 * SUN ICON - Tradelia Signature Premium SVG (Light Mode)
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type SunIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const SunIcon: React.FC<SunIconProps> = ({
  isActive = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  const getVariants = () => {
    if (effectiveMotion === 'none') {
      return { initial: { rotate: 0, scale: 1 }, animate: { rotate: 0, scale: 1 }, hover: { rotate: 0, scale: 1 } };
    }
    if (effectiveMotion === 'reduced') {
      return { initial: { rotate: 0, scale: 1 }, animate: { rotate: isActive ? 180 : 0, scale: 1 }, hover: { scale: 1.05 } };
    }
    return {
      initial: { rotate: 0, scale: 1 },
      animate: { rotate: isActive ? 180 : 0, scale: 1 },
      hover: { scale: 1.1, rotate: isActive ? 195 : 15 },
    };
  };

  const variants = getVariants();
  const transition = effectiveMotion === 'none' ? { duration: 0 } : effectiveMotion === 'reduced' ? { duration: 0.15 } : { duration: 0.3 };

  return (
    <IconBase {...props}>
      <motion.g
        animate="animate"
        initial="initial"
        transition={transition}
        variants={variants}
        whileHover="hover"
        style={{ transformOrigin: 'center' }}
      >
        <circle
          cx="12"
          cy="12"
          r="4"
          style={{ filter: effectiveMotion === 'full' ? 'drop-shadow(0 0 2px currentColor)' : 'none' }}
        />
        <g>
          <line x1="12" x2="12" y1="1" y2="3" />
          <line x1="12" x2="12" y1="21" y2="23" />
          <line x1="4.22" x2="5.64" y1="4.22" y2="5.64" />
          <line x1="18.36" x2="19.78" y1="18.36" y2="19.78" />
          <line x1="1" x2="3" y1="12" y2="12" />
          <line x1="21" x2="23" y1="12" y2="12" />
          <line x1="4.22" x2="5.64" y1="19.78" y2="18.36" />
          <line x1="18.36" x2="19.78" y1="5.64" y2="4.22" />
        </g>
      </motion.g>
    </IconBase>
  );
};
