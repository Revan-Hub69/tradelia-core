/**
 * Risk Badge Component - Tradelia 2026
 * 
 * Badge semantico per indicare il livello di rischio
 * Rafforza il brand "anti-errore" e la percezione di serietà
 */

'use client'

import { useState } from 'react'
import { AlertTriangleIcon, ShieldIcon, InfoIcon, CloseIcon } from '@/components/icons/TradeliaIcons'

export type RiskLevel = 'low' | 'medium' | 'high'

interface RiskBadgeProps {
  level: RiskLevel
  showExplanation?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

interface RiskInfo {
  label: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ComponentType<{ className?: string }>
  explanation: string
  tips: string[]
}

const RISK_CONFIG: Record<RiskLevel, RiskInfo> = {
  low: {
    label: 'Basso Rischio',
    color: 'text-success',
    bgColor: 'bg-success/10',
    borderColor: 'border-success/20',
    icon: ShieldIcon,
    explanation: 'Questo strumento o strategia presenta rischi minimi. È adatto anche ai principianti.',
    tips: [
      'Ideale per iniziare senza stress',
      'Perdite potenziali molto limitate',
      'Adatto per capitale che non puoi permetterti di perdere'
    ]
  },
  medium: {
    label: 'Medio Rischio',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
    icon: AlertTriangleIcon,
    explanation: 'Questo strumento richiede attenzione e conoscenze base. Possibili perdite moderate.',
    tips: [
      'Leggi prima la sezione "Errori da evitare"',
      'Inizia con importi piccoli per fare pratica',
      'Assicurati di capire i meccanismi prima di procedere'
    ]
  },
  high: {
    label: 'Alto Rischio',
    color: 'text-error',
    bgColor: 'bg-error/10',
    borderColor: 'border-error/20',
    icon: AlertTriangleIcon,
    explanation: 'Strumento avanzato con rischi significativi. Solo per utenti esperti con capitale dedicato.',
    tips: [
      'SOLO per utenti esperti',
      'Usa SOLO capitale che puoi permetterti di perdere completamente',
      'Studia approfonditamente prima di utilizzare',
      'Considera alternative a rischio minore'
    ]
  }
}

export function RiskBadge({ 
  level, 
  showExplanation = true, 
  className = '',
  size = 'md' 
}: RiskBadgeProps) {
  const [showModal, setShowModal] = useState(false)
  const config = RISK_CONFIG[level]
  const Icon = config.icon

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <>
      {/* Badge */}
      <div className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeClasses[size]} ${config.bgColor} ${config.borderColor} ${config.color} border ${className}`}>
        <Icon className={iconSizes[size]} />
        <span>{config.label}</span>
        {showExplanation && (
          <button
            onClick={() => setShowModal(true)}
            className={`${iconSizes[size]} ${config.color} hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1`}
            aria-label="Spiegazione livello di rischio"
          >
            <InfoIcon className={iconSizes[size]} />
          </button>
        )}
      </div>

      {/* Explanation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowModal(false)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Chiudi spiegazione"
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-background border border-border rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${config.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {config.label}
                </h3>
              </div>
              
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Chiudi"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Explanation */}
              <p className="text-muted-foreground">
                {config.explanation}
              </p>

              {/* Tips */}
              <div>
                <h4 className="font-medium text-foreground mb-3">
                  {level === 'high' ? 'Attenzioni Critiche' : 'Consigli Pratici'}
                </h4>
                <ul className="space-y-2">
                  {config.tips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className={`w-1.5 h-1.5 rounded-full ${config.bgColor.replace('/10', '/60')} flex-shrink-0 mt-2`} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action */}
              <div className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                <p className={`text-sm font-medium ${config.color}`}>
                  {level === 'low' && '💡 Perfetto per iniziare in sicurezza'}
                  {level === 'medium' && '⚠️ Leggi prima "Errori da evitare"'}
                  {level === 'high' && '🚨 Solo per utenti molto esperti'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-border/50">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground bg-background hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Ho capito
              </button>
              
              {level !== 'low' && (
                <button
                  onClick={() => {
                    setShowModal(false)
                    // This would navigate to errors section
                    const event = new CustomEvent('switchToTab', { detail: 'errors' })
                    window.dispatchEvent(event)
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-white ${
                    level === 'medium' 
                      ? 'bg-warning hover:bg-warning/90 focus:ring-warning/50' 
                      : 'bg-error hover:bg-error/90 focus:ring-error/50'
                  }`}
                >
                  Leggi Errori
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Preset components for common use cases
export function ToolRiskBadge({ 
  toolId: _toolId, 
  level, 
  className 
}: { 
  toolId: string
  level: RiskLevel
  className?: string 
}) {
  return (
    <RiskBadge 
      level={level} 
      showExplanation={true}
      size="sm"
      {...(className && { className })}
    />
  )
}

export function SectionRiskBadge({ 
  sectionId: _sectionId, 
  level, 
  className 
}: { 
  sectionId: string
  level: RiskLevel
  className?: string 
}) {
  return (
    <RiskBadge 
      level={level} 
      showExplanation={true}
      size="md"
      {...(className && { className })}
    />
  )
}

// Hook for determining risk level based on content
export function useRiskLevel(contentType: string, complexity: number): RiskLevel {
  // Simple algorithm - in real app this would be more sophisticated
  if (contentType === 'education' || contentType === 'intro') return 'low'
  if (contentType === 'speculation' || complexity > 7) return 'high'
  return 'medium'
}