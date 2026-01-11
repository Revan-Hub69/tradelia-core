/**
 * Emergency Journey Introduction Drawer - Tradelia 2026
 * 
 * True side drawer with Tradelia button styles and modular translations
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

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setCurrentStep('main')
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const goToRisks = () => setCurrentStep('risks')
  const goBack = () => setCurrentStep('main')

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* True Side Drawer - slides from right */}
      <div 
        ref={drawerRef as React.RefObject<HTMLDivElement>}
        className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white z-[75] shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
      >
        {/* Header with navigation */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4">
            {currentStep === 'risks' && (
              <button
                onClick={goBack}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                aria-label={t('navigation.back')}
              >
                <BackIcon />
              </button>
            )}
            <div>
              <h1 id="intro-title" className="text-xl font-semibold text-gray-900">
                {currentStep === 'main' ? t('title') : t('risksTitle')}
              </h1>
              {currentStep === 'main' && (
                <p className="text-sm text-gray-600 mt-1">
                  {t('subtitle')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label={t('navigation.close')}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 'main' ? (
            <div className="p-6 space-y-8">
              {/* Blocco 1 - ORIGINE */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('sections.origin.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('sections.origin.content')}
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">{t('sections.origin.situations.title')}</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {t.raw('sections.origin.situations.items').map((item: string, index: number) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {t('sections.origin.conclusion')}
                </p>
              </div>

              {/* Blocco 2 - EMERGENZE */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('sections.emergencies.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('sections.emergencies.content')}
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {t.raw('sections.emergencies.types').map((type: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-900">{type.title}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {t('sections.emergencies.keyPoint')}
                  </p>
                </div>
                <button
                  onClick={goToRisks}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {t('sections.emergencies.deepDiveButton')}
                  <ForwardIcon />
                </button>
              </div>

              {/* Blocco 3 - APPROCCIO */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('sections.approach.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('sections.approach.content')}
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {t('sections.approach.keyPoint')}
                  </p>
                </div>
              </div>

              {/* Blocco 4 - SCOPO */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {t('sections.purpose.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('sections.purpose.content')}
                </p>
                <ul className="space-y-2">
                  {t.raw('sections.purpose.items').map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckIcon />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {t('sections.purpose.keyPoint')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Risks Detail View */
            <div className="p-6 space-y-8">
              {/* Sezione 1 - Cyber Risk */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  {t('risks.cyber.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('risks.cyber.content')}
                </p>
                <ul className="text-gray-700 space-y-1">
                  {t.raw('risks.cyber.points').map((point: string, index: number) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Fonti:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {t.raw('risks.cyber.sources').map((source: string, index: number) => (
                      <li key={index}>• {source}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sezione 2 - Systemic Risk */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  {t('risks.systemic.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('risks.systemic.content')}
                </p>
                <p className="text-gray-700">
                  {t('risks.systemic.reason')}
                </p>
                <ul className="text-gray-700 space-y-1">
                  {t.raw('risks.systemic.points').map((point: string, index: number) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Fonti:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {t.raw('risks.systemic.sources').map((source: string, index: number) => (
                      <li key={index}>• {source}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Sezione 3 - Operational Disruptions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  {t('risks.operational.title')}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t('risks.operational.content')}
                </p>
                <ul className="text-gray-700 space-y-1">
                  {t.raw('risks.operational.points').map((point: string, index: number) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Fonti:</p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {t.raw('risks.operational.sources').map((source: string, index: number) => (
                      <li key={index}>• {source}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Conclusione */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {t('risks.conclusion.title')}
                </h4>
                <ul className="text-gray-700 space-y-1 mb-3">
                  {t.raw('risks.conclusion.points').map((point: string, index: number) => (
                    <li key={index}>• {point}</li>
                  ))}
                </ul>
                <p className="font-medium text-gray-900">
                  {t('risks.conclusion.keyPoint')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Tradelia buttons */}
        <div className="p-6 border-t border-gray-200 bg-white">
          {currentStep === 'main' ? (
            <button
              onClick={onClose}
              className="btn-tech w-full"
            >
              {t('buttons.understood')}
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="flex-1 h-10 px-6 text-sm font-medium rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('buttons.backToIntro')}
              </button>
              <button
                onClick={onClose}
                className="btn-tech flex-1"
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