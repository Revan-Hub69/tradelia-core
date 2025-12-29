import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { SuccessDotIcon } from "@/components/icons/success-dot-icon"
import { ErrorDotIcon } from "@/components/icons/error-dot-icon"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content";

export default function WhatIsTradelia() {
  const { whatWeDo, whatWeDont, howItWorks } = HOMEPAGE_CONTENT.whatIsTradelia;

  return (
    <SectionLayout>
      <SectionHeader 
        title={HOMEPAGE_CONTENT.whatIsTradelia.title}
        subtitle={HOMEPAGE_CONTENT.whatIsTradelia.subtitle}
      />
      
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto">
        {/* Card A: What we do - Responsive */}
        <UnifiedCard variant="elevated" className="border-muted-foreground/30 bg-muted/20">
          <CardHeader>
            <CardTitle className="heading-card">{whatWeDo.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="content-spacing">
              {whatWeDo.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <SuccessDotIcon className="shrink-0 mt-1" />
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </UnifiedCard>
        
        {/* Card B: What we don't do - Responsive */}
        <UnifiedCard variant="elevated" className="border-muted-foreground/40 bg-muted/30">
          <CardHeader>
            <CardTitle className="heading-card">{whatWeDont.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="content-spacing">
              {whatWeDont.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <ErrorDotIcon className="shrink-0 mt-1" />
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </UnifiedCard>
      </div>
      
      {/* Method - Responsive */}
      <div className="text-center mt-8 sm:mt-12">
        <UnifiedCard variant="hero" className="bg-primary/10 border-primary/20 max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <h3 className="heading-card mb-3 sm:mb-4">{howItWorks.title}</h3>
            <p className="text-body">
              {howItWorks.description}
            </p>
            <p className="text-caption mt-3 sm:mt-4">
              {howItWorks.subtitle}
            </p>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  );
}