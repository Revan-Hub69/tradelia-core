import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckSquare, Info, TrendingUp } from "lucide-react"
import { BrainIcon } from "@/components/icons/brain-icon"
import { EconomicsIcon } from "@/components/icons/economics-icon"
import { WarningIcon } from "@/components/icons/warning-icon"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <SectionLayout className="py-20">
          <div className="mx-auto max-w-6xl">
            
            {/* Header */}
            <header className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary mb-6">
                <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true"></div>
                Dashboard Tradelia
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Educazione Crypto
                <span className="block text-primary">Antifuffa</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4">
                "Tradelia non dice cosa fare. Dice cosa stai guardando."
              </p>
            </header>

            {/* Main Sections Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              
              {/* Start - Orientamento */}
              <UnifiedCard className="border-primary/20 bg-primary/5 hover:border-primary/30 transition-all duration-200 hover:shadow-lg group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">Nuovo</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Start · Orientamento</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Capire da dove iniziare, senza decidere nulla. Percorso di orientamento in 3 step.
                  </p>
                  <Button asChild size="sm" className="w-full">
                    <Link href="/dashboard/start">
                      Inizia Qui
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>

              {/* Microlearning */}
              <UnifiedCard className="hover:border-primary/30 transition-all duration-200 hover:shadow-lg group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <BrainIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs">Brevi</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Microlearning</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Capire prima di credere. Brevi lezioni educative senza promesse o segnali.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/microlearning">
                      Esplora Lezioni
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>

              {/* Misuratori di Contesto */}
              <UnifiedCard className="hover:border-primary/30 transition-all duration-200 hover:shadow-lg group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <EconomicsIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Live</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Misuratori di Contesto</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Numeri per orientarsi, non per decidere. Include Fear & Greed Index con AI.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/misuratori">
                      Vedi Indicatori
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>

              {/* Libreria Truffe */}
              <UnifiedCard className="hover:border-primary/30 transition-all duration-200 hover:shadow-lg group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <WarningIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Importante</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Libreria Truffe</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Riconoscere prima di cadere. Schemi ricorrenti e segnali d'allarme.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/truffe">
                      Studia Pattern
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>

              {/* Check Piattaforme */}
              <UnifiedCard className="opacity-75 hover:opacity-100 transition-opacity duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-muted">
                      <CheckSquare className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <Badge variant="outline" className="text-xs">Fase 2</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Check Piattaforme</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Checklist per valutare piattaforme crypto. Disponibile prossimamente.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full" disabled>
                    <Link href="/dashboard/check-piattaforme">
                      Prossimamente
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>

              {/* Metodo & Fonti */}
              <UnifiedCard className="hover:border-primary/30 transition-all duration-200 hover:shadow-lg group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                      <Info className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Fondamentale</Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Metodo & Fonti</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Come funziona Tradelia, trasparenza completa su metodologia e limitazioni.
                  </p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/metodo">
                      Leggi Tutto
                    </Link>
                  </Button>
                </CardContent>
              </UnifiedCard>

            </section>

            {/* Quick Access to Fear & Greed */}
            <section className="mb-16">
              <UnifiedCard variant="hero" className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Live</Badge>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Fear & Greed Index</h3>
                      <p className="text-sm text-muted-foreground">
                        Sentiment di mercato con analisi AI educativa. Aggiornato in tempo reale.
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/misuratori">
                        Vedi Ora
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </UnifiedCard>
            </section>

            {/* Educational Reminder */}
            <section className="text-center">
              <UnifiedCard className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 max-w-3xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="font-semibold mb-4 text-blue-900 dark:text-blue-100">
                    Ricorda: Tradelia è educativo
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    Non fornisce consulenza finanziaria né raccomandazioni operative. 
                    L'obiettivo è sviluppare comprensione e senso critico per navigare 
                    il mondo crypto con maggiore consapevolezza.
                  </p>
                </CardContent>
              </UnifiedCard>
            </section>
            
          </div>
        </SectionLayout>
      </div>
    </ErrorBoundary>
  )
}