'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useInView } from '@/components/ui/useInView';

const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

export const FadeIn = ({
  children,
  delay = 0,
  duration = 700,
  direction = 'up',
  distance = 32,
  className = '',
  threshold = 0.1,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
  className?: string;
  threshold?: number;
}) => {
  const { ref, isInView } = useInView({ threshold });
  const prefersReducedMotion = useReducedMotion();

  const getTransform = () => {
    if (prefersReducedMotion) {
      return 'translate3d(0, 0, 0)';
    }
    if (isInView) {
      return 'translate3d(0, 0, 0)';
    }

    switch (direction) {
      case 'up': return `translate3d(0, ${distance}px, 0)`;
      case 'down': return `translate3d(0, -${distance}px, 0)`;
      case 'left': return `translate3d(${distance}px, 0, 0)`;
      case 'right': return `translate3d(-${distance}px, 0, 0)`;
      default: return `translate3d(0, ${distance}px, 0)`;
    }
  };

  const animationDuration = prefersReducedMotion ? 0 : duration;
  const animationDelay = prefersReducedMotion ? 0 : delay;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: getTransform(),
        opacity: isInView ? 1 : 0,
        transition: `all ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        transitionDelay: `${animationDelay}ms`,
        willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

export const StaggerChildren = ({
  children,
  staggerDelay = 100,
  className = '',
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}) => {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => {
            const key = React.isValidElement(child) && child.key != null
              ? String(child.key)
              : `stagger-child-${String(child)}`;
            return (
              <FadeIn key={key} delay={isInView ? index * staggerDelay : 0}>
                {child}
              </FadeIn>
            );
          })
        : children}
    </div>
  );
};

export const ScaleIn = ({
  children,
  delay = 0,
  duration = 500,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const { ref, isInView } = useInView();
  const prefersReducedMotion = useReducedMotion();

  const animationDuration = prefersReducedMotion ? 0 : duration;
  const animationDelay = prefersReducedMotion ? 0 : delay;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: prefersReducedMotion || isInView ? 'scale(1)' : 'scale(0.95)',
        opacity: isInView ? 1 : 0,
        transition: `all ${animationDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        transitionDelay: `${animationDelay}ms`,
        willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

export const SlideReveal = ({
  children,
  delay = 0,
  duration = 800,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const { ref, isInView } = useInView();
  const prefersReducedMotion = useReducedMotion();

  const animationDuration = prefersReducedMotion ? 0 : duration;
  const animationDelay = prefersReducedMotion ? 0 : delay;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          transform: prefersReducedMotion || isInView ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${animationDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          transitionDelay: `${animationDelay}ms`,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const AnimatedCounter = ({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}) => {
  const { ref, isInView } = useInView();
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isInView || !mounted) {
      return;
    }

    let startTime: number;

    const animate = (currentTime: number) => {
      if (!startTime) {
        startTime = currentTime;
      }
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - (1 - progress) ** 4;
      const currentCount = end * easeOutQuart;

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration, mounted]);

  if (!mounted) {
    return (
      <span ref={ref} className={className}>
        {prefix}
        {end.toFixed(decimals)}
        {suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const Parallax = ({
  children,
  speed = 0.5,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const [offset, setOffset] = useState(0);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || prefersReducedMotion) {
      return;
    }

    const handleScroll = () => {
      if (!ref.current) {
        return;
      }

      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;

      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, mounted, prefersReducedMotion]);

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          transform: mounted && !prefersReducedMotion ? `translate3d(0, ${offset}px, 0)` : 'translate3d(0, 0, 0)',
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
