import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CryptoPage() {
  return (
    <div className="space-y-6">

      <Alert>
        <AlertTitle>Nota metodologica</AlertTitle>
        <AlertDescription>
          Nessun segnale operativo. L'obiettivo è ridurre errori di interpretazione prima di qualsiasi decisione.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rischio Dominante</CardTitle>
            <CardDescription>Custodia + liquidità prima del prezzo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              La natura digitale delle crypto introduce rischi irreversibili di perdita totale del capitale.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Custodia: chi controlla le chiavi private?</li>
              <li>Liquidità: spread e volumi sufficienti?</li>
              <li>Trasparenza: codice verificabile e auditato?</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Cognitiva</CardTitle>
            <CardDescription>Verifica prima di qualsiasi esposizione</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">1</Badge>
                <span className="text-sm">Venue regolamentata o almeno affidabile?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">2</Badge>
                <span className="text-sm">Custodia non-custodiale verificata?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span className="text-sm">Volume giornaliero superiore al sizing personale?</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Errori Tipici</CardTitle>
          <CardDescription>Confondere trasparenza tecnica con prevedibilità</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">❌ Errore</p>
            <p className="text-sm text-muted-foreground">Trattare BTC come strumento finanziario tradizionale senza considerare la custodia.</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">✅ Correzione</p>
            <p className="text-sm text-muted-foreground">BTC è prima di tutto un protocollo di trasferimento valore con rischi di perdita irreversibile.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard/paths/short-term">Percorso Breve Termine</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/library">Libreria Indicatori</Link>
        </Button>
      </div>
    </div>
  );
}