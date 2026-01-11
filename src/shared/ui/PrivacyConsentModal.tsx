/**
 * Privacy Consent Modal - Tradelia 2026 MODERNIZED
 * 
 * Modal per gestione consenso privacy conforme GDPR/CCPA
 * - Professional design with system colors
 * - Glass morphism effects
 * - Smooth animations
 * - Enhanced accessibility
 */

'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [settings, setSettings] = useState<ConsentSettings>({
    analytics_enabled: false,
    performance_tracking: false,
    error_reporting: true, // Essential for functionality
    feature_usage: false
  })

  const [showDetails, setShowDetails] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  
  // Ref for modal content
  const modalRef = useRef<HTMLDivElement>(null)

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

    return () => {
      // Restore scroll lock
      html.style.overflow = prevOverflow
      html.style.paddingRight = prevPadding
    }
  }, [isOpen])

  // Auto-focus on modal content start
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      const current = getAnalyticsStatus()
      setSettings({
        analytics_enabled: current.analytics_enabled,
        performance_tracking: current.performance_tracking,
        error_reporting: current.error_reporting,
        feature_usage: current.feature_usage
      })
      
      // Focus on modal content area start after animation with timeout cleanup
      const focusTimer = setTimeout(() => {
        // Focus the modal content area itself for screen readers
        if (modalRef.current) {
          modalRef.current.focus()
        }
        setIsAnimating(false)
      }, 300)

      return () => clearTimeout(focusTimer)
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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      {/* Enhanced Backdrop with refined gradient */}
      <div 
        className="absolute inset-0 bg-background/85 backdrop-blur-lg backdrop-saturate-105" 
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close modal"
      />

      {/* Refined Modal with subtle glass morphism */}
      <div 
        ref={modalRef}
        className={`
          relative w-full max-w-2xl section-frame backdrop-blur-lg backdrop-saturate-105
          shadow-xl shadow-primary/8 transition-all duration-300 ease-out
          ${isOpen ? 'scale-100 opacity-100' : 'scale-98 opacity-0'}
        `}
        style={{
          background: 'hsl(var(--bg-section)/0.95)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        tabIndex={-1}
      >
        {/* Header with modern design */}
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 id="privacy-modal-title" className="text-xl font-bold content-primary">
                Impostazioni Privacy
              </h2>
              <p className="text-sm content-secondary">
                Gestisci i tuoi dati e la privacy
              </p>
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
            aria-label="Chiudi"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content with enhanced styling */}
        <div className={`p-6 space-y-6 ${isAnimating ? 'pointer-events-none' : ''}`}>
          {/* Introduction with modern card */}
          <div className="section-frame-info p-5 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <InfoIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-primary mb-2">La tua privacy è importante</h3>
                <p className="text-sm content-secondary leading-relaxed">
                  Utilizziamo solo i dati necessari per migliorare la tua esperienza. 
                  Puoi controllare esattamente quali dati condividere con noi.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Settings with modern cards */}
          <div className="space-y-4">
            <h3 className="font-bold content-primary">Controlli Privacy</h3>
            
            {/* Analytics */}
            <div className="card-2026 p-5 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary/60" />
                    </div>
                    <h4 className="font-semibold content-primary">Analytics di Base</h4>
                    <span className="px-2 py-1 text-xs bg-muted/50 content-secondary rounded-full border border-border/30">
                      Opzionale
                    </span>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    Raccogliamo dati anonimi su come usi l'app per migliorare l'esperienza utente.
                  </p>
                </div>
                <label className="flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={settings.analytics_enabled}
                    onChange={(e) => handleSettingChange('analytics_enabled', e.target.checked)}
                    className="sr-only"
                    aria-label="Abilita analytics di base"
                  />
                  <div className={`
                    w-12 h-6 rounded-full transition-all duration-200 relative border
                    ${settings.analytics_enabled 
                      ? 'bg-primary border-primary/30' 
                      : 'bg-muted border-border'
                    }
                  `}>
                    <div className={`
                      w-4 h-4 bg-background rounded-full absolute top-1 transition-all duration-200 shadow-sm
                      ${settings.analytics_enabled ? 'translate-x-7' : 'translate-x-1'}
                    `} />
                  </div>
                </label>
              </div>
            </div>

            {/* Performance Tracking */}
            <div className="card-2026 p-5 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-warning/60" />
                    </div>
                    <h4 className="font-semibold content-primary">Monitoraggio Performance</h4>
                    <span className="px-2 py-1 text-xs bg-muted/50 content-secondary rounded-full border border-border/30">
                      Opzionale
                    </span>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    Monitoriamo le performance dell'app per identificare e risolvere problemi di velocità.
                  </p>
                </div>
                <label className="flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={settings.performance_tracking}
                    onChange={(e) => handleSettingChange('performance_tracking', e.target.checked)}
                    className="sr-only"
                    aria-label="Abilita monitoraggio performance"
                  />
                  <div className={`
                    w-12 h-6 rounded-full transition-all duration-200 relative border
                    ${settings.performance_tracking 
                      ? 'bg-primary border-primary/30' 
                      : 'bg-muted border-border'
                    }
                  `}>
                    <div className={`
                      w-4 h-4 bg-background rounded-full absolute top-1 transition-all duration-200 shadow-sm
                      ${settings.performance_tracking ? 'translate-x-7' : 'translate-x-1'}
                    `} />
                  </div>
                </label>
              </div>
            </div>

            {/* Error Reporting */}
            <div className="card-2026 p-5 bg-success/5 border-success/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-success/60" />
                    </div>
                    <h4 className="font-semibold content-primary">Segnalazione Errori</h4>
                    <span className="px-2 py-1 text-xs bg-success/20 text-success rounded-full border border-success/30">
                      Essenziale
                    </span>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    Necessario per identificare e correggere errori che potrebbero compromettere la funzionalità.
                  </p>
                </div>
                <label className="flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={settings.error_reporting}
                    onChange={(e) => handleSettingChange('error_reporting', e.target.checked)}
                    className="sr-only"
                    aria-label="Abilita segnalazione errori"
                  />
                  <div className={`
                    w-12 h-6 rounded-full transition-all duration-200 relative border
                    ${settings.error_reporting 
                      ? 'bg-primary border-primary/30' 
                      : 'bg-muted border-border'
                    }
                  `}>
                    <div className={`
                      w-4 h-4 bg-background rounded-full absolute top-1 transition-all duration-200 shadow-sm
                      ${settings.error_reporting ? 'translate-x-7' : 'translate-x-1'}
                    `} />
                  </div>
                </label>
              </div>
            </div>

            {/* Feature Usage */}
            <div className="card-2026 p-5 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-primary/60" />
                    </div>
                    <h4 className="font-semibold content-primary">Utilizzo Funzionalità</h4>
                    <span className="px-2 py-1 text-xs bg-muted/50 content-secondary rounded-full border border-border/30">
                      Opzionale
                    </span>
                  </div>
                  <p className="text-sm content-secondary leading-relaxed">
                    Tracciamo quali funzionalità usi di più per migliorare quelle più importanti per te.
                  </p>
                </div>
                <label className="flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={settings.feature_usage}
                    onChange={(e) => handleSettingChange('feature_usage', e.target.checked)}
                    className="sr-only"
                    aria-label="Abilita tracciamento utilizzo funzionalità"
                  />
                  <div className={`
                    w-12 h-6 rounded-full transition-all duration-200 relative border
                    ${settings.feature_usage 
                      ? 'bg-primary border-primary/30' 
                      : 'bg-muted border-border'
                    }
                  `}>
                    <div className={`
                      w-4 h-4 bg-background rounded-full absolute top-1 transition-all duration-200 shadow-sm
                      ${settings.feature_usage ? 'translate-x-7' : 'translate-x-1'}
                    `} />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Details Toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="
              text-sm text-primary hover:text-primary/80 transition-colors duration-200
              font-medium underline decoration-primary/30 hover:decoration-primary/60
            "
          >
            {showDetails ? 'Nascondi dettagli' : 'Mostra dettagli tecnici'}
          </button>

          {/* Technical Details */}
          {showDetails && (
            <div className="section-frame p-5 rounded-xl bg-muted/20 space-y-3">
              <h4 className="font-bold content-primary">Dettagli Tecnici</h4>
              <div className="text-sm content-secondary space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p><strong>Dati raccolti:</strong> Solo dati anonimi di utilizzo, nessuna informazione personale</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p><strong>Conservazione:</strong> I dati vengono conservati per massimo 90 giorni</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p><strong>Condivisione:</strong> I dati non vengono mai condivisi con terze parti</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p><strong>Sicurezza:</strong> Tutti i dati sono crittografati in transito e a riposo</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p><strong>Controllo:</strong> Puoi modificare queste impostazioni in qualsiasi momento</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modern Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-border/30">
          <button
            onClick={handleRejectAll}
            className="
              flex-1 h-12 px-6 text-base font-medium rounded-xl
              bg-muted/50 hover:bg-muted/80 active:scale-95
              border border-border/50 hover:border-border
              content-secondary hover:text-foreground
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
            "
          >
            Solo Essenziali
          </button>
          
          <button
            onClick={handleSave}
            className="
              flex-1 h-12 px-6 text-base font-medium rounded-xl
              bg-background hover:bg-muted/30 active:scale-95
              border border-border hover:border-primary/30
              content-primary hover:text-primary
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
            "
          >
            Salva Preferenze
          </button>
          
          <button
            onClick={handleAcceptAll}
            className="
              flex-1 h-12 px-6 text-base font-semibold rounded-xl
              bg-gradient-to-r from-primary to-primary/90
              text-white shadow-lg shadow-primary/20
              transition-all duration-200 ease-out
              hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5
              active:scale-[0.98]
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
            "
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