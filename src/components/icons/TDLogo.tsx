/**
 * TDLogo — Tradelia brand mark  (V1 SOTA 2026)
 *
 * Mark concept: sparkline ascendente su assi XY sottili + dot teal terminale.
 * Un solo gesto — il grafico è il logo. Legge da 16px a 128px.
 *
 * Wordmark: "tradelia" — Inter 700, letter-spacing -1.5px.
 * Accent:   underline teal largo 24px sotto le prime 2 lettere.
 *
 * Props
 * ─────
 * size       px height del mark (default: 32). Wordmark scala proporzionalmente.
 * variant    'mark'    → solo sparkline SVG
 *            'full'    → mark + wordmark affiancati  (default)
 *            'stacked' → mark sopra wordmark (splash, og:image)
 * color      'auto'  → currentColor per il testo; teal forced per mark
 *            'teal'  → forza teal su tutto
 *            'white' → forza bianco su tutto (background scuro esplicito)
 * className  classi extra Tailwind / CSS forwarded al root element
 */

import React from 'react';

export type TDLogoVariant = 'mark' | 'full' | 'stacked';
export type TDLogoColor = 'auto' | 'teal' | 'white';

export interface TDLogoProps {
  size?: number;
  variant?: TDLogoVariant;
  color?: TDLogoColor;
  className?: string;
  'aria-label'?: string;
}

/* ─────────────────────────────────────────────
   TDMark — sparkline su asse XY, viewBox 0 0 72 72
   ───────────────────────────────────────────── */
function TDMark({
  size,
  ariaLabel,
  ariaHidden,
}: {
  size: number;
  ariaLabel?: string;
  ariaHidden?: boolean;
}) {
  // Mantieni proporzione 1:1 (il mark è quadrato)
  const uid = React.useId ? React.useId().replace(/:/g, '') : 'tdm';
  const gradId = `tdGrad_${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaHidden ? undefined : (ariaLabel ?? 'Tradelia')}
      aria-hidden={ariaHidden ? true : undefined}
      role={ariaHidden ? undefined : 'img'}
      style={{ flexShrink: 0, display: 'block' }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#07E0B0" />
          <stop offset="100%" stopColor="#0594CC" />
        </linearGradient>
      </defs>

      {/* ── Asse X ── */}
      <line
        x1="8" y1="58" x2="64" y2="58"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        opacity="0.18"
      />
      {/* ── Asse Y ── */}
      <line
        x1="8" y1="58" x2="8" y2="10"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        opacity="0.18"
      />

      {/* ── Area fill sotto la sparkline ── */}
      <polygon
        points="8,58 18,48 28,52 40,36 54,24 64,14 64,58"
        fill={`url(#${gradId})`}
        opacity="0.07"
      />

      {/* ── Sparkline ── */}
      <polyline
        points="8,58 18,48 28,52 40,36 54,24 64,14"
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── Dot terminale ── */}
      <circle cx="64" cy="14" r="5" fill="#07E0B0" />
      {/* Ring halo */}
      <circle
        cx="64" cy="14" r="9.5"
        fill="none"
        stroke="#07E0B0"
        strokeWidth="1.5"
        opacity="0.32"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Wordmark — "tradelia" in Inter 700
   ───────────────────────────────────────────── */
function Wordmark({
  size,
  colorValue,
}: {
  size: number;
  colorValue: string;
}) {
  const fontSize = Math.round(size * 0.52);
  const underlineW = Math.round(fontSize * 1.2); // accent sotto le prime ~2 lettere

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', userSelect: 'none' }}>
      <span
        style={{
          fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: `${fontSize}px`,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: colorValue,
          lineHeight: 1,
        }}
      >
        tradelia
      </span>
      {/* Accent underline teal — visibile solo ≥ 20px */}
      {size >= 20 && (
        <div
          style={{
            marginTop: '3px',
            width: `${underlineW}px`,
            height: '2px',
            borderRadius: '1px',
            background: 'linear-gradient(90deg, #07E0B0, #0594CC)',
          }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Color map
   ───────────────────────────────────────────── */
const COLOR_MAP: Record<TDLogoColor, string> = {
  auto: 'currentColor',
  teal: '#07E0B0',
  white: '#ffffff',
};

/* ─────────────────────────────────────────────
   TDLogo — default export
   ───────────────────────────────────────────── */
export default function TDLogo({
  size = 32,
  variant = 'full',
  color = 'auto',
  className,
  'aria-label': ariaLabel = 'Tradelia',
}: TDLogoProps) {
  const colorValue = COLOR_MAP[color];

  /* ── mark only ── */
  if (variant === 'mark') {
    return (
      <TDMark
        size={size}
        ariaLabel={ariaLabel}
      />
    );
  }

  /* ── stacked ── */
  if (variant === 'stacked') {
    return (
      <div
        className={className}
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: Math.round(size * 0.18),
        }}
        aria-label={ariaLabel}
        role="img"
      >
        <TDMark size={size} ariaHidden />
        <Wordmark size={size} colorValue={colorValue} />
      </div>
    );
  }

  /* ── full (default) ── */
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.35),
      }}
      aria-label={ariaLabel}
      role="img"
    >
      <TDMark size={size} ariaHidden />
      <Wordmark size={size} colorValue={colorValue} />
    </div>
  );
}
