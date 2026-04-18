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

/** Rileva prefers-reduced-motion in modo SSR-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Flash background quando un valore numerico cambia (recompute feedback).
 * Rispetta prefers-reduced-motion: se attivo, diventa no-op.
 */
export function getFlashOnChange() {
  if (prefersReducedMotion()) {
    return {
      initial: false as const,
      animate: {},
      transition: { duration: 0 },
    };
  }
  return {
    initial: { backgroundColor: 'rgba(16, 185, 129, 0.20)' },
    animate: { backgroundColor: 'rgba(16, 185, 129, 0)' },
    transition: { duration: 0.6, ease: EASE.standard },
  };
}

/** @deprecated — usa getFlashOnChange() che rispetta prefers-reduced-motion. */
export const FLASH_ON_CHANGE = {
  initial: { backgroundColor: 'rgba(16, 185, 129, 0.20)' },
  animate: { backgroundColor: 'rgba(16, 185, 129, 0)' },
  transition: { duration: 0.6, ease: EASE.standard },
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
