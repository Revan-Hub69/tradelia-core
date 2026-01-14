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

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

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
  const groupNumber = groupId === 'phase-0' ? 0 : groupId === 'phase-1' ? 1 : 2

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
      <div className="relative density-card rounded-xl bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
        }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-enterprise-primary tracking-tight">
              {groupTitle}
            </h2>
            <span className="text-sm font-semibold text-enterprise-primary px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm border border-primary-500/20">
              {completedModules.length}/{modules.length}
            </span>
          </div>
          
          {/* Progress bar with shimmer (matching ModuleContent style) */}
          <div 
            className="relative h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('progress')}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-50" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)'
            }} />
            
            {/* Progress fill with gradient and shimmer */}
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 shadow-sm transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${completionPercent}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow" />
            </div>
            
            {/* Glow effect */}
            <div 
              className="absolute top-0 h-full bg-primary-400/50 blur-sm transition-all duration-500"
              style={{ 
                width: `${completionPercent}%`,
                right: `${100 - completionPercent}%`
              }}
            />
          </div>

          {/* Completion badge with animation */}
          {completionPercent === 100 && (
            <div className="mt-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-sm font-medium ring-1 ring-inset ring-emerald-600/20 shadow-sm">
                <CheckCircleFilledIcon className="w-4 h-4 animate-zoom-in" />
                <span>{tGroups('completed')}</span>
              </div>
            </div>
          )}
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
                module={module}
                index={index}
                groupNumber={groupNumber}
                isCompleted={isCompleted}
                isLocked={isLocked}
                progressPercent={moduleProgressPercent}
                onSelect={() => onSelectModule(module.id)}
              />
            </AnimatedCard>
          )
        })}
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

function ModuleCard({
  module,
  index,
  groupNumber,
  isCompleted,
  isLocked,
  progressPercent,
  onSelect
}: {
  module: Module
  index: number
  groupNumber: number
  isCompleted: boolean
  isLocked: boolean
  progressPercent: number
  onSelect: () => void
}) {
  if (isLocked) {
    return (
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ height: `${progressPercent}%`, width: '4px' }}
          />
        </div>
        
        <div className="pl-6 density-card rounded-xl bg-card border border-border-card overflow-hidden relative shadow-sm">
          <div className="flex items-center gap-6">
            {/* SVG Number - pastel blue-gray "stampato" */}
            <div className="flex-shrink-0">
              <StampatoNumber groupNumber={groupNumber} moduleNumber={index + 1} />
            </div>

            {/* Module info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-enterprise-primary truncate tracking-tight mb-1">
                {module.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-enterprise-secondary">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>~{module.estimatedMinutes} min</span>
              </div>
            </div>
          </div>

          {/* Glassmorphism overlay - dashboard style */}
          <div className="absolute inset-0 bg-card/40 backdrop-blur-[1px] rounded-xl flex items-end justify-center pb-4 cursor-not-allowed">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/90 rounded-full border border-border-card shadow-sm">
              <LockIcon className="w-3.5 h-3.5 text-enterprise-secondary" />
              <span className="text-xs font-medium text-enterprise-secondary">
                Bloccato
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative">
      {/* Progress bar on left side - 3-4px width with rounded corners and glow */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-500 to-emerald-500 transition-all duration-500 rounded-full shadow-lg shadow-primary-500/30"
          style={{ height: `${progressPercent}%`, width: '4px' }}
        />
      </div>
      
      <button
        onClick={onSelect}
        className="group relative w-full density-card rounded-xl border text-left bg-card border-border-card transition-all duration-200 ease-out hover:border-primary-500/30 hover:shadow-lg hover:translate-y-[-2px] tap-target-touch focus-enterprise-ring"
      >
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 flex-1 min-w-0">
            {/* SVG Number - pastel blue-gray "stampato" */}
            <div className="flex-shrink-0">
              <StampatoNumber groupNumber={groupNumber} moduleNumber={index + 1} />
            </div>

            {/* Module info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-enterprise-primary truncate tracking-tight">
                  {module.title}
                </h3>
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckIcon className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>~{module.estimatedMinutes} min</span>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <ArrowRightIcon className="w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </button>
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

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
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

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
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

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}


// SVG "Stampato" Number Component - Pastel Blue-Gray
function StampatoNumber({ groupNumber, moduleNumber }: { groupNumber: number; moduleNumber: number }) {
  const moduleStr = String(moduleNumber).padStart(2, '0')
  
  return (
    <svg width="80" height="48" viewBox="0 0 80 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
      {/* Group number (large) */}
      <text
        x="0"
        y="38"
        fontSize="42"
        fontWeight="900"
        fill="currentColor"
        className="text-slate-400 dark:text-slate-500"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        {groupNumber}
      </text>
      
      {/* Dot */}
      <text
        x="32"
        y="38"
        fontSize="42"
        fontWeight="900"
        fill="currentColor"
        className="text-slate-400 dark:text-slate-500"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        .
      </text>
      
      {/* Module number (medium) */}
      <text
        x="42"
        y="36"
        fontSize="28"
        fontWeight="700"
        fill="currentColor"
        className="text-slate-400 dark:text-slate-500"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        {moduleStr}
      </text>
    </svg>
  )
}
