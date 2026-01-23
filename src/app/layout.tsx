import '@/styles/shared.css';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tradelia - Learn Crypto Trading',
  description: 'Educational platform for cryptocurrency trading',
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

/**
 * Root Layout - ONLY place for <html>, <head>, <body>
 * 
 * This is the true root layout for Next.js App Router.
 * Nested layouts (like [locale]/layout.tsx) should NOT render html/head/body.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 layer-modal focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
        >
          Skip to main content
        </a>

        {children}
      </body>
    </html>
  );
}
