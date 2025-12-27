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
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold">Tradelia</p>
            <p className="text-xs text-muted-foreground">Educazione al rischio · Metodo, non segnali</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="secondary">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Fonti & Metodo</Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-lg">
                <div className="space-y-6 py-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Principi</p>
                    <div className="space-y-3">
                      {[
                        { title: "Economia Finanziaria", body: "Analisi del rischio e teoria dei portafogli." },
                        { title: "Market Microstructure", body: "Contesto operativo e liquidità degli strumenti." },
                        { title: "Behavioral Finance", body: "Riconoscimento e riduzione dei bias cognitivi." },
                      ].map((p) => (
                        <Card key={p.title}>
                          <CardContent className="p-3">
                            <p className="text-sm font-medium">{p.title}</p>
                            <p className="text-sm text-muted-foreground">{p.body}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Limiti</p>
                    <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                      <li>Nessuna previsione di performance</li>
                      <li>Nessun segnale operativo</li>
                      <li>Nessuna promessa di rendimento</li>
                      <li>Contenuti esclusivamente educativi</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Fonti</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Dimson, Marsh, Staunton - Triumph of the Optimists</p>
                      <p>Markowitz - Portfolio Selection</p>
                      <p>Kahneman - Thinking, Fast and Slow</p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        {/* Hero Section */}
        <Card className="border-primary/30">
          <CardHeader>
            <Badge>HERO</Badge>
            <CardTitle className="text-2xl">Il problema non è la mancanza di dati. È l'interpretazione.</CardTitle>
            <CardDescription className="text-base">
              Tradelia è una piattaforma educativa a rigore accademico: riduce gli errori cognitivi prima di qualsiasi operatività.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="#method">Scopri il metodo</Link>
            </Button>
            <span className="text-xs text-muted-foreground">Educativo · Nessuna consulenza · Nessun segnale</span>
          </CardContent>
        </Card>

        {/* Problem & Risk */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Perché sbagliamo</CardTitle>
              <CardDescription>Errori di interpretazione nei mercati</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc space-y-2 pl-5">
                <li>Applicare regole corrette al contesto sbagliato.</li>
                <li>Confondere strumenti con natura e liquidità diverse.</li>
                <li>Leggere il prezzo senza considerare regime e struttura.</li>
                <li>Usare concetti accademici in modo superficiale.</li>
              </ul>
            </CardContent>
          </Card>
          <Alert variant="destructive">
            <AlertTitle>Rischio cognitivo</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              <p>Errore di interpretazione = errore strutturale.</p>
              <p className="text-foreground">
                Porta a decisioni sistematicamente sbagliate, sottovalutazione del rischio, falsa sicurezza e perdita di capitale nel medio periodo.
              </p>
            </AlertDescription>
          </Alert>
        </div>

        {/* Method Section */}
        <section id="method" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Soluzione: metodo di lettura, non segnali</CardTitle>
              <CardDescription>Ridurre errori cognitivi prima dell'operatività.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 text-sm text-foreground">
                <Badge variant="secondary">Principi</Badge>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  <li>Economia finanziaria e analisi del rischio.</li>
                  <li>Market microstructure per contesto e liquidità.</li>
                  <li>Behavioral finance per ridurre bias decisionali.</li>
                </ul>
              </div>
              <div className="space-y-2 text-sm text-foreground">
                <Badge variant="secondary">Cosa non è</Badge>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                  <li>Nessuna previsione di performance.</li>
                  <li>Nessun segnale automatico.</li>
                  <li>Nessuna promessa di rendimento.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Asset Classes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Asset Classes</h2>
                <p className="text-sm text-muted-foreground">
                  Ogni asset richiede un modello mentale diverso. Seleziona il contesto corretto.
                </p>
              </div>
              <Badge>Router cognitivo</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Crypto", desc: "Custodia + liquidità prima del prezzo", href: "/dashboard/crypto" },
                { name: "FX", desc: "Regime tassi + driver dominanti", href: "/dashboard/fx" },
                { name: "Equity", desc: "Regime + coerenza evidenze", href: "/dashboard/equity" },
                { name: "Commodities", desc: "Ciclicità fisica + vincoli offerta", href: "/dashboard/commodities" },
              ].map((asset) => (
                <Card key={asset.name} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription>{asset.desc}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={asset.href}>Esplora</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Metodo & Solidità</CardTitle>
            <CardDescription>Base accademica esplicita e verificabile.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Badge variant="secondary">Economia Finanziaria</Badge>
              <p className="text-sm text-muted-foreground">Analisi del rischio e teoria dei portafogli.</p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Market Microstructure</Badge>
              <p className="text-sm text-muted-foreground">Contesto operativo e liquidità degli strumenti.</p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary">Behavioral Finance</Badge>
              <p className="text-sm text-muted-foreground">Riconoscimento e riduzione dei bias cognitivi.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Alert>
          <AlertTitle>Avvertenza</AlertTitle>
          <AlertDescription className="text-sm">
            Contenuti esclusivamente educativi: non costituiscono consulenza finanziaria, non sono sollecitazione al pubblico risparmio, non forniscono indicazioni operative.
          </AlertDescription>
        </Alert>
      </main>
    </div>
  );
}
