/**
 * TDLogo — Tradelia monogram mark
 *
 * The 't' and 'd' share a single vertical stem. The crossbar of 't' also
 * serves as the visual cap-line of 'd', creating a locked, inseparable glyph.
 *
 * Props
 * ─────
 * size       px height (and proportional width). Default: 32
 * variant    'mark'  → SVG glyph only
 *            'full'  → glyph + wordmark "tradelia" beside it  (default)
 *            'stacked' → glyph above wordmark (useful for splash / favicon)
 * color      'auto'  → currentColor (inherits from parent, works in dark/light)
 *            'teal'  → forces brand teal (#01696f / #4f98a3 dark)
 *            'white' → forces white (for dark backgrounds)
 * className  extra Tailwind / CSS classes forwarded to the root element
 */

import React from 'react';

export type TDLogoVariant = 'mark' | 'full' | 'stacked';
export type TDLogoColor = 'auto' | 'teal' | 'white';

export interface TDLogoProps {
  size?: number;
  variant?: TDLogoVariant;
  color?: TDLogoColor;
  className?: string;
  /** forwarded to the root <svg> or <div> */
  'aria-label'?: string;
}

/** The raw SVG mark — 't' and 'd' on a shared stem, viewBox 0 0 28 36 */
function TDMark({
  size,
  colorValue,
  ariaLabel,
  ariaHidden,
}: {
  size: number;
  colorValue: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
}) {
  // Proportional width from the 28×36 viewBox
  const width = Math.round((size * 28) / 36);

  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 28 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaHidden ? undefined : ariaLabel ?? 'Tradelia'}
      aria-hidden={ariaHidden ? true : undefined}
      role={ariaHidden ? undefined : 'img'}
      style={{ color: colorValue, flexShrink: 0 }}
    >
      {/*
        Geometry
        ────────
        Shared vertical stem  x=12  top=4   bottom=32  strokeWidth=2.5
        Crossbar of 't'       x=6   x2=18   y=13       strokeWidth=2.5
        Bowl of 'd'           circle-arc from stem, right side, bottom at y=28

        We draw everything as stroked paths so the mark scales
        cleanly and inherits color via `currentColor`.
      */}

      {/* ── shared vertical stem ── */}
      <line
        x1="13" y1="4"
        x2="13" y2="32"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* ── 't' crossbar ── */}
      <line
        x1="6" y1="13"
        x2="20" y2="13"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/*
        ── 'd' bowl ──
        A right-opening arc anchored to the stem at y=14 (just below crossbar)
        and y=29 (just above baseline), bulging to x=26 at midpoint y=21.5
        The bowl is a cubic bezier: M 13,14 C 13,14 26,14 26,21.5 C 26,29 13,29 13,29
      */}
      <path
        d="M 13 14 C 20 14 26 16.5 26 21.5 C 26 26.5 20 29 13 29"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Wordmark — "tradelia" in Geist Mono, tracked slightly */
function Wordmark({ size, colorValue }: { size: number; colorValue: string }) {
  // Font size scales with the mark height, capped for readability
  const fontSize = Math.round(size * 0.38);
  return (
    <span
      style={{
        fontFamily: "'Geist Mono', 'Courier New', monospace",
        fontSize: `${fontSize}px`,
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: colorValue,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      tradelia
    </span>
  );
}

const COLOR_MAP: Record<TDLogoColor, string> = {
  auto: 'currentColor',
  teal: 'var(--color-primary, #01696f)',
  white: '#ffffff',
};

export default function TDLogo({
  size = 32,
  variant = 'full',
  color = 'auto',
  className,
  'aria-label': ariaLabel = 'Tradelia',
}: TDLogoProps) {
  const colorValue = COLOR_MAP[color];

  if (variant === 'mark') {
    return (
      <TDMark
        size={size}
        colorValue={colorValue}
        ariaLabel={ariaLabel}
      />
    );
  }

  if (variant === 'stacked') {
    return (
      <div
        className={className}
        style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(size * 0.15) }}
        aria-label={ariaLabel}
        role="img"
      >
        <TDMark size={size} colorValue={colorValue} ariaHidden />
        <Wordmark size={size} colorValue={colorValue} />
      </div>
    );
  }

  // variant === 'full'  (default)
  return (
    <div
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(size * 0.3) }}
      aria-label={ariaLabel}
      role="img"
    >
      <TDMark size={size} colorValue={colorValue} ariaHidden />
      <Wordmark size={size} colorValue={colorValue} />
    </div>
  );
}
