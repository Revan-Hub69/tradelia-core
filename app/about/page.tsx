import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <AppShell
      title="Metodo & Compliance"
      subtitle="Struttura educativa orientata alla prevenzione degli errori e alla trasparenza dei limiti."
      actions={
        <Button asChild variant="secondary" size="sm">
          <Link href="/">Home</Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Metodo educativo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground">
          <p>Approccio basato su micro-unità focalizzate su un singolo errore da evitare.</p>
          <p>Ogni sezione collega la regola chiave a checklist verificabili e fonti di studio.</p>
          <p>La progressione è pensata per consolidare disciplina, non per generare segnali.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fonti</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-foreground md:grid-cols-2">
          <ul className="list-disc space-y-2 pl-4">
            <li>Letteratura accademica su risk management, microstruttura, behavioral finance.</li>
            <li>Linee guida di vigilanza e codici di condotta (ESMA, BIS, IOSCO).</li>
            <li>Manuali tecnici su metodologia di stress test e gestione della liquidità.</li>
          </ul>
          <ul className="list-disc space-y-2 pl-4">
            <li>Best practice di governance per investitori individuali e team di rischio.</li>
            <li>Strumenti di self-assessment per documentare scelte e criteri di uscita.</li>
            <li>Approcci di apprendimento graduale con esempi sintetici.</li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      <Alert variant="destructive">
        <AlertTitle>Disclaimer</AlertTitle>
        <AlertDescription>
          Tradelia fornisce contenuti educativi. Nessuna sezione costituisce consulenza o raccomandazione di investimento. Le decisioni restano responsabilità esclusiva dell&#39;utente.
        </AlertDescription>
      </Alert>
    </AppShell>
  );
}
