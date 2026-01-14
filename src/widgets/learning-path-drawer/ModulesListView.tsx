/**
 * Modules List View - Level 3 - DESIGN SYSTEM 2026 COMPLIANT
 * 
 * Mostra tutti i moduli del gruppo selezionato con:
 * - Progress bar
 * - Completion status
 * - Estimated time (dynamic word count / 250)
 * - Complexity indicator
 * 
 * DESIGN COMPLIANCE:
 * - Enterprise typography (text-enterprise-*)
 * - Density system (density-*)
 * - Tap targets (tap-target-touch, min 44px mobile)
 * - Focus rings (focus-enterprise-ring)
 * - Drawer list item pattern
 * - Progress state badges
 * - Animated checkmark on completion
 */

'use client'

import { useTranslations } from 'next-intl'

interface Module {
  id: string
  title: string
  estimatedMinutes: number
}

interface ModulesListViewProps {
  groupTitle: string
  modules: Module[]
  completedModules: string[]
  onSelectModule: (moduleId: string) => void
  onBack: () => void
}

export function ModulesListView({ 
  groupTitle,
  modules, 
  completedModules,
  onSelectModule, 
  onBack
}: ModulesListViewProps) {
  const t = useTranslations('drawer.modules')
  const tNav = useTranslations('drawer.navigation')
  const tGroups = useTranslations('drawer.groups')
  const completionPercent = Math.round((completedModules.length / modules.length) * 100)

  return (
    <div className="flex flex-col gap-section">
      {/* Back button */}
      <button
        onClick={onBack}
        className="
          flex items-center gap-inline
          text-enterprise-small font-medium text-enterprise-secondary
          hover:text-enterprise-primary
          transition-enterprise-fast
          rounded-lg px-3 py-2 -ml-2
          tap-target-touch
          focus-enterprise-ring
        "
      >
        <span className="text-lg">←</span>
        {tNav('back')}
      </button>

      {/* Progress */}
      <div className="card-enterprise-flat space-element">
        <div className="flex items-center justify-between mb-element">
          <h2 className="text-enterprise-h2 text-enterprise-primary">
            {groupTitle}
          </h2>
          <span className="text-enterprise-small font-numeric font-semibold text-enterprise-secondary">
            {completedModules.length}/{modules.length}
          </span>
        </div>
        
        <div 
          className="progress-enterprise"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('progress')}
        >
          <div 
            className="progress-enterprise-fill"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        {completionPercent === 100 && (
          <div className="mt-element">
            <div className="badge-enterprise-success flex items-center gap-inline animate-fade-in">
              <CheckCircleIcon className="w-3 h-3 flex-shrink-0" />
              <span className="font-medium">
                {tGroups('completed')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modules list */}
      <div className="flex flex-col gap-2">
        {modules.map((module, index) => {
          const isCompleted = completedModules.includes(module.id)
          return (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className="
                w-full card-enterprise
                hover-enterprise-lift
                tap-target-touch
                focus-enterprise-ring
                text-left
              "
            >
              <div className="flex items-center justify-between gap-element">
                <div className="flex items-center gap-element flex-1 min-w-0">
                  {/* Completion indicator */}
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    transition-enterprise
                    ${isCompleted 
                      ? 'bg-success border-success' 
                      : 'border-neutral-300 dark:border-neutral-700'
                    }
                  `}>
                    {isCompleted && (
                      <CheckIcon className="w-3.5 h-3.5 text-white animate-zoom-in" />
                    )}
                  </div>

                  {/* Module info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-inline mb-1">
                      <span className="text-enterprise-body font-medium text-enterprise-primary truncate">
                        {index + 1}. {module.title}
                      </span>
                    </div>
                    <span className="text-enterprise-small text-enterprise-secondary">
                      ~{module.estimatedMinutes} min
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRightIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-enterprise group-hover:translate-x-1" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// SVG Icons - Homemade, no emoji, no icon libraries
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
