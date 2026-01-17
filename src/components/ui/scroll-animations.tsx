'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer hook for scroll animations
 * Optimized for performance with single-use observers
 */
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
    if (!mounted) return;

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

/**
 * Fade in animation component
 */
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

  const getTransform = () => {
    if (isInView) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'up': return `translate3d(0, ${distance}px, 0)`;
      case 'down': return `translate3d(0, -${distance}px, 0)`;
      case 'left': return `translate3d(${distance}px, 0, 0)`;
      case 'right': return `translate3d(-${distance}px, 0, 0)`;
      default: return `translate3d(0, ${distance}px, 0)`;
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: getTransform(),
        opacity: isInView ? 1 : 0,
        transition: `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Stagger children animation
 */
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
        ? children.map((child, index) => (
            <FadeIn key={index} delay={isInView ? index * staggerDelay : 0}>
              {child}
            </FadeIn>
          ))
        : children
      }
    </div>
  );
};

/**
 * Scale in animation
 */
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

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: isInView ? 'scale(1)' : 'scale(0.95)',
        opacity: isInView ? 1 : 0,
        transition: `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

/**
 * Slide reveal animation (for text/content)
 */
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

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div
        style={{
          transform: isInView ? 'translateY(0)' : 'translateY(100%)',
          transition: `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          transitionDelay: `${delay}ms`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Counter animation for numbers
 */
export const AnimatedCounter = ({ 
  end, 
  duration = 2000,
  suffix = '',
  className = '',
}: { 
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) => {
  const { ref, isInView } = useInView();
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isInView || !mounted) return;

    let startTime: number;
    const startCount = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startCount + (end - startCount) * easeOutQuart);
      
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
        {end.toLocaleString()}{suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

/**
 * Parallax scroll effect
 */
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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * -speed;
      
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        setOffset(rate);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, mounted]);

  return (
    <div ref={ref} className={className}>
      <div
        style={{
          transform: mounted ? `translate3d(0, ${offset}px, 0)` : 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};