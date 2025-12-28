import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Symptoms() {
  const symptoms = [
    "Vedi indicatori e non sai cosa rappresentano",
    "Senti parlare di fear, hype, trend senza contesto",
    "Hai paura di sbagliare perché ti mancano le basi",
    "Non distingui informazione utile da fuffa"
  ];

  return (
    <section id="symptoms" className="py-20">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ti riconosci?</h2>
        </div>
        
        <div className="space-y-4 mb-8">
          {symptoms.map((symptom, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {i + 1}
              </div>
              <p className="text-base leading-relaxed pt-0.5">{symptom}</p>
            </div>
          ))}
        </div>
        
        <Alert className="border-primary/20 bg-primary/5">
          <AlertDescription className="text-center text-base">
            È normale. Il problema è come vengono spiegate le cose, non la tua intelligenza.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
