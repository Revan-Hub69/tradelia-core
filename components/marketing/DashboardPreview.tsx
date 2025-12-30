import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content"
import { CheckCircleIcon, WarningIcon, BrainIcon } from "@/components/icons"

export default function DashboardPreview() {
  const features = [
    {
      icon: BrainIcon,
      text: HOMEPAGE_CONTENT.dashboardPreview.features[0],
      color: "text-blue-600"
    },
    {
      icon: CheckCircleIcon,
      text: HOMEPAGE_CONTENT.dashboardPreview.features[1],
      color: "text-green-600"
    },
    {
      icon: WarningIcon,
      text: HOMEPAGE_CONTENT.dashboardPreview.features[2],
      color: "text-amber-600"
    }
  ]

  return (
    <SectionLayout className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl text-center">
        
        {/* Section Header */}
        <div className="space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {HOMEPAGE_CONTENT.dashboardPreview.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {HOMEPAGE_CONTENT.dashboardPreview.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-3 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <UnifiedCard key={index} className="text-center p-6">
                <CardContent className="space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                    <IconComponent className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <p className="text-base font-medium text-foreground">
                    {feature.text}
                  </p>
                </CardContent>
              </UnifiedCard>
            )
          })}
        </div>

        {/* Conclusion */}
        <div className="bg-muted/30 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-lg font-medium text-foreground">
            {HOMEPAGE_CONTENT.dashboardPreview.conclusion}
          </p>
        </div>

      </div>
    </SectionLayout>
  )
}