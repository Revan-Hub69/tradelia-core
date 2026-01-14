/**
 * Setup View - Level 1
 * 
 * Prima schermata del Learning Path drawer:
 * - Selezione paese (per tassazione/regolamentazione)
 * - Selezione livello tecnico (Noob/Informato/Smart)
 * 
 * Tutti i moduli si adattano automaticamente al livello selezionato.
 */

'use client'

import { useState } from 'react'
import { 
  type Country, 
  type TechnicalLevel,
  COUNTRY_LABELS,
  TECHNICAL_LEVEL_LABELS,
  TECHNICAL_LEVEL_DESCRIPTIONS
} from '@/src/shared/config/learning-path-groups'

interface SetupViewProps {
  currentCountry: Country | null
  currentLevel: TechnicalLevel | null
  onComplete: (country: Country, level: TechnicalLevel) => void
}

export function SetupView({ currentCountry, currentLevel, onComplete }: SetupViewProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(currentCountry)
  const [selectedLevel, setSelectedLevel] = useState<TechnicalLevel | null>(currentLevel)

  const canProceed = selectedCountry && selectedLevel

  const handleProceed = () => {
    if (canProceed) {
      onComplete(selectedCountry, selectedLevel)
    }
  }

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="space-y-3">
        <h2 className="text-xl font-bold text-foreground">
          Personalizza il tuo percorso
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Seleziona il tuo paese e il tuo livello di esperienza. Tutti i moduli si adatteranno automaticamente.
        </p>
      </div>

      {/* Country Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <GlobeIcon className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Dove vivi?
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Questo ci aiuta a mostrarti informazioni su tassazione e regolamentazione specifiche per il tuo paese.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(COUNTRY_LABELS) as Country[]).map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-200
                min-h-[64px] text-left
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${selectedCountry === country
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/50 hover:border-border hover:bg-muted/30'
                }
              `}
            >
              <div className="flex items-center gap-2">
                {selectedCountry === country && (
                  <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${
                  selectedCountry === country ? 'text-primary' : 'text-foreground'
                }`}>
                  {COUNTRY_LABELS[country]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Technical Level Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-primary" />
          <h3 className="text-base font-semibold text-foreground">
            Qual è il tuo livello?
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Tutti i moduli si adatteranno al tuo livello di esperienza.
        </p>
        <div className="space-y-3">
          {(Object.keys(TECHNICAL_LEVEL_LABELS) as TechnicalLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`
                w-full p-4 rounded-xl border-2 transition-all duration-200
                text-left min-h-[72px]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                ${selectedLevel === level
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/50 hover:border-border hover:bg-muted/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                  ${selectedLevel === level
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                  }
                `}>
                  {selectedLevel === level && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={`text-sm font-semibold mb-1 ${
                    selectedLevel === level ? 'text-primary' : 'text-foreground'
                  }`}>
                    {TECHNICAL_LEVEL_LABELS[level]}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {TECHNICAL_LEVEL_DESCRIPTIONS[level]}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-4 border-t border-border/50">
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className={`
            w-full py-4 rounded-xl font-semibold text-base
            transition-all duration-200
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            ${canProceed
              ? 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {canProceed ? 'Inizia il percorso →' : 'Seleziona paese e livello'}
        </button>
      </div>
    </div>
  )
}

// SVG Icons
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
