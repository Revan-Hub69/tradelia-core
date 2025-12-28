import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionLayout } from "@/components/ui/design-system/section-layout"

export default function HeroSection() {
  return (
    <SectionLayout className="py-16 lg:py-24 relative overflow-hidden">
      {/* Grid pattern background - Clean lines */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none" aria-hidden="true"></div>
      
      {/* Geometric shapes - VERY VISIBLE */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[100px] pointer-events-none" aria-hidden="true"></div>
      
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="space-y-6">
          {/* Category badge - Academic style */}
          <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
            Educazione Finanziaria
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            Vedi grafici e "consigli" crypto ovunque, ma non sai cosa significano <strong className="text-primary">davvero</strong>?
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-foreground leading-relaxed">
            Tradelia è un <strong className="font-semibold">progetto antifuffa</strong>: micro-lezioni brevi + spiegazioni guidate per capire ciò che stai guardando. 
            <strong className="font-semibold"> Senza promesse. Senza segnali. Senza pressione.</strong>
          </p>
          
          <div className="flex justify-center pt-2">
            <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
              <Link href="/dashboard">
                Inizia con calma
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm pt-4">
            <Badge variant="outline" className="font-medium">Educativo</Badge>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <Badge variant="outline" className="font-medium">Trasparente</Badge>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <Badge variant="outline" className="font-medium">Nessun consiglio operativo</Badge>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
