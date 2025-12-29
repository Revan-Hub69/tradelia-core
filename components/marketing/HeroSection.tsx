import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionLayout } from "@/components/ui/design-system/section-layout"

export default function HeroSection() {
  return (
    <SectionLayout className="py-20 lg:py-32 relative overflow-hidden">
      {/* Institutional Background - Ultra Subtle */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" aria-hidden="true"></div>
      
      {/* Academic Geometric Elements */}
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border/20 to-transparent" aria-hidden="true"></div>
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-border/15 to-transparent" aria-hidden="true"></div>
      
      {/* Cognitive Architecture - Balanced */}
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="space-y-10">
          
          {/* Eyebrow label - ultra discreto */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></div>
            Educazione Crypto Antifuffa
          </div>
          
          {/* Recognition - H1 unico non spezzato */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
              Il mondo crypto è pieno di hype e confusione
            </h1>
            
            <h2 className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Paura, promesse, numeri fuori contesto.
              <br />
              <span className="text-foreground font-medium">È normale sentirsi disorientati.</span>
            </h2>
          </div>
          
          {/* Normalization - Brief */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-foreground leading-relaxed">
              Tradelia è un sistema educativo che ti guida 
              <strong className="font-semibold"> passo dopo passo</strong>, 
              senza fretta, senza promesse, senza segnali.
            </p>
          </div>
          
          {/* Single State Transition */}
          <div className="space-y-4 pt-4">
            <Button asChild size="lg" className="px-10 py-6 text-base font-semibold">
              <Link href="/dashboard/start">
                Inizia dal primo passo
              </Link>
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Nessuna registrazione • Nessuna decisione • Solo orientamento
            </p>
          </div>
          
        </div>
      </div>
    </SectionLayout>
  );
}
