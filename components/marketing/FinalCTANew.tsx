import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { LogoIcon } from "@/components/icons/logo-icon";
import { HOMEPAGE_CONTENT, NAVIGATION } from "@/lib/constants/homepage-content";

export default function FinalCTANew() {
  return (
    <>
      <SectionLayout background="muted">
        <div className="mx-auto max-w-3xl text-center">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-8">
            {HOMEPAGE_CONTENT.finalCta.title}
          </h2>
          
          {/* CTA Button */}
          <div className="mb-6">
            <Button asChild size="lg" className="px-10 py-6 text-lg font-semibold">
              <Link href={NAVIGATION.dashboard}>
                {HOMEPAGE_CONTENT.finalCta.cta}
              </Link>
            </Button>
          </div>
          
          {/* Final Disclaimer */}
          <p className="text-sm text-muted-foreground">
            {HOMEPAGE_CONTENT.finalCta.disclaimer}
          </p>
          
        </div>
      </SectionLayout>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          
          {/* Single Row Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Brand */}
            <div className="flex items-center space-x-2">
              <LogoIcon className="h-5 w-5 text-primary" />
              <div>
                <span className="text-sm font-semibold">Tradelia</span>
                <p className="text-xs text-muted-foreground">Dashboard dinamica</p>
              </div>
            </div>

            {/* Links - Horizontal */}
            <nav className="flex flex-wrap gap-6">
              {HOMEPAGE_CONTENT.footer.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Copyright */}
            <div className="text-sm text-muted-foreground">
              {HOMEPAGE_CONTENT.footer.copyright}
            </div>
          </div>

          {/* Disclaimer - Separate row */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong>Disclaimer:</strong> {HOMEPAGE_CONTENT.footer.disclaimer}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
