import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content"
import { BrainIcon } from "@/components/icons"

export default function ContextualMicroLearning() {
  return (
    <SectionLayout className="py-16 lg:py-24 bg-muted/20">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <BrainIcon className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {HOMEPAGE_CONTENT.microLearning.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {HOMEPAGE_CONTENT.microLearning.description}
          </p>
        </div>

        {/* Features List */}
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mb-8">
          {HOMEPAGE_CONTENT.microLearning.features.map((feature, index) => (
            <UnifiedCard key={index} className="p-6">
              <CardContent className="text-center space-y-2">
                <div className="w-2 h-2 bg-primary rounded-full mx-auto"></div>
                <p className="text-sm font-medium text-foreground">
                  {feature}
                </p>
              </CardContent>
            </UnifiedCard>
          ))}
        </div>

        {/* Philosophy */}
        <div className="text-center">
          <div className="bg-background/80 rounded-lg p-6 max-w-2xl mx-auto border border-border/50">
            <p className="text-base font-medium text-foreground">
              {HOMEPAGE_CONTENT.microLearning.philosophy}
            </p>
          </div>
        </div>

      </div>
    </SectionLayout>
  )
}