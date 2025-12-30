import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content"

export default function IntentionDriven() {
  return (
    <SectionLayout className="py-16 lg:py-24 bg-muted/20">
      <div className="mx-auto max-w-4xl text-center">
        
        {/* Section Header */}
        <div className="space-y-6 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {HOMEPAGE_CONTENT.intentionDriven.title}
          </h2>
          <p className="text-xl sm:text-2xl font-semibold text-primary">
            {HOMEPAGE_CONTENT.intentionDriven.question}
          </p>
        </div>

        {/* Objectives Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {HOMEPAGE_CONTENT.intentionDriven.objectives.map((objective) => (
            <UnifiedCard key={objective.id} className="p-4 hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-3 text-left">
                <span className="text-2xl flex-shrink-0">
                  {objective.emoji}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {objective.label}
                </span>
              </CardContent>
            </UnifiedCard>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-background/80 rounded-lg p-4 max-w-2xl mx-auto border border-border/50">
          <p className="text-sm text-muted-foreground">
            {HOMEPAGE_CONTENT.intentionDriven.disclaimer}
          </p>
        </div>

      </div>
    </SectionLayout>
  )
}