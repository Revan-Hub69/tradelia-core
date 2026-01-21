/*
 * HOME ICON - Tradelia Signature Premium SVG
 *
 * Design: Casa elegante con dettagli raffinati + signature animations
 * Optical weight: Bilanciato per 20px standard
 * Animation: Door open effect on hover, window glow on active
 * Motion: Respects prefers-reduced-motion (full/reduced/none)
 * Premium: Framer Motion + HapticVisualFeedback integration
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type HomeIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const HomeIcon: React.FC<HomeIconProps> = ({
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
        <filter id="home-glow">
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
        style={{ transformOrigin: 'center bottom' }}
      >
        {/* Roof */}
        <path d="M4 11l8-6 8 6" />

        {/* House body */}
        <path d="M6 10.5v9.5a2.2 2.2 0 0 0 2.2 2.2h7.6a2.2 2.2 0 0 0 2.2-2.2v-9.5" />

        {/* Porta con dettaglio - subtle swing on hover */}
        <motion.path
          d="M10.2 20v-6.8a1 1 0 0 1 1-1h1.6a1 1 0 0 1 1 1V20"
          fill="currentColor"
          fillOpacity="0.08"
          strokeWidth="1.6"
          animate={effectiveMotion === 'full'
            ? {
                scaleX: [1, 0.95, 1],
              }
            : {}}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'left center' }}
        />

        {/* Maniglia porta - dettaglio premium con glow */}
        <motion.circle
          cx="13.4"
          cy="16.7"
          r="0.6"
          fill="currentColor"
          filter={
            isActive && effectiveMotion === 'full'
              ? 'url(#home-glow)'
              : undefined
          }
          animate={isActive && effectiveMotion === 'full'
            ? {
                opacity: [0.6, 1, 0.6],
              }
            : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Finestra - dettaglio premium con light effect */}
        <motion.rect
          x="7.2"
          y="12.3"
          width="2.6"
          height="2.6"
          rx="0.6"
          fill="currentColor"
          fillOpacity="0.06"
          strokeWidth="1.5"
          filter={
            isActive && effectiveMotion === 'full'
              ? 'url(#home-glow)'
              : undefined
          }
          animate={isActive && effectiveMotion === 'full'
            ? {
                opacity: [0.4, 0.8, 0.4],
              }
            : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Smoke from chimney (solo in full motion quando active) */}
        {isActive && effectiveMotion === 'full' && (
          <g className="chimney-smoke">
            <motion.circle
              cx="17"
              cy="5"
              r="0.5"
              animate={{
                y: [-5, -10],
                opacity: [0.6, 0],
                scale: [0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="17"
              cy="5"
              r="0.5"
              animate={{
                y: [-5, -10],
                opacity: [0.6, 0],
                scale: [0.5, 1],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            />
          </g>
        )}
      </motion.g>
    </IconBase>
  );
};
