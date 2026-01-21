/*
 * BELL ICON - Tradelia Signature Premium SVG (Notifications)
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
      <motion.g
        animate={hasNewNotification ? 'animate' : 'initial'}
        initial="initial"
        transition={transition}
        variants={variants}
        whileHover="hover"
        style={{ transformOrigin: '12px 8px' }}
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <motion.path
          d="M13.73 21a2 2 0 0 1-3.46 0"
          animate={hasNewNotification && effectiveMotion === 'full' ? { rotate: [0, 10, -10, 10, -10, 5, -5, 0] } : {}}
          style={{ transformOrigin: '12px 17px' }}
          transition={{ duration: 0.5 }}
        />
      </motion.g>
    </IconBase>
  );
};
