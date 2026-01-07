import type { Metadata, Viewport } from "next";
import { PWAProvider } from "@/components/PWAProvider";
import { SkipLink } from "@/components/SkipLink";
import { JsonLd, getOrganizationSchema, getWebSiteSchema, getLearningResourceSchema, getCourseSchemas } from "@/components/seo/JsonLd";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = 'it';
  
  const titles = {
    it: "Tradelia - Evita gli Errori più Costosi nelle Crypto | Dashboard Educativa Gratuita",
    en: "Tradelia - Avoid the Most Costly Crypto Mistakes | Free Educational Dashboard"
  };
  
  const descriptions = {
    it: "Dashboard educativa che ti aiuta a evitare gli errori più comuni di chi inizia con le crypto. 4 percorsi personalizzati basati su ricerca accademica. Gratuita, senza deposito.",
    en: "Educational dashboard helping you avoid the most common crypto beginner mistakes. 4 personalized paths based on academic research. Free, no deposit required."
  };

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tradelia.com'),
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    keywords: "errori crypto, perdere soldi crypto, rischi criptovalute principianti, crypto senza rischi, educazione crypto, finanza comportamentale, investire crypto sicuro",
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
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Tradelia - Dashboard educativa per evitare errori crypto"
      }]
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles],
      description: descriptions[locale as keyof typeof descriptions],
      images: ["/og.png"]
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
        {/* Preload critical fonts */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          as="style"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <JsonLd data={[
          getOrganizationSchema(), 
          getWebSiteSchema(), 
          getLearningResourceSchema(),
          ...getCourseSchemas()
        ]} />
        <SkipLink />
        <PWAProvider>
          {children}
        </PWAProvider>
      </body>
    </html>
  );
}
