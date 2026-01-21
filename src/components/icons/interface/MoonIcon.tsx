/*
 * MOON ICON - Tradelia Signature Premium SVG (Dark Mode)
 * PREMIUM EFFECTS: Glow + Breathing + Twinkling stars
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

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

  const stars = [
    { cx: 8, cy: 8, delay: 0 },
    { cx: 16, cy: 6, delay: 0.7 },
    { cx: 18, cy: 16, delay: 1.4 },
  ];

  return (
    <IconBase {...props}>
      {/* Premium SVG Filters */}
      <defs>
        <filter id="moon-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
        {/* Moon crescent with breathing glow */}
        <motion.path
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
          filter={
            effectiveMotion === 'full'
              ? 'url(#moon-glow)'
              : undefined
          }
          animate={
            effectiveMotion === 'full'
              ? { opacity: [0.8, 1, 0.8] }
              : {}
          }
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Twinkling stars - Premium effect (only full motion) */}
        {effectiveMotion === 'full' && (
          <g>
            {stars.map(star => (
              <motion.circle
                key={`star-${star.cx}-${star.cy}`}
                cx={star.cx}
                cy={star.cy}
                r="0.5"
                fill="currentColor"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
