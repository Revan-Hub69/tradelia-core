import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionLayout } from "@/components/ui/design-system/section-layout"

export default function HeroSection() {
  return (
    <SectionLayout className="py-20 lg:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Vedi grafici e "consigli" crypto ovunque, ma non sai cosa significano <strong className="text-primary">davvero</strong>?
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
            Tradelia è un <strong>progetto antifuffa</strong>: micro-lezioni brevi + spiegazioni guidate per capire ciò che stai guardando. 
            <strong> Senza promesse. Senza segnali. Senza pressione.</strong>
          </p>
          
          <div className="flex justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/dashboard">
                Inizia con calma
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm pt-4">
            <Badge variant="outline">Educativo</Badge>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <Badge variant="outline">Trasparente</Badge>
            <span className="text-muted-foreground hidden sm:inline">•</span>
            <Badge variant="outline">Nessun consiglio operativo</Badge>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
}
