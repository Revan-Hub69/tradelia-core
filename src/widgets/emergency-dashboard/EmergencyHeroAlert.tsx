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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-8">
      <div className="relative">
        {/* Main Alert Box */}
        <div className="
          bg-gradient-to-r from-warning/5 to-warning/10 
          border border-warning/20 
          rounded-xl p-6 sm:p-8
          shadow-sm
        ">
          {/* Header with Icon */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertTriangleIcon className="w-5 h-5 text-warning" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
                {t('title')}
              </h2>
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0 mt-2" />
              <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
                {t('point1')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0 mt-2" />
              <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
                {t('point2')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-warning flex-shrink-0 mt-2" />
              <p className="text-base sm:text-lg text-foreground font-medium leading-relaxed">
                {t('point3')}
              </p>
            </div>
          </div>

          {/* Warning Message */}
          <div className="
            bg-error/5 border border-error/20 rounded-lg p-4
            flex items-start gap-3
          ">
            <InfoIcon className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-base text-error font-semibold leading-relaxed">
              {t('warning')}
            </p>
          </div>
        </div>

        {/* Tooltip Trigger */}
        <button
          className="
            absolute -top-2 -right-2 w-8 h-8 
            bg-primary text-white rounded-full
            flex items-center justify-center
            hover:bg-primary/90 transition-colors
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
            shadow-lg
          "
          aria-label={t('moreInfoAriaLabel')}
          onClick={() => {
            // Trigger introduction overlay
            const event = new CustomEvent('openEmergencyIntro')
            window.dispatchEvent(event)
          }}
        >
          <InfoIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}