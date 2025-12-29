'use client'

import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Button } from "@/components/ui/button"
import { SuccessDotIcon } from "@/components/icons/success-dot-icon"
import { ErrorDotIcon } from "@/components/icons/error-dot-icon"
import { getSessionId, initStorageCleanup } from "@/lib/utils/session"
import { useAuth } from "@/components/providers/AppProviders"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function StartPage() {
  const [sessionId, setSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const initializePage = async () => {
      try {
        await initStorageCleanup()
        const id = await getSessionId()
        setSessionId(id)
      } catch (error) {
        console.warn('Failed to initialize page:', error)
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
        <SectionLayout className="py-12 sm:py-20">
          <div className="mx-auto max-w-4xl space-y-8">
          
          {/* BLOCCO 1 — COSA STAI GUARDANDO (3 RIGHE) */}
          <header className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Come usare Tradelia
            </h1>
            <div className="max-w-2xl mx-auto space-y-2 text-muted-foreground">
              <p>Tradelia è una piattaforma educativa sulle crypto.</p>
              <p>Serve a capire rischi, limiti ed errori comuni.</p>
              <p className="font-medium text-foreground">Non serve a decidere cosa comprare.</p>
            </div>
          </header>
          
          {/* BLOCCO 2 — COME FUNZIONA (SCHEMA, NON COPY) */}
          <UnifiedCard variant="elevated" className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Funziona così:</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium flex items-center justify-center">1</span>
                  <span>Tutti partono dalle basi comuni</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium flex items-center justify-center">2</span>
                  <span>Poi scegli cosa approfondire</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium flex items-center justify-center">3</span>
                  <span>Ogni contenuto è breve e indipendente</span>
                </li>
              </ol>
            </CardContent>
          </UnifiedCard>
          
          {/* BLOCCO 3 — PERCHÉ LE BASI SONO OBBLIGATORIE (1 FRASE) */}
          <UnifiedCard variant="elevated" className="bg-muted/30 max-w-2xl mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-foreground font-medium">
                Senza alcune basi minime, le informazioni crypto vengono interpretate male. Per questo non sono facoltative.
              </p>
            </CardContent>
          </UnifiedCard>
          
          {/* BLOCCO 4 — COSA TROVERAI / COSA NO (DUE COLONNE) */}
          <div className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            <UnifiedCard variant="elevated" className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300">Troverai</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <SuccessDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">spiegazioni brevi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SuccessDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">esempi reali</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SuccessDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">errori comuni spiegati</span>
                  </li>
                </ul>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard variant="elevated" className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-300">Non troverai</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ErrorDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">segnali</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ErrorDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">consigli di investimento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ErrorDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">promesse</span>
                  </li>
                </ul>
              </CardContent>
            </UnifiedCard>
          </div>
          
          {/* BLOCCO 5 — REGISTRAZIONE (SECCA, NON COMMERCIALE) */}
          <UnifiedCard variant="elevated" className="max-w-2xl mx-auto">
            <CardContent className="p-6 text-center space-y-4">
              <p className="text-muted-foreground">
                Puoi usare Tradelia anche senza account. Se ti registri, puoi salvare i progressi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/microlearning">Continua senza account</Link>
                </Button>
                {!user && (
                  <Button asChild size="sm">
                    <Link href="/auth/register">Registrati per salvare</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </UnifiedCard>
          
          {/* BLOCCO 6 — CTA UNICA */}
          <div className="text-center pt-4">
            <Button asChild size="lg" className="px-8 py-4">
              <Link href="/dashboard/microlearning">
                Inizia dalle basi comuni
              </Link>
            </Button>
          </div>
          
          {/* Institutional Compliance */}
          <footer className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-xs text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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