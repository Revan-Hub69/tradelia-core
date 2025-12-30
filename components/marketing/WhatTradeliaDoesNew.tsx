import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { UnifiedCard, CardContent, CardHeader, CardTitle } from "@/components/ui/design-system/unified-card"
import { HOMEPAGE_CONTENT } from "@/lib/constants/homepage-content"
import { CheckCircleIcon, WarningIcon } from "@/components/icons"

export default function WhatTradeliaDoesNew() {
  return (
    <SectionLayout className="py-16 lg:py-24 bg-muted/20">
      <div className="mx-auto max-w-5xl">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {HOMEPAGE_CONTENT.whatTradeliaDoes.title}
          </h2>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          
          {/* What Tradelia Does */}
          <UnifiedCard className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {HOMEPAGE_CONTENT.whatTradeliaDoes.does.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {HOMEPAGE_CONTENT.whatTradeliaDoes.does.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </CardContent>
          </UnifiedCard>

          {/* What Tradelia Does NOT Do */}
          <UnifiedCard className="p-6">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <WarningIcon className="w-5 h-5 text-red-600" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">
                  {HOMEPAGE_CONTENT.whatTradeliaDoes.doesNot.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {HOMEPAGE_CONTENT.whatTradeliaDoes.doesNot.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </CardContent>
          </UnifiedCard>

        </div>

      </div>
    </SectionLayout>
  )
}