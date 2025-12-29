'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { BrainIcon } from '@/components/icons/brain-icon'
import { EconomicsIcon } from '@/components/icons/economics-icon'
import { WarningIcon } from '@/components/icons/warning-icon'
import { AuthModal } from '@/components/auth/AuthModal'
import { authManager } from '@/lib/auth/supabase-auth'
import { getProgressData, savePreferences, getPreferences } from '@/lib/utils/session'

interface AuthSuggestionPopupProps {
  trigger: 'start_flow_complete' | 'multiple_sections' | 'data_retention' | 'manual'
  onClose: () => void
}

export function AuthSuggestionPopup({ trigger, onClose }: AuthSuggestionPopupProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated
    if (authManager.isAuthenticated) {
      onClose()
      return
    }

    // Check if this suggestion was permanently dismissed
    checkDismissalStatus()
  }, [])

  const checkDismissalStatus = async () => {
    try {
      const preferences = await getPreferences()
      const dismissedSuggestions = preferences?.dismissedAuthSuggestions || []
      
      if (dismissedSuggestions.includes(trigger)) {
        setIsDismissed(true)
        onClose()
      }
    } catch (error) {
      console.warn('Failed to check dismissal status:', error)
    }
  }

  const handleDismiss = async (permanent = false) => {
    if (permanent) {
      try {
        const currentPrefs = await getPreferences() || {}
        const dismissedSuggestions = currentPrefs.dismissedAuthSuggestions || []
        
        await savePreferences({
          ...currentPrefs,
          dismissedAuthSuggestions: [...dismissedSuggestions, trigger]
        })
      } catch (error) {
        console.warn('Failed to save dismissal preference:', error)
      }
    }
    
    onClose()
  }

  const handleCreateAccount = () => {
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    onClose()
  }

  const getSuggestionContent = () => {
    switch (trigger) {
      case 'start_flow_complete':
        return {
          title: 'Percorso di orientamento completato',
          subtitle: 'Valutazione iniziale terminata',
          description: 'Hai completato la valutazione del tuo stato attuale. Un account educativo ti permetterebbe di salvare questo progresso e accedere a funzionalità avanzate.',
          icon: BrainIcon,
          benefits: [
            'Salvataggio permanente del progresso educativo',
            'Sincronizzazione automatica tra dispositivi',
            'Accesso prioritario a nuovi contenuti educativi'
          ],
          urgency: 'low',
          badgeText: 'Opzionale'
        }

      case 'multiple_sections':
        return {
          title: 'Utilizzo multi-sezione rilevato',
          subtitle: 'Esplorazione approfondita in corso',
          description: 'Stai utilizzando diverse sezioni educative. Un account centralizzato ottimizzerebbe il tracciamento del tuo percorso di apprendimento.',
          icon: EconomicsIcon,
          benefits: [
            'Tracciamento unificato del progresso educativo',
            'Ripresa automatica da qualsiasi sezione',
            'Analytics dettagliate del percorso di apprendimento'
          ],
          urgency: 'medium',
          badgeText: 'Consigliato'
        }

      case 'data_retention':
        return {
          title: 'Scadenza automatica dati',
          subtitle: 'Eliminazione programmata per privacy',
          description: 'I dati educativi locali vengono eliminati automaticamente dopo 30 giorni per garantire la privacy. Un account previene questa perdita mantenendo la sicurezza.',
          icon: WarningIcon,
          benefits: [
            'Prevenzione perdita dati educativi',
            'Backup crittografato e sicuro',
            'Conservazione permanente del progresso'
          ],
          urgency: 'high',
          badgeText: 'Azione richiesta'
        }

      default:
        return {
          title: 'Account educativo disponibile',
          subtitle: 'Salvataggio progresso opzionale',
          description: 'Un account educativo opzionale per salvare il tuo percorso di apprendimento e sincronizzare i progressi tra dispositivi.',
          icon: BrainIcon,
          benefits: [
            'Progresso salvato automaticamente',
            'Sincronizzazione multi-dispositivo',
            'Privacy e sicurezza garantite'
          ],
          urgency: 'low',
          badgeText: 'Opzionale'
        }
    }
  }

  if (isDismissed) {
    return null
  }

  const content = getSuggestionContent()
  const IconComponent = content.icon

  const urgencyStyles: Record<string, { border: string; bg: string; badge: string }> = {
    low: { 
      border: 'border-blue-200 dark:border-blue-800', 
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    },
    medium: { 
      border: 'border-orange-200 dark:border-orange-800', 
      bg: 'bg-orange-50/50 dark:bg-orange-950/20',
      badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    },
    high: { 
      border: 'border-red-200 dark:border-red-800', 
      bg: 'bg-red-50/50 dark:bg-red-950/20',
      badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
  }

  const styles = urgencyStyles[content.urgency]

  return (
    <>
      <Dialog open={true} onOpenChange={() => handleDismiss(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="sr-only">
              Suggerimento account - {content.title}
            </DialogTitle>
          </DialogHeader>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Chiudi suggerimento"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6 pt-2">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{content.title}</h2>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${styles.badge}`}
                  >
                    {content.badgeText}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{content.subtitle}</p>
              </div>
            </div>

            {/* Main Content */}
            <div className={`rounded-lg border p-4 ${styles.border} ${styles.bg}`}>
              <p className="text-sm mb-4 leading-relaxed">{content.description}</p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Vantaggi dell'account:
                </div>
                {content.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleCreateAccount}
                className="w-full"
                size="lg"
              >
                Crea Account Educativo
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleDismiss(false)}
                  className="text-sm"
                >
                  Ricorda dopo
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => handleDismiss(true)}
                  className="text-sm"
                >
                  Non mostrare
                </Button>
              </div>
            </div>

            {/* Educational Note */}
            <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-3 border">
              <div className="flex items-start gap-2">
                <WarningIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Principio di trasparenza:</strong> L'account è completamente opzionale. 
                  Tradelia funziona integralmente anche senza registrazione. Nessuna funzionalità educativa è limitata.
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
        title="Crea il tuo account educativo"
        description="Salva il tuo progresso e sincronizza tra dispositivi"
      />
    </>
  )
}

// Hook for triggering auth suggestions
export function useAuthSuggestions() {
  const [activeSuggestion, setActiveSuggestion] = useState<{
    trigger: AuthSuggestionPopupProps['trigger']
    show: boolean
  } | null>(null)

  const triggerSuggestion = (trigger: AuthSuggestionPopupProps['trigger']) => {
    // Don't show if user is already authenticated
    if (authManager.isAuthenticated) return

    setActiveSuggestion({ trigger, show: true })
  }

  const closeSuggestion = () => {
    setActiveSuggestion(null)
  }

  // Auto-trigger based on usage patterns
  useEffect(() => {
    const checkTriggerConditions = async () => {
      if (authManager.isAuthenticated) return

      try {
        // Check for start flow completion
        const startFlowData = await getProgressData('start_flow_responses')
        if (startFlowData?.completed_at) {
          const completedDate = new Date(startFlowData.completed_at)
          const now = new Date()
          const hoursSinceCompletion = (now.getTime() - completedDate.getTime()) / (1000 * 60 * 60)
          
          // Suggest account creation 1 hour after completing start flow
          if (hoursSinceCompletion >= 1 && hoursSinceCompletion <= 2) {
            triggerSuggestion('start_flow_complete')
            return
          }
        }

        // Check for data retention warning (7+ days of data)
        const preferences = await getPreferences()
        if (preferences?.created_at) {
          const createdDate = new Date(preferences.created_at)
          const daysSinceCreation = (new Date().getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
          
          if (daysSinceCreation >= 7) {
            triggerSuggestion('data_retention')
            return
          }
        }

      } catch (error) {
        console.warn('Failed to check trigger conditions:', error)
      }
    }

    // Check conditions on mount and periodically
    checkTriggerConditions()
    const interval = setInterval(checkTriggerConditions, 60 * 60 * 1000) // Every hour

    return () => clearInterval(interval)
  }, [])

  return {
    activeSuggestion,
    triggerSuggestion,
    closeSuggestion,
    SuggestionComponent: activeSuggestion?.show ? (
      <AuthSuggestionPopup
        trigger={activeSuggestion.trigger}
        onClose={closeSuggestion}
      />
    ) : null
  }
}