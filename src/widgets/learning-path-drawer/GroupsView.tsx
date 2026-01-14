/**
 * Groups View - ULTRA PREMIUM 2026
 * 
 * Premium features:
 * - Dashboard-matching palette (primary-500/8, /3, /20)
 * - Premium card design with depth and shadows
 * - Icon backgrounds with gradients and glow
 * - Hover effects with lift and shine
 * - Viewport animations with stagger
 * - Decorative dividers
 * - Glassmorphism for locked states
 */

'use client'

import { useTranslations } from 'next-intl'
import { type LearningPathGroup } from '@/src/shared/config/learning-path-groups'
import { GroupCard } from '@/src/shared/ui/GroupCard'
import { DecorativeDivider } from '@/src/shared/ui/DecorativeDivider'
import { AnimatedCard } from '@/src/shared/ui/AnimatedCard'

interface GroupsViewProps {
  groups: LearningPathGroup[]
  onSelectGroup: (groupId: string) => void
  onBack: () => void
}

export function GroupsView({ groups, onSelectGroup, onBack }: GroupsViewProps) {
  const t = useTranslations('drawer.groups')
  const tNav = useTranslations('drawer.navigation')
  
  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-enterprise-secondary hover:text-enterprise-primary transition-colors rounded-lg px-3 py-2 -ml-2 tap-target-touch focus-enterprise-ring"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        {tNav('back')}
      </button>

      {/* Intro - dashboard style */}
      <div className="relative density-card rounded-xl bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }} />
        
        <div className="relative z-10">
          <h2 className="text-xl font-semibold text-enterprise-primary mb-2 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-sm text-enterprise-secondary leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Decorative divider - using primitive */}
      <DecorativeDivider variant="dots" spacing="sm" />

      {/* Groups */}
      <div className="flex flex-col gap-4">
        {groups.map((group, index) => (
          <AnimatedCard key={group.id} delay={index * 80}>
            <GroupCard
              title={getGroupTitle(group.id, t)}
              icon={<GroupIcon type={group.id} className="w-6 h-6" />}
              color={group.color}
              moduleCount={group.moduleCount}
              estimatedHours={group.estimatedHours}
              isLocked={group.isLocked}
              lockedMessage={group.isLocked ? t('locked', { phase: index === 1 ? t('phase0') : t('phase1') }) : undefined}
              onClick={() => onSelectGroup(group.id)}
            />
          </AnimatedCard>
        ))}
      </div>
    </div>
  )
}

// Helper function to get group title
function getGroupTitle(groupId: string, t: ReturnType<typeof useTranslations<'drawer.groups'>>) {
  if (groupId === 'phase-0') return t('phase0Title')
  if (groupId === 'phase-1') return t('phase1Title')
  if (groupId === 'technical-deep-dives') return t('technicalTitle')
  return groupId
}

// Icons
function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function GroupIcon({ type, className }: { type: string; className?: string }) {
  if (type === 'phase-0') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    )
  }
  
  if (type === 'phase-1') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )
}
