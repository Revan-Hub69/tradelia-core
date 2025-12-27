import Link from "next/link";

import { AppShell } from "@/components/app-shell";
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
import { pathOverviews } from "@/data/paths";

const assetPaths = [
  { label: "Crypto", href: "/paths/short-term" },
  { label: "FX", href: "/paths/intraday" },
  { label: "Equity", href: "/paths/long-term" },
  { label: "Commodities", href: "/paths/mid-term" },
];

export default function HomePage() {
  const totalUnits = pathOverviews.reduce((acc, path) => acc + path.units.length, 0);

  return (
    <AppShell
      title="Landing educativa"
      subtitle="Router cognitivo: esplicita il problema di interpretazione, offre metodo rigoroso, instrada ai percorsi."
      actions={
        <Button asChild variant="secondary" size="sm">
          <Link href="/paths/long-term">Entra nei percorsi</Link>
        </Button>
      }
    >
      {/* 1) HERO — problema + promessa cognitiva */}
      <Card className="border-primary/30">
        <CardHeader>
          <Badge>HERO</Badge>
          <CardTitle>Il problema non è la mancanza di dati. È l’interpretazione.</CardTitle>
          <CardDescription>
            Tradelia è una landing page educativa a rigore accademico: riduce gli errori cognitivi prima di qualsiasi
            operatività.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Obiettivo: instradare verso la sezione corretta con un metodo di lettura, non con segnali o promesse.</p>
          <div className="flex flex-wrap gap-3 text-foreground">
            <Badge variant="secondary">Rigore accademico</Badge>
            <Badge variant="secondary">Nessun segnale</Badge>
            <Badge variant="secondary">Metodo operativo</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 2) PROBLEMA & RISCHIO */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perché sbagliamo</CardTitle>
            <CardDescription>Errori di interpretazione nei mercati</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <ul className="list-disc space-y-2 pl-4">
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
              Porta a decisioni sistematicamente sbagliate, sottovalutazione del rischio, falsa sicurezza e perdita di
              capitale nel medio periodo.
            </p>
          </AlertDescription>
        </Alert>
      </div>

      {/* 3) SOLUZIONE METODOLOGICA */}
      <Card>
        <CardHeader>
          <CardTitle>Soluzione: metodo di lettura, non segnali</CardTitle>
          <CardDescription>Ridurre errori cognitivi prima dell’operatività.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2 text-sm text-foreground">
            <Badge variant="secondary">Principi</Badge>
            <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
              <li>Economia finanziaria e analisi del rischio.</li>
              <li>Market microstructure per contesto e liquidità.</li>
              <li>Behavioral finance per ridurre bias decisionali.</li>
            </ul>
          </div>
          <div className="space-y-2 text-sm text-foreground">
            <Badge variant="secondary">Cosa non è</Badge>
            <ul className="list-disc space-y-2 pl-4 text-muted-foreground">
              <li>Nessuna previsione di performance.</li>
              <li>Nessun segnale automatico.</li>
              <li>Nessuna promessa di rendimento.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 4) SCELTA PERCORSO — asset class come modelli mentali */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Scelta percorso</h2>
            <p className="text-sm text-muted-foreground">
              Asset class = modelli mentali diversi. Seleziona il contesto corretto.
            </p>
          </div>
          <Badge>Router cognitivo</Badge>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {assetPaths.map((asset) => (
            <Card key={asset.label}>
              <CardHeader>
                <CardTitle className="text-base">{asset.label}</CardTitle>
                <CardDescription>Regole specifiche per contesto e struttura.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant="secondary">Percorso</Badge>
                <Button asChild variant="outline" size="sm">
                  <Link href={asset.href}>Apri</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 5) MICRO-STEP DINAMICO */}
      <Card>
        <CardHeader>
          <CardTitle>Micro-learning operativo</CardTitle>
          <CardDescription>Sequenza breve, verificabile, applicata.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="space-y-2">
            <Badge variant="secondary">Stato 0 → 1</Badge>
            <p className="text-sm text-foreground">Identifica orizzonte e contesto di rischio.</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Stato 1 → 2</Badge>
            <p className="text-sm text-foreground">Applica unità con regola chiave e checklist.</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Stato 2 → 3</Badge>
            <p className="text-sm text-foreground">Verifica fonti, documenta decisioni, rientra nel percorso.</p>
          </div>
        </CardContent>
      </Card>

      {/* 6) METODO & SOLIDITÀ */}
      <Card>
        <CardHeader>
          <CardTitle>Metodo & solidità</CardTitle>
          <CardDescription>Base accademica esplicita e verificabile.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="text-foreground">Approccio basato su:</p>
            <ul className="list-disc space-y-2 pl-4">
              <li>Economia finanziaria e analisi del rischio.</li>
              <li>Market microstructure e struttura di mercato.</li>
              <li>Behavioral finance per riconoscere bias.</li>
            </ul>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="text-foreground">Uso di:</p>
            <ul className="list-disc space-y-2 pl-4">
              <li>Dati di mercato verificabili.</li>
              <li>Fonti istituzionali e letteratura accademica.</li>
              <li>Trasparenza metodologica, nessun modello opaco.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 7) NOTE METODOLOGICHE & LIMITI */}
      <Card>
        <CardHeader>
          <CardTitle>Note metodologiche & limiti</CardTitle>
          <CardDescription>Chiarezza su cosa aspettarsi.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>Il progetto è educativo: non sostituisce consulenza, non elimina il rischio, non garantisce risultati.</p>
          <p>Il metodo migliora la qualità delle decisioni; l’esito dipende dal contesto e dalla disciplina dell’utente.</p>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Trasparenza fonti</Badge>
            <Badge variant="secondary">Nessun segnale</Badge>
            <Badge variant="secondary">Documentazione decisionale</Badge>
          </div>
        </CardContent>
      </Card>

      {/* 8) FOOTER COMPLIANCE */}
      <Alert>
        <AlertTitle>Compliance</AlertTitle>
        <AlertDescription className="text-sm">
          Contenuti a scopo educativo: non costituiscono consulenza finanziaria, non sono sollecitazione al pubblico
          risparmio, non forniscono indicazioni operative.
        </AlertDescription>
      </Alert>
    </AppShell>
  );
}
