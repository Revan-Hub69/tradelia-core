/*
 * SETTINGS ICON - Tradelia Signature Premium SVG
 *
 * Design: Settings gear icon (lucide-react style)
 * Clean, professional, well-proportioned
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';

import { IconBase, type IconBaseProps } from '../IconBase';

export type SettingsIconProps = IconBaseProps & {
  isActive?: boolean;
  motionPreference?: 'full' | 'reduced' | 'none';
};

export const SettingsIcon: React.FC<SettingsIconProps> = ({
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
      return { initial: { scale: 1 }, active: { scale: 1.05 }, hover: { scale: 1.05 } };
    }
    return {
      initial: { scale: 1 },
      active: { scale: 1.05 },
      hover: { scale: 1.1, rotate: 15 },
    };
  };

  const variants = getVariants();
  const transition = effectiveMotion === 'none' ? { duration: 0 } : { duration: 0.2 };

  return (
    <IconBase {...props}>
      <motion.g
        variants={variants}
        initial="initial"
        animate={isActive ? 'active' : 'initial'}
        whileHover="hover"
        transition={transition}
        style={{ transformOrigin: 'center' }}
      >
        {/* Settings gear icon - lucide style */}
        <path
          d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="12" cy="12" r="3" strokeWidth="2" fill="none" />
      </motion.g>
    </IconBase>
  );
};
