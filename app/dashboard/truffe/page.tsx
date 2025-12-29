import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye } from "lucide-react"
import { WarningIcon } from "@/components/icons/warning-icon"
import { BrainIcon } from "@/components/icons/brain-icon"
import Link from "next/link"

export default function TruffePage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-4xl">
            
            {/* Header */}
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
                Libreria Truffe
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Riconoscere prima di cadere
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                Raccolta educativa di schemi ricorrenti, segnali d'allarme ed errori comuni nel mondo crypto.
              </p>
            </header>

            {/* Educational Disclaimer */}
            <div className="mb-12">
              <UnifiedCard className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                      <WarningIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      <strong>Nota educativa:</strong> Gli esempi servono a riconoscere pattern ricorrenti, non a creare allarmismo.
                    </p>
                  </div>
                </CardContent>
              </UnifiedCard>
            </div>

            {/* Schema Categories - Preview */}
            <section className="grid gap-6 mb-12">
              <UnifiedCard className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                          Promesse di Guadagno Garantito
                        </h3>
                        <Badge variant="destructive">Critico</Badge>
                      </div>
                      <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                        <strong>Schema ricorrente:</strong> "Guadagna X% al giorno senza rischi"
                      </p>
                      <div className="space-y-2 text-sm">
                        <p><strong>Perché funziona:</strong> Sfrutta la paura di perdere opportunità</p>
                        <p><strong>Segnale d'allarme:</strong> Percentuali irrealistiche + "senza rischi"</p>
                        <p><strong>Come evitarlo:</strong> Nessun investimento è privo di rischi</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>

              <UnifiedCard className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <Eye className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                          Falsi Influencer e Testimonial
                        </h3>
                        <Badge variant="outline">Comune</Badge>
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                        <strong>Schema ricorrente:</strong> Personaggi che mostrano ricchezza fittizia
                      </p>
                      <div className="space-y-2 text-sm">
                        <p><strong>Perché funziona:</strong> Crea aspirazione e fiducia sociale</p>
                        <p><strong>Segnale d'allarme:</strong> Lifestyle eccessivo + pressione temporale</p>
                        <p><strong>Come evitarlo:</strong> Verificare credenziali e track record reali</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>

              <UnifiedCard className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <BrainIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">
                          Manipolazione Emotiva
                        </h3>
                        <Badge variant="outline">Sottile</Badge>
                      </div>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                        <strong>Schema ricorrente:</strong> "Ultima occasione", "Solo per pochi"
                      </p>
                      <div className="space-y-2 text-sm">
                        <p><strong>Perché funziona:</strong> Sfrutta FOMO e urgenza artificiale</p>
                        <p><strong>Segnale d'allarme:</strong> Pressione temporale + esclusività forzata</p>
                        <p><strong>Come evitarlo:</strong> Prendersi sempre tempo per riflettere</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>

              <UnifiedCard className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <WarningIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                          Piattaforme Non Regolamentate
                        </h3>
                        <Badge variant="outline">Tecnico</Badge>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                        <strong>Schema ricorrente:</strong> Exchange senza licenze o trasparenza
                      </p>
                      <div className="space-y-2 text-sm">
                        <p><strong>Perché funziona:</strong> Offre condizioni apparentemente migliori</p>
                        <p><strong>Segnale d'allarme:</strong> Mancanza di informazioni legali chiare</p>
                        <p><strong>Come evitarlo:</strong> Verificare sempre licenze e regolamentazione</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </UnifiedCard>
            </section>

            {/* Coming Soon */}
            <section className="text-center mb-12">
              <UnifiedCard variant="hero" className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <Badge variant="outline" className="mb-4">In Sviluppo</Badge>
                  <h2 className="text-xl font-semibold mb-4">Libreria in Espansione</h2>
                  <p className="text-muted-foreground mb-6">
                    Stiamo catalogando altri schemi ricorrenti e aggiornando i contenuti 
                    basandoci su nuovi pattern identificati.
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/dashboard/start">
                      Torna al Percorso di Orientamento
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>
            </section>

            {/* Educational Disclaimer */}
            <footer className="mt-16 pt-8 border-t border-border text-center">
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                <strong className="font-medium">Obiettivo educativo:</strong> Sviluppare senso critico 
                e capacità di riconoscimento, non creare paranoia o sfiducia generalizzata.
              </p>
            </footer>
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}