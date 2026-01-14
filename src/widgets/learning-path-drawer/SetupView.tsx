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
    <div className="density-section-gap flex flex-col">
      {/* Intro */}
      <div className="section-frame density-card">
        <h2 className="text-xl font-bold text-enterprise-primary mb-3">
          Personalizza il tuo percorso
        </h2>
        <p className="density-text-secondary text-enterprise-secondary reading-line-height">
          Seleziona il tuo paese e il tuo livello di esperienza. Tutti i moduli si adatteranno automaticamente.
        </p>
      </div>

      {/* Country Selection */}
      <div className="section-frame density-card density-section-gap">
        <div className="flex items-center density-gap">
          <div className="density-icon-box flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <GlobeIcon className="density-icon" />
          </div>
          <h3 className="text-base font-semibold text-enterprise-primary">
            Dove vivi?
          </h3>
        </div>
        <p className="density-text-secondary text-enterprise-secondary reading-line-height">
          Questo ci aiuta a mostrarti informazioni su tassazione e regolamentazione specifiche per il tuo paese.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 density-gap">
          {(Object.keys(COUNTRY_LABELS) as Country[]).map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`
                card-2026 card-hover-lift density-card
                tap-target-touch focus-enterprise-ring
                text-left transition-subtle
                ${selectedCountry === country
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border border-border-soft hover:border-border-strong'
                }
              `}
            >
              <div className="flex items-center density-gap">
                {selectedCountry === country && (
                  <CheckIcon className="w-4 h-4 text-primary flex-shrink-0" />
                )}
                <span className={`density-text-secondary font-medium ${
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
      <div className="section-frame density-card density-section-gap">
        <div className="flex items-center density-gap">
          <div className="density-icon-box flex items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
            <UserIcon className="density-icon" />
          </div>
          <h3 className="text-base font-semibold text-enterprise-primary">
            Qual è il tuo livello?
          </h3>
        </div>
        <p className="density-text-secondary text-enterprise-secondary reading-line-height">
          Tutti i moduli si adatteranno al tuo livello di esperienza.
        </p>
        <div className="space-y-3">
          {(Object.keys(TECHNICAL_LEVEL_LABELS) as TechnicalLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`
                w-full card-2026 card-hover-lift density-card
                tap-target-touch focus-enterprise-ring
                text-left transition-subtle
                ${selectedLevel === level
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border border-border-soft hover:border-border-strong'
                }
              `}
            >
              <div className="flex items-start density-gap">
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                  transition-subtle
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
                  <div className={`density-text-secondary font-semibold mb-1 ${
                    selectedLevel === level ? 'text-primary' : 'text-enterprise-primary'
                  }`}>
                    {TECHNICAL_LEVEL_LABELS[level]}
                  </div>
                  <div className="density-text-tertiary text-enterprise-secondary reading-line-height">
                    {TECHNICAL_LEVEL_DESCRIPTIONS[level]}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="section-frame density-card">
        <button
          onClick={handleProceed}
          disabled={!canProceed}
          className={`
            cta-enterprise-primary w-full focus-enterprise-ring
            ${!canProceed && 'opacity-50 cursor-not-allowed'}
          `}
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
