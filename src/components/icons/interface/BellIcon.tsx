/*
 * BELL ICON - Tradelia Signature Premium SVG (Notifications)
 * PREMIUM EFFECTS: Ring animation + Sound waves + Glow
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type BellIconProps = IconBaseProps & {
  hasNewNotification?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
  onAnimationComplete?: () => void;
};

export const BellIcon: React.FC<BellIconProps> = ({
  hasNewNotification = false,
  motionPreference,
  onAnimationComplete,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  const getRingVariants = () => {
    if (effectiveMotion === 'none' || !hasNewNotification) {
      return { initial: { rotate: 0 }, animate: { rotate: 0 }, hover: { scale: 1 } };
    }
    if (effectiveMotion === 'reduced') {
      return { initial: { rotate: 0 }, animate: { rotate: [0, -5, 5, 0] }, hover: { scale: 1.05 } };
    }
    return {
      initial: { rotate: 0 },
      animate: { rotate: [0, -15, 15, -15, 15, -10, 10, -10, 10, -5, 5, 0] },
      hover: { scale: 1.1, rotate: [0, -5, 5, 0] },
    };
  };

  const variants = getRingVariants();
  const transition = effectiveMotion === 'none' || !hasNewNotification ? { duration: 0 } : effectiveMotion === 'reduced' ? { duration: 0.15 } : { duration: 0.5 };

  return (
    <IconBase {...props}>
      {/* Premium SVG Filters */}
      <defs>
        <filter id="bell-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bell body with ring animation */}
      <motion.g
        animate={hasNewNotification ? 'animate' : 'initial'}
        initial="initial"
        transition={transition}
        variants={variants}
        whileHover="hover"
        style={{ transformOrigin: '12px 8px' }}
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />

        {/* Clapper with glow when active */}
        <motion.path
          d="M13.73 21a2 2 0 0 1-3.46 0"
          filter={
            hasNewNotification && effectiveMotion === 'full'
              ? 'url(#bell-glow)'
              : undefined
          }
          animate={
            hasNewNotification && effectiveMotion === 'full'
              ? {
                  opacity: [0.6, 1, 0.6],
                  rotate: [0, 10, -10, 10, -10, 5, -5, 0],
                }
              : {}
          }
          style={{ transformOrigin: '12px 17px' }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.g>

      {/* Sound waves - Premium effect (only full motion) */}
      {hasNewNotification && effectiveMotion === 'full' && (
        <g>
          {[0, 1, 2].map(i => (
            <motion.path
              key={i}
              d={`M${18 + i * 2},${8 - i} Q${20 + i * 2},${8} ${18 + i * 2},${8 + i}`}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.8, 1.2, 1.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{ transformOrigin: '12px 8px' }}
            />
          ))}
        </g>
      )}
    </IconBase>
  );
};
