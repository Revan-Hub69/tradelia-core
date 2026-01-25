import '@/styles/shared.css';
import '@/styles/bottom-nav-capsule-2026.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import NextTopLoader from 'nextjs-toploader';

import { RuntimeReady } from '@/components/runtime/RuntimeReady';
import { ServiceWorkerCleanup } from '@/components/ServiceWorkerCleanup';
import { WebVitalsMonitor } from '@/components/WebVitalsMonitor';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover', // iOS safe area insets support
};

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
 * 
 * CSP Configuration (2026):
 * - Domain-based CSP with 'unsafe-inline' (no nonces)
 * - See: docs/research/CSP_NONCE_NEXTJS15_TIER1_2026.md
 * - Nonce-based CSP removed due to Next.js 15 incompatibility
 * - Static generation enabled (no force-dynamic required)
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-tradelia-runtime="boot">
      <head>
        {/* Performance P0: Preconnect to external origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Performance P0: DNS prefetch for faster lookups */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body className="overflow-x-hidden bg-background text-foreground antialiased" suppressHydrationWarning>
        {/* Global loading indicator for navigation transitions */}
        <NextTopLoader
          color="hsl(var(--primary))"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
          zIndex={9999}
        />
        
        <RuntimeReady />
        <ServiceWorkerCleanup />
        <WebVitalsMonitor />
        
        {/* Vercel Analytics - Real User Monitoring */}
        <Analytics />
        <SpeedInsights />

        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="layer-modal sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2"
        >
          Skip to main content
        </a>

        {children}
      </body>
    </html>
  );
}
