/**
 * Emergency Journey Introduction Drawer - Tradelia 2026 MODERNIZED
 * 
 * Professional & innovative drawer with system colors and advanced effects
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useModalFocusTrap } from '@/src/shared/hooks/useFocusTrap'
import { 
  CloseIcon, 
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

  // Focus trap for drawer
  const { containerRef: drawerRef } = useModalFocusTrap(isOpen, onClose)
  
  // Ref for content scrollable area
  const contentRef = useRef<HTMLDivElement>(null)

  // Auto-focus with explicit anchor targeting and scroll reset
  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Reset scroll to top when step changes
      contentRef.current.scrollTop = 0
      
      // Focus explicit anchor after animation with timeout cleanup
      const focusTimer = setTimeout(() => {
        const target = contentRef.current?.querySelector('[data-autofocus="true"]') as HTMLElement | null
        if (target) {
          target.focus()
        } else {
          // Fallback to first interactive element
          const firstButton = contentRef.current?.querySelector('button:not([aria-hidden="true"])')
          if (firstButton) {
            (firstButton as HTMLElement).focus()
          }
        }
      }, isAnimating ? 400 : 100)

      return () => clearTimeout(focusTimer)
    }
  }, [currentStep, isOpen, isAnimating])

  // Production-safe scroll lock with documentElement
  useEffect(() => {
    if (!isOpen) return

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    const prevPadding = html.style.paddingRight
    const scrollbarWidth = window.innerWidth - html.clientWidth

    // Apply robust scroll lock
    html.style.overflow = 'hidden'
    html.style.paddingRight = scrollbarWidth ? `${scrollbarWidth}px` : ''

    // Enhanced main content push with refined animation
    const mainContent = document.querySelector('.dashboard-main-content') as HTMLElement
    if (mainContent && window.innerWidth >= 1024) {
      mainContent.style.transform = 'translateX(-300px)'
      mainContent.style.transition = 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      mainContent.style.opacity = '0.7'
    }
    
    // Animation complete with cleanup
    const animationTimer = setTimeout(() => setIsAnimating(false), 300)

    return () => {
      // Restore scroll lock
      html.style.overflow = prevOverflow
      html.style.paddingRight = prevPadding
      
      // Reset main content position
      if (mainContent) {
        mainContent.style.transform = ''
        mainContent.style.transition = 'transform 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        mainContent.style.opacity = ''
      }
      
      clearTimeout(animationTimer)
    }
  }, [isOpen])

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

  if (!isOpen) return null

  return (
    <>
      {/* Enhanced Backdrop with refined gradient */}
      <div 
        className={`
          fixed inset-0 z-[60] transition-all duration-300 ease-out
          bg-background/85 backdrop-blur-lg backdrop-saturate-110
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Refined Side Drawer with subtle glass morphism */}
      <div 
        ref={drawerRef as React.RefObject<HTMLDivElement>}
        className={`
          fixed top-0 right-0 bottom-0 w-full max-w-xl z-[65] 
          section-frame border-l border-r-0 border-t-0 border-b-0 rounded-l-xl rounded-r-none
          backdrop-blur-lg backdrop-saturate-105
          shadow-xl shadow-primary/8
          transform transition-all duration-300 ease-out overflow-hidden
          flex flex-col
          ${isOpen ? 'translate-x-0 scale-100' : 'translate-x-full scale-98'}
        `}
        style={{
          background: 'hsl(var(--bg-section)/0.95)',
          borderColor: 'hsl(var(--border-section))',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
      >
        {/* Refined Header with subtle glass morphism */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border/20 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            {currentStep === 'risks' && (
              <button
                onClick={goBack}
                className="
                  p-2.5 rounded-lg transition-all duration-200 ease-out
                  bg-muted/40 hover:bg-muted/60 active:scale-95
                  border border-border/30 hover:border-border/50
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
              p-2.5 rounded-lg transition-all duration-200 ease-out
              bg-muted/30 hover:bg-error/10 active:scale-95
              border border-border/20 hover:border-error/30
              text-muted-foreground hover:text-error
              shadow-sm hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-error/50 focus:ring-offset-2
            "
            aria-label={t('navigation.close')}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Refined Content with smooth transitions */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto overscroll-contain min-h-0 max-h-full"
        >
          <div className={`
            transition-all duration-250 ease-out
            ${isAnimating ? 'opacity-60 transform translate-x-1 pointer-events-none' : 'opacity-100 transform translate-x-0'}
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
                      {t.raw('sections.origin.situations.items').map((item: string) => (
                        <li key={`origin-situation-${item.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-center gap-2">
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
                    {t.raw('sections.emergencies.types').map((type: { title: string; description: string }) => (
                      <div key={`emergency-type-${type.title.replace(/\s+/g, '-').toLowerCase()}`} className="
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
                    data-autofocus="true"
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
                    {t.raw('sections.purpose.items').map((item: string) => (
                      <li key={`purpose-item-${item.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-3">
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
                    {t.raw('risks.cyber.points').map((point: string) => (
                      <li key={`cyber-point-${point.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-error flex-shrink-0 mt-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="section-frame p-4 rounded-xl bg-muted/30">
                    <p className="text-xs font-semibold content-primary mb-2">Fonti:</p>
                    <ul className="text-xs content-secondary space-y-1">
                      {t.raw('risks.cyber.sources').map((source: string) => (
                        <li key={`cyber-source-${source.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-2">
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
                    {t.raw('risks.systemic.points').map((point: string) => (
                      <li key={`systemic-point-${point.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0 mt-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="section-frame p-4 rounded-xl bg-muted/30">
                    <p className="text-xs font-semibold content-primary mb-2">Fonti:</p>
                    <ul className="text-xs content-secondary space-y-1">
                      {t.raw('risks.systemic.sources').map((source: string) => (
                        <li key={`systemic-source-${source.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-2">
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
                    {t.raw('risks.operational.points').map((point: string) => (
                      <li key={`operational-point-${point.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <div className="section-frame p-4 rounded-xl bg-muted/30">
                    <p className="text-xs font-semibold content-primary mb-2">Fonti:</p>
                    <ul className="text-xs content-secondary space-y-1">
                      {t.raw('risks.operational.sources').map((source: string) => (
                        <li key={`operational-source-${source.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-2">
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
                    {t.raw('risks.conclusion.points').map((point: string) => (
                      <li key={`conclusion-point-${point.replace(/\s+/g, '-').toLowerCase()}`} className="flex items-start gap-2">
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

        {/* Refined Footer with elegant buttons */}
        <div className="sticky bottom-0 p-6 border-t border-border/20 backdrop-blur-lg">
          {currentStep === 'main' ? (
            <button
              onClick={onClose}
              data-autofocus="true"
              className="
                w-full h-12 px-6 text-base font-semibold rounded-lg
                bg-primary text-white shadow-lg shadow-primary/15
                transition-all duration-200 ease-out
                hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
                active:scale-[0.98]
                focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
                flex items-center justify-center gap-2
              "
            >
              {t('buttons.understood')}
              <CheckIcon />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="
                  flex-1 h-12 px-6 text-base font-medium rounded-lg
                  bg-muted/40 hover:bg-muted/60 active:scale-95
                  border border-border/30 hover:border-border/50
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
                data-autofocus="true"
                className="
                  flex-1 h-12 px-6 text-base font-semibold rounded-lg
                  bg-primary text-white shadow-lg shadow-primary/15
                  transition-all duration-200 ease-out
                  hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5
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

// Refined SVG Icons - Standardized to 24x24 viewBox
function OriginIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 3L4 9V21H20V9L12 3Z" 
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path 
        d="M12 2V12L18 18" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2"
        fill="none"
      />
    </svg>
  )
}

function CyberIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect 
        x="3" 
        y="11" 
        width="18" 
        height="10" 
        rx="2" 
        stroke="hsl(var(--error))" 
        strokeWidth="2"
        fill="none"
      />
      <path 
        d="M7 11V7A5 5 0 0 1 17 7V11" 
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2"
        fill="none"
      />
      <path 
        d="M8 14S9.5 16 12 16S16 14 16 14" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <line 
        x1="9" 
        y1="9" 
        x2="9.01" 
        y2="9" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <line 
        x1="15" 
        y1="9" 
        x2="15.01" 
        y2="9" 
        stroke="hsl(var(--primary))" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  )
}

function ConclusionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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