'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

export type UseIntersectionObserverOptions = {
  /**
   * Fraction of the element that must be visible to trigger.
   * Default: 0.15 — iOS 26 pattern: reveal when 15% enters viewport.
   */
  threshold?: number;
  /**
   * Margin around the root viewport.
   * Default: '0px 0px -40px 0px' — leggermente prima del bordo inferiore.
   */
  rootMargin?: string;
  /**
   * If true (default), once visible the observer disconnects.
   * Set to false for sticky animations that toggle on scroll.
   */
  once?: boolean;
};

export type UseIntersectionObserverReturn<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T>;
  isIntersecting: boolean;
};

/**
 * useIntersectionObserver
 *
 * Hook generico per section reveal e scroll-triggered animations.
 * Usato con le classi CSS .reveal-on-scroll / .is-visible in landing.css.
 *
 * @example
 * const { ref, isIntersecting } = useIntersectionObserver();
 * <section ref={ref} className={cn('reveal-on-scroll', isIntersecting && 'is-visible')}>
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn<T> {
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsIntersecting(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isIntersecting };
}
