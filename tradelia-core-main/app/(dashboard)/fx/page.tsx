import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function FXPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">FX</h1>
          <p className="text-muted-foreground">Regime tassi + driver dominanti</p>
        </div>
        <Badge variant="secondary">Asset Class</Badge>
      </div>

      <Alert>
        <AlertTitle>Nota metodologica</AlertTitle>
        <AlertDescription>
          Non leggere il cambio senza contesto macro-monetary. Identifica driver dominanti.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Driver Dominanti</CardTitle>
            <CardDescription>Tassi, rischio, commodity linkage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Le coppie valutarie riflettono disequilibri macroeconomici, non pattern tecnici isolati.
            </p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Tassi: differenziali reali e aspettative policy</li>
              <li>Rischio: carry trade e flight-to-quality</li>
              <li>Commodity: correlazioni con materie prime</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist Cognitiva</CardTitle>
            <CardDescription>Contesto prima del pattern</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">1</Badge>
                <span className="text-sm">Quale driver domina attualmente?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">2</Badge>
                <span className="text-sm">Regime tassi stabile o in cambiamento?</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span className="text-sm">Liquidity sufficiente per il sizing?</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Errori Tipici</CardTitle>
          <CardDescription>Leggere il cambio senza contesto macro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">❌ Errore</p>
            <p className="text-sm text-muted-foreground">Applicare regole equity ai cambi senza considerare il contesto monetario.</p>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium text-sm">✅ Correzione</p>
            <p className="text-sm text-muted-foreground">I cambi sono riflesso di squilibri globali, non di momentum isolato.</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link href="/dashboard/paths/intraday">Percorso Intraday</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/library">Libreria Indicatori</Link>
        </Button>
      </div>
    </div>
  );
}