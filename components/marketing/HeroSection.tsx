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
      
      {/* Dashboard Dinamica 2025 - Hero */}
      <div className="mx-auto max-w-4xl text-center relative z-10">
        <div className="space-y-8">
          
          {/* Main Headline - Dashboard Dinamica */}
          <div className="content-spacing-lg">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight px-4 sm:px-0">
              {HOMEPAGE_CONTENT.hero.headline}
            </h1>
            
            <div className="max-w-3xl mx-auto px-4 sm:px-0">
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed">
                {HOMEPAGE_CONTENT.hero.subHeadline}
              </p>
            </div>
          </div>
          
          {/* Disclaimer - Compliance */}
          <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <p className="text-sm text-muted-foreground font-medium bg-muted/50 rounded-lg px-4 py-2 inline-block">
              {HOMEPAGE_CONTENT.hero.disclaimer}
            </p>
          </div>
          
          {/* CTA Section - Dashboard Access */}
          <div className="content-spacing pt-4 px-4 sm:px-0 space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Button asChild size="lg" className="px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto">
                <Link href={NAVIGATION.dashboard}>
                  {HOMEPAGE_CONTENT.hero.cta.primary}
                </Link>
              </Button>
            </div>
            
            {/* Reassurance - No Pressure */}
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              {HOMEPAGE_CONTENT.hero.cta.reassurance}
            </p>
          </div>
          
        </div>
      </div>
    </SectionLayout>
  );
}
