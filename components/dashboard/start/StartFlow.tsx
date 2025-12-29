'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { saveProgressData, getProgressData } from '@/lib/utils/session'
import { useAuthSuggestions } from '@/components/progressive-auth/AuthSuggestionPopup'
import { authManager } from '@/lib/auth/supabase-auth'
import type { Database } from '@/lib/supabase/types'

type StartFlowResponse = Database['public']['Tables']['start_flow_responses']['Insert']

interface StartFlowProps {
  sessionId: string
}

// Step 1: Mental State Options
const mentalStateOptions = [
  {
    id: 'confused_newcomer',
    label: 'Non sono mai entrato e mi sento confuso',
    description: 'Il mondo crypto mi sembra complicato e non so da dove iniziare'
  },
  {
    id: 'lost_participant',
    label: 'Sono entrato, ma non capisco bene cosa sto guardando',
    description: 'Ho già fatto qualche operazione ma mi sento disorientato'
  },
  {
    id: 'fearful_follower',
    label: 'Seguo il mercato, ma ho paura di sbagliare',
    description: 'Conosco i termini base ma temo di prendere decisioni sbagliate'
  },
  {
    id: 'scam_aware',
    label: 'Voglio soprattutto evitare truffe e fuffa',
    description: 'La mia priorità è riconoscere e evitare schemi fraudolenti'
  }
]

// Step 2: Cognitive Need Options
const cognitiveNeedOptions = [
  {
    id: 'understand_basics',
    label: 'Capire le basi, con calma',
    description: 'Voglio una comprensione solida dei concetti fondamentali'
  },
  {
    id: 'understand_indicators',
    label: 'Capire che numeri e indicatori hanno senso guardare',
    description: 'Voglio sapere quali metriche sono utili e come interpretarle'
  },
  {
    id: 'recognize_scams',
    label: 'Riconoscere truffe e schemi ricorrenti',
    description: 'Voglio sviluppare la capacità di identificare pattern fraudolenti'
  },
  {
    id: 'evaluate_platforms',
    label: 'Capire come valutare una piattaforma (disponibile più avanti)',
    description: 'Voglio imparare a valutare la sicurezza e affidabilità delle piattaforme'
  }
]

// Path suggestions based on responses
const getPathSuggestion = (mentalState: string, cognitiveNeed: string) => {
  // Logic to determine the best starting path
  if (cognitiveNeed === 'recognize_scams' || mentalState === 'scam_aware') {
    return {
      primary: 'Libreria truffe',
      primaryHref: '/dashboard/truffe',
      secondary: ['Misuratori di contesto', 'Microlearning'],
      secondaryHrefs: ['/dashboard/misuratori', '/dashboard/microlearning']
    }
  }
  
  if (cognitiveNeed === 'understand_indicators') {
    return {
      primary: 'Misuratori di contesto',
      primaryHref: '/dashboard/misuratori',
      secondary: ['Microlearning', 'Libreria truffe'],
      secondaryHrefs: ['/dashboard/microlearning', '/dashboard/truffe']
    }
  }
  
  // Default path for most users
  return {
    primary: 'Microlearning · Capire come funziona l\'hype crypto',
    primaryHref: '/dashboard/microlearning',
    secondary: ['Libreria truffe', 'Misuratori di contesto'],
    secondaryHrefs: ['/dashboard/truffe', '/dashboard/misuratori']
  }
}

export function StartFlow({ sessionId }: StartFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [responses, setResponses] = useState<Partial<StartFlowResponse>>({
    session_id: sessionId
  })
  const [isLoading, setIsLoading] = useState(false)
  const [pathSuggestion, setPathSuggestion] = useState<ReturnType<typeof getPathSuggestion> | null>(null)
  
  // Auth suggestions hook
  const { triggerSuggestion, SuggestionComponent } = useAuthSuggestions()

  // Load existing responses if any
  useEffect(() => {
    const loadExistingResponses = async () => {
      try {
        // First try to load from database if authenticated
        if (supabase && authManager.isAuthenticated) {
          const { data } = await supabase
            .from('start_flow_responses')
            .select('*')
            .eq('session_id', authManager.user?.id || sessionId)
            .single()

          if (data) {
            setResponses(data)
            if (data.completed_at) {
              setCurrentStep(4) // Go to results
              setPathSuggestion(getPathSuggestion(data.mental_state!, data.cognitive_need!))
            } else if (data.cognitive_need) {
              setCurrentStep(3)
            } else if (data.mental_state) {
              setCurrentStep(2)
            }
            return
          }
        }

        // Fallback to local storage for guest users
        const localData = await getProgressData('start_flow_responses')
        if (localData) {
          setResponses({ ...localData, session_id: sessionId })
          if (localData.completed_at) {
            setCurrentStep(4)
            setPathSuggestion(getPathSuggestion(localData.mental_state!, localData.cognitive_need!))
          } else if (localData.cognitive_need) {
            setCurrentStep(3)
          } else if (localData.mental_state) {
            setCurrentStep(2)
          }
        }
      } catch (error) {
        console.warn('Failed to load existing responses:', error)
      }
    }

    loadExistingResponses()
  }, [sessionId])

  const handleMentalStateSelect = async (optionId: string) => {
    setIsLoading(true)
    const updatedResponses = { ...responses, mental_state: optionId }
    setResponses(updatedResponses)

    try {
      // Save to database if authenticated
      if (supabase && authManager.isAuthenticated) {
        await supabase
          .from('start_flow_responses')
          .upsert({
            ...updatedResponses,
            session_id: authManager.user!.id
          })
      }

      // Always save locally as backup
      await saveProgressData('start_flow_responses', updatedResponses)
    } catch (error) {
      console.warn('Failed to save mental state:', error)
    }

    setCurrentStep(2)
    setIsLoading(false)
  }

  const handleCognitiveNeedSelect = async (optionId: string) => {
    setIsLoading(true)
    const updatedResponses = { ...responses, cognitive_need: optionId }
    setResponses(updatedResponses)

    // Generate path suggestion
    const suggestion = getPathSuggestion(responses.mental_state!, optionId)
    setPathSuggestion(suggestion)

    const completedData = {
      ...updatedResponses,
      suggested_path: suggestion.primary,
      completed_at: new Date().toISOString()
    }

    try {
      // Save to database if authenticated
      if (supabase && authManager.isAuthenticated) {
        await supabase
          .from('start_flow_responses')
          .upsert({
            ...completedData,
            session_id: authManager.user!.id
          })
      }

      // Always save locally
      await saveProgressData('start_flow_responses', completedData)

      // Trigger auth suggestion after completion (for guest users)
      if (!authManager.isAuthenticated) {
        setTimeout(() => {
          triggerSuggestion('start_flow_complete')
        }, 2000) // Wait 2 seconds to let user see the results
      }
    } catch (error) {
      console.warn('Failed to save cognitive need:', error)
    }

    setCurrentStep(3)
    setIsLoading(false)
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = ((currentStep - 1) / 3) * 100

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {Math.min(currentStep, 3)} di 3
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 1: Mental State */}
        {currentStep === 1 && (
          <UnifiedCard>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold mb-2">
                In questo momento, come ti senti rispetto al mondo crypto?
              </h2>
              <p className="text-muted-foreground mb-8">
                Scegli l'opzione che descrive meglio la tua situazione attuale.
              </p>

              <div className="space-y-4">
                {mentalStateOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleMentalStateSelect(option.id)}
                    disabled={isLoading}
                    className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50"
                  >
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </UnifiedCard>
        )}

        {/* Step 2: Cognitive Need */}
        {currentStep === 2 && (
          <UnifiedCard>
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Indietro
                </Button>
              </div>

              <h2 className="text-2xl font-semibold mb-2">
                Cosa ti serve di più adesso?
              </h2>
              <p className="text-muted-foreground mb-8">
                Seleziona il bisogno che senti più urgente in questo momento.
              </p>

              <div className="space-y-4">
                {cognitiveNeedOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleCognitiveNeedSelect(option.id)}
                    disabled={isLoading}
                    className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 disabled:opacity-50"
                  >
                    <div className="font-medium mb-1">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </UnifiedCard>
        )}

        {/* Step 3: Path Suggestion */}
        {currentStep === 3 && pathSuggestion && (
          <UnifiedCard variant="hero">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Da dove iniziare
                </h2>
                <p className="text-muted-foreground">
                  In base a quello che hai indicato, il punto più utile per iniziare è questo:
                </p>
              </div>

              {/* Primary Suggestion */}
              <div className="mb-8">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-primary">Suggerimento principale</span>
                  </div>
                  <h3 className="text-lg font-medium mb-4">{pathSuggestion.primary}</h3>
                  <Button asChild size="lg" className="w-full">
                    <a href={pathSuggestion.primaryHref}>
                      Inizia da qui
                    </a>
                  </Button>
                </div>
              </div>

              {/* Secondary Suggestions */}
              <div>
                <h4 className="font-medium mb-4 text-muted-foreground">
                  Altre sezioni utili (link soft):
                </h4>
                <div className="grid gap-3">
                  {pathSuggestion.secondary.map((item, index) => (
                    <a
                      key={item}
                      href={pathSuggestion.secondaryHrefs[index]}
                      className="block p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
                    >
                      <span className="text-sm font-medium">{item}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Restart Option */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCurrentStep(1)
                    setResponses({ session_id: sessionId })
                    setPathSuggestion(null)
                  }}
                >
                  Ricomincia il percorso
                </Button>
              </div>
            </CardContent>
          </UnifiedCard>
        )}
      </div>

      {/* Auth Suggestion Popup */}
      {SuggestionComponent}
    </>
  )
}