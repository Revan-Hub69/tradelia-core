'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { Badge } from '@/components/ui/badge'
import { X, BookOpen, RefreshCw, Shield, Clock } from 'lucide-react'
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
          title: 'Ottimo lavoro! 🎉',
          subtitle: 'Hai completato il percorso di orientamento',
          description: 'Vuoi salvare il tuo progresso per continuare da qualsiasi dispositivo?',
          benefits: [
            'Il tuo percorso educativo viene salvato automaticamente',
            'Sincronizzazione tra tutti i tuoi dispositivi',
            'Accesso a funzionalità avanzate quando disponibili'
          ],
          urgency: 'low'
        }

      case 'multiple_sections':
        return {
          title: 'Stai esplorando molto! 📚',
          subtitle: 'Hai visitato diverse sezioni educative',
          description: 'Un account ti permetterebbe di tenere traccia del tuo progresso complessivo.',
          benefits: [
            'Tracciamento del progresso tra tutte le sezioni',
            'Ripresa automatica da dove hai lasciato',
            'Statistiche personali del tuo apprendimento'
          ],
          urgency: 'medium'
        }

      case 'data_retention':
        return {
          title: 'I tuoi dati scadranno presto ⏰',
          subtitle: 'Hai dati educativi da più di 7 giorni',
          description: 'Senza un account, i tuoi progressi verranno eliminati automaticamente tra qualche giorno.',
          benefits: [
            'Salvataggio permanente di tutto il tuo progresso',
            'Nessuna perdita di dati educativi',
            'Backup sicuro e crittografato'
          ],
          urgency: 'high'
        }

      default:
        return {
          title: 'Salva il tuo progresso',
          subtitle: 'Account opzionale ma utile',
          description: 'Crea un account per non perdere il tuo percorso educativo.',
          benefits: [
            'Progresso salvato automaticamente',
            'Sincronizzazione tra dispositivi',
            'Privacy e sicurezza garantite'
          ],
          urgency: 'low'
        }
    }
  }

  if (isDismissed) {
    return null
  }

  const content = getSuggestionContent()
  const urgencyColors: Record<string, string> = {
    low: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20',
    medium: 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20',
    high: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
  }

  return (
    <>
      <Dialog open={true} onOpenChange={() => handleDismiss(false)}>
        <DialogContent className="max-w-md">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDismiss(false)}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="space-y-6 pt-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">{content.title}</h2>
              <p className="text-sm text-muted-foreground">{content.subtitle}</p>
            </div>

            {/* Main Content */}
            <UnifiedCard className={urgencyColors[content.urgency]}>
              <CardContent className="p-6">
                <p className="text-sm mb-4">{content.description}</p>
                
                <div className="space-y-3">
                  {content.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-primary/10 flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </UnifiedCard>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleCreateAccount}
                className="w-full"
                size="lg"
              >
                Crea Account (Gratis)
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleDismiss(false)}
                  className="flex-1 text-sm"
                >
                  Ricordamelo dopo
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => handleDismiss(true)}
                  className="flex-1 text-sm"
                >
                  Non mostrare più
                </Button>
              </div>
            </div>

            {/* Educational Note */}
            <div className="text-xs text-muted-foreground text-center p-3 bg-muted/20 rounded-lg">
              <strong>Promemoria:</strong> L'account è completamente opzionale. 
              Puoi continuare a usare Tradelia senza registrarti.
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth Modal */}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultTab="register"
        title="Salva il tuo progresso"
        description="Crea un account per non perdere il tuo percorso educativo"
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