/*
 * PROFILE ICON - Tradelia Signature Premium SVG
 *
 * Design: Avatar utente elegante + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Pulse effect on active, subtle bounce on hover
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type ProfileIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  isActive = false,
  motionPreference,
  strokeWidth,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();

  // Determine motion level
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  // Animation variants based on motion preference
  const getAnimationVariants = () => {
    if (effectiveMotion === 'none') {
      return {
        initial: { scale: 1 },
        active: { scale: 1 },
        hover: { scale: 1 },
      };
    }

    if (effectiveMotion === 'reduced') {
      return {
        initial: { scale: 1 },
        active: { scale: 1.05 },
        hover: { scale: 1.05 },
      };
    }

    // Full motion
    return {
      initial: { scale: 1 },
      active: {
        scale: 1.05,
      },
      hover: {
        scale: 1.1,
        y: -2,
      },
    };
  };

  const variants = getAnimationVariants();

  // Transition timing - simplified for TypeScript compatibility
  const transition
    = effectiveMotion === 'none'
      ? { duration: 0 }
      : effectiveMotion === 'reduced'
        ? { duration: 0.15 }
        : { duration: 0.2 };

  const effectiveStrokeWidth = strokeWidth ?? 2;

  return (
    <IconBase strokeWidth={effectiveStrokeWidth} {...props}>
      <defs>
        <filter id="profile-glow">
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
        {/* Avatar body */}
        <motion.path
          d="M5.5 20c1.6-3 4.1-4.6 6.5-4.6s4.9 1.6 6.5 4.6"
          animate={isActive && effectiveMotion === 'full'
            ? {
                opacity: [1, 0.7, 1],
              }
            : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Avatar head */}
        <motion.circle
          cx="12"
          cy="8.5"
          r="3.2"
          fill="currentColor"
          fillOpacity="0.12"
          animate={isActive && effectiveMotion === 'full'
            ? {
                opacity: [1, 0.8, 1],
              }
            : {}}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

        {/* Status indicator (online dot - solo quando active) */}
        {isActive && (
          <motion.circle
            cx="16.2"
            cy="9.2"
            r="1.4"
            fill="currentColor"
            filter={effectiveMotion === 'full' ? 'url(#profile-glow)' : undefined}
            animate={effectiveMotion === 'full'
              ? {
                  opacity: [0.6, 1, 0.6],
                  scale: [0.8, 1, 0.8],
                }
              : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Sparkle effect quando active (solo in full motion) */}
        {isActive && effectiveMotion === 'full' && (
          <g className="profile-sparkles">
            <motion.circle
              cx="8"
              cy="5"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.circle
              cx="16"
              cy="6"
              r="0.5"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.7,
              }}
            />
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
