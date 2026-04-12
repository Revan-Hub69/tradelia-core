import { useRef, useEffect } from 'react';

/**
 * Quando `trigger` cambia, aspetta 300ms (AnimatedSection transition)
 * poi scrolla l'ultimo .sim-section visibile in view nel container.
 * Enabled = false disabilita senza smontare l'hook.
 */
export function useStepAutoScroll(
  containerRef: React.RefObject<HTMLElement | null>,
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
