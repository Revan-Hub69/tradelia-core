/**
 * Error State Components - Tradelia 2026
 * 
 * Seguendo ux-contract.md:
 * - Messaggio umano, non stack trace
 * - Azione di retry
 * - Non bloccare tutta la UI
 * - Errori specifici, non generici
 */

import type { ReactNode } from 'react'
import { Button } from './Button'
import { AlertTriangleIcon } from '@/components/icons/TradeliaIcons'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  icon?: ReactNode
  className?: string
}

// Inline error for sections/cards
export function ErrorState({ 
  title = 'Si è verificato un errore',
  message, 
  onRetry,
  retryLabel = 'Riprova',
  icon,
  className = '' 
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 px-6 text-center ${className}`}>
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center mb-4">
        {icon || <AlertTriangleIcon className="w-7 h-7 text-error" />}
      </div>
      
      {/* Title */}
      <h3 className="text-base font-semibold text-foreground mb-1">
        {title}
      </h3>
      
      {/* Message */}
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {message}
      </p>
      
      {/* Retry */}
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

// Card-level error (replaces card content)
export function ErrorCard({ 
  message, 
  onRetry,
  className = '' 
}: Omit<ErrorStateProps, 'title' | 'icon'>) {
  return (
    <div className={`bg-background/60 border border-error/20 rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center flex-shrink-0">
          <AlertTriangleIcon className="w-4 h-4 text-error" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-1">
            Errore caricamento
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            {message}
          </p>
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline" 
              size="sm"
              className="text-xs"
            >
              Riprova
            </Button>
          )}
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
        <Button 
          onClick={onRetry} 
          variant="outline" 
          size="sm"
          className="border-error/30 text-error hover:bg-error/10"
        >
          Riprova
        </Button>
      )}
    </div>
  )
}

// Full page error (for fatal errors)
interface FullPageErrorProps {
  title?: string
  message: string
  onRetry?: () => void
  onGoBack?: () => void
}

export function FullPageError({ 
  title = 'Qualcosa è andato storto',
  message,
  onRetry,
  onGoBack
}: FullPageErrorProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangleIcon className="w-10 h-10 text-error" />
        </div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {title}
        </h1>
        
        {/* Message */}
        <p className="text-muted-foreground mb-8">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry}>
              Riprova
            </Button>
          )}
          {onGoBack && (
            <Button onClick={onGoBack} variant="outline">
              Torna indietro
            </Button>
          )}
        </div>
        
        {/* Support link */}
        <p className="text-xs text-muted-foreground mt-8">
          Se il problema persiste,{' '}
          <a href="mailto:support@tradelia.com" className="text-primary hover:underline">
            contatta il supporto
          </a>
        </p>
      </div>
    </div>
  )
}
