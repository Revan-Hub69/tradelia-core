/**
 * Canonical motion tokens for Simulator v2.
 * Single source of truth — ogni transition passa da qui.
 *
 * Basato su Material 3 Expressive 2026 + HIG.
 */

/** Curve canoniche (cubic-bezier [x1, y1, x2, y2]). */
export const EASE = {
  /** Default per hover/press/color: equilibrato. */
  standard: [0.2, 0, 0, 1] as const,
  /** Enter / reveal / expand: decelerazione forte. */
  emphasized: [0.22, 1, 0.36, 1] as const,
  /** Exit / dismiss / hide: accelerazione. */
  exit: [0.4, 0, 1, 1] as const,
  /** Linear fallback. */
  linear: [0, 0, 1, 1] as const,
} as const;

/** Durate canoniche (secondi, compatibili framer-motion). */
export const DURATION = {
  /** Micro-interactions: hover, ripple. */
  quick: 0.18,
  /** Default: switch view, collapse. */
  base: 0.28,
  /** Enter / reveal lunghi. */
  slow: 0.42,
} as const;

/** Preset pronti per `transition` di framer-motion. */
export const TRANSITION = {
  standard: { duration: DURATION.base, ease: EASE.standard },
  enter: { duration: DURATION.slow, ease: EASE.emphasized },
  exit: { duration: DURATION.quick, ease: EASE.exit },
  /** Collapse asimmetrico usato in CompareView scroll-aware header. */
  collapseAsymmetric: (collapsed: boolean) => ({
    duration: collapsed ? DURATION.quick + 0.04 : DURATION.slow,
    ease: collapsed ? EASE.exit : EASE.emphasized,
  }),
} as const;
