/**
 * Emergency Journey Introduction Drawer - Tradelia 2026
 * 
 * True side drawer with proper scroll behavior and focus management
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
  const t = useTranslations('emergencyIntro')

  // Focus trap for drawer
  const { containerRef: drawerRef } = useModalFocusTrap(isOpen, onClose)

  // Proper scroll lock with position preservation - Fixed for drawer scrolling
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      // Apply scroll lock using overflow hidden instead of position fixed
      // This allows internal scrolling in the drawer
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = '0px' // Prevent layout shift
      
      // Store scroll position for restoration
      document.body.dataset.scrollY = scrollY.toString()
      document.body.dataset.scrollX = scrollX.toString()
      
      // Push main content to the left on desktop
      const mainContent = document.querySelector('.dashboard-main-content') as HTMLElement
      if (mainContent && window.innerWidth >= 1024) {
        mainContent.style.transform = 'translateX(-320px)'
        mainContent.style.transition = 'transform 300ms ease-out'
      }
    } else {
      // Restore scroll position and remove scroll lock
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10)
      const scrollX = parseInt(document.body.dataset.scrollX || '0', 10)
      
      // Remove scroll lock styles
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      
      // Restore scroll position
      window.scrollTo(scrollX, scrollY)
      
      // Clean up data attributes
      delete document.body.dataset.scrollY
      delete document.body.dataset.scrollX
      
      // Reset main content position
      const mainContent = document.querySelector('.dashboard-main-content') as HTMLElement
      if (mainContent) {
        mainContent.style.transform = ''
        mainContent.style.transition = 'transform 300ms ease-out'
      }
      
      setCurrentStep('main')
    }

    return () => {
      // Cleanup on unmount
      const scrollY = parseInt(document.body.dataset.scrollY || '0', 10)
      const scrollX = parseInt(document.body.dataset.scrollX || '0', 10)
      
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
      
      if (scrollY || scrollX) {
        window.scrollTo(scrollX, scrollY)
      }
      
      delete document.body.dataset.scrollY
      delete document.body.dataset.scrollX
      
      const mainContent = document.querySelector('.dashboard-main-content') as HTMLElement
      if (mainContent) {
        mainContent.style.transform = ''
      }
    }
  }, [isOpen])

  const goToRisks = () => setCurrentStep('risks')
  const goBack = () => setCurrentStep('main')

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with proper z-index */}
      <div 
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* True Side Drawer - slides from right with proper layering */}
      <div 
        ref={drawerRef as React.RefObject<HTMLDivElement>}
        className={`
          fixed top-0 right-0 bottom-0 w-full max-w-lg bg-white z-[65] shadow-2xl
          transform transition-transform duration-300 ease-out overflow-hidden
          flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
      >
        {/* Header with navigation - sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {currentStep === 'risks' && (
              <button
                onClick={goBack}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={t('navigation.back')}
              >
                <BackIcon />
              </button>
            )}
            <div>
              <h1 id="intro-title" className="text-lg font-semibold text-gray-900">
                {currentStep === 'main' ? t('title') : t('risksTitle')}
              </h1>
              {currentStep === 'main' && (
                <p className="text-sm text-gray-600 mt-0.5">
                  {t('subtitle')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('navigation.close')}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content - SCROLLABLE with proper padding and visible scrollbar */}
        <div className="flex-1 overflow-y-scroll overscroll-contain drawer-scrollable min-h-0">
          {currentStep === 'main' ? (
            <div className="p-4 pb-24 space-y-6">
              {/* Blocco 1 - ORIGINE */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900">
                  {t('sections.origin.title')}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('sections.origin.content')}
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 rounded-r">
                  <p className="text-xs font-medium text-gray-900 mb-2">{t('sections.origin.situations.title')}</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {t.raw('sections.origin.situations.items').map((item: string) => (
                      <li key={`origin-${item.slice(0, 10)}`}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('sections.origin.conclusion')}
                </p>
              </div>

              {/* Blocco 2 - EMERGENZE */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900">
                  {t('sections.emergencies.title')}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('sections.emergencies.content')}
                </p>
                <div className="space-y-2">
                  {t.raw('sections.emergencies.types').map((type: { title: string; description: string }) => (
                    <div key={`emergency-${type.title.slice(0, 10)}`} className="border border-gray-200 rounded-lg p-3">
                      <div className="font-medium text-sm text-gray-900">{type.title}</div>
                      <div className="text-xs text-gray-600">{type.description}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="font-medium text-sm text-gray-900">
                    {t('sections.emergencies.keyPoint')}
                  </p>
                </div>
                <button
                  onClick={goToRisks}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                >
                  {t('sections.emergencies.deepDiveButton')}
                  <ForwardIcon />
                </button>
              </div>

              {/* Blocco 3 - APPROCCIO */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900">
                  {t('sections.approach.title')}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('sections.approach.content')}
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="font-medium text-sm text-gray-900">
                    {t('sections.approach.keyPoint')}
                  </p>
                </div>
              </div>

              {/* Blocco 4 - SCOPO */}
              <div className="space-y-3">
                <h2 className="text-base font-semibold text-gray-900">
                  {t('sections.purpose.title')}
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('sections.purpose.content')}
                </p>
                <ul className="space-y-2">
                  {t.raw('sections.purpose.items').map((item: string) => (
                    <li key={`purpose-${item.slice(0, 15)}`} className="flex items-start gap-2">
                      <CheckIcon />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="font-medium text-sm text-gray-900">
                    {t('sections.purpose.keyPoint')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Risks Detail View */
            <div className="p-4 pb-24 space-y-6">
              {/* Sezione 1 - Cyber Risk */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-gray-900">
                  {t('risks.cyber.title')}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('risks.cyber.content')}
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {t.raw('risks.cyber.points').map((point: string) => (
                    <li key={`cyber-${point.slice(0, 20)}`}>• {point}</li>
                  ))}
                </ul>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-900 mb-2">Fonti:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {t.raw('risks.cyber.sources').map((source: string) => (
                      <li key={`cyber-source-${source.slice(0, 15)}`}>• {source}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sezione 2 - Systemic Risk */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-gray-900">
                  {t('risks.systemic.title')}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('risks.systemic.content')}
                </p>
                <p className="text-sm text-gray-700">
                  {t('risks.systemic.reason')}
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {t.raw('risks.systemic.points').map((point: string) => (
                    <li key={`systemic-${point.slice(0, 20)}`}>• {point}</li>
                  ))}
                </ul>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-900 mb-2">Fonti:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {t.raw('risks.systemic.sources').map((source: string) => (
                      <li key={`systemic-source-${source.slice(0, 15)}`}>• {source}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sezione 3 - Operational Disruptions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-gray-900">
                  {t('risks.operational.title')}
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {t('risks.operational.content')}
                </p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {t.raw('risks.operational.points').map((point: string) => (
                    <li key={`operational-${point.slice(0, 20)}`}>• {point}</li>
                  ))}
                </ul>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-900 mb-2">Fonti:</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {t.raw('risks.operational.sources').map((source: string) => (
                      <li key={`operational-source-${source.slice(0, 15)}`}>• {source}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conclusione */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-sm text-gray-900 mb-2">
                  {t('risks.conclusion.title')}
                </h4>
                <ul className="text-sm text-gray-700 space-y-1 mb-3">
                  {t.raw('risks.conclusion.points').map((point: string) => (
                    <li key={`conclusion-${point.slice(0, 20)}`}>• {point}</li>
                  ))}
                </ul>
                <p className="font-medium text-sm text-gray-900">
                  {t('risks.conclusion.keyPoint')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Tradelia buttons - sticky */}
        <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
          {currentStep === 'main' ? (
            <button
              onClick={onClose}
              className="btn-tech w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t('buttons.understood')}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="flex-1 h-10 px-4 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t('buttons.backToIntro')}
              </button>
              <button
                onClick={onClose}
                className="btn-tech flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {t('buttons.goToDashboard')}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// SVG Icons - Tradelia Design System Compliant
function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M12 4L4 12M4 4l8 8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--success))' }}>
      <path 
        d="M13 4L6 11L3 8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M10 12L6 8L10 4" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ForwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M6 4L10 8L6 12" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}