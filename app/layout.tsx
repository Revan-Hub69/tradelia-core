import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { fraunces, sora } from "@/lib/fonts";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://tradelia.org"),
  title: {
    default: "Tradelia | Verifica decisionale",
    template: "%s | Tradelia",
  },
  description:
    "Sistema che verifica la compatibilita tra obiettivi dichiarati e caratteristiche reali di broker, wallet, exchange, conti deposito e strumenti di pagamento.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  keywords: [
    "compatibilita finanziaria",
    "broker",
    "exchange",
    "wallet",
    "conti deposito",
    "strumenti di pagamento",
    "risk management",
    "decision science",
    "MiFID",
    "due diligence",
    "fintech",
  ],
  authors: [{ name: "Tradelia Team" }],
  creator: "Tradelia",
  publisher: "Tradelia",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="it"
      className={`${sora.variable} ${fraunces.variable}`}
      data-theme="light"
      style={{ colorScheme: "light" }}
    >
      <body className="bg-background text-foreground antialiased font-sans">
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{var t="tradelia-theme";var e=localStorage.getItem(t);var n=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";var r=e==="light"||e==="dark"?e:n;document.documentElement.dataset.theme=r;document.documentElement.style.colorScheme=r;}catch(o){}})();',
          }}
        />
        <a href="#main-content" className="skip-link">
          Salta al contenuto
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
