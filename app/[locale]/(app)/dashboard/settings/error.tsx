'use client'

/**
 * Settings Error Page - Tradelia 2026
 * REQ 25.3: Add Error Boundaries to routes
 */

import { useEffect } from 'react'
import { FullPageError } from '@/src/shared/ui/ErrorState'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function SettingsError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Settings error:', error)
  }, [error])

  return (
    <FullPageError
      title="Errore nelle Impostazioni"
      message={error.message || 'Si è verificato un errore nelle impostazioni. Riprova o torna al dashboard.'}
      errorCode={error.digest || 'SETTINGS_ERROR'}
      onRetry={reset}
      onGoBack={() => window.history.back()}
      showCopyDebug
    />
  )
}
