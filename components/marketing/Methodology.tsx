import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content"
import { ShieldIcon } from "@/components/icons"

export default function Methodology() {
  return (
    <SectionLayout className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <ShieldIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {HOMEPAGE_CONTENT.methodology.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {HOMEPAGE_CONTENT.methodology.description}
          </p>
        </div>

        {/* Foundations */}
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mb-8">
          {HOMEPAGE_CONTENT.methodology.foundations.map((foundation, index) => (
            <UnifiedCard key={index} className="p-6 text-center">
              <CardContent className="space-y-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto"></div>
                <p className="text-sm font-medium text-foreground leading-relaxed">
                  {foundation}
                </p>
              </CardContent>
            </UnifiedCard>
          ))}
        </div>

        {/* Philosophy */}
        <div className="text-center">
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 max-w-2xl mx-auto border border-blue-200 dark:border-blue-800">
            <p className="text-base font-medium text-blue-900 dark:text-blue-100">
              {HOMEPAGE_CONTENT.methodology.philosophy}
            </p>
          </div>
        </div>

      </div>
    </SectionLayout>
  )
}