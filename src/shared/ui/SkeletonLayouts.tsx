/**
 * Skeleton Layouts - Tradelia 2026
 * 
 * Layout-stable skeletons che matchano esattamente il contenuto finale
 * per evitare Cumulative Layout Shift (CLS)
 */

import { Skeleton, SkeletonText, SkeletonCard } from './Skeleton'

// Journey Page Skeleton - matches JourneyPage structure exactly
export function SkeletonJourneyPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb skeleton (desktop only) */}
      <div className="hidden md:flex items-center space-x-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Section Header skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-4 w-96 max-w-full" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Sub Navigation skeleton */}
      <div className="border-b border-border/50">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-12 w-28" />
          ))}
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-6">
        <div className="bg-background/60 border border-border/50 rounded-xl p-6">
          <SkeletonText lines={1} className="mb-3" />
          <SkeletonText lines={2} className="mb-6" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </div>
  )
}

// Section Layout Skeleton - for SectionLayout component
export function SkeletonSectionLayout() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="hidden md:flex items-center space-x-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="flex items-center gap-3">
          <Skeleton className="w-6 h-6 rounded" />
          <Skeleton className="h-7 w-40" />
        </div>
        
        <Skeleton className="h-4 w-80 max-w-full" />
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Tabs */}
      <div className="border-b border-border/50">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-2 px-4 py-3">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="min-h-[400px] space-y-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  )
}

// Dashboard Home Skeleton
export function SkeletonDashboardHome() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
        
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
          <div className="bg-background/60 border border-border/50 rounded-xl p-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Tool Grid Skeleton
export function SkeletonToolGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 border border-border/50 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-5 w-24" />
          </div>
          <SkeletonText lines={2} className="mb-3" />
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  )
}

// Empty State Skeleton (for loading empty states)
export function SkeletonEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Skeleton className="w-16 h-16 rounded-2xl mb-6" />
      <Skeleton className="h-6 w-48 mb-2" />
      <Skeleton className="h-4 w-80 max-w-full mb-6" />
      <Skeleton className="h-10 w-32" />
    </div>
  )
}

// Navigation Skeleton (for loading states)
export function SkeletonNavigation() {
  return (
    <div className="space-y-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="w-5 h-5" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  )
}

// Modal/Dialog Skeleton
export function SkeletonModal() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-6 w-48" />
      </div>
      
      <SkeletonText lines={3} />
      
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      
      <div className="flex gap-3 justify-end">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}

// Form Skeleton
export function SkeletonForm({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
      ))}
      
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}