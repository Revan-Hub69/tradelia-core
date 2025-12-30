'use client'

import { Progress } from "@/components/ui/progress"
import { BrainIcon } from "@/components/icons/brain-icon"

interface MicrolearningHeaderProps {
  totalLessons: number
  completedLessons: number
  progressPercentage: number
}

export function MicrolearningHeader({ 
  totalLessons, 
  completedLessons, 
  progressPercentage 
}: MicrolearningHeaderProps) {
  return (
    <header className="text-center space-y-6">
      <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
        <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
        Microlearning
      </div>
      
      <div className="space-y-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          Capire prima di credere
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Brevi lezioni per capire concetti fondamentali, senza promesse e senza segnali.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progresso Generale</span>
          <span className="font-medium">{completedLessons}/{totalLessons} lezioni</span>
        </div>
        
        <Progress value={progressPercentage} className="h-2" />
        
        <div className="text-xs text-muted-foreground">
          {progressPercentage}% completato
        </div>
      </div>

      {/* Methodology Reminder */}
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
            <BrainIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
            <strong>Struttura:</strong> Concetto → Esempio reale → Errore comune → Regola di sicurezza
          </p>
        </div>
      </div>
    </header>
  )
}