/*
 * TOOLS ICON - Tradelia Signature Premium SVG
 *
 * Design: Precision sliders with animated knobs
 * Motion: Knob drift + subtle hover tilt
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
      hover: { scale: 1.08, rotate: -3 },
    };
  };

  const variants = getVariants();
  const transition = effectiveMotion === 'none' ? { duration: 0 } : { duration: 0.2 };
  const shouldAnimate = isActive && effectiveMotion === 'full';

  const knobs = [
    { x: 6, y: 11, delay: 0 },
    { x: 12, y: 8, delay: 0.25 },
    { x: 18, y: 14, delay: 0.5 },
  ];

  return (
    <IconBase strokeWidth={effectiveStrokeWidth} {...props}>
      <defs>
        <filter id="tools-glow">
          <feGaussianBlur stdDeviation="2.2" result="coloredBlur" />
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
        {/* Vertical rails */}
        <line x1="6" x2="6" y1="4" y2="9" />
        <line x1="6" x2="6" y1="13" y2="20" />
        <line x1="12" x2="12" y1="4" y2="6" />
        <line x1="12" x2="12" y1="10" y2="20" />
        <line x1="18" x2="18" y1="4" y2="12" />
        <line x1="18" x2="18" y1="16" y2="20" />

        {/* Knobs */}
        {knobs.map(knob => (
          <motion.circle
            key={`knob-${knob.x}-${knob.y}`}
            cx={knob.x}
            cy={knob.y}
            r="2"
            fill="currentColor"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.5"
            filter={shouldAnimate ? 'url(#tools-glow)' : undefined}
            animate={shouldAnimate
              ? {
                  cy: [knob.y, knob.y - 1, knob.y],
                  opacity: [0.9, 1, 0.9],
                }
              : {}}
            transition={{ duration: 2.2, repeat: Infinity, delay: knob.delay }}
          />
        ))}
      </motion.g>
    </IconBase>
  );
};
