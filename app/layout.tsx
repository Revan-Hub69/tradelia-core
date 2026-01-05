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
  title: "Tradelia - Check di coerenza crypto in 60 secondi",
  description: "Verifica la coerenza tra i tuoi obiettivi e gli strumenti crypto. Check guidato basato su evidenze accademiche. Nessuna registrazione, nessuna operazione.",
  keywords: "crypto, bitcoin, trading, investimenti, check coerenza, finanza, blockchain",
  authors: [{ name: "Tradelia" }],
  creator: "Tradelia",
  publisher: "Tradelia",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://tradelia.com",
    title: "Tradelia - Check di coerenza crypto",
    description: "Verifica la coerenza tra i tuoi obiettivi e gli strumenti crypto in 60 secondi",
    siteName: "Tradelia",
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Tradelia - Check di coerenza crypto"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Tradelia - Check di coerenza crypto",
    description: "Verifica la coerenza tra i tuoi obiettivi e gli strumenti crypto in 60 secondi",
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
  themeColor: "#1f2937",
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
      <body className={`antialiased min-h-screen bg-white font-sans ${inter.className}`}>
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