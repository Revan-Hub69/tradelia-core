/**
 * Error Boundary - Tradelia 2026
 * 
 * React Error Boundary per catturare errori nei componenti figli
 * e mostrare una UI di fallback invece di crashare l'intera app.
 * 
 * REQ 25.3: Add Error Boundaries to routes
 */

'use client'

import { Component, type ReactNode } from 'react'
import { FullPageError } from './ErrorState'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Fallback UI to show when error occurs */
  fallback?: ReactNode
  /** Called when error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /** Error code to display */
  errorCode?: string
  /** Custom title for error state */
  title?: string
  /** Custom message for error state */
  message?: string
  /** Show retry button */
  showRetry?: boolean
  /** Show go back button */
  showGoBack?: boolean
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  render() {
    const { 
      children, 
      fallback, 
      errorCode,
      title,
      message,
      showRetry = true,
      showGoBack = true
    } = this.props
    const { hasError, error } = this.state

    if (hasError) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback
      }

      // Default error UI - only pass handlers when enabled
      const errorProps = {
        title: title || 'Si è verificato un errore',
        message: message || error?.message || 'Qualcosa è andato storto. Riprova o torna indietro.',
        errorCode: errorCode || 'RENDER_ERROR',
        showCopyDebug: true as const,
        ...(showRetry && { onRetry: this.handleRetry }),
        ...(showGoBack && { onGoBack: this.handleGoBack }),
      }
      
      return <FullPageError {...errorProps} />
    }

    return children
  }
}

/**
 * Route-level Error Boundary with sensible defaults
 * Use this to wrap entire route pages
 */
export function RouteErrorBoundary({ 
  children,
  routeName
}: { 
  children: ReactNode
  routeName?: string 
}) {
  return (
    <ErrorBoundary
      errorCode={routeName ? `ROUTE_${routeName.toUpperCase()}` : 'ROUTE_ERROR'}
      title="Errore nella pagina"
      message="Si è verificato un errore durante il caricamento di questa sezione. Puoi riprovare o tornare alla pagina precedente."
      showRetry
      showGoBack
    >
      {children}
    </ErrorBoundary>
  )
}

/**
 * Section-level Error Boundary for smaller UI sections
 * Shows a more compact error state
 */
export function SectionErrorBoundary({ 
  children,
  sectionName
}: { 
  children: ReactNode
  sectionName?: string 
}) {
  return (
    <ErrorBoundary
      errorCode={sectionName ? `SECTION_${sectionName.toUpperCase()}` : 'SECTION_ERROR'}
      title="Errore nel caricamento"
      message="Questa sezione non è disponibile al momento."
      showRetry
      showGoBack={false}
    >
      {children}
    </ErrorBoundary>
  )
}
