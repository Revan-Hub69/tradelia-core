/**
 * Section Dashboard - Generic Component
 * 
 * Struttura pagina sezione:
 * ┌─────────────────────────────────────────────────────┐
 * │  INTRODUZIONE COGNITIVA (hero alert in alto)        │
 * └─────────────────────────────────────────────────────┘
 * ┌─────────────────────┐  ┌─────────────────────┐
 * │ Percorso dinamico   │  │ Checklist anti-err  │
 * └─────────────────────┘  └─────────────────────┘
 * ┌─────────────────────┐  ┌─────────────────────┐
 * │ Indicatori base     │  │ Demo assistita      │
 * └─────────────────────┘  └─────────────────────┘
 */

'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { DashboardLayout } from '@/src/widgets/dashboard-layout'
import { DashboardAuthGuard } from '@/src/widgets/dashboard-auth'
import { JourneyCard } from '@/src/shared/ui/JourneyCard'
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'
import { ComplexityIndicator } from '@/src/shared/ui/ComplexityIndicator'
import { CRYPTO_SECTIONS, type SectionId } from '@/src/shared/config/crypto-sections'
import { useProgressTracking } from '@/src/shared/hooks/useProgressTracking'
import { useDashboardAuth } from '@/src/processes/dashboard-auth'

interface SectionDashboardProps {
  sectionId: SectionId
}

// Configurazione 4 pilastri per ogni sezione
const SECTION_PILLARS: Record<SectionId, PillarConfig[]> = {
  own: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ],
  yield: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ],
  invest: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ],
  speculate: [
    { id: 'learning-path', titleKey: 'pillars.learningPath.title', descriptionKey: 'pillars.learningPath.description', icon: 'book', color: 'primary', focusKeys: ['pillars.learningPath.focus1', 'pillars.learningPath.focus2', 'pillars.learningPath.focus3'] },
    { id: 'checklist', titleKey: 'pillars.checklist.title', descriptionKey: 'pillars.checklist.description', icon: 'check', color: 'success', focusKeys: ['pillars.checklist.focus1', 'pillars.checklist.focus2', 'pillars.checklist.focus3'] },
    { id: 'indicators', titleKey: 'pillars.indicators.title', descriptionKey: 'pillars.indicators.description', icon: 'chart', color: 'warning', focusKeys: ['pillars.indicators.focus1', 'pillars.indicators.focus2', 'pillars.indicators.focus3'] },
    { id: 'demo', titleKey: 'pillars.demo.title', descriptionKey: 'pillars.demo.description', icon: 'play', color: 'error', focusKeys: ['pillars.demo.focus1', 'pillars.demo.focus2', 'pillars.demo.focus3'] }
  ]
}

interface PillarConfig {
  id: string
  titleKey: string
  descriptionKey: string
  icon: 'book' | 'check' | 'chart' | 'play'
  color: 'primary' | 'success' | 'warning' | 'error'
  focusKeys: string[]
}

export function SectionDashboard({ sectionId }: SectionDashboardProps) {
  const t = useTranslations('sections')
  const section = CRYPTO_SECTIONS[sectionId]
  const pillars = SECTION_PILLARS[sectionId]

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activePillar, setActivePillar] = useState<string | null>(null)

  // Progress tracking
  const { state } = useDashboardAuth()
  const { getPillarProgress } = useProgressTracking({
    isGuest: state.isGuestMode,
    userId: state.user?.id
  })

  // Pillars with progress
  const pillarsWithProgress = useMemo(() => {
    return pillars.map(pillar => {
      const progress = getPillarProgress(sectionId, pillar.id)
      const focusAreas = pillar.focusKeys.map(key => t(key))
      return { ...pillar, completionPercent: progress?.percentage || 0, focusAreas }
    })
  }, [pillars, getPillarProgress, sectionId, t])

  const activePillarData = activePillar 
    ? pillarsWithProgress.find(p => p.id === activePillar) 
    : null

  const handleOpenPillar = (pillarId: string) => {
    setActivePillar(pillarId)
    setDrawerOpen(true)
  }

  // CLOSE: Reset everything and cleanup inert
  const closeDrawer = () => {
    setDrawerOpen(false)
    
    // Hard cleanup - ensure inert is removed BEFORE unmounting
    const mainContent = document.querySelector('#main-content') as HTMLElement | null
    if (mainContent) {
      mainContent.removeAttribute('inert')
    }
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    
    // Delay resetting activePillar to allow drawer animation to complete
    setTimeout(() => {
      setActivePillar(null)
    }, 200)
  }

  // Color mapping for section
  const sectionColors = {
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    error: { bg: 'bg-error/10', text: 'text-error', border: 'border-error/20' },
    info: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' }
  }
  const colors = sectionColors[section.color] || sectionColors.success

  return (
    <DashboardAuthGuard>
      <DashboardLayout>
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <SectionIcon type={section.icon} className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t(`${sectionId}.title`)}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <ComplexityIndicator level={section.complexity} size="sm" showTooltip={false} />
                <span className="text-sm text-muted-foreground">{t(`${sectionId}.complexity`)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 pb-8">
          {/* INTRODUZIONE COGNITIVA - Hero Alert */}
          <SectionHeroAlert sectionId={sectionId} colors={colors} t={t} />

          {/* 4 PILASTRI - Griglia 2x2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pillarsWithProgress.map((pillar) => (
              <JourneyCard
                key={pillar.id}
                title={t(pillar.titleKey)}
                description={t(pillar.descriptionKey)}
                icon={<PillarIcon type={pillar.icon} className="w-6 h-6" />}
                accentColor={pillar.color}
                onClick={() => handleOpenPillar(pillar.id)}
                badge={<CompletionBadge percentage={pillar.completionPercent} />}
              >
                {/* Focus Areas - come in EmergencyPillars */}
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('ui.focus')}:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {pillar.focusAreas.map((area) => (
                      <span 
                        key={area}
                        className="px-2 py-1 text-xs bg-muted/50 text-muted-foreground rounded-md"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </JourneyCard>
            ))}
          </div>
        </div>

        {/* Drawer per pilastro attivo */}
        {activePillarData && (
          <PremiumDrawer
            isOpen={drawerOpen}
            onClose={closeDrawer}
            title={t(activePillarData.titleKey)}
            subtitle={t(`${sectionId}.title`)}
            icon={<PillarIcon type={activePillarData.icon} className="w-6 h-6" />}
            accentColor={activePillarData.color}
            size="xl"
          >
            <div className="space-y-6">
              <p className="text-muted-foreground">
                {t(activePillarData.descriptionKey)}
              </p>
              
              {/* Placeholder per contenuto */}
              <div className="p-8 rounded-lg border border-dashed border-border/50 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <PillarIcon type={activePillarData.icon} className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Contenuto in arrivo
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  I moduli per questo pilastro sono in fase di sviluppo.
                </p>
              </div>
            </div>
          </PremiumDrawer>
        )}
      </DashboardLayout>
    </DashboardAuthGuard>
  )
}

// Hero Alert per introduzione cognitiva
function SectionHeroAlert({ 
  sectionId, 
  colors, 
  t 
}: { 
  sectionId: SectionId
  colors: { bg: string; text: string; border: string }
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className={`section-frame p-6 border-l-4 ${colors.border}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <AlertIcon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            {t(`${sectionId}.whatItAnalyzes`)}
          </h2>
          <ul className="space-y-2">
            {[0, 1, 2].map((index) => (
              <li key={index} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace('/10', '')} mt-2 flex-shrink-0`} />
                <span className="text-muted-foreground">
                  {t(`${sectionId}.whatItAnalyzesList.${index}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// Badge completamento
function CompletionBadge({ percentage }: { percentage: number }) {
  if (percentage === 0) return null
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-success rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{percentage}%</span>
    </div>
  )
}

// Icons
function SectionIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'wallet':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      )
    case 'percent':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'trending':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      )
    case 'zap':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      )
    default:
      return null
  }
}

function PillarIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'book':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    case 'check':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'chart':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    case 'play':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        </svg>
      )
    default:
      return null
  }
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  )
}
