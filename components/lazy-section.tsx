'use client'

import { lazy, Suspense } from 'react'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

interface LazySectionProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  rootMargin?: string
}

export function LazySection({ 
  children, 
  fallback = <div className="h-96 animate-pulse bg-muted/20" />,
  rootMargin = '100px'
}: LazySectionProps) {
  const { ref, isVisible } = useIntersectionObserver({
    rootMargin,
    triggerOnce: true
  })

  return (
    <div ref={ref as any}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  )
}