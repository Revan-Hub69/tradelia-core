'use client'

import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { StartFlow } from "@/components/dashboard/start/StartFlow"
import { getSessionId, initStorageCleanup } from "@/lib/utils/session"
import { useEffect, useState } from "react"

export default function StartPage() {
  const [sessionId, setSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializePage = async () => {
      try {
        // Initialize storage cleanup service
        await initStorageCleanup()
        
        // Get session ID
        const id = await getSessionId()
        setSessionId(id)
      } catch (error) {
        console.warn('Failed to initialize page:', error)
        // Fallback to a temporary session ID
        setSessionId(`temp-${Date.now()}`)
      } finally {
        setIsLoading(false)
      }
    }

    initializePage()
  }, [])

  if (isLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <SectionLayout className="py-20">
            <div className="mx-auto max-w-4xl">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
                  <div className="h-12 bg-muted rounded w-96 mx-auto mb-6"></div>
                  <div className="h-6 bg-muted rounded w-80 mx-auto"></div>
                </div>
              </div>
            </div>
          </SectionLayout>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-4xl">
          
          {/* Institutional Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6" role="banner">
              <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
              Sistema Educativo Tradelia
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Prima di iniziare
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
              Qui non devi dimostrare competenze, scegliere strumenti o prendere decisioni. 
              Questo percorso serve solo a capire da dove partire.
            </p>
          </header>
          
          {/* Start Flow Component */}
          <section className="mb-16">
            <StartFlow sessionId={sessionId} />
          </section>
          
          {/* Institutional Compliance */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              <strong className="font-medium">Sistema educativo:</strong> Tradelia non fornisce consulenza finanziaria 
              né raccomandazioni operative. L'obiettivo è sviluppare comprensione e senso critico.
            </p>
          </footer>
          
        </div>
      </SectionLayout>
    </div>
    </ErrorBoundary>
  );
}