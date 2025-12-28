import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CommoditiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Commodities</h1>
          <p className="text-muted-foreground">Ciclicità fisica + vincoli offerta</p>
        </div>
        <Badge variant="secondary">Asset Class</Badge>
      </div>

      <Alert>
        <AlertTitle>Nota metodologica</AlertTitle>
        <AlertDescription>
          Non trattarle come asset puramente finanziari. Ciclicità fisica, shock e vincoli d'offerta dominano.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vincoli Fisici</CardTitle>
            <CardDescription>Domanda/offerta + geopolitica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Le commodities sono beni fisici con vincoli di produzione e geopolitica.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Domanda/offerta: crescita economica vs capacità produttiva</li>
              <li>Geopolitica: concentrazione produzione e instabilità</li>
              <li>Stagionalità: cicli produttivi e climatici</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Cognitiva</CardTitle>
            <CardDescription>Cosa domina attualmente?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">1</Badge>
                <span className="text-sm">Domanda/offerta sta guidando i prezzi?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">2</Badge>
                <span className="text-sm">Geopolitica o stagionalità è rilevante?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span className="text-sm">Liquidity sufficiente per posizione?</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Errori Tipici</CardTitle>
          <CardDescription>Trattarle come asset puramente finanziari</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">❌ Errore</p>
            <p className="text-sm text-muted-foreground">Applicare modelli finanziari a commodities senza considerare i vincoli fisici.</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">✅ Correzione</p>
            <p className="text-sm text-muted-foreground">Le commodities seguono logiche fisiche prima che finanziarie.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard/paths/mid-term">Percorso Medio Termine</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/library">Libreria Indicatori</Link>
        </Button>
      </div>
    </div>
  );
}