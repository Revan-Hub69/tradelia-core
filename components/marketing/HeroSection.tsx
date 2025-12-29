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
      
      {/* Hero Content - Crypto-Only Focus */}
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="space-y-8">
          
          {/* Category Badge */}
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            Educazione Crypto Antifuffa
          </div>
          
          {/* Main Headline - Recognition */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-foreground">
            Il mondo crypto oggi è dominato da 
            <span className="text-primary block mt-2">hype, paura e promesse</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Capirci qualcosa è difficile
          </p>
          
          {/* Normalization */}
          <div className="max-w-2xl mx-auto space-y-6 pt-4">
            <p className="text-lg text-foreground leading-relaxed">
              Milioni di persone:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-base text-foreground">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                <span>restano fuori per paura</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-warning mt-2 flex-shrink-0"></div>
                <span>entrano e sbagliano</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0"></div>
                <span>si fidano delle fonti sbagliate</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0"></div>
                <span>non sanno più a cosa credere</span>
              </div>
            </div>
            <p className="text-lg text-foreground font-medium">
              Non perché siano stupide. Ma perché il rumore è enorme.
            </p>
          </div>
          
          {/* Single CTA */}
          <div className="pt-8">
            <Button asChild size="lg" className="px-8 py-6 text-base font-semibold">
              <Link href="/dashboard">
                Inizia dal primo passo
              </Link>
            </Button>
          </div>
          
        </div>
      </div>
    </SectionLayout>
  );
}
