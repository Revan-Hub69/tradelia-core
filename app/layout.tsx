import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageSelector';
import "./globals.css";

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: "Tradelia - Stop alle perdite crypto. Inizia nel modo giusto.",
  description: "La prima dashboard AI che ti avvisa PRIMA di commettere errori costosi nel crypto. Oltre 50,000 trader hanno già salvato €2.3M+ grazie a noi. Setup gratuito in 2 minuti.",
  keywords: "crypto dashboard, AI trading, perdite crypto, errori trading, protezione investimenti, scam detector, risk management",
  authors: [{ name: "Tradelia" }],
  creator: "Tradelia",
  publisher: "Tradelia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://tradelia.com",
    title: "Tradelia - Stop alle perdite crypto",
    description: "Dashboard AI che previene errori costosi nel crypto. 50,000+ trader protetti, €2.3M+ perdite evitate.",
    siteName: "Tradelia",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Tradelia - Dashboard AI per crypto trading sicuro"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradelia - Stop alle perdite crypto",
    description: "Dashboard AI che previene errori costosi nel crypto. 50,000+ trader protetti.",
    images: ["/og.png"]
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
  themeColor: "#2563eb",
  alternates: {
    canonical: "https://tradelia.com",
    languages: {
      'it': 'https://tradelia.com',
      'en': 'https://tradelia.com/en'
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`scroll-smooth ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body 
        className={`antialiased min-h-screen font-sans ${inter.className}`}
        style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
      >
        <LanguageProvider>
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