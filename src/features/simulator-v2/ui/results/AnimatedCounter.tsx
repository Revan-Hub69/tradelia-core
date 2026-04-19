'use client';

import { animate, useMotionValue, useTransform } from 'framer-motion';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  /** Numero di decimali da mostrare. Default 0 per interi, 2 per decimali. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Formatter custom che ha priorità su decimals/prefix/suffix. */
  formatAction?: (v: number) => string;
  className?: string;
};

/**
 * Counter animato da 0 al valore finale con easing out quart.
 * Usa Framer Motion MotionValue per performance (no re-render per ogni tick).
 */
export function AnimatedCounter({
  value,
  duration = 0.9,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatAction,
  className,
}: AnimatedCounterProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (formatAction) {
      return formatAction(latest);
    }
    const formatted = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(latest);
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [value, duration, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
