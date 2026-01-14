/**
 * Technical Library Widget - Tradelia 2026
 * 
 * Widget espandibile per approfondimenti tecnici opzionali
 * Visivamente diverso dalle 4 sezioni principali
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { TECHNICAL_MODULE_LIST } from '@/src/shared/config/technical-deep-dives'

interface TechnicalLibraryProps {
  completedModules?: string[]
  onModuleClick?: (moduleId: string) => void
}

export function TechnicalLibrary({ 
  completedModules = [],
  onModuleClick 
}: TechnicalLibraryProps) {
  const t = useTranslations('dashboard')
  const [isExpanded, setIsExpanded] = useState(false)
  
  const completedCount = completedModules.length
  const totalCount = TECHNICAL_MODULE_LIST.length
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="section-frame border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left transition-all hover:bg-primary/5 rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-expanded={isExpanded}
        aria-controls="technical-library-content"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
              <BookStackIcon className="w-6 h-6 text-primary" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  📚 Biblioteca Tecnica
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
                  Opzionale
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Approfondimenti per chi vuole andare più a fondo
              </p>
              
              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted-foreground/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </div>
          </div>
          
          {/* Expand/Collapse Icon */}
          <div className="flex-shrink-0 mt-1">
            <ChevronIcon 
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div 
          id="technical-library-content"
          className="px-6 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="h-px bg-border/50 mb-4" />
          
          {/* Module List */}
          <div className="space-y-2">
            {TECHNICAL_MODULE_LIST.map((module) => {
              const isCompleted = completedModules.includes(module.id)
              
              return (
                <button
                  key={module.id}
                  onClick={() => onModuleClick?.(module.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isCompleted 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground/30 group-hover:border-primary/50'
                    }`}>
                      {isCompleted && (
                        <CheckIcon className="w-3 h-3 text-white" />
                      )}
                    </div>
                    
                    {/* Title */}
                    <span className={`font-medium text-sm flex-1 min-w-0 truncate ${
                      isCompleted ? 'text-muted-foreground' : 'text-foreground'
                    }`}>
                      {module.title}
                    </span>
                    
                    {/* Duration */}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      ~{module.estimatedMinutes} min
                    </span>
                  </div>
                  
                  {/* Arrow */}
                  <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </button>
              )
            })}
          </div>
          
          {/* Footer note */}
          <div className="mt-4 p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              💡 <strong>Suggerimento:</strong> Questi moduli non sono obbligatori per completare i percorsi, ma ti aiutano a capire meglio i concetti tecnici e a parlare con esperti senza sembrare ignorante.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
function BookStackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  )
}
