import { useRef, useEffect, RefObject } from 'react';

/**
 * Quando `trigger` cambia, aspetta che AnimatedSection finisca
 * (300ms) e porta l'ultimo .sim-section / .sim-block-divider /
 * .sim-sheet__cta in view con scrollIntoView({ block: 'nearest' }).
 *
 * @param containerRef  ref del div scrollabile (panel o sheet content)
 * @param trigger       stringa che cambia ad ogni step completato
 * @param enabled       false → no-op (es. sheet chiuso)
 */
export function useStepAutoScroll(
  containerRef: RefObject<HTMLElement | null>,
  trigger: unknown,
  enabled = true,
) {
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (!enabled || prevTrigger.current === trigger) return;
    prevTrigger.current = trigger;

    const container = containerRef.current;
    if (!container) return;

    const t = setTimeout(() => {
      const children = container.querySelectorAll<HTMLElement>(
        '.sim-section, .sim-block-divider, .sim-sheet__cta',
      );
      const last = children[children.length - 1];
      if (last) {
        last.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      }
    }, 300);

    return () => clearTimeout(t);
  }, [trigger, enabled, containerRef]);
}
