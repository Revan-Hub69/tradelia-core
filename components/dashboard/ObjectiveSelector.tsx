'use client'

import { useState } from 'react'
import { UnifiedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/design-system/unified-card"
import { Button } from "@/components/ui/button"
import { CheckCircleIcon, BookIcon, TrophyIcon, WarningIcon, CoinsIcon, BrainIcon } from "@/components/icons"

export type ObjectiveType = 
  | 'passive'
  | 'accumulation' 
  | 'speculation-moderate'
  | 'speculation-high'
  | 'automation'
  | 'learning'

interface Objective {
  id: ObjectiveType
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  warning?: string
  examples: string[]
}

const objectives: Objective[] = [
  {
    id: 'passive',
    title: 'Investimenti passivi / lungo periodo',
    description: 'Costruire un portafoglio diversificato per il lungo termine, con approccio buy-and-hold.',
    icon: TrophyIcon,
    color: 'blue',
    examples: [
      'Allocazione percentuale tra asset',
      'Rebalancing periodico',
      'Costi di gestione e tasse'
    ]
  },
  {
    id: 'accumulation',
    title: 'Accumulo graduale',
    description: 'Investimenti regolari nel tempo (DCA) per ridurre la volatilità e costruire posizioni.',
    icon: CoinsIcon,
    color: 'green',
    examples: [
      'Piano di accumulo mensile',
      'Timing degli acquisti',
      'Gestione della volatilità'
    ]
  },
  {
    id: 'speculation-moderate',
    title: 'Speculazione moderata',
    description: 'Trading attivo con gestione del rischio, analisi tecnica e posizioni a medio termine.',
    icon: WarningIcon,
    color: 'amber',
    warning: 'Richiede esperienza e gestione attiva del rischio',
    examples: [
      'Analisi tecnica e fondamentale',
      'Stop loss e take profit',
      'Gestione del capitale'
    ]
  },
  {
    id: 'speculation-high',
    title: 'Speculazione ad alto rischio',
    description: 'Trading aggressivo, leverage, derivati. Solo per trader esperti con capitale a rischio.',
    icon: WarningIcon,
    color: 'red',
    warning: 'ATTENZIONE: Alto rischio di perdite significative',
    examples: [
      'Futures e opzioni',
      'Trading con leva',
      'Gestione rischio avanzata'
    ]
  },
  {
    id: 'automation',
    title: 'Automazioni / strategie sistematiche',
    description: 'Bot di trading, strategie algoritmiche, sistemi automatizzati basati su regole.',
    icon: BrainIcon,
    color: 'purple',
    examples: [
      'Bot di trading automatico',
      'Strategie algoritmiche',
      'Backtesting e ottimizzazione'
    ]
  },
  {
    id: 'learning',
    title: 'Sto solo cercando di capire',
    description: 'Apprendimento dei concetti base, esplorazione del settore senza impegni operativi.',
    icon: BookIcon,
    color: 'gray',
    examples: [
      'Concetti fondamentali',
      'Come funzionano i mercati',
      'Rischi e opportunità'
    ]
  }
]

interface ObjectiveSelectorProps {
  selectedObjective?: ObjectiveType
  onObjectiveSelect: (objective: ObjectiveType) => void
  onContinue: () => void
}

export function ObjectiveSelector({ 
  selectedObjective, 
  onObjectiveSelect, 
  onContinue 
}: ObjectiveSelectorProps) {
  const [hoveredObjective, setHoveredObjective] = useState<ObjectiveType | null>(null)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="dashboard-title text-3xl">
          Non partiamo dai grafici. Partiamo dall'obiettivo.
        </h1>
        <p className="dashboard-body text-lg max-w-2xl mx-auto">
          La prima domanda di Tradelia non è "che crypto vuoi comprare?", ma:
        </p>
        <h2 className="dashboard-subtitle text-xl font-semibold">
          Cosa stai cercando di fare nel mondo crypto?
        </h2>
        <p className="dashboard-caption text-sm text-muted-foreground">
          Questa scelta non è una raccomandazione finanziaria. Serve solo a configurare correttamente la dashboard.
        </p>
      </div>

      {/* Objectives Grid */}
      <div className="objective-selector">
        {objectives.map((objective) => {
          const IconComponent = objective.icon
          const isSelected = selectedObjective === objective.id
          const isHovered = hoveredObjective === objective.id
          
          return (
            <UnifiedCard
              key={objective.id}
              className={`
                objective-card cursor-pointer transition-all duration-200
                ${isSelected ? `objective-${objective.color} ring-2 ring-primary ring-offset-2` : 'hover:shadow-md'}
                ${isHovered ? 'scale-[1.02]' : ''}
              `}
              onClick={() => onObjectiveSelect(objective.id)}
              onMouseEnter={() => setHoveredObjective(objective.id)}
              onMouseLeave={() => setHoveredObjective(null)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      p-2 rounded-lg 
                      ${objective.color === 'blue' ? 'bg-blue-100 text-blue-600' : ''}
                      ${objective.color === 'green' ? 'bg-green-100 text-green-600' : ''}
                      ${objective.color === 'amber' ? 'bg-amber-100 text-amber-600' : ''}
                      ${objective.color === 'red' ? 'bg-red-100 text-red-600' : ''}
                      ${objective.color === 'purple' ? 'bg-purple-100 text-purple-600' : ''}
                      ${objective.color === 'gray' ? 'bg-gray-100 text-gray-600' : ''}
                    `}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold leading-tight">
                        {objective.title}
                      </CardTitle>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className="w-5 h-5 text-primary animate-scale-in" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-3">
                <p className="dashboard-body text-sm leading-relaxed">
                  {objective.description}
                </p>
                
                {objective.warning && (
                  <div className={`
                    p-2 rounded text-xs font-medium
                    ${objective.color === 'amber' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                    ${objective.color === 'red' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                  `}>
                    ⚠️ {objective.warning}
                  </div>
                )}
                
                <div className="space-y-2">
                  <p className="dashboard-caption font-medium">
                    Cosa vedrai nella dashboard:
                  </p>
                  <ul className="space-y-1">
                    {objective.examples.map((example, index) => (
                      <li key={index} className="dashboard-caption flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </UnifiedCard>
          )
        })}
      </div>

      {/* Continue Button */}
      {selectedObjective && (
        <div className="text-center animate-slide-in-up">
          <Button 
            onClick={onContinue}
            size="lg"
            className="px-8 py-3 text-base font-medium"
          >
            Configura la mia dashboard
          </Button>
          <p className="dashboard-caption mt-2">
            Potrai sempre cambiare obiettivo in seguito
          </p>
        </div>
      )}
    </div>
  )
}