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
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

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
    { x: 5, y: 9, delay: 0 },
    { x: 12, y: 15, delay: 0.25 },
    { x: 19, y: 7, delay: 0.5 },
  ];

  return (
    <IconBase {...props}>
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
        <line x1="5" x2="5" y1="4" y2="20" />
        <line x1="12" x2="12" y1="4" y2="20" />
        <line x1="19" x2="19" y1="4" y2="20" />

        {/* Knobs */}
        {knobs.map(knob => (
          <motion.circle
            key={`knob-${knob.x}-${knob.y}`}
            cx={knob.x}
            cy={knob.y}
            r="2"
            fill="currentColor"
            stroke="none"
            filter={shouldAnimate ? 'url(#tools-glow)' : undefined}
            animate={shouldAnimate
              ? {
                  y: [0, -1.2, 0],
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
