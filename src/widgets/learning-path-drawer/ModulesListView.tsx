/**
 * Modules List View - Level 3
 * 
 * Mostra tutti i moduli del gruppo selezionato con:
 * - Progress bar
 * - Completion status
 * - Estimated time
 */

'use client'

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
  const completionPercent = Math.round((completedModules.length / modules.length) * 100)

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 -ml-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="text-lg">←</span>
        Torna ai gruppi
      </button>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">
            {groupTitle}
          </h2>
          <span className="text-sm font-semibold text-muted-foreground">
            {completedModules.length}/{modules.length}
          </span>
        </div>
        
        <div 
          className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso completamento moduli"
        >
          <div 
            className="h-full bg-success rounded-full transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Modules list */}
      <div className="space-y-2">
        {modules.map((module, index) => {
          const isCompleted = completedModules.includes(module.id)
          return (
            <button
              key={module.id}
              onClick={() => onSelectModule(module.id)}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-colors text-left min-h-[64px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Completion indicator */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isCompleted 
                    ? 'bg-success border-success' 
                    : 'border-muted-foreground/30'
                  }
                `}>
                  {isCompleted && (
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  )}
                </div>

                {/* Module info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">
                      {index + 1}. {module.title}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ~{module.estimatedMinutes} min
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <ArrowRightIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 ml-2" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

// SVG Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path d="M20 6 9 17l-5-5" />
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
