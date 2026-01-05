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
        {/* Viewport ottimizzato */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color per browser mobile */}
        <meta name="theme-color" content="#f8f9fa" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
      </head>
      <body className="antialiased">
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