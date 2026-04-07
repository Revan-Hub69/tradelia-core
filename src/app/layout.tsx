import '@/styles/shared.css';
import '@/styles/bottom-nav-capsule-2026.css';
import '@/styles/custom-scrollbar-2026.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter, Instrument_Serif, Geist_Mono } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import NextTopLoader from 'nextjs-toploader';

import { RuntimeReady } from '@/components/runtime/RuntimeReady';
import { ServiceWorkerCleanup } from '@/components/ServiceWorkerCleanup';
import { WebVitalsMonitor } from '@/components/WebVitalsMonitor';

/* ─────────────────────────────────────────────────────────────────────────────
   FONTS — next/font (zero layout shift, self-hosted via Vercel edge)
   ─────────────────────────────────────────────────────────────────────────── */

/** Body & UI: Inter variable — tabular-nums, data-dense, WCAG-safe at 12px+ */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
});

/** Display / Hero headings: Instrument Serif — editorial authority, H1/H2 only */
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  fallback: ['Georgia', 'ui-serif', 'serif'],
});

/** Monospace: Geist Mono — eyebrows, labels, code, ticker data */
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Tradelia | Trading Cost Simulator',
  description: 'Model spreads, swaps, commissions, and holding pressure to find the broker and instrument setup that best protects your net returns.',
  icons: [
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'icon', url: '/favicon.ico' },
  ],
};

/**
 * Root Layout — ONLY place for <html>, <head>, <body>
 *
 * Font CSS variables injected via next/font className on <html>:
 *   --font-body    → Inter (variable font, full axis range)
 *   --font-display → Instrument Serif (400 normal + italic)
 *   --font-mono    → Geist Mono (variable)
 *
 * CSP: domain-based, 'unsafe-inline' — see docs/research/CSP_NONCE_NEXTJS15_TIER1_2026.md
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-tradelia-runtime="boot"
      className={`${inter.variable} ${instrumentSerif.variable} ${geistMono.variable}`}
    >
      <head />
      <body
        className="overflow-x-hidden bg-background font-body text-foreground antialiased"
        suppressHydrationWarning
      >
        <NextTopLoader
          color="hsl(var(--primary))"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl
          showSpinner={false}
          easing="ease"
          speed={400}
          shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
          zIndex={9999}
        />

        <RuntimeReady />
        <ServiceWorkerCleanup />
        <WebVitalsMonitor />

        <Analytics />
        <SpeedInsights />

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
