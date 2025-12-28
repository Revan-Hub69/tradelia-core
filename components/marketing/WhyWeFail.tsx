import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WhyWeFailProps {
  className?: string;
}

export default function WhyWeFail({ className }: WhyWeFailProps) {
  const errors = [
    "Non sai da dove iniziare e hai paura di sbagliare tutto",
    "Segui segnali e strategie che non capisci davvero", 
    "Usi indicatori a caso senza sapere quando funzionano",
    "Perdi soldi e non capisci perché continui a sbagliare"
  ];

  return (
    <section className={`py-32 bg-muted/20 ${className || ""}`}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="outline" className="text-sm">Il Problema</Badge>
              <h2 className="text-4xl font-bold tracking-tight">Ti riconosci in uno di questi?</h2>
              <p className="text-lg text-muted-foreground">Gli errori più comuni di chi inizia o continua a sbagliare</p>
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
                Non ti mancano i dati o i segnali. Ti mancano le basi per capire cosa stai facendo.
                Senza fondamenta solide, ogni strategia è solo fortuna. E la fortuna finisce sempre.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </section>
  );
}