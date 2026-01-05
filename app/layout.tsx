import type { Metadata } from "next";
import { dictionary, defaultLocale, localeMetadata } from '@/lib/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import "./globals.css";

// Metadata ottimizzati per SEO e performance
export const metadata: Metadata = {
  ...localeMetadata[defaultLocale],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" }
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLocale} className="scroll-smooth">
      <head>
        {/* Inter Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

        {/* Viewport ottimizzato */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Theme color per browser mobile */}
        <meta name="theme-color" content="#1a1a1a" />
      </head>
      <body className="antialiased min-h-screen bg-background">
        {/* Header modulare */}
        <Header dictionary={dictionary} locale={defaultLocale} />
        
        {/* Main content con ID per skip link */}
        <main id="main-content" role="main">
          {children}
        </main>
        
        {/* Footer modulare */}
        <Footer dictionary={dictionary} locale={defaultLocale} />
      </body>
    </html>
  );
}