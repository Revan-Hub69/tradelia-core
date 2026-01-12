/**
 * Emergency Journey Introduction Drawer - Tradelia 2026
 * 
 * Unificato con PremiumDrawer system
 * Navigazione interna: main → risks
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { PremiumDrawer } from '@/src/shared/ui/PremiumDrawer'
import { 
  CheckIcon, 
  ArrowLeftIcon as BackIcon, 
  ArrowRightIcon as ForwardIcon 
} from '@/components/icons/TradeliaIcons'

interface DashboardIntroOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type DrawerStep = 'main' | 'risks'

export function DashboardIntroOverlay({ isOpen, onClose }: DashboardIntroOverlayProps) {
  const [currentStep, setCurrentStep] = useState<DrawerStep>('main')
  const [isAnimating, setIsAnimating] = useState(false)
  const t = useTranslations('emergencyIntro')
  const contentRef = useRef<HTMLDivElement>(null)

  // Reset step when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCurrentStep('main'), 300)
    }
  }, [isOpen])

  // Scroll to top on step change
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [currentStep])

  const goToRisks = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep('risks')
      setIsAnimating(false)
    }, 150)
  }
  
  const goBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep('main')
      setIsAnimating(false)
    }, 150)
  }

  // Custom header with back button for risks step
  const headerContent = currentStep === 'risks' ? (
    <button
      onClick={goBack}
      className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 border border-border/30 text-muted-foreground hover:text-foreground transition-all mr-3"
      aria-label={t('navigation.back')}
    >
      <BackIcon className="w-4 h-4" />
    </button>
  ) : null

  return (
    <PremiumDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={currentStep === 'main' ? t('title') : t('risksTitle')}
      subtitle={currentStep === 'main' ? t('subtitle') : undefined}
      icon={currentStep === 'main' ? <IntroIcon /> : <RisksIcon />}
      accentColor={currentStep === 'main' ? 'primary' : 'warning'}
      size="xl"
      footer={
        currentStep === 'main' ? (
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {t('buttons.understood')}
            <CheckIcon className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex-1 py-3.5 px-4 rounded-xl text-sm font-medium bg-muted/40 hover:bg-muted/60 border border-border/30 text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
            >
              <BackIcon className="w-4 h-4" />
              {t('buttons.backToIntro')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-xl text-sm font-semibold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {t('buttons.goToDashboard')}
              <ForwardIcon className="w-4 h-4" />
            </button>
          </div>
        )
      }
    >
      <div 
        ref={contentRef}
        className={`transition-opacity duration-150 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
      >
        {currentStep === 'main' ? (
          <MainContent t={t} onGoToRisks={goToRisks} />
        ) : (
          <RisksContent t={t} />
        )}
      </div>
    </PremiumDrawer>
  )
}

// Main content component
function MainContent({ t, onGoToRisks }: { t: ReturnType<typeof useTranslations>; onGoToRisks: () => void }) {
  return (
    <div className="px-6 py-6 space-y-6">
      {/* Blocco 1 - ORIGINE */}
      <ContentCard
        icon={<OriginIcon />}
        iconBg="bg-primary/10"
        title={t('sections.origin.title')}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('sections.origin.content')}
        </p>
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
          <p className="text-sm font-semibold text-foreground mb-3">
            {t('sections.origin.situations.title')}
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            {t.raw('sections.origin.situations.items').map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg font-medium">
          {t('sections.origin.conclusion')}
        </p>
      </ContentCard>

      {/* Blocco 2 - EMERGENZE */}
      <ContentCard
        icon={<EmergencyIcon />}
        iconBg="bg-red-500/10"
        title={t('sections.emergencies.title')}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('sections.emergencies.content')}
        </p>
        <div className="space-y-3">
          {t.raw('sections.emergencies.types').map((type: { title: string; description: string }, i: number) => (
            <div key={i} className="p-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="font-semibold text-sm text-foreground mb-1">{type.title}</div>
              <div className="text-sm text-muted-foreground">{type.description}</div>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-sm font-semibold text-foreground">
            {t('sections.emergencies.keyPoint')}
          </p>
        </div>
        <button
          onClick={onGoToRisks}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary font-semibold text-sm transition-all"
        >
          {t('sections.emergencies.deepDiveButton')}
          <ForwardIcon className="w-4 h-4" />
        </button>
      </ContentCard>

      {/* Blocco 3 - APPROCCIO */}
      <ContentCard
        icon={<ApproachIcon />}
        iconBg="bg-emerald-500/10"
        title={t('sections.approach.title')}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('sections.approach.content')}
        </p>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <p className="text-sm font-semibold text-foreground">
            {t('sections.approach.keyPoint')}
          </p>
        </div>
      </ContentCard>

      {/* Blocco 4 - SCOPO */}
      <ContentCard
        icon={<PurposeIcon />}
        iconBg="bg-primary/10"
        title={t('sections.purpose.title')}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('sections.purpose.content')}
        </p>
        <ul className="space-y-3">
          {t.raw('sections.purpose.items').map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckIcon className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="text-sm text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <p className="text-sm font-semibold text-foreground">
            {t('sections.purpose.keyPoint')}
          </p>
        </div>
      </ContentCard>
    </div>
  )
}

// Risks content component
function RisksContent({ t }: { t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="px-6 py-6 space-y-6">
      {/* Cyber Risk */}
      <ContentCard
        icon={<CyberIcon />}
        iconBg="bg-red-500/10"
        title={t('risks.cyber.title')}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('risks.cyber.content')}
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          {t.raw('risks.cyber.points').map((point: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <SourcesBox sources={t.raw('risks.cyber.sources')} />
      </ContentCard>

      {/* Systemic Risk */}
      <ContentCard
        icon={<SystemicIcon />}
        iconBg="bg-amber-500/10"
        title={t('risks.systemic.title')}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('risks.systemic.content')}
        </p>
        <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
          {t('risks.systemic.reason')}
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          {t.raw('risks.systemic.points').map((point: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <SourcesBox sources={t.raw('risks.systemic.sources')} />
      </ContentCard>

      {/* Operational Risk */}
      <ContentCard
        icon={<OperationalIcon />}
        iconBg="bg-primary/10"
        title={t('risks.operational.title')}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t('risks.operational.content')}
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          {t.raw('risks.operational.points').map((point: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <SourcesBox sources={t.raw('risks.operational.sources')} />
      </ContentCard>

      {/* Conclusion */}
      <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ConclusionIcon />
          </div>
          <h4 className="font-semibold text-foreground">
            {t('risks.conclusion.title')}
          </h4>
        </div>
        <ul className="text-sm text-muted-foreground space-y-2 mb-4">
          {t.raw('risks.conclusion.points').map((point: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm font-semibold text-foreground bg-primary/10 p-3 rounded-lg">
          {t('risks.conclusion.keyPoint')}
        </p>
      </div>
    </div>
  )
}

// Reusable content card
function ContentCard({ 
  icon, 
  iconBg, 
  title, 
  children 
}: { 
  icon: React.ReactNode
  iconBg: string
  title: string
  children: React.ReactNode 
}) {
  return (
    <div className="p-5 rounded-xl bg-muted/20 border border-border/30 space-y-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// Sources box
function SourcesBox({ sources }: { sources: string[] }) {
  return (
    <div className="p-3 rounded-lg bg-muted/30">
      <p className="text-xs font-semibold text-muted-foreground mb-2">Fonti:</p>
      <ul className="text-xs text-muted-foreground/80 space-y-1">
        {sources.map((source: string, i: number) => (
          <li key={i} className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50 mt-1.5 flex-shrink-0" />
            <span>{source}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Icons
function IntroIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function RisksIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function OriginIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function EmergencyIcon() {
  return (
    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )
}

function ApproachIcon() {
  return (
    <svg className="w-5 h-5 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PurposeIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

function CyberIcon() {
  return (
    <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function SystemicIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
  )
}

function OperationalIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  )
}

function ConclusionIcon() {
  return (
    <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}
