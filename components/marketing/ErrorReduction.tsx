import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content"
import { WarningIcon } from "@/components/icons"

export default function ErrorReduction() {
  return (
    <SectionLayout className="py-16 lg:py-24">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <WarningIcon className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {HOMEPAGE_CONTENT.errorReduction.title}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {HOMEPAGE_CONTENT.errorReduction.description}
          </p>
        </div>

        {/* Common Errors */}
        <div className="space-y-4 mb-8">
          {HOMEPAGE_CONTENT.errorReduction.commonErrors.map((error, index) => (
            <UnifiedCard key={index} className="p-4">
              <CardContent className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                <p className="text-base text-foreground">
                  {error}
                </p>
              </CardContent>
            </UnifiedCard>
          ))}
        </div>

        {/* Solution */}
        <div className="text-center">
          <div className="bg-primary/10 rounded-lg p-6 max-w-2xl mx-auto border border-primary/20">
            <p className="text-lg font-semibold text-primary">
              {HOMEPAGE_CONTENT.errorReduction.solution}
            </p>
          </div>
        </div>

      </div>
    </SectionLayout>
  )
}