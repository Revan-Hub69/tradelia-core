/*
 * COMMUNITY ICON - Tradelia Signature Premium SVG
 *
 * Design: Group of three profiles with layered depth
 * Motion: Group pulse + subtle hover lift
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
  strokeWidth,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');
  const effectiveStrokeWidth = strokeWidth ?? 2;

  const getVariants = () => {
    if (effectiveMotion === 'none') {
      return { initial: { scale: 1 }, active: { scale: 1 }, hover: { scale: 1 } };
    }
    if (effectiveMotion === 'reduced') {
      return { initial: { scale: 1 }, active: { scale: 1.04 }, hover: { scale: 1.04 } };
    }
    return {
      initial: { scale: 1 },
      active: { scale: 1.06 },
      hover: { scale: 1.1, y: -2 },
    };
  };

  const variants = getVariants();
  const transition = effectiveMotion === 'none' ? { duration: 0 } : { duration: 0.2 };
  const shouldAnimate = isActive && effectiveMotion === 'full';

  const pulse = () => (
    shouldAnimate
      ? {
          scale: [1, 1.08, 1],
          opacity: [1, 0.7, 1],
        }
      : {}
  );

  const pulseTransition = (delay: number) => ({
    duration: 2.4,
    repeat: Infinity,
    delay,
  });

  return (
    <IconBase strokeWidth={effectiveStrokeWidth} {...props}>
      <defs>
        <filter id="community-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <motion.g
        variants={variants}
        initial="initial"
        animate={isActive ? 'active' : 'initial'}
        whileHover="hover"
        transition={transition}
        style={{ transformOrigin: 'center' }}
      >
        {shouldAnimate && (
          <motion.circle
            cx="12"
            cy="9.5"
            r="6"
            fill="currentColor"
            stroke="none"
            opacity="0.08"
            filter="url(#community-glow)"
            animate={{ opacity: [0.06, 0.14, 0.06], scale: [0.96, 1.02, 0.96] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Heads */}
        <motion.circle
          cx="12"
          cy="8.5"
          r="3"
          fill="currentColor"
          fillOpacity="0.12"
          animate={pulse()}
          transition={pulseTransition(0)}
        />
        <motion.circle
          cx="6.6"
          cy="10.2"
          r="2.2"
          animate={pulse()}
          transition={pulseTransition(0.3)}
        />
        <motion.circle
          cx="17.4"
          cy="10.2"
          r="2.2"
          animate={pulse()}
          transition={pulseTransition(0.6)}
        />

        {/* Bodies */}
        <path d="M5.3 20c1.5-3.1 4.3-4.8 6.7-4.8s5.2 1.7 6.7 4.8" />
        <path d="M2.4 19.4c0-2.1 1.6-3.4 3.6-3.9" />
        <path d="M21.6 19.4c0-2.1-1.6-3.4-3.6-3.9" />
      </motion.g>
    </IconBase>
  );
};
