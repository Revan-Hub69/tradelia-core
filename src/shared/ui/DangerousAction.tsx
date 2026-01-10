/**
 * Dangerous Action Component - Tradelia 2026
 * 
 * Pattern UX per azioni rischiose che richiedono conferma esplicita
 * Conforme alle best practice di sicurezza UX 2026
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { SafeButton } from '@/src/shared/ui/SafeButton'
import { AlertTriangleIcon, ShieldIcon, CloseIcon } from '@/components/icons/TradeliaIcons'

interface DangerousActionProps {
  // Action details
  title: string
  description: string
  warningText: string
  confirmText: string
  
  // Callbacks
  onConfirm: () => void
  onCancel?: () => void
  
  // Trigger element
  children: React.ReactNode
  
  // Customization
  variant?: 'destructive' | 'warning' | 'critical'
  requiresTyping?: boolean
  className?: string
}

export function DangerousAction({
  title,
  description,
  warningText,
  confirmText,
  onConfirm,
  onCancel,
  children,
  variant = 'destructive',
  requiresTyping = true,
  className = ''
}: DangerousActionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [confirmInput, setConfirmInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Variant styles
  const variantStyles = {
    destructive: {
      icon: AlertTriangleIcon,
      iconColor: 'text-error',
      iconBg: 'bg-error/10',
      borderColor: 'border-error/20',
      bgColor: 'bg-error/5',
      buttonColor: 'bg-error hover:bg-error/90',
      textColor: 'text-error'
    },
    warning: {
      icon: AlertTriangleIcon,
      iconColor: 'text-warning',
      iconBg: 'bg-warning/10',
      borderColor: 'border-warning/20',
      bgColor: 'bg-warning/5',
      buttonColor: 'bg-warning hover:bg-warning/90',
      textColor: 'text-warning'
    },
    critical: {
      icon: ShieldIcon,
      iconColor: 'text-error',
      iconBg: 'bg-error/10',
      borderColor: 'border-error/30',
      bgColor: 'bg-error/10',
      buttonColor: 'bg-error hover:bg-error/90',
      textColor: 'text-error'
    }
  }

  const style = variantStyles[variant]
  const Icon = style.icon

  // Handle modal open
  const handleOpen = () => {
    setIsOpen(true)
    setConfirmInput('')
    setIsProcessing(false)
  }

  // Handle modal close
  const handleClose = () => {
    if (isProcessing) return
    setIsOpen(false)
    setConfirmInput('')
    onCancel?.()
  }

  // Handle confirm action
  const handleConfirm = async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      await onConfirm()
      setIsOpen(false)
      setConfirmInput('')
    } catch (error) {
      console.error('Dangerous action failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Check if action can be confirmed
  const canConfirm = requiresTyping 
    ? confirmInput.toLowerCase().trim() === confirmText.toLowerCase().trim()
    : true

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && requiresTyping && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, requiresTyping])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isProcessing) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, isProcessing])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  return (
    <>
      {/* Trigger Element */}
      <div onClick={handleOpen} className={className}>
        {children}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dangerous-action-title"
            aria-describedby="dangerous-action-description"
            className="
              relative w-full max-w-md bg-background border border-border rounded-xl shadow-2xl
              animate-in fade-in zoom-in-95 duration-200
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${style.iconColor}`} />
                </div>
                <h2 id="dangerous-action-title" className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              </div>
              
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Chiudi"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Description */}
              <p id="dangerous-action-description" className="text-muted-foreground">
                {description}
              </p>

              {/* Warning Box */}
              <div className={`p-4 rounded-lg border ${style.borderColor} ${style.bgColor}`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`text-sm font-medium ${style.textColor} mb-1`}>
                      Attenzione
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {warningText}
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation Input */}
              {requiresTyping && (
                <div className="space-y-2">
                  <label htmlFor="confirm-input" className="block text-sm font-medium text-foreground">
                    Scrivi "<span className="font-mono text-primary">{confirmText}</span>" per confermare:
                  </label>
                  <input
                    ref={inputRef}
                    id="confirm-input"
                    type="text"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    disabled={isProcessing}
                    placeholder={confirmText}
                    className="
                      w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
              )}

              {/* Context Information */}
              <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <p>💡 <strong>Suggerimento:</strong> Questa azione non può essere annullata. Assicurati di aver compreso le conseguenze prima di procedere.</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-6 border-t border-border/50">
              <button
                onClick={handleClose}
                disabled={isProcessing}
                className="
                  flex-1 px-4 py-2 border border-border rounded-lg text-foreground bg-background
                  hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Annulla
              </button>
              
              <SafeButton
                variant="critical"
                onClick={handleConfirm}
                disabled={!canConfirm || isProcessing}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors ${style.buttonColor}`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Elaborazione...
                  </div>
                ) : (
                  'Conferma azione'
                )}
              </SafeButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Preset components for common dangerous actions
export function DeleteAction({ 
  itemName, 
  onConfirm, 
  children 
}: { 
  itemName: string
  onConfirm: () => void
  children: React.ReactNode 
}) {
  return (
    <DangerousAction
      title="Elimina elemento"
      description={`Stai per eliminare "${itemName}". Questa azione non può essere annullata.`}
      warningText="Tutti i dati associati a questo elemento verranno persi definitivamente."
      confirmText="ELIMINA"
      onConfirm={onConfirm}
      variant="destructive"
      requiresTyping={true}
    >
      {children}
    </DangerousAction>
  )
}

export function ResetAction({ 
  onConfirm, 
  children 
}: { 
  onConfirm: () => void
  children: React.ReactNode 
}) {
  return (
    <DangerousAction
      title="Reset configurazione"
      description="Stai per ripristinare tutte le impostazioni ai valori predefiniti."
      warningText="Tutte le personalizzazioni e configurazioni verranno perse."
      confirmText="RESET"
      onConfirm={onConfirm}
      variant="warning"
      requiresTyping={true}
    >
      {children}
    </DangerousAction>
  )
}

export function CriticalAction({ 
  title,
  description,
  warningText,
  onConfirm, 
  children 
}: { 
  title: string
  description: string
  warningText: string
  onConfirm: () => void
  children: React.ReactNode 
}) {
  return (
    <DangerousAction
      title={title}
      description={description}
      warningText={warningText}
      confirmText="CONFERMO"
      onConfirm={onConfirm}
      variant="critical"
      requiresTyping={true}
    >
      {children}
    </DangerousAction>
  )
}