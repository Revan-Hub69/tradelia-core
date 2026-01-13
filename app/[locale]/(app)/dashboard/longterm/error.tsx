'use client'

/**
 * Longterm Journey Error Page - Tradelia 2026
 * REQ 25.3: Add Error Boundaries to routes
 */

import { useEffect } from 'react'
import { FullPageError } from '@/src/shared/ui/ErrorState'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function LongtermError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Longterm journey error:', error)
  }, [error])

  return (
    <FullPageError
      title="Errore in Longterm"
      message={error.message || 'Si è verificato un errore nel percorso Longterm. Riprova o torna al dashboard.'}
      errorCode={error.digest || 'LONGTERM_ERROR'}
      onRetry={reset}
      onGoBack={() => window.history.back()}
      showCopyDebug
    />
  )
}
