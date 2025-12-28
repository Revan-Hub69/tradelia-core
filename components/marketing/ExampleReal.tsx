import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
                  Valori bassi indicano paura diffusa; valori alti indicano avidità e pressione a comprare. 
                  Non è un segnale operativo: serve come contesto.
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
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">
                      Usalo per capire il clima emotivo, non per "prevedere" il prezzo
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">
                      Leggilo insieme al contesto (notizie, volatilità, liquidità)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-sm text-muted-foreground">
                      Evita scorciatoie: un indice non sostituisce il ragionamento
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Limiti (antifuffa)</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="text-destructive mt-1">✗</span>
                    <span className="text-sm text-muted-foreground">Non predice il futuro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-destructive mt-1">✗</span>
                    <span className="text-sm text-muted-foreground">
                      Non dice cosa comprare o quando entrare
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* AI Reading Placeholder */}
            <Alert>
              <AlertTitle>Lettura guidata (AI)</AlertTitle>
              <AlertDescription className="mt-2">
                <div className="bg-muted/50 rounded p-4 mb-3">
                  <p className="text-sm text-muted-foreground italic">
                    [AI_DYNAMIC_PLACEHOLDER]
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Qui comparirà una lettura aggiornata basata sul valore corrente dell'indice. 
                    Sarà descrittiva e non operativa.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Nessuna previsione. Nessuna raccomandazione.
                </p>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  );
}
