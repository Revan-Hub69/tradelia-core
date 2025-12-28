import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WhyWeFailProps {
  className?: string;
}

export default function WhyWeFail({ className }: WhyWeFailProps) {
  const errors = [
    "Hai sentito parlare di Bitcoin ma non sai se è il momento giusto",
    "Hai comprato crypto seguendo l'hype e hai perso soldi", 
    "Non capisci la differenza tra exchange, wallet e custodia",
    "Vedi tutti che guadagnano e hai paura di restare indietro"
  ];

  return (
    <section className={`py-32 bg-muted/20 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-sm">Il Problema</Badge>
              <h2 className="text-4xl font-bold tracking-tight">Ti riconosci?</h2>
              <p className="text-lg text-muted-foreground">Gli errori più comuni con le crypto (e gli investimenti)</p>
            </div>
            
            <div className="space-y-6">
              {errors.map((item, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm font-medium text-destructive group-hover:bg-destructive/20 transition-colors">
                    {i + 1}
                  </div>
                  <p className="text-base leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center">
            <Alert className="border-destructive/50 bg-destructive/5 shadow-lg">
              <AlertTitle className="text-destructive text-xl">Il vero problema</AlertTitle>
              <AlertDescription className="text-base leading-relaxed mt-3">
                Tutti parlano di crypto, ma nessuno ti spiega davvero come funzionano. 
                Compri sull'onda dell'entusiasmo, senza capire cosa stai facendo. E poi perdi soldi.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  );
}