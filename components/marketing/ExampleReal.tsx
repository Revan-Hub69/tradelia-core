import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckIcon } from "@/components/icons/check-icon";
import { CrossIcon } from "@/components/icons/cross-icon";
import { WarningIcon } from "@/components/icons/warning-icon";

export default function ExampleReal() {
  return (
    <section id="example" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Esempio reale dal mercato crypto</h2>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card Dati */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fear & Greed Index — Crypto</CardTitle>
                <Badge variant="secondary">Live</Badge>
              </div>
              <CardDescription>Indicatore del sentiment di mercato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-primary mb-2">
                  [VALUE_PLACEHOLDER]
                </div>
                <div className="text-xl text-muted-foreground">
                  [CLASS_PLACEHOLDER]
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  Aggiornato: [DATE_PLACEHOLDER]
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Fonte: [SOURCE_PLACEHOLDER]
                </div>
              </div>
              
              {/* Chart Placeholder */}
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <div className="text-muted-foreground mb-2">[CHART_PLACEHOLDER]</div>
                <p className="text-xs text-muted-foreground">
                  Esempio illustrativo basato su dati reali (quando integrati)
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Spiegazione */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cosa indica (in breve)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Il Fear & Greed Index prova a riassumere lo stato emotivo del mercato crypto su una scala 0–100.
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li><strong>Valori bassi</strong> → paura diffusa</li>
                  <li><strong>Valori alti</strong> → avidità e pressione emotiva</li>
                </ul>
                <p className="mt-4 text-sm flex items-center gap-2">
                  <WarningIcon className="h-5 w-5 shrink-0" />
                  <span><strong>Non è un segnale operativo.</strong> Serve solo come contesto, non come decisione.</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Come usarlo correttamente</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Per capire il clima emotivo del mercato
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Insieme a notizie, volatilità, liquidità
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">
                      Come supporto al ragionamento, non come scorciatoia
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400">Limiti (antifuffa)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CrossIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm">Non predice il futuro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Non dice cosa comprare
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm">
                      Non dice quando entrare o uscire
                    </span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground italic">
                  Se qualcuno lo usa così, sta semplificando troppo.
                </p>
              </CardContent>
            </Card>
            
            {/* AI Reading Placeholder */}
            <Alert>
              <AlertTitle>Lettura guidata (AI educativa)</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="bg-muted/50 rounded p-4 mb-3">
                  <p className="text-sm text-muted-foreground italic">
                    [AI_DYNAMIC_PLACEHOLDER]
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Qui comparirà una lettura descrittiva aggiornata, basata sul valore corrente dell'indice.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" /> Nessuna previsione
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" /> Nessuna raccomandazione
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" /> Solo spiegazione contestuale
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  );
}
