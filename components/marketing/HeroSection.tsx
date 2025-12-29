import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { HOMEPAGE_CONTENT, NAVIGATION } from "@/lib/constants/homepage-content";

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
        <div className="space-y-8">
          
          {/* Title - Audit 2025: più corto, più definito */}
          <div className="content-spacing-lg">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight px-4 sm:px-0">
              {HOMEPAGE_CONTENT.hero.title}
            </h1>
            
            <div className="max-w-2xl mx-auto px-4 sm:px-0 space-y-4">
              <p className="text-lg sm:text-xl text-muted-foreground">
                {HOMEPAGE_CONTENT.hero.subtitle.line1}
              </p>
              <p className="text-lg sm:text-xl text-foreground">
                {HOMEPAGE_CONTENT.hero.subtitle.line2}
              </p>
            </div>
          </div>
          
          {/* Riga di fiducia - Audit: microcopy */}
          <div className="max-w-lg mx-auto px-4 sm:px-0">
            <p className="text-sm font-medium text-muted-foreground tracking-wide">
              {HOMEPAGE_CONTENT.hero.description}
            </p>
          </div>
          
          {/* CTA Section - Audit: riduce ansia da commitment */}
          <div className="content-spacing pt-4 px-4 sm:px-0 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="px-8 sm:px-10 py-4 sm:py-6 text-sm sm:text-base font-semibold w-full sm:w-auto">
                <Link href={NAVIGATION.dashboard}>
                  {HOMEPAGE_CONTENT.hero.cta.primary}
                </Link>
              </Button>
              
              <Link 
                href="#come-funziona" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                {HOMEPAGE_CONTENT.hero.cta.secondary}
              </Link>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {HOMEPAGE_CONTENT.hero.cta.subtitle}
            </p>
          </div>
          
        </div>
      </div>
    </SectionLayout>
  );
}
