/*
 * GLOBE ICON - Tradelia Signature Premium SVG (Language Switcher)
 */

'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import { IconBase, type IconBaseProps } from '../IconBase';

export type GlobeIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const GlobeIcon: React.FC<GlobeIconProps> = ({
  isActive = false,
  motionPreference,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const effectiveMotion = motionPreference || (prefersReducedMotion ? 'reduced' : 'full');

  const getVariants = () => {
    if (effectiveMotion === 'none') {
      return { initial: { rotateY: 0, scale: 1 }, animate: { rotateY: 0, scale: 1 }, hover: { rotateY: 0, scale: 1 } };
    }
    if (effectiveMotion === 'reduced') {
      return { initial: { rotateY: 0, scale: 1 }, animate: { rotateY: 0, scale: 1 }, hover: { scale: 1.05 } };
    }
    return {
      initial: { rotateY: 0, scale: 1 },
      animate: { rotateY: 360, scale: 1 },
      hover: { scale: 1.1, rotateY: 15 },
    };
  };

  const variants = getVariants();
  const transition = effectiveMotion === 'none' ? { duration: 0 } : effectiveMotion === 'reduced' ? { duration: 0.15 } : { rotateY: { duration: 20, repeat: Infinity }, scale: { duration: 0.2 } };

  return (
    <IconBase {...props}>
      <motion.g
        animate="animate"
        initial="initial"
        transition={transition}
        variants={variants}
        whileHover="hover"
        style={{ transformOrigin: 'center', transformStyle: 'preserve-3d' }}
      >
        <circle cx="12" cy="12" r="10" />
        <motion.line
          x1="2"
          x2="22"
          y1="12"
          y2="12"
          animate={effectiveMotion === 'full' ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
          animate={effectiveMotion === 'full' ? { opacity: [1, 0.7, 1] } : {}}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
        />
      </motion.g>
    </IconBase>
  );
};
