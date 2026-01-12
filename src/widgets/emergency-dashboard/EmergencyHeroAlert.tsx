/**
 * Emergency Hero Alert - Tradelia 2026
 * 
 * Alert box centrale che definisce chiaramente lo scopo delle crypto in emergenza
 */

'use client'

import { useTranslations } from 'next-intl'
import { AlertTriangleIcon, InfoIcon } from '@/components/icons/TradeliaIcons'

export function EmergencyHeroAlert() {
  const t = useTranslations('emergencyDashboard.heroAlert')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Main Alert Box - più compatto su mobile */}
        <div className="
          section-frame-warning p-4 sm:p-6
          transition-all duration-150
        ">
          {/* Header with Icon - inline su mobile */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg icon-bg-warning flex items-center justify-center flex-shrink-0">
              <AlertTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
            </div>
            <h2 className="text-base sm:text-xl font-bold content-primary leading-tight">
              {t('title')}
            </h2>
          </div>

          {/* Key Points - più compatti */}
          <div className="space-y-2.5 sm:space-y-3 mb-4">
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-warning flex-shrink-0 mt-1.5 sm:mt-2" />
              <p className="text-sm sm:text-base content-primary font-medium leading-snug">
                {t('point1')}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-warning flex-shrink-0 mt-1.5 sm:mt-2" />
              <p className="text-sm sm:text-base content-primary font-medium leading-snug">
                {t('point2')}
              </p>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-warning flex-shrink-0 mt-1.5 sm:mt-2" />
              <p className="text-sm sm:text-base content-primary font-medium leading-snug">
                {t('point3')}
              </p>
            </div>
          </div>

          {/* Warning Message - più compatto */}
          <div className="alert-error p-3 sm:p-4">
            <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 alert-error-icon flex-shrink-0" />
            <p className="text-sm sm:text-base alert-error-text font-semibold leading-snug">
              {t('warning')}
            </p>
          </div>
        </div>

        {/* Tooltip Trigger */}
        <button
          className="
            absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 
            bg-primary text-white rounded-full
            flex items-center justify-center
            hover:bg-primary/90 transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
            shadow-lg
          "
          aria-label={t('moreInfoAriaLabel')}
          onClick={() => {
            const event = new CustomEvent('openEmergencyIntro')
            window.dispatchEvent(event)
          }}
        >
          <InfoIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  )
}