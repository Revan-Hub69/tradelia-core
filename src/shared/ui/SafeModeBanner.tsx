/**
 * SafeModeBanner Component - Tradelia 2026
 * 
 * Banner shown when network is unstable to indicate safe mode is active.
 * Warns users that some actions may be paused or disabled.
 * 
 * @see Requirements 19.3
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangleIcon, CloseIcon } from '@/components/icons/TradeliaIcons'

interface SafeModeBannerProps {
  /** Whether safe mode is currently active */
  isActive: boolean
  /** Optional callback when banner is dismissed */
  onDismiss?: () => void
  className?: string
}

export function SafeModeBanner({ isActive, onDismiss, className = '' }: SafeModeBannerProps) {
  const t = useTranslations('safeMode')
  const [isDismissed, setIsDismissed] = useState(false)

  // Don't show if not active or dismissed
  if (!isActive || isDismissed) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <div 
      className={`
        fixed top-16 left-0 right-0 z-40 
        bg-warning/10 border-b border-warning/20 
        animate-in slide-in-from-top-2 duration-300
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangleIcon className="w-4 h-4 text-warning flex-shrink-0" />
            <p className="text-sm text-warning font-medium">
              {t('banner')}
            </p>
          </div>
          
          <button
            onClick={handleDismiss}
            className="tap-target p-1 rounded-md text-warning/70 hover:text-warning hover:bg-warning/10 transition-colors focus:outline-none focus:ring-2 focus:ring-warning/50"
            aria-label={t('dismiss')}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SafeModeBanner
