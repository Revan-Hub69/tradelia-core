import type { Metadata, Viewport } from "next";
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageSelector';
import { DashboardModalProvider } from '@/contexts/DashboardModalContext';
import DashboardModal from '@/components/DashboardModal';
import InitialPopup from '@/components/InitialPopup';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://tradelia.com'),
  title: "Tradelia - Come Iniziare con le Crypto Senza Errori Costosi | Guida Principianti",
  description: "Hai paura di investire in crypto? Tradelia ti aiuta a capire i rischi prima di comprare Bitcoin. Guida gratuita per principianti che vogliono evitare errori costosi. Nessun account richiesto.",
  keywords: "crypto principianti, come iniziare bitcoin, errori da evitare crypto, bitcoin sicuro, investire crypto senza rischi, crypto per principianti italia, bitcoin truffa come evitare, exchange crypto sicuro, wallet bitcoin principianti, crypto guida italiana, paura investire bitcoin, come comprare crypto sicuro",
  authors: [{ name: "Tradelia" }],
  creator: "Tradelia",
  publisher: "Tradelia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://tradelia.com",
    title: "Tradelia - Come Iniziare con le Crypto Senza Errori Costosi",
    description: "Hai paura di investire in crypto? Tradelia ti aiuta a capire i rischi prima di comprare Bitcoin.",
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
    title: "Tradelia - Come Iniziare con le Crypto Senza Errori Costosi",
    description: "Guida gratuita per principianti crypto. Evita errori costosi prima di investire in Bitcoin.",
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
  alternates: {
    canonical: "https://tradelia.com"
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: 'hsl(220 15% 12%)'
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
          <DashboardModalProvider>
            <InitialPopup type="disclaimer" />
            <Header />
            <main id="main-content" role="main">
              {children}
            </main>
            <Footer />
            <DashboardModal />
          </DashboardModalProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}