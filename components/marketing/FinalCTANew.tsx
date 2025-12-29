import Link from "next/link";
import { SectionLayout } from "@/components/ui/design-system/section-layout"
import { LogoIcon } from "@/components/icons/logo-icon";
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
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          
          {/* Single Row Layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Brand */}
            <div className="flex items-center space-x-2">
              <LogoIcon className="h-5 w-5 text-primary" />
              <div>
                <span className="text-sm font-semibold">Tradelia</span>
                <p className="text-xs text-muted-foreground">Educazione al rischio</p>
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
              © {new Date().getFullYear()} Tradelia
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
