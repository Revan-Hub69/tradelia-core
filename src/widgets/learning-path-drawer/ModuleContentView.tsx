/**
 * Module Content View - Level 4 - DESIGN SYSTEM 2026 COMPLIANT
 * 
 * Mostra il contenuto del modulo con:
 * - Navigation header (progress + prev/next)
 * - Module content (riutilizza ModuleContent.tsx)
 * 
 * DESIGN COMPLIANCE:
 * - Enterprise typography (text-enterprise-*)
 * - Progress bar with shimmer effect (progress-enterprise)
 * - Tap targets (tap-target-touch, min 44px mobile)
 * - Focus rings (focus-enterprise-ring)
 * - Smooth transitions (transition-enterprise)
 * - Accessible navigation controls
 */

'use client'

import { useTranslations } from 'next-intl'
import { ModuleContent } from '@/src/widgets/section-dashboards/ModuleContent'
import { type LearningModule } from '@/src/shared/config/own-learning-path'

interface ModuleContentViewProps {
  module: LearningModule
  currentIndex: number
  totalModules: number
  isCompleted: boolean
  onComplete: () => void
  onPrevious: () => void
  onNext: () => void
  onBack: () => void
  hasPrevious: boolean
  hasNext: boolean
}

export function ModuleContentView({
  module,
  currentIndex,
  totalModules,
  isCompleted,
  onComplete,
  onPrevious,
  onNext,
  onBack,
  hasPrevious,
  hasNext
}: ModuleContentViewProps) {
  const tNav = useTranslations('drawer.navigation')
  const progressPercent = Math.round(((currentIndex + 1) / totalModules) * 100)

  return (
    <div className="flex flex-col gap-section">
      {/* Navigation header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-border-card">
        <span className="text-xs text-enterprise-secondary whitespace-nowrap">
          {tNav('progress')}:
        </span>
        <div 
          className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={tNav('moduleProgress')}
        >
          <div 
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-sm transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-enterprise-primary whitespace-nowrap">
          {currentIndex + 1}/{totalModules}
        </span>
        </div>
        
        {/* Navigation controls */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-card">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-enterprise-secondary hover:text-enterprise-primary transition-colors rounded-lg px-3 py-2 -ml-2 tap-target-touch focus-enterprise-ring"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {tNav('back')}
          </button>
          
          {/* Prev/Next navigation */}
          <div className="flex items-center gap-inline">
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              aria-label={tNav('previousModule')}
              className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted/70 tap-target-touch focus-enterprise-ring"
            >
              <ChevronLeftIcon className="w-5 h-5 text-enterprise-primary" />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              aria-label={tNav('nextModule')}
              className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted/70 tap-target-touch focus-enterprise-ring"
            >
              <ChevronRightIcon className="w-5 h-5 text-enterprise-primary" />
            </button>
          </div>
      </div>
      
      {/* Module content */}
      <ModuleContent 
        module={module}
        onComplete={onComplete}
        isCompleted={isCompleted}
      />
    </div>
  )
}

// SVG Icons - Homemade, no emoji, no icon libraries
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}
