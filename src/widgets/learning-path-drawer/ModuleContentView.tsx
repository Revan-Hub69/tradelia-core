/**
 * Module Content View - Level 4
 * 
 * Mostra il contenuto del modulo con:
 * - Navigation header (progress + prev/next)
 * - Module content (riutilizza ModuleContent.tsx)
 */

'use client'

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
  const progressPercent = Math.round(((currentIndex + 1) / totalModules) * 100)

  return (
    <div className="space-y-6">
      {/* Navigation header */}
      <div className="space-y-4 pb-4 border-b border-border/50">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Progresso:
          </span>
          <div 
            className="flex-1 h-2 bg-muted-foreground/20 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso moduli"
          >
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {currentIndex + 1}/{totalModules}
          </span>
        </div>
        
        {/* Navigation controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 -ml-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <span className="text-lg">←</span>
            Indietro
          </button>
          
          {/* Prev/Next navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              aria-label="Modulo precedente"
              className="w-11 h-11 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              aria-label="Modulo successivo"
              className="w-11 h-11 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-muted hover:bg-muted-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              ›
            </button>
          </div>
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
