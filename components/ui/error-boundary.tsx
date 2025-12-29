'use client'

import { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { UnifiedCard, CardContent } from '@/components/ui/design-system/unified-card'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Dashboard Start Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <UnifiedCard className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 rounded-full bg-destructive"></div>
              </div>
              
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Qualcosa è andato storto
              </h2>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Si è verificato un errore imprevisto. Puoi provare a ricaricare la pagina 
                o tornare alla homepage.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.location.reload()}
                  variant="default"
                  size="sm"
                >
                  Ricarica pagina
                </Button>
                
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline"
                  size="sm"
                >
                  Torna alla homepage
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-6">
                Se il problema persiste, contattaci per assistenza.
              </p>
            </CardContent>
          </UnifiedCard>
        </div>
      )
    }

    return this.props.children
  }
}