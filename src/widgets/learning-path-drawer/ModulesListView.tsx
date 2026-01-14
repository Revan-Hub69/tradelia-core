/**
 * Modules List View - Level 3 - PREMIUM EDITION with ALL Chicche
 * 
 * Premium features matching ModuleContent.tsx:
 * - Gradient backgrounds with depth
 * - Shimmer effect on progress bar
 * - Animated completion badge with confetti feel
 * - Premium card hover effects with glow
 * - Viewport-based animations
 * - Decorative dividers
 * - Professional shadows and transitions
 * - Reading line-height optimization
 * - Font professional features
 */

'use client'

import { useTranslations } from 'next-intl'
import { ModuleCard } from '@/src/shared/ui/ModuleCard'
import { DecorativeDivider } from '@/src/shared/ui/DecorativeDivider'
import { AnimatedCard } from '@/src/shared/ui/AnimatedCard'
import { ProgressBarPremium } from '@/src/shared/ui/ProgressBarPremium'

interface Module {
  id: string
  title: string
  estimatedMinutes: number
}

interface ModulesListViewProps {
  groupTitle: string
  groupId?: string // 'phase-0', 'phase-1', 'technical-deep-dives'
  modules: Module[]
  completedModules: string[]
  onSelectModule: (moduleId: string) => void
  onBack: () => void
}

export function ModulesListView({ 
  groupTitle,
  groupId,
  modules, 
  completedModules,
  onSelectModule, 
  onBack
}: ModulesListViewProps) {
  const t = useTranslations('drawer.modules')
  const tNav = useTranslations('drawer.navigation')
  const tGroups = useTranslations('drawer.groups')
  const completionPercent = Math.round((completedModules.length / modules.length) * 100)
  
  // Determine group number for module numbering (0.01, 1.01, 2.01)
  const _groupNumber = groupId === 'phase-0' ? 0 : groupId === 'phase-1' ? 1 : 2

  return (
    <div className="flex flex-col gap-section font-professional">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-enterprise-secondary hover:text-enterprise-primary transition-colors rounded-lg px-3 py-2 -ml-2 tap-target-touch focus-enterprise-ring"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        {tNav('back')}
      </button>

      {/* Progress header with gradient background */}
      <div className="relative px-4 py-3 rounded-xl bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
        }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-enterprise-primary tracking-tight">
              {groupTitle}
            </h2>
            <span className="text-sm font-semibold text-enterprise-primary px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-primary-500/20">
              {completedModules.length}/{modules.length}
            </span>
          </div>
          
          {/* Progress bar with shimmer - using ProgressBarPremium */}
          <ProgressBarPremium
            value={completionPercent}
            size="md"
            showShimmer={true}
            showGlow={true}
            orientation="horizontal"
          />

          {/* Completion badge with animation */}
          {completionPercent === 100 && (
            <div className="mt-2 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium ring-1 ring-inset ring-emerald-600/20 shadow-sm">
                <CheckCircleFilledIcon className="w-4 h-4 animate-zoom-in" />
                <span>{tGroups('completed')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative divider - using primitive */}
      <DecorativeDivider variant="dots" spacing="sm" />

      {/* Modules list with viewport animations */}
      <div className="flex flex-col gap-3">
        {modules.map((module, index) => {
          const isCompleted = completedModules.includes(module.id)
          // Progressive unlock: modulo locked se il precedente non è completato
          const previousModule = index > 0 ? modules[index - 1] : null
          const isLocked = previousModule ? !completedModules.includes(previousModule.id) : false
          
          // Calculate overall progress percentage for this module
          // Each module contributes equally to the total progress
          const moduleProgressPercent = ((index + (isCompleted ? 1 : 0)) / modules.length) * 100
          
          return (
            <AnimatedCard key={module.id} delay={index * 80}>
              <ModuleCard
                title={module.title}
                moduleNumber={index + 1}
                estimatedMinutes={module.estimatedMinutes}
                isCompleted={isCompleted}
                isLocked={isLocked}
                progressPercent={moduleProgressPercent}
                onClick={() => onSelectModule(module.id)}
              />
            </AnimatedCard>
          )
        })}
      </div>
    </div>
  )
}

// SVG Icons - Premium style matching ModuleContent
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function CheckCircleFilledIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.707 8.707a1 1 0 0 0-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l5-5z" />
    </svg>
  )
}
