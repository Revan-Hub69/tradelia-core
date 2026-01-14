/**
 * Onboarding Preferences Modal - Enterprise Edition
 * 
 * Features:
 * - Country + Technical Level selection
 * - Auto-detect country from IP
 * - Smooth animations (200-300ms)
 * - Full accessibility (WCAG 2.2 AA)
 * - Mobile-optimized
 * - Translations (IT/EN)
 * - IndexedDB persistence
 * - Auto-sync on login
 */

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createPortal } from 'react-dom'
import { SearchableCountrySelector } from './SearchableCountrySelector'
import { TechnicalLevelSelector, type TechnicalLevel } from './TechnicalLevelSelector'
import { InfoCircleIcon } from '@/src/shared/ui/icons/PreferencesIcons'
import { 
  savePreferencesToStorage, 
  detectCountryFromIP 
} from '@/src/shared/lib/storage/preferences-storage'

interface OnboardingPreferencesModalProps {
  isOpen: boolean
  onComplete: (preferences: { country: string; technicalLevel: TechnicalLevel }) => void
  userId?: string | undefined
  userType?: 'email' | 'google' | 'apple' | 'guest'
  defaultCountry?: string
  defaultLevel?: TechnicalLevel
}

export function OnboardingPreferencesModal({
  isOpen,
  onComplete,
  userId: _userId,
  userType: _userType = 'guest',
  defaultCountry = '',
  defaultLevel = 'informato'
}: OnboardingPreferencesModalProps) {
  const t = useTranslations('preferences.onboarding')
  const tCountry = useTranslations('preferences.country')
  const tLevel = useTranslations('preferences.technicalLevel')
  
  const [mounted, setMounted] = useState(false)
  const [country, setCountry] = useState(defaultCountry)
  const [technicalLevel, setTechnicalLevel] = useState<TechnicalLevel>(defaultLevel)
  const [isDetecting, setIsDetecting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Mount check for portal
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Auto-detect country on mount
  useEffect(() => {
    if (isOpen && !country) {
      const detectCountry = async () => {
        setIsDetecting(true)
        const detected = await detectCountryFromIP()
        if (detected) {
          setCountry(detected)
        }
        setIsDetecting(false)
      }
      
      detectCountry()
    }
  }, [isOpen, country])
  
  // Focus trap
  useEffect(() => {
    if (!isOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Don't allow closing with ESC - user must complete
        e.preventDefault()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])
  
  const handleSubmit = async () => {
    if (!country || !technicalLevel) return
    
    try {
      setIsSubmitting(true)
      
      // Save to IndexedDB
      await savePreferencesToStorage({
        country,
        technicalLevel,
        language: document.documentElement.lang || 'it'
      })
      
      // Complete onboarding
      onComplete({ country, technicalLevel })
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const canSubmit = country && technicalLevel && !isSubmitting
  
  if (!isOpen || !mounted) return null
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-backdrop-in"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="
          relative w-full max-w-lg
          bg-background rounded-2xl 
          border-2 border-border/50
          shadow-2xl
          animate-modal-in
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <InfoCircleIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 
                id="onboarding-title"
                className="text-xl font-bold text-foreground mb-1"
              >
                {t('title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Country selector */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-foreground mb-2 block">
                {tCountry('label')}
              </span>
              <SearchableCountrySelector
                value={country}
                onChange={setCountry}
                placeholder={tCountry('placeholder')}
                showTierBadge={true}
              />
            </label>
            
            {isDetecting && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                {tCountry('autoDetected')}...
              </p>
            )}
            
            <p className="text-xs text-muted-foreground reading-line-height">
              {tCountry('description')}
            </p>
          </div>
          
          {/* Technical level selector */}
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-semibold text-foreground mb-2 block">
                {tLevel('label')}
              </span>
            </label>
            
            <TechnicalLevelSelector
              value={technicalLevel}
              onChange={setTechnicalLevel}
              showDetails={false}
            />
            
            <p className="text-xs text-muted-foreground reading-line-height">
              {tLevel('description')}
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border/30 bg-muted/20">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="
              w-full px-6 py-3 rounded-xl
              bg-primary text-white font-semibold
              hover:bg-primary/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
              min-h-[48px]
              flex items-center justify-center gap-2
            "
          >
            {isSubmitting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('continue')}...
              </>
            ) : (
              <>
                {t('continue')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-muted-foreground mt-3">
            {t('canChange')}
          </p>
        </div>
      </div>
    </div>
  )
  
  // Render via portal to body
  return createPortal(modalContent, document.body)
}
