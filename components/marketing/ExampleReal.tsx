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
          <h2 className="text-3xl font-bold mb-4">Esempio: Fear & Greed Index</h2>
          <p className="text-secondary max-w-2xl mx-auto">
            Un indicatore spiegato come si deve: dalle basi accademiche alla lettura pratica.
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Card Dati Live */}
          <Card className="card-elevated hover-lift">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Fear & Greed Index — Crypto</CardTitle>
                <Badge variant="secondary">Live</Badge>
              </div>
              <CardDescription>Indicatore del sentiment di mercato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="text-6xl font-bold text-primary mb-2 animate-bounce-subtle">
                  [VALUE_PLACEHOLDER]
                </div>
                <div className="text-xl text-secondary">
                  [CLASS_PLACEHOLDER]
                </div>
                <div className="text-sm text-tertiary mt-4">
                  Aggiornato: [DATE_PLACEHOLDER]
                </div>
                <div className="text-xs text-tertiary mt-1">
                  Fonte: [SOURCE_PLACEHOLDER]
                </div>
              </div>
              
              {/* Chart Placeholder */}
              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <div className="text-secondary mb-2">[CHART_PLACEHOLDER]</div>
                <p className="text-xs text-tertiary">
                  Grafico storico (quando integrato con API)
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Spiegazione Progressiva */}
          <div className="space-y-6">
            {/* 1. Origine Accademica */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">1. Da dove nasce</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary leading-relaxed text-sm">
                  L'idea di misurare il sentiment di mercato viene dalla <strong>finanza comportamentale</strong> (Kahneman, Tversky). 
                  Gli investitori non sono sempre razionali: paura e avidità influenzano le decisioni.
                </p>
                <p className="text-secondary leading-relaxed text-sm mt-3">
                  Il Fear & Greed Index è un tentativo di <strong>quantificare queste emozioni collettive</strong> in un numero.
                </p>
              </CardContent>
            </Card>
            
            {/* 2. Cosa Misura */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">2. Cosa misura</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary leading-relaxed text-sm">
                  Misura il <strong>sentiment emotivo dominante</strong> nel mercato crypto, su una scala 0–100:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-secondary">
                  <li><strong>0–24:</strong> Paura estrema</li>
                  <li><strong>25–49:</strong> Paura</li>
                  <li><strong>50–74:</strong> Avidità</li>
                  <li><strong>75–100:</strong> Avidità estrema</li>
                </ul>
              </CardContent>
            </Card>
            
            {/* 3. Come lo Misura */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">3. Come lo misura</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-secondary leading-relaxed text-sm">
                  Combina diversi fattori di mercato, ognuno con un peso specifico:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-secondary">
                  <li>• <strong>Volatilità</strong> (25%)</li>
                  <li>• <strong>Volume di trading</strong> (25%)</li>
                  <li>• <strong>Social media sentiment</strong> (15%)</li>
                  <li>• <strong>Dominance di Bitcoin</strong> (10%)</li>
                  <li>• <strong>Google Trends</strong> (10%)</li>
                  <li>• Altri fattori (15%)</li>
                </ul>
                <p className="text-tertiary text-xs mt-3 italic">
                  Nota: i pesi possono variare tra diverse implementazioni dell'indice.
                </p>
              </CardContent>
            </Card>
            
            {/* 4. Spiegazione Tradelia AI */}
            <Alert>
              <AlertTitle>4. Spiegazione Tradelia AI</AlertTitle>
              <div className="mt-2 text-sm leading-relaxed">
                <div className="bg-muted/50 rounded p-4 mb-3">
                  <p className="text-sm text-secondary italic">
                    [AI_DYNAMIC_PLACEHOLDER]
                  </p>
                  <p className="text-sm text-secondary mt-2">
                    Qui comparirà una lettura contestuale basata sul valore corrente: cosa significa oggi, quali fattori stanno influenzando il mercato, e come interpretarlo senza cadere in semplificazioni.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-tertiary flex-wrap">
                  <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" /> Nessuna previsione
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" /> Nessuna raccomandazione
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckIcon className="h-4 w-4" /> Solo contesto educativo
                  </span>
                </div>
              </div>
            </Alert>
            
            {/* Limiti */}
            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardHeader>
                <CardTitle className="text-amber-700 dark:text-amber-400 text-lg">Limiti da conoscere</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CrossIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm">Non predice movimenti futuri</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm">Non dice cosa comprare o vendere</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CrossIcon className="shrink-0 mt-0.5" />
                    <span className="text-sm">È un indicatore ritardato (lagging), non anticipatore</span>
                  </li>
                </ul>
                <p className="mt-4 text-sm text-secondary">
                  Va usato come <strong>contesto</strong>, mai come segnale operativo isolato.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
