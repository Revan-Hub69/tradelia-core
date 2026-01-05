import type { Metadata } from "next";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageSelector';
import InitialPopup from '@/components/InitialPopup';
import "./globals.css";

export const metadata: Metadata = {
  title: "Tradelia - Esplora le crypto senza fare gli errori più costosi",
  description: "Una dashboard guidata che ti aiuta a capire il contesto, evitare trappole comuni e scegliere un percorso coerente prima di usare denaro.",
  keywords: "crypto, cryptocurrency, bitcoin, trading, educazione, principianti, dashboard, errori, contesto",
  authors: [{ name: "Tradelia" }],
  creator: "Tradelia",
  publisher: "Tradelia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://tradelia.com",
    title: "Tradelia - Esplora le crypto senza fare gli errori più costosi",
    description: "Una dashboard guidata che ti aiuta a capire il contesto, evitare trappole comuni e scegliere un percorso coerente prima di usare denaro.",
    siteName: "Tradelia",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Tradelia - Dashboard Guidata per Crypto"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradelia - Esplora le crypto senza fare gli errori più costosi",
    description: "Dashboard guidata per evitare errori comuni nel mondo crypto.",
    images: ["/og-image.png"]
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" }
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  themeColor: "hsl(220 15% 12%)",
  alternates: {
    canonical: "https://tradelia.com"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <LanguageProvider>
          <InitialPopup type="disclaimer" />
          <Header />
          <main id="main-content" role="main">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}