/**
 * Groups View - Level 2 - DESIGN SYSTEM 2026 COMPLIANT
 * 
 * Mostra i 3 gruppi principali:
 * - Phase 0 (sempre libero)
 * - Phase 1 (locked fino a completamento Phase 0)
 * - Technical Deep Dives (locked fino a completamento Phase 1)
 * 
 * DESIGN COMPLIANCE:
 * - Enterprise typography (text-enterprise-*)
 * - Density system (density-*)
 * - Tap targets (tap-target-touch, min 44px mobile)
 * - Focus rings (focus-enterprise-ring)
 * - Card hover lift (card-hover-lift)
 * - Progress state badges (progress-state-*)
 * - Alert enterprise for locked states
 * - Section frame for visual hierarchy
 */

'use client'

import { useTranslations } from 'next-intl'
import { type LearningPathGroup } from '@/src/shared/config/learning-path-groups'

interface GroupsViewProps {
  groups: LearningPathGroup[]
  onSelectGroup: (groupId: string) => void
  onBack: () => void
}

export function GroupsView({ groups, onSelectGroup, onBack }: GroupsViewProps) {
  const t = useTranslations('drawer.groups')
  const tNav = useTranslations('drawer.navigation')
  
  return (
    <div className="density-section-gap flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center density-gap density-text-secondary font-medium text-enterprise-secondary hover:text-enterprise-primary transition-subtle rounded-lg density-card -ml-2 tap-target-touch focus-enterprise-ring"
      >
        <span className="text-lg">←</span>
        {tNav('back')}
      </button>

      {/* Intro */}
      <div className="section-frame density-card">
        <h2 className="text-xl font-bold text-enterprise-primary mb-2">
          {t('title')}
        </h2>
        <p className="density-text-secondary text-enterprise-secondary reading-line-height">
          {t('subtitle')}
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
  const t = useTranslations('drawer.groups')
  
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

  if (group.isLocked) {
    return (
      <div className="section-frame density-card opacity-60">
        <div className="flex items-start density-gap">
          {/* Icon */}
          <div className="density-icon-box flex items-center justify-center rounded-lg bg-muted flex-shrink-0">
            <LockIcon className="density-icon text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center density-gap mb-2">
              <h3 className="text-base font-bold text-enterprise-primary">
                {index === 0 ? 'Phase 0' : index === 1 ? 'Phase 1' : 'Approfondimenti Tecnici'}
              </h3>
              <span className="progress-state-not-started">
                Bloccato
              </span>
            </div>
            
            <div className="alert-enterprise-info">
              <p className="density-text-secondary reading-line-height">
                {t('locked', { phase: index === 1 ? t('phase0') : t('phase1') })}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={onSelect}
      className={`
        w-full card-2026 card-hover-lift density-card
        tap-target-touch focus-enterprise-ring
        text-left transition-subtle
        ${style.border} ${style.bg}
      `}
    >
      <div className="flex items-start density-gap">
        {/* Icon */}
        <div className={`
          density-icon-box flex items-center justify-center rounded-lg flex-shrink-0
          ${style.iconBg}
        `}>
          <GroupIcon type={group.id} className={`density-icon ${style.text}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center density-gap mb-2">
            <h3 className="text-base font-bold text-enterprise-primary">
              {index === 0 ? 'Phase 0' : index === 1 ? 'Phase 1' : 'Approfondimenti Tecnici'}
            </h3>
            <span className="focus-chip-secondary">
              {group.moduleCount} moduli
            </span>
          </div>
          
          <p className="density-text-secondary text-enterprise-secondary reading-line-height mb-3">
            ~{group.estimatedHours}h di contenuti
          </p>

          <div className="flex items-center density-gap density-text-secondary font-medium text-primary">
            Inizia
            <ArrowRightIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </button>
  )
}

// SVG Icons - Homemade, no emoji, no icon libraries
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
