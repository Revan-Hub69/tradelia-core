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
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">T</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Tradelia</p>
              <p className="text-xs text-muted-foreground">Educazione al rischio</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">Metodo</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Principi Metodologici</h3>
                    <div className="mt-4 space-y-4">
                      {[
                        { title: "Economia Finanziaria", desc: "Analisi del rischio e teoria dei portafogli" },
                        { title: "Market Microstructure", desc: "Contesto operativo e liquidità" },
                        { title: "Behavioral Finance", desc: "Riduzione dei bias cognitivi" },
                      ].map((item) => (
                        <div key={item.title} className="rounded-lg border bg-card p-4">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Limiti</h3>
                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                      <li>• Nessuna previsione di performance</li>
                      <li>• Nessun segnale operativo</li>
                      <li>• Nessuna promessa di rendimento</li>
                      <li>• Contenuti esclusivamente educativi</li>
                    </ul>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero Section with Gradient */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-background to-secondary/5 py-24">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-xs">Metodo • Rigore • Trasparenza</Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  Il problema non è la mancanza di dati.
                  <span className="block text-primary">È l'interpretazione.</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                  Tradelia è una piattaforma educativa a rigore accademico che riduce gli errori cognitivi prima di qualsiasi operatività nei mercati finanziari.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button asChild size="lg" className="px-8">
                  <Link href="#assets">Esplora Asset Classes</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">Accedi Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">Perché sbagliamo</h2>
                  <p className="text-muted-foreground">Errori sistematici di interpretazione nei mercati</p>
                </div>
                <div className="space-y-4">
                  {[
                    "Applicare regole corrette al contesto sbagliato",
                    "Confondere strumenti con natura e liquidità diverse",
                    "Leggere il prezzo senza regime e struttura",
                    "Usare concetti accademici superficialmente",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-xs font-medium text-destructive">
                        {i + 1}
                      </div>
                      <p className="text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Alert className="border-destructive/50 bg-destructive/5">
                <AlertTitle className="text-destructive">Rischio cognitivo strutturale</AlertTitle>
                <AlertDescription className="text-sm">
                  L'errore di interpretazione porta a decisioni sistematicamente sbagliate,
                  sottovalutazione del rischio, falsa sicurezza e perdita di capitale nel medio periodo.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </section>

        {/* Asset Classes */}
        <section id="assets" className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold">Asset Classes</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ogni asset richiede un modello mentale diverso. Seleziona il contesto corretto per il tuo percorso educativo.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  name: "Crypto",
                  desc: "Custodia e liquidità prima del prezzo",
                  color: "from-orange-500/20 to-red-500/20",
                  href: "/dashboard/crypto"
                },
                {
                  name: "FX",
                  desc: "Regime tassi e driver dominanti",
                  color: "from-blue-500/20 to-cyan-500/20",
                  href: "/dashboard/fx"
                },
                {
                  name: "Equity",
                  desc: "Regime di mercato e coerenza evidenze",
                  color: "from-green-500/20 to-emerald-500/20",
                  href: "/dashboard/equity"
                },
                {
                  name: "Commodities",
                  desc: "Ciclicità fisica e vincoli offerta",
                  color: "from-amber-500/20 to-yellow-500/20",
                  href: "/dashboard/commodities"
                },
              ].map((asset) => (
                <Card key={asset.name} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`absolute inset-0 bg-gradient-to-br ${asset.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <CardHeader className="relative">
                    <CardTitle className="text-xl">{asset.name}</CardTitle>
                    <CardDescription className="text-sm">{asset.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <Button asChild className="w-full group-hover:bg-primary/90">
                      <Link href={asset.href}>Esplora</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Method */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl font-bold">Metodo & Solidità</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Approccio basato su discipline accademiche consolidate e verificabili
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Economia Finanziaria",
                  desc: "Teoria dei portafogli e analisi del rischio",
                  icon: "📊"
                },
                {
                  title: "Market Microstructure",
                  desc: "Contesto operativo e liquidità degli strumenti",
                  icon: "🔬"
                },
                {
                  title: "Behavioral Finance",
                  desc: "Riconoscimento e riduzione dei bias cognitivi",
                  icon: "🧠"
                },
              ].map((item) => (
                <div key={item.title} className="text-center space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Pronto a iniziare il tuo percorso educativo?</h2>
                <p className="text-muted-foreground mb-6">
                  Accedi alla dashboard per esplorare contenuti interattivi, checklist cognitive e percorsi di apprendimento strutturati.
                </p>
                <Button asChild size="lg">
                  <Link href="/dashboard">Accedi Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t bg-muted/50 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                <strong>Avvertenza:</strong> Contenuti esclusivamente educativi. Non costituiscono consulenza finanziaria,
                non sono sollecitazione al pubblico risparmio, non forniscono indicazioni operative.
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <span>Tradelia</span>
                <span>•</span>
                <span>Metodo, non segnali</span>
                <span>•</span>
                <span>Rigore accademico</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
