import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntlConfig = withNextIntl();

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const CACHE_BUST_TIMESTAMP = Date.now();

if (process.env.NODE_ENV === 'production' && !process.env.SKIP_I18N_VALIDATION && false) {
  try {
    execSync('npm run i18n:validate', { stdio: 'inherit' });
  } catch {
    process.exit(1);
  }
}

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withNextIntlConfig({
    poweredByHeader: false,
    reactStrictMode: true,
    serverExternalPackages: ['@electric-sql/pglite', '@supabase/supabase-js'],
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: false,
            vendors: false,
            styles: {
              name: 'styles',
              type: 'css/mini-extract',
              chunks: 'all',
              enforce: true,
              priority: 20,
            },
            critical: {
              name: 'critical',
              type: 'css/mini-extract',
              chunks: 'initial',
              enforce: true,
              priority: 30,
            },
          },
        },
      };
      return config;
    },
    async headers() {
      const securityHeaders = [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            // Next.js + React DevTools richiedono unsafe-eval in dev
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            // Tailwind inline + Fontshare + Google Fonts
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
            "img-src 'self' data: https:",
            // Font: self + data URI + Google Fonts CDN + Fontshare CDN
            "font-src 'self' data: https://fonts.gstatic.com https://api.fontshare.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
      ];

      return [
        {
          source: '/:path*',
          headers: securityHeaders,
        },
        {
          source: '/api/:path*',
          headers: [
            ...securityHeaders,
            { key: 'X-Cache-Bust',   value: `${CACHE_BUST_TIMESTAMP}` },
            { key: 'X-Deploy-Time', value: new Date().toISOString() },
            { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          ],
        },
        {
          source: '/_next/static/:path*',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/icon.svg',
          headers: [
            { key: 'Content-Type',  value: 'image/svg+xml' },
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
        {
          source: '/icon-192x192.:ext(png|svg)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/icon-512x512.:ext(png|svg)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/icon-192x192-maskable.:ext(png|svg)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/icon-512x512-maskable.:ext(png|svg)',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/favicon.ico',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/favicon.svg',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/favicon-16x16.png',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
        {
          source: '/favicon-32x32.png',
          headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
        },
      ];
    },
  }),
);
