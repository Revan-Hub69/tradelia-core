import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="mx-auto max-w-4xl px-6 relative text-center">
        <div className="space-y-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Vedi grafici e "consigli" crypto online ma non capisci cosa significano davvero?
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Tradelia è un progetto antifuffa: micro-lezioni brevi + spiegazioni guidate per capire cosa stai guardando. 
            Senza promesse, senza segnali.
          </p>
          
          <div className="flex justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/dashboard">
                Inizia
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
            <Badge variant="outline">Educativo</Badge>
            <span>•</span>
            <Badge variant="outline">Trasparente</Badge>
            <span>•</span>
            <Badge variant="outline">Nessuna raccomandazione operativa</Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
