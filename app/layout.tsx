import type { Metadata, Viewport } from "next";
import { PWAProvider } from "@/components/PWAProvider";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd, getOrganizationSchema, getWebSiteSchema } from "@/components/seo/JsonLd";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'it';
  
  const titles = {
    it: "Tradelia - Identifica Incompatibilità tra Obiettivi e Strumenti Crypto | Ricerca Accademica",
    en: "Tradelia - Identify Incompatibilities between Objectives and Crypto Tools | Academic Research"
  };
  
  const descriptions = {
    it: "Dashboard educativa basata su ricerca comportamentale peer-reviewed per identificare incompatibilità tra obiettivi di investimento e strumenti crypto. Metodologia accademica verificata.",
    en: "Educational dashboard based on peer-reviewed behavioral research to identify incompatibilities between investment objectives and crypto tools. Verified academic methodology."
  };

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tradelia.com'),
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    keywords: "crypto education, behavioral finance, investment risk assessment, academic research, cryptocurrency tools, financial literacy, risk management, peer-reviewed methodology",
    authors: [{ name: "Tradelia Research Team" }],
    creator: "Tradelia",
    publisher: "Tradelia",
    robots: "index, follow",
    alternates: {
      canonical: "/",
      languages: {
        'it': '/it',
        'en': '/en'
      }
    },
    openGraph: {
      type: "website",
      locale: locale === 'it' ? 'it_IT' : 'en_US',
      url: "/",
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      siteName: "Tradelia",
      images: [{
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tradelia - Academic Crypto Risk Assessment Dashboard"
      }]
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      images: ["/og-image.png"]
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "32x32" }
      ],
      apple: "/apple-touch-icon.png",
    }
  };
}

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
        <JsonLd data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <SkipLink />
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
