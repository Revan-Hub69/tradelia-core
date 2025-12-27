import Link from "next/link";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EconomicsIcon } from "@/components/icons/economics-icon";
import { MicrostructureIcon } from "@/components/icons/microstructure-icon";
import { BrainIcon } from "@/components/icons/brain-icon";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="relative">
        {/* Hero Section with Enhanced Design */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-secondary/10 py-32">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary/5)_0%,transparent_50%)]" />
          
          <div className="mx-auto max-w-7xl px-6 relative">
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <Badge variant="premium" className="text-sm px-4 py-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Metodo • Rigore • Trasparenza
                  </span>
                </Badge>
                
                <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
                  <span className="block bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
                    Il problema
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                    non è la mancanza di dati.
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4">
                    È l'interpretazione.
                  </span>
                </h1>
                
                <p className="mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
                  Tradelia è una piattaforma educativa a rigore accademico che riduce gli errori cognitivi 
                  prima di qualsiasi operatività nei mercati finanziari. Metodo, non segnali.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="xl" variant="premium" className="px-12 py-4 text-base">
                  <Link href="#assets">
                    Esplora Asset Classes
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="px-12 py-4 text-base">
                  <Link href="/dashboard">
                    Accedi Dashboard
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </Link>
                </Button>
              </div>

              {/* Stats Row */}
              <div className="flex justify-center items-center gap-8 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">4</div>
                  <div className="text-sm text-muted-foreground">Asset Classes</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">3</div>
                  <div className="text-sm text-muted-foreground">Discipline</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Educativo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="py-32 bg-muted/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-16 lg:grid-cols-2">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-sm">Analisi del Problema</Badge>
                  <h2 className="text-4xl font-bold tracking-tight">Perché sbagliamo</h2>
                  <p className="text-lg text-muted-foreground">Errori sistematici di interpretazione nei mercati</p>
                </div>
                
                <div className="space-y-6">
                  {[
                    "Applicare regole corrette al contesto sbagliato",
                    "Confondere strumenti con natura e liquidità diverse", 
                    "Leggere il prezzo senza regime e struttura",
                    "Usare concetti accademici superficialmente"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm font-medium text-destructive group-hover:bg-destructive/20 transition-colors">
                        {i + 1}
                      </div>
                      <p className="text-base leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <Alert className="border-destructive/50 bg-destructive/5 shadow-lg">
                  <AlertTitle className="text-destructive text-xl">Rischio cognitivo strutturale</AlertTitle>
                  <AlertDescription className="text-base leading-relaxed mt-3">
                    L'errore di interpretazione porta a decisioni sistematicamente sbagliate,
                    sottovalutazione del rischio, falsa sicurezza e perdita di capitale nel medio periodo.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </section>

        {/* Asset Classes */}
        <section id="assets" className="py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-6 mb-20">
              <Badge variant="secondary" className="text-sm">Asset Classes</Badge>
              <h2 className="text-4xl font-bold tracking-tight">Ogni asset richiede un modello mentale diverso</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Seleziona il contesto corretto per il tuo percorso educativo. Ogni mercato ha le sue regole, 
                la sua liquidità e i suoi driver fondamentali.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Crypto",
                  desc: "Custodia e liquidità prima del prezzo",
                  color: "from-orange-500/20 to-red-500/20",
                  href: "/dashboard/crypto",
                  badge: "Nuovo",
                  features: ["Custodia", "Liquidità", "Regulatory"]
                },
                {
                  name: "FX", 
                  desc: "Regime tassi e driver dominanti",
                  color: "from-blue-500/20 to-cyan-500/20",
                  href: "/dashboard/fx",
                  badge: null,
                  features: ["Tassi", "Macro", "Correlazioni"]
                },
                {
                  name: "Equity",
                  desc: "Regime di mercato e coerenza evidenze", 
                  color: "from-green-500/20 to-emerald-500/20",
                  href: "/dashboard/equity",
                  badge: null,
                  features: ["Regimi", "Valutazione", "Ciclicità"]
                },
                {
                  name: "Commodities",
                  desc: "Ciclicità fisica e vincoli offerta",
                  color: "from-amber-500/20 to-yellow-500/20", 
                  href: "/dashboard/commodities",
                  badge: null,
                  features: ["Supply/Demand", "Stagionalità", "Geopolitica"]
                }
              ].map((asset) => (
                <Card key={asset.name} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50">
                  <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <CardHeader className="relative">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold">{asset.name}</CardTitle>
                      {asset.badge && (
                        <Badge variant="premium" className="text-xs">
                          {asset.badge}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-base">{asset.desc}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="relative space-y-4">
                    <div className="space-y-2">
                      {asset.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                      <Link href={asset.href}>
                        Esplora Dashboard
                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Method */}
        <section className="py-32 bg-muted/20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-6 mb-20">
              <Badge variant="outline" className="text-sm">Metodologia</Badge>
              <h2 className="text-4xl font-bold tracking-tight">Solidità Accademica</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Approccio basato su discipline accademiche consolidate e verificabili.
                Nessuna promessa, solo metodo.
              </p>
            </div>
            
            <div className="grid gap-12 md:grid-cols-3">
              {[
                {
                  title: "Economia Finanziaria",
                  desc: "Teoria dei portafogli, analisi del rischio e pricing dei titoli",
                  icon: EconomicsIcon,
                  color: "from-blue-500/10 to-blue-500/5"
                },
                {
                  title: "Market Microstructure", 
                  desc: "Contesto operativo, liquidità e meccanismi di formazione dei prezzi",
                  icon: MicrostructureIcon,
                  color: "from-purple-500/10 to-purple-500/5"
                },
                {
                  title: "Behavioral Finance",
                  desc: "Riconoscimento e riduzione sistematica dei bias cognitivi",
                  icon: BrainIcon,
                  color: "from-green-500/10 to-green-500/5"
                }
              ].map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.title} className="text-center space-y-6 group">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300">
                      <IconComponent className="h-10 w-10 text-primary" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                    
                    <div className={`h-1 w-12 mx-auto rounded-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="mx-auto max-w-5xl px-6">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5 shadow-2xl">
              <CardContent className="p-12 text-center space-y-8">
                <div className="space-y-4">
                  <Badge variant="premium" className="text-sm">Inizia il Percorso</Badge>
                  <h2 className="text-4xl font-bold">Pronto a iniziare il tuo percorso educativo?</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Accedi alla dashboard per esplorare contenuti interattivi, checklist cognitive 
                    e percorsi di apprendimento strutturati. Metodo, non segnali.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="xl" variant="premium" className="px-10">
                    <Link href="/dashboard">
                      Accedi Dashboard
                      <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl" className="px-10">
                    <Link href="/about">
                      Scopri il Metodo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <p className="text-base text-muted-foreground">
                  <strong className="text-foreground">Avvertenza:</strong> Contenuti esclusivamente educativi. 
                  Non costituiscono consulenza finanziaria, non sono sollecitazione al pubblico risparmio, 
                  non forniscono indicazioni operative.
                </p>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <span className="font-medium">Tradelia</span>
                <span>•</span>
                <span>Metodo, non segnali</span>
                <span>•</span>
                <span>Rigore accademico</span>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  © 2025 Tradelia. Piattaforma educativa per la gestione consapevole del rischio.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
