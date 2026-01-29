'use client';

import { useEffect, useRef, useState } from 'react';

export const useInView = (options: {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
} = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsInView(true);
          setHasTriggered(true);

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce && !entry?.isIntersecting) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered, mounted]);

  return { ref, isInView: mounted ? isInView : false };
};
