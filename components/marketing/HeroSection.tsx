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
        <div className="space-y-10">
          
          {/* Eyebrow label - responsive e discreto */}
          <div className="eyebrow-label mb-4 sm:mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40"></div>
            <span className="hidden sm:inline">{HOMEPAGE_CONTENT.hero.eyebrowLabel.full}</span>
            <span className="sm:hidden">{HOMEPAGE_CONTENT.hero.eyebrowLabel.short}</span>
          </div>
          
          {/* Recognition - H1 responsive */}
          <div className="content-spacing-lg">
            <h1 className="heading-display px-4 sm:px-0">
              {HOMEPAGE_CONTENT.hero.title}
            </h1>
            
            <h2 className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
              {HOMEPAGE_CONTENT.hero.subtitle.line1}
              <br className="hidden sm:block" />
              <span className="text-foreground font-medium">{HOMEPAGE_CONTENT.hero.subtitle.line2}</span>
            </h2>
          </div>
          
          {/* Normalization - Responsive */}
          <div className="max-w-2xl mx-auto px-4 sm:px-0">
            <p className="text-body-large">
              {HOMEPAGE_CONTENT.hero.description}
            </p>
          </div>
          
          {/* Single State Transition - Responsive */}
          <div className="content-spacing pt-4 px-4 sm:px-0">
            <Button asChild size="lg" className="px-8 sm:px-10 py-4 sm:py-6 text-sm sm:text-base font-semibold w-full sm:w-auto">
              <Link href={NAVIGATION.dashboard}>
                {HOMEPAGE_CONTENT.hero.cta.primary}
              </Link>
            </Button>
            
            <p className="text-caption">
              {HOMEPAGE_CONTENT.hero.cta.subtitle}
            </p>
          </div>
          
        </div>
      </div>
    </SectionLayout>
  );
}
