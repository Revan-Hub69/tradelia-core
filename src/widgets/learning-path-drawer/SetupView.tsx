/**
 * Setup View - Level 1 - DESIGN SYSTEM 2026 COMPLIANT
 * 
 * Prima schermata del Learning Path drawer:
 * - Selezione paese (per tassazione/regolamentazione)
 * - Selezione livello tecnico (Noob/Informato/Smart)
 * 
 * Tutti i moduli si adattano automaticamente al livello selezionato.
 * 
 * DESIGN COMPLIANCE:
 * - Enterprise typography (text-enterprise-*)
 * - Density system (density-*)
 * - Tap targets (tap-target-touch, min 44px mobile)
 * - Focus rings (focus-enterprise-ring)
 * - Card hover lift (card-hover-lift)
 * - Reading line height (reading-line-height)
 * - Drawer enterprise structure
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
    <div className="flex flex-col gap-6">
      {/* Intro */}
      <div className="relative density-card rounded-xl bg-gradient-to-br from-primary-500/8 to-primary-500/3 border border-primary-500/20 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }} />
        <div className="relative z-10">
          <h2 className="text-xl font-bold text-enterprise-primary mb-3">
            Personalizza il tuo percorso
          </h2>
          <p className="text-sm text-enterprise-secondary reading-line-height">
            Seleziona il tuo paese e il tuo livello di esperienza. Tutti i moduli si adatteranno automaticamente.
          </p>
        </div>
      </div>

      {/* Country Selection */}
      <div className="density-card rounded-xl bg-card border border-border-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/10 to-primary-500/5 text-primary flex-shrink-0">
            <GlobeIcon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-enterprise-primary">
            Dove vivi?
          </h3>
        </div>
        <p className="text-sm text-enterprise-secondary reading-line-height">
          Questo ci aiuta a mostrarti informazioni su tassazione e regolamentazione specifiche per il tuo paese.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(COUNTRY_LABELS) as Country[]).map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`
                p-4 rounded-lg border text-left transition-all duration-200
                tap-target-touch focus-enterprise-ring
                ${selectedCountry === country
                  ? 'border-2 border-primary bg-gradient-to-br from-primary-500/8 to-primary-500/3'
                  : 'border border-border-card hover:border-primary-500/30 hover:bg-muted/30'
                }
              `}
            >
              <div className="flex items-center gap-2">
                {selectedCountry === country && (
                  <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${
                  selectedCountry === country ? 'text-primary' : 'text-enterprise-body'
                }`}>
                  {COUNTRY_LABELS[country]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Technical Level Selection */}
      <div className="density-card rounded-xl bg-card border border-border-card space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/10 to-primary-500/5 text-primary flex-shrink-0">
            <UserIcon className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-enterprise-primary">
            Qual è il tuo livello?
          </h3>
        </div>
        <p className="text-sm text-enterprise-secondary reading-line-height">
          Tutti i moduli si adatteranno al tuo livello di esperienza.
        </p>
        <div className="space-y-3">
          {(Object.keys(TECHNICAL_LEVEL_LABELS) as TechnicalLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`
                w-full p-4 rounded-lg border text-left transition-all duration-200
                tap-target-touch focus-enterprise-ring
                ${selectedLevel === level
                  ? 'border-2 border-primary bg-gradient-to-br from-primary-500/8 to-primary-500/3'
                  : 'border border-border-card hover:border-primary-500/30 hover:bg-muted/30'
                }
              `}
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                  transition-all duration-200
                  ${selectedLevel === level
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground/30'
                  }
                `}>
                  {selectedLevel === level && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold mb-1 ${
                    selectedLevel === level ? 'text-primary' : 'text-enterprise-primary'
                  }`}>
                    {TECHNICAL_LEVEL_LABELS[level]}
                  </div>
                  <div className="text-xs text-enterprise-secondary reading-line-height">
                    {TECHNICAL_LEVEL_DESCRIPTIONS[level]}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="density-card rounded-xl bg-card border border-border-card">
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className="cta-enterprise-primary w-full focus-enterprise-ring tap-target-touch disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {canProceed ? 'Inizia il percorso →' : 'Seleziona paese e livello'}
        </button>
      </div>
    </div>
  )
}

// SVG Icons - Homemade, no emoji, no icon libraries
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
