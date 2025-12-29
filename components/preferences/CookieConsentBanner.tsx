'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { Badge } from '@/components/ui/badge'
import { Settings, Cookie, Shield } from 'lucide-react'
import { cookieManager, type CookiePreferences } from '@/lib/preferences/cookie-manager'
import { CookiePreferencesModal } from './CookiePreferencesModal'

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user needs to consent
    const checkConsent = () => {
      if (cookieManager.needsConsent) {
        setShowBanner(true)
      }
    }

    // Initial check
    checkConsent()

    // Listen for consent changes
    const unsubscribe = cookieManager.onConsentChange(() => {
      setShowBanner(false)
    })

    return unsubscribe
  }, [])

  const handleAcceptAll = async () => {
    setIsLoading(true)
    try {
      await cookieManager.giveConsent({
        essential: true,
        functional: true,
        analytics: true
      })
      setShowBanner(false)
    } catch (error) {
      console.error('Failed to save consent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptEssential = async () => {
    setIsLoading(true)
    try {
      await cookieManager.giveConsent({
        essential: true,
        functional: false,
        analytics: false
      })
      setShowBanner(false)
    } catch (error) {
      console.error('Failed to save consent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManagePreferences = () => {
    setShowPreferences(true)
  }

  const handlePreferencesClose = () => {
    setShowPreferences(false)
    // Banner will hide automatically if consent was given
  }

  if (!showBanner) {
    return null
  }

  return (
    <>
      {/* Banner */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-t border-border"
        role="region"
        aria-label="Preferenze cookie"
        aria-live="polite"
      >
        <div className="mx-auto max-w-6xl">
          <UnifiedCard className="border-primary/20 bg-background/95">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                
                {/* Icon and Content */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                    <Cookie className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0" id="cookie-banner-description">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm">Cookie e Privacy</h3>
                      <Badge variant="outline" className="text-xs">GDPR</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Utilizziamo cookie per migliorare la tua esperienza educativa. 
                      I cookie essenziali sono necessari per il funzionamento, 
                      quelli funzionali salvano le tue preferenze.
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      <span>Nessun tracking pubblicitario • Dati educativi protetti</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0" aria-describedby="cookie-banner-description">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleManagePreferences}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Gestisci Preferenze
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleAcceptEssential}
                    disabled={isLoading}
                  >
                    Solo Essenziali
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                  >
                    Accetta Tutti
                  </Button>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
        </div>
      </div>

      {/* Preferences Modal */}
      <CookiePreferencesModal
        open={showPreferences}
        onClose={handlePreferencesClose}
      />
    </>
  )
}
