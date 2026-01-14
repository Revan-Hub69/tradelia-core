/**
 * AnimatedCard Component - Tradelia 2026
 * 
 * Wrapper per card con animazione viewport-based.
 * Usa IntersectionObserver per rilevare quando entra in viewport.
 * Supporta stagger delay per liste di card.
 * 
 * @requirements 2.5, 3.6, 7.3 - Viewport-based stagger animation
 */

'use client';

import { type ReactNode, useRef, useState, useEffect } from 'react';
import { cn } from './utils';

export interface AnimatedCardProps {
  /** Contenuto della card */
  children: ReactNode;
  /** Delay in ms per stagger animation (es. index * 80) */
  delay?: number;
  /** Classi CSS aggiuntive */
  className?: string;
}

/**
 * AnimatedCard - Wrapper con animazione fade-in + translate-y
 * 
 * Usato per animare card quando entrano in viewport.
 * Per liste, passare delay={index * 80} per effetto stagger.
 * Rispetta prefers-reduced-motion automaticamente via CSS.
 */
export function AnimatedCard({
  children,
  delay = 0,
  className = '',
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Skip animation for users who prefer reduced motion
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // Apply delay for stagger effect
          const timeoutId = setTimeout(() => {
            setIsVisible(true);
          }, delay);

          observer.disconnect();

          return () => clearTimeout(timeoutId);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4',
        className
      )}
    >
      {children}
    </div>
  );
}

AnimatedCard.displayName = 'AnimatedCard';
