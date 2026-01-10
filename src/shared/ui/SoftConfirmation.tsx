/**
 * SoftConfirmation - Ultra-Chicca 2026
 * 
 * Soft Confirmation System
 * - Non-modal inline confirmations
 * - "Procedi" / "Leggi prima" pattern
 * - Contextual warnings without blocking
 * - Reduces errors while maintaining flow
 */

'use client'

import { useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangleIcon, InfoIcon, ShieldIcon } from '@/components/icons/TradeliaIcons'

export interface SoftConfirmationProps {
  message: string
  type?: 'warning' | 'info' | 'critical'
  onProceed: () => void
  onCancel?: () => void
  proceedLabel?: string
  cancelLabel?: string
  showOnce?: boolean
  storageKey?: string
  children: React.ReactNode
  className?: string
}

export function SoftConfirmation({ 
  message,
  type = 'warning',
  onProceed, 
  onCancel, 
  proceedLabel,
  cancelLabel,
  showOnce = false,
  storageKey,
  children,
  className = ''
}: SoftConfirmationProps) {
  const t = useTranslations('common.softConfirmation')
  
  // Check if confirmation was already shown and dismissed
  const [showConfirmation, setShowConfirmation] = useState(() => {
    if (showOnce && storageKey) {
      const wasShown = localStorage.getItem(`soft-confirmation-${storageKey}`)
      return !wasShown
    }
    return false
  })

  const [hasInteracted, setHasInteracted] = useState(false)

  // Type configurations
  const typeConfig = {
    warning: {
      icon: AlertTriangleIcon,
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      textColor: 'text-warning',
      buttonColor: 'bg-warning hover:bg-warning/90'
    },
    info: {
      icon: InfoIcon,
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      textColor: 'text-primary',
      buttonColor: 'bg-primary hover:bg-primary/90'
    },
    critical: {
      icon: ShieldIcon,
      bgColor: 'bg-error/10',
      borderColor: 'border-error/20',
      textColor: 'text-error',
      buttonColor: 'bg-error hover:bg-error/90'
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  const handleInitialClick = useCallback(() => {
    if (!hasInteracted) {
      setShowConfirmation(true)
      setHasInteracted(true)
    }
  }, [hasInteracted])

  const handleProceed = useCallback(() => {
    setShowConfirmation(false)
    
    // Mark as shown if showOnce is enabled
    if (showOnce && storageKey) {
      localStorage.setItem(`soft-confirmation-${storageKey}`, 'true')
    }
    
    onProceed()
  }, [showOnce, storageKey, onProceed])

  const handleCancel = useCallback(() => {
    setShowConfirmation(false)
    onCancel?.()
  }, [onCancel])

  const handleDismiss = useCallback(() => {
    setShowConfirmation(false)
    setHasInteracted(false)
  }, [])

  if (showConfirmation) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className={`p-4 ${config.bgColor} border ${config.borderColor} rounded-lg animate-in slide-in-from-top-2 duration-200`}>
          <div className="flex items-start gap-3">
            <Icon className={`w-5 h-5 ${config.textColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 space-y-3">
              <p className={`text-sm ${config.textColor} font-medium leading-relaxed`}>
                {message}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleProceed}
                  className={`px-4 py-2 ${config.buttonColor} text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current`}
                >
                  {proceedLabel || t('proceed')}
                </button>
                
                {onCancel && (
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                  >
                    {cancelLabel || t('readFirst')}
                  </button>
                )}
                
                <button
                  onClick={handleDismiss}
                  className="ml-auto p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg"
                  aria-label={t('dismiss')}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={handleInitialClick} className={className}>
      {children}
    </div>
  )
}

// Preset components for common use cases
export function ToolConfirmation({ 
  toolName, 
  riskLevel = 'medium',
  onProceed, 
  children,
  ...props 
}: {
  toolName: string
  riskLevel?: 'low' | 'medium' | 'high'
  onProceed: () => void
  children: React.ReactNode
} & Omit<SoftConfirmationProps, 'message' | 'onProceed' | 'children'>) {
  const t = useTranslations('common.softConfirmation')
  
  const riskMessages = {
    low: t('toolWarning.low', { toolName }),
    medium: t('toolWarning.medium', { toolName }),
    high: t('toolWarning.high', { toolName })
  }

  const riskTypes = {
    low: 'info' as const,
    medium: 'warning' as const,
    high: 'critical' as const
  }

  return (
    <SoftConfirmation
      message={riskMessages[riskLevel]}
      type={riskTypes[riskLevel]}
      onProceed={onProceed}
      storageKey={`tool-${toolName.toLowerCase().replace(/\s+/g, '-')}`}
      showOnce={riskLevel === 'low'}
      {...props}
    >
      {children}
    </SoftConfirmation>
  )
}

export function SectionConfirmation({ 
  sectionId, 
  onProceed, 
  children,
  ...props 
}: {
  sectionId: string
  onProceed: () => void
  children: React.ReactNode
} & Omit<SoftConfirmationProps, 'message' | 'onProceed' | 'children'>) {
  const t = useTranslations('common.softConfirmation')
  
  return (
    <SoftConfirmation
      message={t('sectionWarning', { sectionId })}
      type="warning"
      onProceed={onProceed}
      storageKey={`section-${sectionId}`}
      showOnce={true}
      {...props}
    >
      {children}
    </SoftConfirmation>
  )
}