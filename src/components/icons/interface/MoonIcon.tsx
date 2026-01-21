/*
 * MOON ICON - Tradelia Signature Premium SVG (Dark Mode)
 */

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { IconBase, type IconBaseProps } from '../IconBase';

export type MoonIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const MoonIcon: React.FC<MoonIconProps> = ({
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
        <motion.path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          style={{ filter: effectiveMotion === 'full' ? 'drop-shadow(0 0 3px currentColor)' : 'none' }}
          animate={effectiveMotion === 'full' ? { opacity: [1, 0.8, 1] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {effectiveMotion === 'full' && (
          <g>
            <motion.circle
              cx="8"
              cy="8"
              r="0.5"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="16"
              cy="6"
              r="0.5"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            />
            <motion.circle
              cx="18"
              cy="16"
              r="0.5"
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
            />
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
