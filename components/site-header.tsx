import Link from "next/link";
import { LogoIcon } from "@/components/icons/logo-icon";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[60rem] items-center px-6 sm:px-8">
        <Link href="/" className="flex items-center gap-3 no-underline hover:no-underline">
          <LogoIcon className="h-8 w-8 text-primary" />
          <div className="leading-tight">
            <span className="block text-lg font-semibold text-primary">Tradelia</span>
            <span className="block text-xs text-muted-foreground">
              Sistema di verifica decisionale
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
