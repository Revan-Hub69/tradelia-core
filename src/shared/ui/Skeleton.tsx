/**
 * Skeleton Components - Tradelia 2026
 * 
 * Seguendo ux-contract.md:
 * - Skeleton > spinner (mantiene layout)
 * - Deve matchare layout finale
 * - No layout shift al caricamento
 * 
 * @see Requirements 10.6, 10.7 - Layout accuracy 95%, shimmer respects reduced motion
 */

import { cn } from './utils'

interface SkeletonProps {
  className?: string
  /** Accessible label for screen readers */
  'aria-label'?: string
  /** Variant for different skeleton styles */
  variant?: 'default' | 'text' | 'circular' | 'rectangular'
  /** Animation style - shimmer or pulse */
  animation?: 'shimmer' | 'pulse' | 'none'
}

/**
 * Base skeleton with shimmer animation that respects reduced motion
 * Uses motion-safe: prefix to only animate when user hasn't requested reduced motion
 */
export function Skeleton({ 
  className, 
  'aria-label': ariaLabel,
  variant = 'default',
  animation = 'shimmer'
}: SkeletonProps) {
  const variantClasses = {
    default: 'rounded',
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  }

  // Shimmer uses gradient background with animation
  // Pulse uses simple opacity animation
  // Both respect reduced motion via motion-safe/motion-reduce
  const animationClasses = {
    shimmer: cn(
      'bg-gradient-to-r from-muted/60 via-muted/30 to-muted/60 bg-[length:200%_100%]',
      'motion-safe:animate-shimmer motion-reduce:bg-muted/60 motion-reduce:bg-none'
    ),
    pulse: 'bg-muted/60 motion-safe:animate-pulse',
    none: 'bg-muted/60'
  }

  return (
    <div 
      className={cn(
        'relative overflow-hidden',
        variantClasses[variant],
        animationClasses[animation],
        className
      )} 
      aria-hidden="true"
      aria-label={ariaLabel}
    />
  )
}

// Text line skeleton with accurate line heights
export function SkeletonText({ 
  className, 
  lines = 1,
  lineHeight = 'normal'
}: SkeletonProps & { 
  lines?: number
  lineHeight?: 'tight' | 'normal' | 'relaxed'
}) {
  const lineHeightClasses = {
    tight: 'space-y-1.5',
    normal: 'space-y-2',
    relaxed: 'space-y-3'
  }
  
  return (
    <div className={cn(lineHeightClasses[lineHeight], className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          variant="text"
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )} 
        />
      ))}
    </div>
  )
}

// Card skeleton (matches KPI card layout with density support)
export function SkeletonCard({ className, density = 'comfortable' }: SkeletonProps & { density?: 'compact' | 'comfortable' }) {
  const paddingClass = density === 'compact' ? 'p-4' : 'p-6'
  
  return (
    <div className={cn(
      'bg-background/60 border border-border/50 rounded-xl',
      paddingClass,
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton variant="rectangular" className="w-12 h-12" />
      </div>
    </div>
  )
}

// Dashboard KPI grid skeleton
export function SkeletonKPIGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

// Table row skeleton
export function SkeletonTableRow({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border/30">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === 0 ? 'w-32' : 'flex-1'
          )} 
        />
      ))}
    </div>
  )
}

// Table skeleton
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center gap-4 py-3 border-b border-border">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-20" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} columns={columns} />
      ))}
    </div>
  )
}

// Chart skeleton
export function SkeletonChart({ className }: SkeletonProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  )
}

// Avatar skeleton with proper circular variant
export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return <Skeleton variant="circular" className={sizeClasses[size]} />
}

// Button skeleton with proper rectangular variant
export function SkeletonButton({ className, size = 'md' }: SkeletonProps & { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32'
  }
  return <Skeleton variant="rectangular" className={cn(sizeClasses[size], className)} />
}

// Full page loading skeleton (dashboard)
export function SkeletonDashboard() {
  return (
    <div 
      className="space-y-8 animate-in fade-in duration-300"
      role="status"
      aria-busy="true"
      aria-label="Caricamento dashboard in corso"
    >
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      {/* KPI Grid */}
      <SkeletonKPIGrid />
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SkeletonChart />
        </div>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}
