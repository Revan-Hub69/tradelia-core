'use client'

/**
 * Error State Components - Tradelia 2026
 * 
 * Seguendo ux-contract.md:
 * - Messaggio umano, non stack trace
 * - Azione di retry
 * - Non bloccare tutta la UI
 * - Errori specifici, non generici
 * 
 * Enterprise Enhancements (REQ 25):
 * - Error code display (REQ 25.1)
 * - Copy debug info button (REQ 25.2)
 * - Recovery actions
 */

import { useState, useCallback, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { SafeButton } from './SafeButton'
import { AlertTriangleIcon } from '@/components/icons/TradeliaIcons'

interface ErrorStateProps {
  title?: string
  message: string
  /** Error code for display (e.g., "E001", "404") */
  errorCode?: string
  onRetry?: () => void
  retryLabel?: string
  /** Secondary action (e.g., go back, contact support) */
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  icon?: ReactNode
  className?: string
  /** Show copy debug info button (REQ 25.2) */
  showCopyDebug?: boolean
}

/**
 * Generates debug info for error reporting
 * Excludes sensitive data (no tokens, no PII)
 */
function generateDebugInfo(errorCode?: string, message?: string): string {
  const debugInfo = {
    route: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
    timestamp: new Date().toISOString(),
    errorCode: errorCode || 'UNKNOWN',
    errorMessage: message?.slice(0, 100) || 'No message',
    online: typeof navigator !== 'undefined' ? navigator.onLine : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 60) : 'unknown',
    viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
    locale: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
  }
  return JSON.stringify(debugInfo, null, 2)
}

// Inline error for sections/cards
export function ErrorState({ 
  title,
  message, 
  errorCode,
  onRetry,
  retryLabel,
  secondaryAction,
  icon,
  className = '',
  showCopyDebug = false
}: ErrorStateProps) {
  const t = useTranslations('common')
  const [copySuccess, setCopySuccess] = useState(false)
  
  const handleCopyDebug = useCallback(async () => {
    try {
      const debugInfo = generateDebugInfo(errorCode, message)
      await navigator.clipboard.writeText(debugInfo)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy debug info:', err)
    }
  }, [errorCode, message])
  
  return (
    <div className={`flex flex-col items-center justify-center py-8 px-6 text-center ${className}`}>
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-4">
        {icon || <AlertTriangleIcon className="w-7 h-7 text-error" />}
      </div>
      
      {/* Error Code (REQ 25.1) */}
      {errorCode && (
        <span className="text-xs font-mono text-muted-foreground mb-2 px-2 py-0.5 bg-muted/50 rounded">
          Errore {errorCode}
        </span>
      )}
      
      {/* Title */}
      <h3 className="text-base font-semibold text-foreground mb-1">
        {title || t('errorOccurred')}
      </h3>
      
      {/* Message */}
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {message}
      </p>
      
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Primary: Retry */}
        {onRetry && (
          <SafeButton 
            onClick={onRetry} 
            variant="safe" 
            size="sm"
          >
            {retryLabel || t('retry')}
          </SafeButton>
        )}
        
        {/* Secondary Action */}
        {secondaryAction && (
          <SafeButton 
            onClick={secondaryAction.onClick} 
            variant="safe" 
            size="sm"
            className="border-border/50 text-muted-foreground hover:text-foreground"
          >
            {secondaryAction.label}
          </SafeButton>
        )}
        
        {/* Copy Debug Info (REQ 25.2) */}
        {showCopyDebug && (
          <button
            onClick={handleCopyDebug}
            className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
            aria-label={copySuccess ? 'Info debug copiate!' : 'Copia info debug'}
          >
            {copySuccess ? '✓ Copiato!' : 'Copia info debug'}
          </button>
        )}
      </div>
    </div>
  )
}

// Card-level error (replaces card content)
interface ErrorCardProps {
  message: string
  errorCode?: string
  onRetry?: () => void
  showCopyDebug?: boolean
  className?: string
}

export function ErrorCard({ 
  message, 
  errorCode,
  onRetry,
  showCopyDebug = false,
  className = '' 
}: ErrorCardProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  
  const handleCopyDebug = useCallback(async () => {
    try {
      const debugInfo = generateDebugInfo(errorCode, message)
      await navigator.clipboard.writeText(debugInfo)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy debug info:', err)
    }
  }, [errorCode, message])
  
  return (
    <div className={`bg-background/60 border border-error/20 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangleIcon className="w-4 h-4 text-error" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-foreground">
              Errore caricamento
            </p>
            {errorCode && (
              <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 bg-muted/50 rounded">
                {errorCode}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            {message}
          </p>
          <div className="flex items-center gap-2">
            {onRetry && (
              <SafeButton 
                onClick={onRetry} 
                variant="safe" 
                size="sm"
                className="text-xs"
              >
                Riprova
              </SafeButton>
            )}
            {showCopyDebug && (
              <button
                onClick={handleCopyDebug}
                className="text-[10px] text-muted-foreground hover:text-foreground underline underline-offset-2"
              >
                {copySuccess ? '✓ Copiato' : 'Debug info'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Inline error message (for forms, small areas)
export function InlineError({ 
  message,
  className = '' 
}: { message: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-error ${className}`}>
      <AlertTriangleIcon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="text-xs font-medium">{message}</span>
    </div>
  )
}

// Network error banner
export function NetworkError({ 
  onRetry,
  className = '' 
}: { onRetry?: () => void; className?: string }) {
  return (
    <div className={`alert-error flex items-center justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <AlertTriangleIcon className="w-5 h-5 text-error" />
        <div>
          <p className="text-sm font-medium text-error">Connessione persa</p>
          <p className="text-xs text-error/80">Verifica la tua connessione internet</p>
        </div>
      </div>
      {onRetry && (
        <SafeButton 
          onClick={onRetry} 
          variant="safe" 
          size="sm"
          className="border-error/30 text-error hover:bg-error/10"
        >
          Riprova
        </SafeButton>
      )}
    </div>
  )
}

// Full page error (for fatal errors)
interface FullPageErrorProps {
  title?: string
  message: string
  errorCode?: string
  onRetry?: () => void
  onGoBack?: () => void
  showCopyDebug?: boolean
}

export function FullPageError({ 
  title,
  message,
  errorCode,
  onRetry,
  onGoBack,
  showCopyDebug = true
}: FullPageErrorProps) {
  const t = useTranslations('common')
  const [copySuccess, setCopySuccess] = useState(false)
  
  const handleCopyDebug = useCallback(async () => {
    try {
      const debugInfo = generateDebugInfo(errorCode, message)
      await navigator.clipboard.writeText(debugInfo)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy debug info:', err)
    }
  }, [errorCode, message])
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangleIcon className="w-10 h-10 text-error" />
        </div>
        
        {/* Error Code (REQ 25.1) */}
        {errorCode && (
          <span className="inline-block text-xs font-mono text-muted-foreground mb-3 px-2 py-1 bg-muted/50 rounded">
            Errore {errorCode}
          </span>
        )}
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {title || t('somethingWentWrong')}
        </h1>
        
        {/* Message */}
        <p className="text-muted-foreground mb-8">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <SafeButton onClick={onRetry} variant="safe">
              Riprova
            </SafeButton>
          )}
          {onGoBack && (
            <SafeButton onClick={onGoBack} variant="safe">
              Torna indietro
            </SafeButton>
          )}
        </div>
        
        {/* Copy Debug Info (REQ 25.2) */}
        {showCopyDebug && (
          <button
            onClick={handleCopyDebug}
            className="mt-6 text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
          >
            {copySuccess ? '✓ Info debug copiate!' : 'Copia info debug per supporto'}
          </button>
        )}
        
        {/* Support link */}
        <p className="text-xs text-muted-foreground mt-6">
          Se il problema persiste,{' '}
          <a href="mailto:support@tradelia.com" className="text-primary hover:underline">
            contatta il supporto
          </a>
        </p>
      </div>
    </div>
  )
}
