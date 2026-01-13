/**
 * InlineStatus Component - Tradelia 2026
 * 
 * Inline feedback system for showing status near trigger buttons.
 * Follows REQ 21.1, 21.4:
 * - States: idle, loading, success, error
 * - Show inline near trigger button
 * - Accessible with aria-live
 */

'use client'

import { memo } from 'react'
import { CheckIcon } from '@/components/icons/TradeliaIcons'

// Types
export type InlineStatusType = 'idle' | 'loading' | 'success' | 'error'

export interface InlineStatusProps {
  /** Current status state */
  status: InlineStatusType
  /** Message to show on success (default: "Salvato") */
  successMessage?: string
  /** Message to show on error */
  errorMessage?: string | undefined
  /** Loading message (default: "Salvataggio...") */
  loadingMessage?: string
  /** Callback for retry action on error */
  onRetry?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Spinner component for loading state
 */
const Spinner = memo(function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin ${className}`} 
      fill="none" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4" 
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
      />
    </svg>
  )
})

/**
 * X Icon for error state
 */
const XIcon = memo(function XIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6 18L18 6M6 6l12 12" 
      />
    </svg>
  )
})

/**
 * InlineStatus - Shows inline feedback near trigger buttons
 * 
 * @example
 * ```tsx
 * <div className="flex items-center gap-2">
 *   <button onClick={handleSave}>Save</button>
 *   <InlineStatus 
 *     status={saveStatus} 
 *     successMessage="Saved!" 
 *     errorMessage="Failed to save"
 *     onRetry={handleSave}
 *   />
 * </div>
 * ```
 */
export const InlineStatus = memo(function InlineStatus({
  status,
  successMessage = 'Salvato',
  errorMessage,
  loadingMessage = 'Salvataggio...',
  onRetry,
  className = ''
}: InlineStatusProps) {
  // Don't render anything in idle state
  if (status === 'idle') return null

  const statusConfig = {
    loading: {
      icon: <Spinner className="w-3.5 h-3.5 text-muted-foreground" />,
      text: loadingMessage,
      textClass: 'text-muted-foreground',
      ariaLive: 'polite' as const
    },
    success: {
      icon: <CheckIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      text: successMessage,
      textClass: 'text-emerald-600 dark:text-emerald-400',
      ariaLive: 'polite' as const
    },
    error: {
      icon: <XIcon className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />,
      text: errorMessage || 'Errore',
      textClass: 'text-red-600 dark:text-red-400',
      ariaLive: 'assertive' as const
    }
  }

  const config = statusConfig[status]

  return (
    <span 
      className={`inline-flex items-center gap-1.5 text-sm animate-in fade-in duration-200 ${className}`}
      role="status"
      aria-live={config.ariaLive}
    >
      {config.icon}
      <span className={config.textClass}>
        {config.text}
      </span>
      
      {status === 'error' && onRetry && (
        <button 
          onClick={onRetry}
          className="ml-1 text-primary hover:text-primary/80 underline underline-offset-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded"
          type="button"
        >
          Riprova
        </button>
      )}
    </span>
  )
})

export default InlineStatus
