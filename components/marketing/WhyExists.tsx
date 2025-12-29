import { SectionLayout, SectionHeader } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content";

export default function WhyExists() {
  return (
    <SectionLayout background="muted">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeader 
          title={HOMEPAGE_CONTENT.whyExists.title}
          subtitle={HOMEPAGE_CONTENT.whyExists.subtitle}
        />
        
        {/* Single focused message */}
        <UnifiedCard variant="elevated" className="bg-primary/5 border-primary/20 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" aria-hidden="true"></div>
          
          <CardContent className="p-8">
            <p className="text-base text-primary font-semibold">
              {HOMEPAGE_CONTENT.whyExists.message}
            </p>
          </CardContent>
        </UnifiedCard>
      </div>
    </SectionLayout>
  );
}
