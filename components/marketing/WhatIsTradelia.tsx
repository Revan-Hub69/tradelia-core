import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardHeader, CardTitle, CardContent } from "@/components/ui/design-system/unified-card"
import { SuccessDotIcon } from "@/components/icons/success-dot-icon"
import { ErrorDotIcon } from "@/components/icons/error-dot-icon"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content";

export default function WhatIsTradelia() {
  const { does, doesNot } = HOMEPAGE_CONTENT.whatTradeliaDoes;

  return (
    <SectionLayout id="cosa-tradelia">
      <SectionHeader 
        title={HOMEPAGE_CONTENT.whatTradeliaDoes.title}
        subtitle=""
      />
      
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto">
        {/* Card A: What we do */}
        <UnifiedCard variant="elevated" className="border-muted-foreground/30 bg-muted/20">
          <CardHeader>
            <CardTitle className="heading-card">{does.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="content-spacing">
              {does.items.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <SuccessDotIcon className="shrink-0 mt-1" />
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </UnifiedCard>
        
        {/* Card B: What we don't do */}
        <UnifiedCard variant="elevated" className="border-muted-foreground/40 bg-muted/30">
          <CardHeader>
            <CardTitle className="heading-card">{doesNot.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="content-spacing">
              {doesNot.items.map((item: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <ErrorDotIcon className="shrink-0 mt-1" />
                  <span className="text-body">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  );
}