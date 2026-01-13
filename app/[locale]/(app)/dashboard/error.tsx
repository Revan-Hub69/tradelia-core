'use client'

/**
 * Dashboard Error Page - Tradelia 2026
 * 
 * Next.js App Router error boundary for dashboard routes.
 * Automatically catches errors in nested routes and shows fallback UI.
 * 
 * REQ 25.3: Add Error Boundaries to routes
 */

import { useEffect } from 'react'
import { FullPageError } from '@/src/shared/ui/ErrorState'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to console (could also send to error tracking service)
    console.error('Dashboard error:', error)
  }, [error])

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  return (
    <FullPageError
      title="Errore nel Dashboard"
      message={error.message || 'Si è verificato un errore imprevisto. Riprova o torna alla pagina precedente.'}
      errorCode={error.digest || 'DASHBOARD_ERROR'}
      onRetry={reset}
      onGoBack={handleGoBack}
      showCopyDebug
    />
  )
}
