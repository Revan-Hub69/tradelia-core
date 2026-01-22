/*
 * BELL ICON REFINED - Tradelia Signature 2026
 *
 * Icona Bell raffinata e leggiadra:
 * - Design elegante e minimalista
 * - Badge discreto e raffinato
 * - Animazione sottile solo su interazione
 * - Proporzioni perfette
 */

'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { RefinedIconBase, type RefinedIconProps, REFINED_TOKENS } from './RefinedIconBase';

export type BellIconRefinedProps = Omit<RefinedIconProps, 'children'> & {
  hasNotifications?: boolean;
  notificationCount?: number;
  variant?: 'minimal' | 'elegant';
};

export const BellIconRefined: React.FC<BellIconRefinedProps> = ({
  hasNotifications = false,
  notificationCount = 0,
  variant = 'minimal',
  ...props
}) => {
  return (
    <RefinedIconBase
      {...props}
      state={hasNotifications ? 'active' : props.state}
    >
      {/* Campana principale - linee eleganti */}
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        strokeWidth={hasNotifications ? 2.5 : undefined}
        opacity={hasNotifications ? 1 : 0.9}
      />

      {/* Base della campana */}
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        strokeWidth={hasNotifications ? 2 : 1.5}
        opacity={0.8}
      />

      {/* Dettagli eleganti */}
      {variant === 'elegant' && (
        <>
          {/* Battacchio interno */}
          <circle
            cx="12"
            cy="15"
            r="0.8"
            fill="currentColor"
            opacity="0.4"
          />

          {/* Linea superiore decorativa */}
          <path
            d="M8 8c0-2.2 1.8-4 4-4s4 1.8 4 4"
            strokeWidth="1"
            opacity="0.3"
          />
        </>
      )}

      {/* Badge notifiche discreto */}
      {hasNotifications && (
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={REFINED_TOKENS.transitions.gentle}
        >
          {/* Sfondo badge elegante */}
          <circle
            cx="18"
            cy="6"
            r="3.5"
            fill="hsl(var(--destructive))"
            stroke="hsl(var(--background))"
            strokeWidth="1.5"
            opacity="0.95"
          />
          
          {/* Numero notifiche */}
          {notificationCount > 0 && (
            <text
              x="18"
              y="6.5"
              textAnchor="middle"
              fontSize="5"
              fill="hsl(var(--destructive-foreground))"
              fontWeight="600"
              opacity="0.9"
            >
              {notificationCount > 99 ? '99+' : notificationCount}
            </text>
          )}

          {/* Punto semplice se nessun numero */}
          {notificationCount === 0 && (
            <circle
              cx="18"
              cy="6"
              r="2"
              fill="hsl(var(--destructive))"
              opacity="0.9"
            />
          )}
        </motion.g>
      )}

      {/* Highlight sottile per stato attivo */}
      {hasNotifications && (
        <path
          d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
          fill="none"
        />
      )}
    </RefinedIconBase>
  );
};