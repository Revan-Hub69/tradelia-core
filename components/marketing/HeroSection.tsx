import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionLayout } from "@/components/ui/design-system/section-layout"

export default function HeroSection() {
  return (
    <SectionLayout className="py-20 lg:py-32 relative overflow-hidden">
      {/* Academic Grid Pattern - Ultra Subtle */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" aria-hidden="true"></div>
      
      {/* Institutional Geometric Elements */}
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-30" aria-hidden="true"></div>
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-20" aria-hidden="true"></div>
      
      {/* Academic Layout - Asymmetric Balance */}
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Content - Academic Left Alignment */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Institutional Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-primary"></div>
                <span className="text-sm font-medium text-primary tracking-wide uppercase">
                  Educazione Finanziaria
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">
                Comprendi i mercati
                <br />
                <span className="text-primary">senza la fuffa</span>
              </h1>
            </div>
            
            {/* Academic Subtitle */}
            <div className="max-w-2xl space-y-6">
              <p className="text-xl leading-relaxed text-foreground">
                Tradelia trasforma indicatori complessi in <strong className="font-semibold">micro-lezioni educative</strong>. 
                Niente segnali, niente promesse: solo comprensione scientifica dei mercati finanziari.
              </p>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Metodologia basata su ricerca accademica • Contenuti verificati • Approccio antifuffa
              </p>
            </div>
            
            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
                <Link href="/dashboard">
                  Inizia l'esplorazione
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-base font-medium">
                <Link href="/about">
                  Metodologia
                </Link>
              </Button>
            </div>
            
          </div>
          
          {/* Academic Sidebar - Credibility Elements */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Institutional Stats */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Approccio Scientifico</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Fonti accademiche</span>
                  <span className="text-lg font-bold tabular-nums">15+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Indicatori analizzati</span>
                  <span className="text-lg font-bold tabular-nums">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Bias cognitivi mappati</span>
                  <span className="text-lg font-bold tabular-nums">12</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Basato su Prospect Theory (Kahneman & Tversky, 1979) e ricerca comportamentale moderna
                </p>
              </div>
            </div>
            
            {/* Academic Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-medium text-xs">
                  Peer-Reviewed Sources
                </Badge>
                <Badge variant="outline" className="font-medium text-xs">
                  No Financial Advice
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-medium text-xs">
                  Behavioral Finance
                </Badge>
                <Badge variant="outline" className="font-medium text-xs">
                  Educational Only
                </Badge>
              </div>
            </div>
            
          </div>
        </div>
        
        {/* Academic Footer - Compliance */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-muted-foreground max-w-2xl">
              <strong className="font-medium">Disclaimer:</strong> Contenuto puramente educativo. 
              Non costituisce consulenza finanziaria o invito all'investimento.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-success"></div>
              <span>Metodologia trasparente</span>
            </div>
          </div>
        </div>
        
      </div>
    </SectionLayout>
  );
}
