'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Settings, BarChart3, Palette, ExternalLink } from 'lucide-react'
import { cookieManager, type CookiePreferences } from '@/lib/preferences/cookie-manager'

interface CookiePreferencesModalProps {
  open: boolean
  onClose: () => void
}

export function CookiePreferencesModal({ open, onClose }: CookiePreferencesModalProps) {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [hasExistingConsent, setHasExistingConsent] = useState(false)

  useEffect(() => {
    if (open) {
      // Load current preferences
      const current = cookieManager.preferences
      if (current) {
        setPreferences(current)
        setHasExistingConsent(true)
      } else {
        setHasExistingConsent(false)
      }
    }
  }, [open])

  const handlePreferenceChange = (type: keyof CookiePreferences, value: boolean) => {
    if (type === 'essential') return // Cannot change essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    try {
      if (hasExistingConsent) {
        await cookieManager.updatePreferences(preferences)
      } else {
        await cookieManager.giveConsent(preferences)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptAll = async () => {
    setIsLoading(true)
    try {
      const allAccepted: CookiePreferences = {
        essential: true,
        functional: true,
        analytics: true
      }
      
      if (hasExistingConsent) {
        await cookieManager.updatePreferences(allAccepted)
      } else {
        await cookieManager.giveConsent(allAccepted)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectAll = async () => {
    setIsLoading(true)
    try {
      const essentialOnly: CookiePreferences = {
        essential: true,
        functional: false,
        analytics: false
      }
      
      if (hasExistingConsent) {
        await cookieManager.updatePreferences(essentialOnly)
      } else {
        await cookieManager.giveConsent(essentialOnly)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save preferences:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Gestione Cookie e Privacy
          </DialogTitle>
          <DialogDescription>
            Controlla quali cookie e dati vengono utilizzati per migliorare la tua esperienza educativa.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          
          {/* Essential Cookies */}
          <UnifiedCard className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-green-900 dark:text-green-100">
                        Cookie Essenziali
                      </h3>
                      <Badge variant="outline" className="text-xs">Obbligatori</Badge>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                      Necessari per il funzionamento base del sito. Include autenticazione, 
                      sicurezza e funzionalità core.
                    </p>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      <strong>Esempi:</strong> Session ID, CSRF protection, preferenze lingua
                    </div>
                  </div>
                </div>
                <Switch
                  checked={preferences.essential}
                  disabled={true}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </UnifiedCard>

          {/* Functional Cookies */}
          <UnifiedCard className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                        Cookie Funzionali
                      </h3>
                      <Badge variant="outline" className="text-xs">Opzionali</Badge>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Migliorano la tua esperienza salvando preferenze UI, progresso educativo 
                      e impostazioni personalizzate.
                    </p>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      <strong>Esempi:</strong> Tema scuro/chiaro, progresso lezioni, preferenze dashboard
                    </div>
                  </div>
                </div>
                <Switch
                  checked={preferences.functional}
                  onCheckedChange={(checked) => handlePreferenceChange('functional', checked)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </UnifiedCard>

          {/* Analytics Cookies */}
          <UnifiedCard className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                        Cookie Analitici
                      </h3>
                      <Badge variant="outline" className="text-xs">Opzionali</Badge>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                      Ci aiutano a capire come migliorare i contenuti educativi analizzando 
                      l'utilizzo in forma anonima e aggregata.
                    </p>
                    <div className="text-xs text-orange-600 dark:text-orange-400">
                      <strong>Esempi:</strong> Pagine più visitate, tempo di permanenza, errori tecnici
                    </div>
                  </div>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => handlePreferenceChange('analytics', checked)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </UnifiedCard>

          <Separator />

          {/* Privacy Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Informazioni sulla Privacy</h4>
            
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span>Dati condivisi con terze parti</span>
                <Badge variant="outline" className="text-xs">Mai</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span>Tracking pubblicitario</span>
                <Badge variant="outline" className="text-xs">Disabilitato</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span>Conservazione dati</span>
                <Badge variant="outline" className="text-xs">30 giorni max</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ExternalLink className="w-3 h-3" />
              <a href="/privacy" className="hover:underline">
                Leggi la Privacy Policy completa
              </a>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              disabled={isLoading}
              className="flex-1"
            >
              Rifiuta Tutti
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="flex-1"
            >
              Salva Preferenze
            </Button>
            
            <Button
              onClick={handleAcceptAll}
              disabled={isLoading}
              className="flex-1"
            >
              Accetta Tutti
            </Button>
          </div>

          {/* Educational Note */}
          <div className="text-xs text-muted-foreground text-center p-4 bg-muted/20 rounded-lg">
            <strong>Nota educativa:</strong> Puoi modificare queste preferenze in qualsiasi momento 
            dalle impostazioni del tuo account o dal footer del sito.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}