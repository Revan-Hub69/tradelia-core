/*
 * SUN ICON - Tradelia Signature Premium SVG (Light Mode)
 * PREMIUM EFFECTS: Glow + Ray pulse with stagger + Rotation
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

  const rayAngles = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <IconBase {...props}>
      {/* Premium SVG Filters */}
      <defs>
        <filter id="sun-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g
        animate="animate"
        initial="initial"
        transition={transition}
        variants={variants}
        whileHover="hover"
        style={{ transformOrigin: 'center' }}
      >
        {/* Center circle with glow */}
        <motion.circle
          cx="12"
          cy="12"
          r="4"
          filter={
            effectiveMotion === 'full'
              ? 'url(#sun-glow)'
              : undefined
          }
          animate={
            effectiveMotion === 'full'
              ? {
                  opacity: [0.8, 1, 0.8],
                }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Rays with stagger animation */}
        <g>
          {rayAngles.map((angle, i) => (
            <motion.line
              key={angle}
              x1="12"
              x2="12"
              y1="1"
              y2="3"
              style={{ transformOrigin: '12px 12px' }}
              transform={`rotate(${angle} 12 12)`}
              animate={
                effectiveMotion === 'full'
                  ? {
                      opacity: [0.6, 1, 0.6],
                      y: [0, -0.5, 0],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </g>
      </motion.g>
    </IconBase>
  );
};
