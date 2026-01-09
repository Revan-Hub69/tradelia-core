/**
 * PasswordStrength - Tradelia 2026
 * 
 * Indicatore visuale della forza password in tempo reale
 * Segue design-contract.md per colori semantici
 */

'use client'

import { useMemo } from 'react'

interface PasswordStrengthProps {
  password: string
  locale?: 'it' | 'en'
  showRequirements?: boolean
  className?: string
}

type StrengthScore = 0 | 1 | 2 | 3 | 4
type RequirementKey = 'length' | 'lowercase' | 'uppercase' | 'number' | 'special'

interface StrengthResult {
  score: StrengthScore
  label: string
  color: string
  bgColor: string
}

const labels: Record<'it' | 'en', string[]> = {
  it: ['Molto debole', 'Debole', 'Discreta', 'Buona', 'Ottima'],
  en: ['Very weak', 'Weak', 'Fair', 'Good', 'Excellent']
}

const requirements: Record<'it' | 'en', Record<RequirementKey, string>> = {
  it: {
    length: 'Almeno 8 caratteri',
    lowercase: 'Una lettera minuscola',
    uppercase: 'Una lettera maiuscola',
    number: 'Un numero',
    special: 'Un carattere speciale (!@#$%^&*)'
  },
  en: {
    length: 'At least 8 characters',
    lowercase: 'One lowercase letter',
    uppercase: 'One uppercase letter',
    number: 'One number',
    special: 'One special character (!@#$%^&*)'
  }
}

const colors: Array<{ color: string; bgColor: string }> = [
  { color: 'text-error', bgColor: 'bg-error' },
  { color: 'text-error', bgColor: 'bg-error' },
  { color: 'text-warning', bgColor: 'bg-warning' },
  { color: 'text-success', bgColor: 'bg-success' },
  { color: 'text-success', bgColor: 'bg-success' }
]

const requirementKeys: RequirementKey[] = ['length', 'lowercase', 'uppercase', 'number', 'special']

function calculateStrength(password: string): { score: StrengthScore; checks: Record<RequirementKey, boolean> } {
  const checks: Record<RequirementKey, boolean> = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
  
  const passed = Object.values(checks).filter(Boolean).length
  
  let score: StrengthScore = 0
  if (passed >= 5) score = 4
  else if (passed >= 4) score = 3
  else if (passed >= 3) score = 2
  else if (passed >= 2) score = 1
  
  return { score, checks }
}

export function PasswordStrength({ 
  password, 
  locale = 'it', 
  showRequirements = true,
  className = ''
}: PasswordStrengthProps) {
  const { score, checks } = useMemo(() => calculateStrength(password), [password])
  
  const strength: StrengthResult = useMemo(() => {
    const localeLabels = labels[locale]
    const defaultColor = { color: 'text-error', bgColor: 'bg-error' }
    const colorSet = colors[score] ?? defaultColor
    const label = localeLabels[score] ?? 'Molto debole'
    return {
      score,
      label,
      color: colorSet.color,
      bgColor: colorSet.bgColor
    }
  }, [score, locale])

  if (!password) return null

  const localeReqs = requirements[locale]

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress bars */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-200 ${
              i < score ? strength.bgColor : 'bg-muted'
            }`}
          />
        ))}
      </div>
      
      {/* Label */}
      <p className={`text-xs font-medium ${strength.color}`}>
        {strength.label}
      </p>

      {/* Requirements checklist */}
      {showRequirements && (
        <ul className="space-y-1 mt-2">
          {requirementKeys.map((key) => (
            <li 
              key={key}
              className={`text-xs flex items-center gap-2 transition-colors duration-150 ${
                checks[key] ? 'text-success' : 'text-muted-foreground'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {checks[key] ? (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                )}
              </span>
              {localeReqs[key]}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Hook per uso programmatico
export function usePasswordStrength(password: string) {
  return useMemo(() => calculateStrength(password), [password])
}

export default PasswordStrength
