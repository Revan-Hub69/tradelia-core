import Link from "next/link";
import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { HOMEPAGE_CONTENT, NAVIGATION } from "@/lib/constants/homepage-content";

export default function FinalCTANew() {
  return (
    <>
      <SectionLayout background="muted">
        <div className="mx-auto max-w-3xl text-center">
          
          <h2 className="heading-section mb-6">
            {HOMEPAGE_CONTENT.finalCta.title}
          </h2>
          
          <p className="text-body-large mb-8">
            {HOMEPAGE_CONTENT.finalCta.description}
          </p>
          
          {/* Repeat CTA - link secondario */}
          <Link 
            href={NAVIGATION.dashboard}
            className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
          >
            {HOMEPAGE_CONTENT.finalCta.cta}
          </Link>
          
        </div>
      </SectionLayout>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-6 text-sm text-foreground">
              {HOMEPAGE_CONTENT.footer.links.map((link, index) => (
                <div key={link.href} className="flex items-center gap-6">
                  <Link href={link.href} className="link-footer">
                    {link.label}
                  </Link>
                  {index < HOMEPAGE_CONTENT.footer.links.length - 1 && (
                    <span className="text-muted-foreground">•</span>
                  )}
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-foreground leading-relaxed max-w-3xl mx-auto">
                <strong className="font-semibold">Disclaimer:</strong> {HOMEPAGE_CONTENT.footer.disclaimer}
              </p>
            </div>
            
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                {HOMEPAGE_CONTENT.footer.copyright}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
