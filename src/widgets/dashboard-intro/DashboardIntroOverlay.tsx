/**
 * Emergency Journey Introduction Drawer - Tradelia 2026 MODERNIZED
 * 
 * Professional & innovative drawer with system colors and advanced effects
 */

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useModalFocusTrap } from '@/src/shared/hooks/useFocusTrap'

interface DashboardIntroOverlayProps {
  isOpen: boolean
  onClose: () => void
}

type DrawerStep = 'main' | 'risks'

export function DashboardIntroOverlay({ isOpen, onClose }: DashboardIntroOverlayProps) {
  const [currentStep, setCurrentStep] = useState<DrawerStep>('main')
  const [isAnimating, setIsAnimating] = useState(false)
  const t = useTranslations('emergencyIntro')

  // Focus trap for drawer
  const { containerRef: drawerRef } = useModalFocusTrap(isOpen, onClose)

  // Enhanced scroll lock with smooth animations
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      
      // Store current scroll position
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      
      // Apply scroll lock with smooth transition
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = `-${scrollX}px`
      document.body.style.width = '100%'
      
      // Store scroll position for restoration
      document.body.dataset.scrollY = scrollY.toString()
      document.body.dataset.scrollX = scrollX.toString()
      
      // Enhanced main content push with elastic animation
      const mainContent = document.querySelector('.dashboard-main-content') as HTMLElement
      if (mainContent && window.innerWidth >= 1024) {
        mainContent.style.transform = 'translateX(-400px) scale(0.98)'
        mainContent.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        mainContent.style.filter = 'blur(1px)'
      }
      
      // Animation complete
      setTimeout(() => setIsAnimating(false), 400)
    } else {
      setIsAnimating(true)
      
      // Restore scroll position and remove scroll lock
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10)
      const scrollX = parseInt(document.body.dataset.scrollX || '0', 10)
      
      // Remove scroll lock styles
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.width = ''
      
      // Restore scroll position
      window.scrollTo(scrollX, scrollY)
      
      // Clean up data attributes
      delete document.body.dataset.scrollY
      delete document.body.dataset.scrollX
      
      // Reset main content position with elastic return
      const mainContent = document.querySelector('.dashboard-main-content') as HTMLElement
      if (mainContent) {
        mainContent.style.transform = ''
        mainContent.style.transition = 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)'
        mainContent.style.filter = ''
      }
      
      setCurrentStep('main')
      setTimeout(() => setIsAnimating(false), 400)
    }

    return () => {
      // Cleanup on unmount
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10)
      const scrollX = parseInt(document.body.dataset.scrollX || '0', 10)
      
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.width = ''
      
      if (scrollY || scrollX) {
        window.scrollTo(scrollX, scrollY)
      }
      
      delete document.body.dataset.scrollY
      delete document.body.dataset.scrollX
      
      const mainContent = document.querySelector('.dashboard-main-content') as HTMLElement
      if (mainContent) {
        mainContent.style.transform = ''
        mainContent.style.filter = ''
      }
    }
  }, [isOpen])

  const goToRisks = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep('risks')
      setIsAnimating(false)
    }, 200)
  }
  
  const goBack = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep('main')
      setIsAnimating(false)
    }, 200)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Enhanced Backdrop with gradient and blur */}
      <div 
        className={`
          fixed inset-0 z-[60] transition-all duration-400 ease-out
          bg-gradient-to-br from-background/80 via-background/60 to-background/40
          backdrop-blur-md backdrop-saturate-150
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modern Side Drawer with glass morphism */}
      <div 
        ref={drawerRef as React.RefObject<HTMLDivElement>}
        className={`
          fixed top-0 right-0 bottom-0 w-full max-w-xl z-[65] 
          section-frame border-l-2 border-r-0 border-t-0 border-b-0 rounded-l-2xl rounded-r-none
          backdrop-blur-xl backdrop-saturate-150
          shadow-2xl shadow-primary/10
          transform transition-all duration-400 ease-out overflow-hidden
          flex flex-col
          ${isOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-95'}
          ${isAnimating ? 'pointer-events-none' : 'pointer-events-auto'}
        `}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--bg-section)) 0%, hsl(var(--bg-section)/0.95) 100%)',
          borderColor: 'hsl(var(--border-section))',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
      >
        {/* Modern Header with glass morphism and gradient */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border/30 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            {currentStep === 'risks' && (
              <button
                onClick={goBack}
                className="
                  p-3 rounded-xl transition-all duration-200 ease-out
                  bg-muted/50 hover:bg-muted/80 active:scale-95
                  border border-border/50 hover:border-border
                  text-muted-foreground hover:text-foreground
                  shadow-sm hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                "
                aria-label={t('navigation.back')}
              >
                <BackIcon />
              </button>
            )}
            <div className="space-y-1">
              <h1 id="intro-title" className="text-xl font-bold content-primary">
                {currentStep === 'main' ? t('title') : t('risksTitle')}
              </h1>
              {currentStep === 'main' && (
                <p className="text-sm content-secondary">
                  {t('subtitle')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="
              p-3 rounded-xl transition-all duration-200 ease-out
              bg-muted/30 hover:bg-error/10 active:scale-95
              border border-border/30 hover:border-error/30
              text-muted-foreground hover:text-error
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-error/50 focus:ring-offset-2
            "
            aria-label={t('navigation.close')}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Enhanced Content with smooth transitions */}
        <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 max-h-full">
          <div className={`
            transition-all duration-300 ease-out
            ${isAnimating ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'}
          `}>
            {currentStep === 'main' ? (
              <div className="p-6 pb-32 space-y-8 min-h-full">
                {/* Blocco 1 - ORIGINE con design moderno */}
                <div className="card-2026 p-6 space-y-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <OriginIcon />
                    </div>
                    <h2 className="text-lg font-bold content-primary">
                      {t('sections.origin.title')}
                    </h2>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('sections.origin.content')}
                  </p>
                  <div className="section-frame-warning p-4 rounded-xl">
                    <p className="text-sm font-semibold content-primary mb-3">
                      {t('sections.origin.situations.title')}
                    </p>
                    <ul className="text-sm content-secondary space-y-2">
                      {t.raw('sections.origin.situations.items').map((item: string, index: number) => (
                        <li key={`origin-${index}`} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed font-medium">
                    {t('sections.origin.conclusion')}
                  </p>
                </div>

                {/* Blocco 2 - EMERGENZE con design innovativo */}
                <div className="card-2026 p-6 space-y-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                      <EmergencyIcon />
                    </div>
                    <h2 className="text-lg font-bold content-primary">
                      {t('sections.emergencies.title')}
                    </h2>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('sections.emergencies.content')}
                  </p>
                  <div className="grid gap-3">
                    {t.raw('sections.emergencies.types').map((type: { title: string; description: string }, index: number) => (
                      <div key={`emergency-${index}`} className="
                        p-4 rounded-xl border border-border/50 
                        bg-gradient-to-r from-muted/30 to-muted/10
                        hover:border-border hover:shadow-sm
                        transition-all duration-200
                      ">
                        <div className="font-semibold text-sm content-primary">{type.title}</div>
                        <div className="text-xs content-secondary mt-1">{type.description}</div>
                      </div>
                    ))}
                  </div>
                  <div className="section-frame-info p-4 rounded-xl">
                    <p className="font-semibold text-sm content-primary">
                      {t('sections.emergencies.keyPoint')}
                    </p>
                  </div>
                  <button
                    onClick={goToRisks}
                    className="
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl
                      bg-primary/10 hover:bg-primary/20 active:scale-95
                      border border-primary/20 hover:border-primary/40
                      text-primary font-semibold text-sm
                      transition-all duration-200 ease-out
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                    "
                  >
                    {t('sections.emergencies.deepDiveButton')}
                    <ForwardIcon />
                  </button>
                </div>

                {/* Blocco 3 - APPROCCIO con stile premium */}
                <div className="card-2026 p-6 space-y-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                      <ApproachIcon />
                    </div>
                    <h2 className="text-lg font-bold content-primary">
                      {t('sections.approach.title')}
                    </h2>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('sections.approach.content')}
                  </p>
                  <div className="section-frame-success p-4 rounded-xl">
                    <p className="font-semibold text-sm content-primary">
                      {t('sections.approach.keyPoint')}
                    </p>
                  </div>
                </div>

                {/* Blocco 4 - SCOPO con design finale */}
                <div className="card-2026 p-6 space-y-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <PurposeIcon />
                    </div>
                    <h2 className="text-lg font-bold content-primary">
                      {t('sections.purpose.title')}
                    </h2>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('sections.purpose.content')}
                  </p>
                  <ul className="space-y-3">
                    {t.raw('sections.purpose.items').map((item: string, index: number) => (
                      <li key={`purpose-${index}`} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckIcon />
                        </div>
                        <span className="text-sm content-secondary">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="section-frame-success p-4 rounded-xl">
                    <p className="font-semibold text-sm content-primary">
                      {t('sections.purpose.keyPoint')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Risks Detail View - Modernized */
              <div className="p-6 pb-32 space-y-8 min-h-full">
                {/* Sezione 1 - Cyber Risk */}
                <div className="card-2026 p-6 space-y-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                      <CyberIcon />
                    </div>
                    <h3 className="font-bold text-lg content-primary">
                      {t('risks.cyber.title')}
                    </h3>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('risks.cyber.content')}
                  </p>
                  <ul className="text-sm content-secondary space-y-2">
                    {t.raw('risks.cyber.points').map((point: string, index: number) => (
                      <li key={`cyber-${index}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0 mt-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="section-frame p-4 rounded-xl bg-muted/30">
                    <p className="text-xs font-semibold content-primary mb-2">Fonti:</p>
                    <ul className="text-xs content-secondary space-y-1">
                      {t.raw('risks.cyber.sources').map((source: string, index: number) => (
                        <li key={`cyber-source-${index}`} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sezione 2 - Systemic Risk */}
                <div className="card-2026 p-6 space-y-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                      <SystemicIcon />
                    </div>
                    <h3 className="font-bold text-lg content-primary">
                      {t('risks.systemic.title')}
                    </h3>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('risks.systemic.content')}
                  </p>
                  <p className="text-sm content-secondary">
                    {t('risks.systemic.reason')}
                  </p>
                  <ul className="text-sm content-secondary space-y-2">
                    {t.raw('risks.systemic.points').map((point: string, index: number) => (
                      <li key={`systemic-${index}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0 mt-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="section-frame p-4 rounded-xl bg-muted/30">
                    <p className="text-xs font-semibold content-primary mb-2">Fonti:</p>
                    <ul className="text-xs content-secondary space-y-1">
                      {t.raw('risks.systemic.sources').map((source: string, index: number) => (
                        <li key={`systemic-source-${index}`} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sezione 3 - Operational Disruptions */}
                <div className="card-2026 p-6 space-y-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <OperationalIcon />
                    </div>
                    <h3 className="font-bold text-lg content-primary">
                      {t('risks.operational.title')}
                    </h3>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    {t('risks.operational.content')}
                  </p>
                  <ul className="text-sm content-secondary space-y-2">
                    {t.raw('risks.operational.points').map((point: string, index: number) => (
                      <li key={`operational-${index}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="section-frame p-4 rounded-xl bg-muted/30">
                    <p className="text-xs font-semibold content-primary mb-2">Fonti:</p>
                    <ul className="text-xs content-secondary space-y-1">
                      {t.raw('risks.operational.sources').map((source: string, index: number) => (
                        <li key={`operational-source-${index}`} className="flex items-start gap-2">
                          <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                          {source}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Conclusione con design finale */}
                <div className="section-frame-info p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ConclusionIcon />
                    </div>
                    <h4 className="font-bold text-lg content-primary">
                      {t('risks.conclusion.title')}
                    </h4>
                  </div>
                  <ul className="text-sm content-secondary space-y-2 mb-4">
                    {t.raw('risks.conclusion.points').map((point: string, index: number) => (
                      <li key={`conclusion-${index}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="font-semibold text-sm content-primary">
                    {t('risks.conclusion.keyPoint')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modern Footer with premium buttons */}
        <div className="sticky bottom-0 p-6 border-t border-border/30 backdrop-blur-xl">
          {currentStep === 'main' ? (
            <button
              onClick={onClose}
              className="
                w-full h-12 px-6 text-base font-semibold rounded-xl
                bg-gradient-to-r from-primary to-primary/90
                text-white shadow-lg shadow-primary/20
                transition-all duration-200 ease-out
                hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                flex items-center justify-center gap-2
              "
            >
              {t('buttons.understood')}
              <CheckIcon />
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={goBack}
                className="
                  flex-1 h-12 px-6 text-base font-medium rounded-xl
                  bg-muted/50 hover:bg-muted/80 active:scale-95
                  border border-border/50 hover:border-border
                  text-muted-foreground hover:text-foreground
                  transition-all duration-200 ease-out
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  flex items-center justify-center gap-2
                "
              >
                <BackIcon />
                {t('buttons.backToIntro')}
              </button>
              <button
                onClick={onClose}
                className="
                  flex-1 h-12 px-6 text-base font-semibold rounded-xl
                  bg-gradient-to-r from-primary to-primary/90
                  text-white shadow-lg shadow-primary/20
                  transition-all duration-200 ease-out
                  hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
                  active:scale-[0.98]
                  focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                  flex items-center justify-center gap-2
                "
              >
                {t('buttons.goToDashboard')}
                <ForwardIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// Modern SVG Icons - System Colors Compliant
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path 
        d="M13.5 4.5L4.5 13.5M4.5 4.5l9 9" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
      <path 
        d="M15 4.5L6.75 12.75L3 9" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path 
        d="M11.25 13.5L6.75 9L11.25 4.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ForwardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path 
        d="M6.75 4.5L11.25 9L6.75 13.5" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

// New Modern Icons for Sections
function OriginIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path 
        d="M10 2L3 7V18H17V7L10 2Z" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function EmergencyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path 
        d="M10 2L12.09 6.26L17 7L13 10.74L14.18 15.74L10 13.5L5.82 15.74L7 10.74L3 7L7.91 6.26L10 2Z" 
        stroke="hsl(var(--error))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function ApproachIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path 
        d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
        stroke="hsl(var(--success))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function PurposeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path 
        d="M10 2V10L15 15" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle 
        cx="10" 
        cy="10" 
        r="8" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

function CyberIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect 
        x="3" 
        y="11" 
        width="14" 
        height="6" 
        rx="2" 
        stroke="hsl(var(--error))" 
        strokeWidth="2"
        fill="none"
      />
      <path 
        d="M7 11V7A3 3 0 0 1 13 7V11" 
        stroke="hsl(var(--error))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SystemicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path 
        d="M12 2L2 7L12 12L22 7L12 2Z" 
        stroke="hsl(var(--warning))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <path 
        d="M2 17L12 22L22 17" 
        stroke="hsl(var(--warning))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M2 12L12 17L22 12" 
        stroke="hsl(var(--warning))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function OperationalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle 
        cx="10" 
        cy="10" 
        r="3" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2"
        fill="none"
      />
      <path 
        d="M19.4 15A9 9 0 0 0 20 12A9 9 0 0 0 19.4 9" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M4.6 15A9 9 0 0 1 4 12A9 9 0 0 1 4.6 9" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  )
}

function ConclusionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path 
        d="M9 11L12 14L22 4" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M21 12V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H16" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}