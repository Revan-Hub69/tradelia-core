/**
 * Groups View - Level 2 - PREMIUM EDITION with ALL Chicche
 * 
 * Premium features matching ModuleContent.tsx:
 * - Gradient backgrounds with depth
 * - Decorative dividers with animated dots
 * - Icon backgrounds with gradients
 * - Hover effects with glow and lift
 * - Shimmer effects on interactive elements
 * - Ring borders on badges
 * - Viewport-based animations
 * - Professional shadows and transitions
 * - Reading line-height optimization
 * - Font professional features
 */

'use client'

import { useEffect, useRef, useState } from 'react'
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
    <div className="flex flex-col gap-section font-professional">
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
        <ArrowLeftIcon className="w-4 h-4" />
        {tNav('back')}
      </button>

      {/* Intro with gradient background */}
      <div className="relative p-6 rounded-xl bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }} />
        
        <div className="relative z-10">
          <h2 className="text-enterprise-h2 text-enterprise-primary mb-2 tracking-tight">
            {t('title')}
          </h2>
          <p className="text-enterprise-body text-enterprise-secondary reading-line-height leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary-500/40" />
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>

      {/* Groups with viewport animations */}
      <div className="flex flex-col gap-component">
        {groups.map((group, index) => (
          <AnimatedCard key={group.id} delay={index * 100}>
            <GroupCard
              group={group}
              index={index}
              onSelect={() => onSelectGroup(group.id)}
            />
          </AnimatedCard>
        ))}
      </div>
    </div>
  )
}

// Viewport-based animation component (matching ModuleContent)
function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
      style={{ transitionDelay: isVisible ? '0ms' : `${delay}ms` }}
    >
      {children}
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
  
  // Premium color styles with gradients (matching ModuleContent)
  const colorStyles = {
    primary: {
      bgGradient: 'bg-gradient-to-br from-primary-500/8 to-primary-500/4',
      border: 'border-primary-500/20',
      text: 'text-primary-600 dark:text-primary-400',
      iconBg: 'bg-gradient-to-br from-primary-500 to-primary-600',
      iconText: 'text-white',
      badgeBg: 'bg-primary-50 dark:bg-primary-900/20',
      badgeText: 'text-primary-700 dark:text-primary-300',
      badgeRing: 'ring-1 ring-inset ring-primary-600/20',
      glow: 'shadow-primary-500/25'
    },
    success: {
      bgGradient: 'bg-gradient-to-br from-emerald-500/8 to-emerald-500/4',
      border: 'border-emerald-500/20',
      text: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      iconText: 'text-white',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      badgeText: 'text-emerald-700 dark:text-emerald-300',
      badgeRing: 'ring-1 ring-inset ring-emerald-600/20',
      glow: 'shadow-emerald-500/25'
    },
    warning: {
      bgGradient: 'bg-gradient-to-br from-amber-500/8 to-amber-500/4',
      border: 'border-amber-500/20',
      text: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-gradient-to-br from-amber-500 to-amber-600',
      iconText: 'text-white',
      badgeBg: 'bg-amber-50 dark:bg-amber-900/20',
      badgeText: 'text-amber-700 dark:text-amber-300',
      badgeRing: 'ring-1 ring-inset ring-amber-600/20',
      glow: 'shadow-amber-500/25'
    }
  }

  const style = colorStyles[group.color]

  if (group.isLocked) {
    return (
      <div className="relative p-5 rounded-xl bg-gradient-to-br from-neutral-500/8 to-neutral-500/4 border border-neutral-500/20 overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(115, 115, 115, 0.1) 0%, transparent 50%)'
        }} />
        
        <div className="relative z-10 flex items-start gap-4">
          {/* Icon with gradient + glow */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-400 to-neutral-500 shadow-lg shadow-neutral-500/25 flex items-center justify-center flex-shrink-0">
            <LockIcon className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {index === 0 ? 'Phase 0' : index === 1 ? 'Phase 1' : 'Approfondimenti Tecnici'}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-50 dark:bg-neutral-900/20 text-neutral-700 dark:text-neutral-300 text-xs font-medium ring-1 ring-inset ring-neutral-600/20">
                <LockIcon className="w-3 h-3" />
                Bloccato
              </span>
            </div>
            
            {/* Info box premium */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary-500/8 to-primary-500/4 border border-primary-500/20">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <p className="text-sm text-foreground/70 reading-line-height leading-relaxed">
                  {t('locked', { phase: index === 1 ? t('phase0') : t('phase1') })}
                </p>
              </div>
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
        group relative w-full p-5 rounded-xl border text-left
        transition-all duration-200 ease-out
        hover:translate-y-[-2px] hover:shadow-lg
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2
        tap-target-touch
        ${style.bgGradient} ${style.border}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
        transition-opacity duration-200 pointer-events-none
        ${style.bgGradient}
      `} />
      
      {/* Shine effect on hover */}
      <div className="
        absolute inset-0 rounded-xl
        bg-gradient-to-r from-transparent via-white/10 to-transparent
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-1000
        pointer-events-none
      " />

      <div className="relative z-10 flex items-start gap-4">
        {/* Icon with gradient background and glow */}
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          shadow-lg transition-all duration-200
          ${style.iconBg} ${style.glow}
          group-hover:scale-110 group-hover:shadow-xl
        `}>
          <GroupIcon type={group.id} className={`w-6 h-6 ${style.iconText}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {index === 0 ? 'Phase 0' : index === 1 ? 'Phase 1' : 'Approfondimenti Tecnici'}
            </h3>
            <span className={`
              inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
              ${style.badgeBg} ${style.badgeText} ${style.badgeRing}
            `}>
              {group.moduleCount} moduli
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground reading-line-height leading-relaxed mb-3">
            ~{group.estimatedHours}h di contenuti
          </p>

          <div className={`flex items-center gap-2 text-sm font-medium ${style.text}`}>
            Inizia
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </button>
  )
}

// SVG Icons - Homemade, premium style matching ModuleContent
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

  // technical-deep-dives
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 16a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}
