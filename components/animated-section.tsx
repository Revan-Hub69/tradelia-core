"use client";

import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-in" | "fade-in-up";
  delay?: 0 | 1 | 2 | 3;
}

export function AnimatedSection({ 
  children, 
  className,
  animation = "fade-in-up",
  delay = 0
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  const animationClass = animation === "fade-in" ? "animate-fade-in" : "animate-fade-in-up";
  const delayClass = delay > 0 ? `animate-fade-in-delay-${delay}` : "";

  return (
    <section
      ref={ref}
      className={cn(
        "opacity-0",
        isVisible && animationClass,
        isVisible && delayClass,
        className
      )}
    >
      {children}
    </section>
  );
}
