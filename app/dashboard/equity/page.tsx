import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EquityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Equity</h1>
          <p className="text-muted-foreground">Regime + coerenza evidenze</p>
        </div>
        <Badge variant="secondary">Asset Class</Badge>
      </div>

      <Alert>
        <AlertTitle>Nota metodologica</AlertTitle>
        <AlertDescription>
          Non focalizzarsi sul prezzo ignorando regime e struttura. Verifica coerenza minima.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regime di Mercato</CardTitle>
            <CardDescription>Risk-on/off come contesto dominante</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              I prezzi azionari riflettono prima di tutto il regime di rischio globale.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Risk-on: espansione, momentum, crescita</li>
              <li>Risk-off: contrazione, difensivi, qualità</li>
              <li>Transizione: massima volatilità e rischio</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Cognitiva</CardTitle>
            <CardDescription>Coerenza evidenze prima delle conclusioni</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">1</Badge>
                <span className="text-sm">Regime attuale confermato da multiple evidenze?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">2</Badge>
                <span className="text-sm">Fundamentals coerenti con il prezzo?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span className="text-sm">Limiti dei dati disponibili considerati?</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Errori Tipici</CardTitle>
          <CardDescription>Focalizzarsi sul prezzo ignorando regime</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">❌ Errore</p>
            <p className="text-sm text-muted-foreground">Comprare titoli growth in regime risk-off perché "fondamentalmente solidi".</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">✅ Correzione</p>
            <p className="text-sm text-muted-foreground">In risk-off, anche i fondamentali solidi vengono penalizzati dal regime dominante.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard/paths/long-term">Percorso Lungo Termine</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/library">Libreria Indicatori</Link>
        </Button>
      </div>
    </div>
  );
}
