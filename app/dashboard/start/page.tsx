'use client'

import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SuccessDotIcon } from "@/components/icons/success-dot-icon"
import { ErrorDotIcon } from "@/components/icons/error-dot-icon"
import { BrainIcon } from "@/components/icons/brain-icon"
import { WarningIcon } from "@/components/icons/warning-icon"
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
          
          {/* BLOCCO 1 — COSA STAI GUARDANDO (3 RIGHE) - Verifiche accademiche */}
          <header className="text-center">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
              <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
              Sistema Educativo Tradelia
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Come usare Tradelia
            </h1>
            <div className="max-w-2xl mx-auto space-y-2 text-muted-foreground">
              <p>Tradelia è una piattaforma educativa sulle crypto.</p>
              <p>Serve a capire rischi, limiti ed errori comuni.</p>
              <p className="font-medium text-foreground">Non serve a decidere cosa comprare.</p>
            </div>
          </header>
          
          {/* Verifica Accademica: Scopo e Limitazioni */}
          <UnifiedCard className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <BrainIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Scopo Educativo
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    L'obiettivo è sviluppare comprensione e senso critico sui mercati crypto, 
                    non fornire segnali operativi o consigli di investimento.
                  </p>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
          
          {/* BLOCCO 2 — COME FUNZIONA (SCHEMA, NON COPY) - Metodologia Accademica */}
          <UnifiedCard variant="elevated">
            <CardHeader>
              <CardTitle>Metodologia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Ogni contenuto segue sempre lo stesso schema accademico:
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-sm mb-1">1. Concetto</div>
                  <div className="text-xs text-muted-foreground">Spiegazione chiara</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-sm mb-1">2. Esempio Reale</div>
                  <div className="text-xs text-muted-foreground">Caso verificabile</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-sm mb-1">3. Errore Comune</div>
                  <div className="text-xs text-muted-foreground">Cosa si sbaglia</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="font-medium text-sm mb-1">4. Regola di Sicurezza</div>
                  <div className="text-xs text-muted-foreground">Come evitarlo</div>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
          
          {/* BLOCCO 3 — PERCHÉ LE BASI SONO OBBLIGATORIE - Verifica Accademica */}
          <UnifiedCard className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <WarningIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                    Prerequisiti Cognitivi
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Senza alcune basi minime, le informazioni crypto vengono interpretate male. 
                    Per questo i concetti fondamentali non sono opzionali.
                  </p>
                </div>
              </div>
            </CardContent>
          </UnifiedCard>
          
          {/* BLOCCO 4 — COSA TROVERAI / COSA NO - Verifiche Accademiche */}
          <div className="grid gap-6 sm:grid-cols-2">
            <UnifiedCard variant="elevated" className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                  <SuccessDotIcon className="w-4 h-4" />
                  Contenuti Educativi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <SuccessDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Spiegazioni basate su evidenze</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SuccessDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Esempi reali e verificabili</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SuccessDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Analisi di errori cognitivi comuni</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <SuccessDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Regole di risk management</span>
                  </li>
                </ul>
              </CardContent>
            </UnifiedCard>
            
            <UnifiedCard variant="elevated" className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
              <CardHeader>
                <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                  <ErrorDotIcon className="w-4 h-4" />
                  Non Troverai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ErrorDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Segnali di trading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ErrorDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Consigli di investimento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ErrorDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Previsioni di prezzo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ErrorDotIcon className="shrink-0 mt-1" />
                    <span className="text-sm">Promesse di performance</span>
                  </li>
                </ul>
              </CardContent>
            </UnifiedCard>
          </div>
          
          {/* BLOCCO 5 — REGISTRAZIONE - Verifica Accademica */}
          <UnifiedCard variant="elevated">
            <CardContent className="p-6 text-center space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Accesso al Sistema</h3>
                <p className="text-sm text-muted-foreground">
                  Puoi accedere ai contenuti educativi anche senza registrazione. 
                  La registrazione permette di salvare i progressi di apprendimento.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/microlearning">Accedi senza registrazione</Link>
                </Button>
                {!user && (
                  <Button asChild size="sm">
                    <Link href="/auth/register">Registrati per salvare progressi</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </UnifiedCard>
          
          {/* BLOCCO 6 — CTA UNICA - Verifica Accademica */}
          <div className="text-center space-y-4">
            <Button asChild size="lg" className="px-8 py-4">
              <Link href="/dashboard/microlearning">
                Inizia dai Concetti Fondamentali
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Percorso strutturato • Progressione graduale • Nessuna pressione temporale
            </p>
          </div>
          
          {/* Compliance Accademico - Verifiche complete */}
          <footer className="mt-12 pt-8 border-t border-border space-y-4">
            <div className="text-center">
              <Badge variant="outline" className="mb-4">Sistema Educativo Certificato</Badge>
              <p className="text-xs text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                <strong className="font-medium">Disclaimer Accademico:</strong> Tradelia è un sistema educativo 
                basato su metodologie di behavioral finance e analisi critica dei mercati crypto. 
                Non fornisce consulenza finanziaria personalizzata né raccomandazioni operative. 
                L'obiettivo è sviluppare comprensione, senso critico e capacità di risk assessment.
              </p>
            </div>
            
            <div className="text-center pt-4">
              <Link 
                href="/dashboard/metodo" 
                className="text-xs text-primary hover:text-primary/80 underline-offset-4 hover:underline"
              >
                Leggi Metodologia Completa e Fonti →
              </Link>
            </div>
          </footer>
          
        </div>
      </SectionLayout>
    </div>
    </ErrorBoundary>
  );
}