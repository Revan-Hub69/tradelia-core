/**
 * Groups View - Level 2
 * 
 * Mostra i 3 gruppi principali:
 * - Phase 0 (sempre libero)
 * - Phase 1 (locked fino a completamento Phase 0)
 * - Technical Deep Dives (locked fino a completamento Phase 1)
 */

'use client'

import { type LearningPathGroup } from '@/src/shared/config/learning-path-groups'

interface GroupsViewProps {
  groups: LearningPathGroup[]
  onSelectGroup: (groupId: string) => void
  onBack: () => void
}

export function GroupsView({ groups, onSelectGroup, onBack }: GroupsViewProps) {
  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg px-3 py-2 -ml-2 min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <span className="text-lg">←</span>
        Modifica impostazioni
      </button>

      {/* Intro */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">
          Scegli da dove iniziare
        </h2>
        <p className="text-sm text-muted-foreground">
          Il percorso è progressivo: completa Phase 0 per sbloccare Phase 1, poi gli approfondimenti tecnici.
        </p>
      </div>

      {/* Groups */}
      <div className="space-y-4">
        {groups.map((group, index) => (
          <GroupCard
            key={group.id}
            group={group}
            index={index}
            onSelect={() => onSelectGroup(group.id)}
          />
        ))}
      </div>
    </div>
  )
}

function GroupCard({ 
  group, 
  index,
  onSelect 
}: { 
  group: LearningPathGroup
  index: number
  onSelect: () => void
}) {
  const colorStyles = {
    primary: {
      bg: 'bg-primary/5',
      border: 'border-primary/20',
      text: 'text-primary',
      iconBg: 'bg-primary/10'
    },
    success: {
      bg: 'bg-success/5',
      border: 'border-success/20',
      text: 'text-success',
      iconBg: 'bg-success/10'
    },
    warning: {
      bg: 'bg-warning/5',
      border: 'border-warning/20',
      text: 'text-warning',
      iconBg: 'bg-warning/10'
    }
  }

  const style = colorStyles[group.color]

  return (
    <button
      onClick={onSelect}
      disabled={group.isLocked}
      className={`
        w-full p-5 rounded-xl border-2 text-left
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        ${group.isLocked
          ? 'border-border/30 bg-muted/20 cursor-not-allowed opacity-60'
          : `${style.border} ${style.bg} hover:shadow-md hover:scale-[1.01]`
        }
      `}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${group.isLocked ? 'bg-muted' : style.iconBg}
        `}>
          {group.isLocked ? (
            <LockIcon className="w-6 h-6 text-muted-foreground" />
          ) : (
            <GroupIcon type={group.id} className={`w-6 h-6 ${style.text}`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-base font-bold ${
              group.isLocked ? 'text-muted-foreground' : 'text-foreground'
            }`}>
              {index === 0 ? 'Phase 0' : index === 1 ? 'Phase 1' : 'Approfondimenti Tecnici'}
            </h3>
            {!group.isLocked && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {group.moduleCount} moduli
              </span>
            )}
          </div>
          
          <p className={`text-sm mb-3 ${
            group.isLocked ? 'text-muted-foreground/70' : 'text-muted-foreground'
          }`}>
            {group.isLocked 
              ? `Completa ${index === 1 ? 'Phase 0' : 'Phase 1'} per sbloccare`
              : `~${group.estimatedHours}h di contenuti`
            }
          </p>

          {!group.isLocked && (
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              Inizia
              <ArrowRightIcon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </button>
  )
}

// SVG Icons
function GroupIcon({ type, className }: { type: string; className?: string }) {
  if (type === 'phase-0') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    )
  }
  
  if (type === 'phase-1') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    )
  }

  // technical-deep-dives
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
