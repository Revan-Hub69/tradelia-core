/**
 * Privacy Consent Modal - Tradelia 2026
 * 
 * Modal per gestione consenso privacy conforme GDPR/CCPA
 * - Granular consent controls
 * - Clear explanations
 * - Easy opt-out
 * - Persistent settings
 */

'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ShieldIcon, CloseIcon, InfoIcon } from '@/components/icons/TradeliaIcons'
import { getAnalyticsStatus, updatePrivacySettings } from '@/src/shared/lib/analytics'

interface ConsentSettings {
  analytics_enabled: boolean
  performance_tracking: boolean
  error_reporting: boolean
  feature_usage: boolean
}

interface PrivacyConsentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: ConsentSettings) => void
}

export function PrivacyConsentModal({ isOpen, onClose, onSave }: PrivacyConsentModalProps) {
  const t = useTranslations('common.privacyConsent')
  const [settings, setSettings] = useState<ConsentSettings>({
    analytics_enabled: false,
    performance_tracking: false,
    error_reporting: true, // Essential for functionality
    feature_usage: false
  })

  const [showDetails, setShowDetails] = useState(false)

  // Load current settings
  useEffect(() => {
    if (isOpen) {
      const current = getAnalyticsStatus()
      setSettings({
        analytics_enabled: current.analytics_enabled,
        performance_tracking: current.performance_tracking,
        error_reporting: current.error_reporting,
        feature_usage: current.feature_usage
      })
    }
  }, [isOpen])

  // Handle setting change
  const handleSettingChange = (key: keyof ConsentSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  // Handle save
  const handleSave = () => {
    updatePrivacySettings(settings)
    onSave(settings)
    onClose()
  }

  // Handle accept all
  const handleAcceptAll = () => {
    const allEnabled = {
      analytics_enabled: true,
      performance_tracking: true,
      error_reporting: true,
      feature_usage: true
    }
    setSettings(allEnabled)
    updatePrivacySettings(allEnabled)
    onSave(allEnabled)
    onClose()
  }

  // Handle reject all (except essential)
  const handleRejectAll = () => {
    const essentialOnly = {
      analytics_enabled: false,
      performance_tracking: false,
      error_reporting: true, // Keep essential error reporting
      feature_usage: false
    }
    setSettings(essentialOnly)
    updatePrivacySettings(essentialOnly)
    onSave(essentialOnly)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div 
        className="relative w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-lg font-semibold text-foreground">
                Impostazioni Privacy
              </h2>
              <p className="text-sm text-muted-foreground">
                Gestisci i tuoi dati e la privacy
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label={t('close')}
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <InfoIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-primary mb-1">La tua privacy è importante</h3>
                <p className="text-sm text-muted-foreground">
                  Utilizziamo solo i dati necessari per migliorare la tua esperienza. 
                  Puoi controllare esattamente quali dati condividere con noi.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Controlli Privacy</h3>
            
            {/* Analytics */}
            <div className="flex items-start justify-between p-4 border border-border/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">Analytics di Base</h4>
                  <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                    Opzionale
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Raccogliamo dati anonimi su come usi l'app per migliorare l'esperienza utente.
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.analytics_enabled}
                  onChange={(e) => handleSettingChange('analytics_enabled', e.target.checked)}
                  className="sr-only"
                  aria-label={t('enableBasicAnalytics')}
                />
                <div className={`
                  w-11 h-6 rounded-full transition-colors relative
                  ${settings.analytics_enabled ? 'bg-primary' : 'bg-muted'}
                `}>
                  <div className={`
                    w-4 h-4 bg-white rounded-full absolute top-1 transition-transform
                    ${settings.analytics_enabled ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </div>
              </label>
            </div>

            {/* Performance Tracking */}
            <div className="flex items-start justify-between p-4 border border-border/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">Monitoraggio Performance</h4>
                  <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                    Opzionale
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitoriamo le performance dell'app per identificare e risolvere problemi di velocità.
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.performance_tracking}
                  onChange={(e) => handleSettingChange('performance_tracking', e.target.checked)}
                  className="sr-only"
                  aria-label={t('enablePerformanceTracking')}
                />
                <div className={`
                  w-11 h-6 rounded-full transition-colors relative
                  ${settings.performance_tracking ? 'bg-primary' : 'bg-muted'}
                `}>
                  <div className={`
                    w-4 h-4 bg-white rounded-full absolute top-1 transition-transform
                    ${settings.performance_tracking ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </div>
              </label>
            </div>

            {/* Error Reporting */}
            <div className="flex items-start justify-between p-4 border border-border/50 rounded-lg bg-muted/20">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">Segnalazione Errori</h4>
                  <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                    Essenziale
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Necessario per identificare e correggere errori che potrebbero compromettere la funzionalità.
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.error_reporting}
                  onChange={(e) => handleSettingChange('error_reporting', e.target.checked)}
                  className="sr-only"
                  aria-label={t('enableErrorReporting')}
                />
                <div className={`
                  w-11 h-6 rounded-full transition-colors relative
                  ${settings.error_reporting ? 'bg-primary' : 'bg-muted'}
                `}>
                  <div className={`
                    w-4 h-4 bg-white rounded-full absolute top-1 transition-transform
                    ${settings.error_reporting ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </div>
              </label>
            </div>

            {/* Feature Usage */}
            <div className="flex items-start justify-between p-4 border border-border/50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground">Utilizzo Funzionalità</h4>
                  <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                    Opzionale
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tracciamo quali funzionalità usi di più per migliorare quelle più importanti per te.
                </p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.feature_usage}
                  onChange={(e) => handleSettingChange('feature_usage', e.target.checked)}
                  className="sr-only"
                  aria-label={t('enableFeatureUsageTracking')}
                />
                <div className={`
                  w-11 h-6 rounded-full transition-colors relative
                  ${settings.feature_usage ? 'bg-primary' : 'bg-muted'}
                `}>
                  <div className={`
                    w-4 h-4 bg-white rounded-full absolute top-1 transition-transform
                    ${settings.feature_usage ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </div>
              </label>
            </div>
          </div>

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {showDetails ? 'Nascondi dettagli' : 'Mostra dettagli tecnici'}
          </button>

          {/* Technical Details */}
          {showDetails && (
            <div className="bg-muted/30 border border-border/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-foreground">Dettagli Tecnici</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• <strong>Dati raccolti:</strong> Solo dati anonimi di utilizzo, nessuna informazione personale</p>
                <p>• <strong>Conservazione:</strong> I dati vengono conservati per massimo 90 giorni</p>
                <p>• <strong>Condivisione:</strong> I dati non vengono mai condivisi con terze parti</p>
                <p>• <strong>Sicurezza:</strong> Tutti i dati sono crittografati in transito e a riposo</p>
                <p>• <strong>Controllo:</strong> Puoi modificare queste impostazioni in qualsiasi momento</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border/50">
          <button
            onClick={handleRejectAll}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground bg-background hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Solo Essenziali
          </button>
          
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            Salva Preferenze
          </button>
          
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            Accetta Tutto
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for managing privacy consent
export function usePrivacyConsent() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasConsented, setHasConsented] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const settings = getAnalyticsStatus()
    const hasGivenConsent = settings.last_updated > 0
    setHasConsented(hasGivenConsent)

    // Show modal if no consent given and not in development
    if (!hasGivenConsent && process.env.NODE_ENV === 'production') {
      // Delay to avoid showing immediately on page load
      setTimeout(() => {
        setIsModalOpen(true)
      }, 2000)
    }
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const handleSave = (_settings: ConsentSettings) => {
    setHasConsented(true)
    setIsModalOpen(false)
  }

  return {
    isModalOpen,
    hasConsented,
    openModal,
    closeModal,
    handleSave
  }
}