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

// Cache busting timestamp for force redeploy
const CACHE_BUST_TIMESTAMP = Date.now();

// Validate translations during production build
if (process.env.NODE_ENV === 'production' && !process.env.SKIP_I18N_VALIDATION) {
  try {
    // Translation validation during build
    execSync('npm run i18n:validate', { stdio: 'inherit' });
  }
  catch {
    // Translation validation failed - logged to build output
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
      // Temporarily disabled due to Next.js ESLint flat config compatibility issue
      // Error: "Unknown options: useEslintrc, extensions"
      // TODO: Re-enable when Next.js updates ESLint integration
      ignoreDuringBuilds: true,
    },
    typescript: {
      // ✅ ENTERPRISE 2026: TypeScript re-enabled after DashboardHeader fixes
      // Remaining ~25 'as any' are in navigation components (acceptable for now)
      ignoreBuildErrors: false,
    },
    webpack: (config, { isServer }) => {
      // Fix for Supabase client-side imports
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          net: false,
          tls: false,
        };
      }

      // Optimize CSS loading to reduce preload warnings
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: false,
            vendors: false,
            // Create a single CSS bundle to reduce preload warnings
            styles: {
              name: 'styles',
              type: 'css/mini-extract',
              chunks: 'all',
              enforce: true,
              priority: 20,
            },
            // Separate critical CSS
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
      return [
        // Cache busting ONLY for API routes (not static assets)
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'X-Cache-Bust',
              value: `${CACHE_BUST_TIMESTAMP}`,
            },
            {
              key: 'X-Deploy-Time',
              value: new Date().toISOString(),
            },
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
          ],
        },
        // Optimal caching for static assets
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        // Ensure proper MIME type for SVG icons with long cache
        {
          source: '/icon.svg',
          headers: [
            {
              key: 'Content-Type',
              value: 'image/svg+xml',
            },
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        // Cache PWA icons (specific patterns)
        {
          source: '/icon-192x192.:ext(png|svg)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/icon-512x512.:ext(png|svg)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/icon-192x192-maskable.:ext(png|svg)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/icon-512x512-maskable.:ext(png|svg)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        // Cache favicon files
        {
          source: '/favicon.ico',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/favicon.svg',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/favicon-16x16.png',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/favicon-32x32.png',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  }),
);
