import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content"

export default function DynamicDashboard() {
  return (
    <SectionLayout className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {HOMEPAGE_CONTENT.dynamicDashboard.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {HOMEPAGE_CONTENT.dynamicDashboard.description}
          </p>
        </div>

        {/* Actions Grid */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 mb-8">
          {HOMEPAGE_CONTENT.dynamicDashboard.actions.map((action, index) => (
            <UnifiedCard key={index} className="p-6 text-center">
              <CardContent className="space-y-3">
                <div className="text-3xl">
                  {action.icon}
                </div>
                <p className="text-base font-medium text-foreground">
                  {action.text}
                </p>
              </CardContent>
            </UnifiedCard>
          ))}
        </div>

        {/* Examples */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-semibold text-foreground text-center">
            Esempio semplice:
          </h3>
          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
            {HOMEPAGE_CONTENT.dynamicDashboard.examples.map((example, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-4 text-center">
                <p className="text-sm font-mono text-foreground">
                  {example}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conclusion */}
        <div className="text-center">
          <p className="text-lg font-medium text-primary bg-primary/10 rounded-lg p-4 inline-block">
            {HOMEPAGE_CONTENT.dynamicDashboard.conclusion}
          </p>
        </div>

      </div>
    </SectionLayout>
  )
}