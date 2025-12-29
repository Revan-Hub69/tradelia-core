import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeroProblemProps {
  className?: string;
}

export default function HeroProblem({ className }: HeroProblemProps) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-secondary/10 py-32 ${className || ""}`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.primary/5)_0%,transparent_50%)]" />
      
      <div className="mx-auto max-w-7xl px-6 relative">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <Badge variant="premium" className="text-sm px-4 py-1.5">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                Metodo • Crypto • Investimenti
              </span>
            </Badge>
            
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
              <span className="block bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
                Vuoi investire in crypto
              </span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                ma hai paura di sbagliare?
              </span>
              <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4">
                O hai già perso soldi?
              </span>
            </h1>
            
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground leading-relaxed">
              Tradelia ti insegna le vere basi delle crypto (e degli altri mercati) con lezioni da 5 minuti 
              e un'AI che ti guida. Capisci cosa stai facendo prima di rischiare i tuoi soldi.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="xl" variant="premium" className="px-12 py-4 text-base">
              <Link href="/dashboard">
                Inizia Gratis
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="px-12 py-4 text-base">
              <Link href="#come-funziona">
                Come Funziona
                <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </Button>
          </div>

          {/* Stats Row */}
          <div className="flex justify-center items-center gap-8 pt-8 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">5 min</div>
              <div className="text-sm text-muted-foreground">Lezioni brevi</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">AI</div>
              <div className="text-sm text-muted-foreground">Assistente personale</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">0€</div>
              <div className="text-sm text-muted-foreground">Per iniziare</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}