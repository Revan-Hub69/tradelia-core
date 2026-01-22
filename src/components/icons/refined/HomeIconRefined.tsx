/*
 * HOME ICON REFINED - Tradelia Signature 2026
 *
 * Icona Home raffinata e leggiadra:
 * - Design minimalista e elegante
 * - Linee pulite e proporzionate
 * - Animazione discreta solo su hover
 * - Dettagli architettonici sottili
 */

'use client';

import React from 'react';

import { RefinedIconBase, type RefinedIconProps } from './RefinedIconBase';

export type HomeIconRefinedProps = Omit<RefinedIconProps, 'children'> & {
  isActive?: boolean;
  variant?: 'minimal' | 'elegant';
};

export const HomeIconRefined: React.FC<HomeIconRefinedProps> = ({
  isActive = false,
  variant = 'minimal',
  ...props
}) => {
  return (
    <RefinedIconBase
      {...props}
      state={isActive ? 'active' : props.state}
    >
      {/* Casa base - linee pulite */}
      <path
        d="M3 12l9-9 9 9"
        strokeWidth={isActive ? 2.5 : undefined}
        opacity={isActive ? 1 : 0.9}
      />
      
      <path
        d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
        strokeWidth={isActive ? 2.5 : undefined}
        opacity={isActive ? 1 : 0.9}
      />

      {/* Porta elegante */}
      <rect
        x="9"
        y="16"
        width="6"
        height="5"
        rx="0.5"
        strokeWidth={isActive ? 2 : 1.5}
        opacity={0.8}
      />

      {/* Dettagli raffinati solo se richiesti */}
      {variant === 'elegant' && (
        <>
          {/* Finestre simmetriche */}
          <rect
            x="6.5"
            y="14"
            width="1.5"
            height="1.5"
            rx="0.2"
            strokeWidth="1"
            opacity="0.6"
          />

          <rect
            x="16"
            y="14"
            width="1.5"
            height="1.5"
            rx="0.2"
            strokeWidth="1"
            opacity="0.6"
          />

          {/* Maniglia porta */}
          <circle
            cx="13.5"
            cy="18.5"
            r="0.3"
            fill="currentColor"
            opacity="0.7"
          />

          {/* Linea del tetto - dettaglio architettonico */}
          <path
            d="M4 11l8-8 8 8"
            strokeWidth="1"
            opacity="0.4"
          />
        </>
      )}

      {/* Highlight sottile per stato attivo */}
      {isActive && (
        <path
          d="M3 12l9-9 9 9M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
          fill="none"
        />
      )}
    </RefinedIconBase>
  );
};