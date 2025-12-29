import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "sonner";
import { inter, ibmPlexSans } from "@/lib/fonts";
import { StructuredData } from "@/components/structured-data";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://tradelia.org'),
  title: {
    default: "Tradelia | Educazione Finanziaria Antifuffa",
    template: "%s | Tradelia"
  },
  description: "Piattaforma educativa per comprendere crypto e mercati finanziari. Micro-lezioni, spiegazioni guidate, zero consigli operativi. Educazione seria contro la fuffa finanziaria.",
  keywords: [
    "educazione finanziaria",
    "crypto educazione", 
    "bitcoin spiegazione",
    "fear greed index",
    "analisi tecnica educativa",
    "trading educazione",
    "investimenti consapevoli",
    "finanza comportamentale",
    "antifuffa finanziaria",
    "micro lezioni crypto"
  ],
  authors: [{ name: "Tradelia Team", url: "https://tradelia.com" }],
  creator: "Tradelia",
  publisher: "Tradelia",
  category: "Education",
  classification: "Financial Education",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://tradelia.com",
    siteName: "Tradelia",
    title: "Tradelia | Educazione Finanziaria Antifuffa",
    description: "Micro-lezioni crypto e spiegazioni guidate. Zero consigli operativi, solo educazione seria contro la fuffa finanziaria.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tradelia - Educazione Finanziaria Antifuffa",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@tradelia",
    creator: "@tradelia",
    title: "Tradelia | Educazione Finanziaria Antifuffa",
    description: "Micro-lezioni crypto e spiegazioni guidate. Zero consigli operativi, solo educazione seria.",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: "https://tradelia.org",
    languages: {
      'it-IT': 'https://tradelia.org',
    }
  },
  verification: {
    google: "your-google-verification-code",
    other: {
      "facebook-domain-verification": "your-facebook-verification-code"
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="it" className={`${inter.variable} ${ibmPlexSans.variable}`} suppressHydrationWarning>
      <body className="bg-muted/20 text-foreground antialiased font-sans">
        <StructuredData />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders>
            {children}
            <Toaster richColors position="bottom-right" />
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
