import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import withBundleAnalyzer from '@next/bundle-analyzer';
import createJiti from 'jiti';
import withNextIntl from 'next-intl/plugin';
import withPWA from 'next-pwa';

const jiti = createJiti(fileURLToPath(import.meta.url));

jiti('./src/libs/Env');

const withNextIntlConfig = withNextIntl();

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

// ✅ TIER 1: PWA Configuration based on Google Chrome Official
const withPWAConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Simplified runtime caching to avoid configuration errors
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-assets',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        },
      },
    },
    {
      urlPattern: /\/api\/.*$/i,
      handler: 'NetworkFirst',
      method: 'GET',
      options: {
        cacheName: 'apis',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 60 * 60 * 24, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

// Validate translations during production build
if (process.env.NODE_ENV === 'production' && !process.env.SKIP_I18N_VALIDATION) {
  try {
    console.log('🔍 Validating translations...');
    execSync('npm run i18n:validate', { stdio: 'inherit' });
    console.log('✅ Translation validation passed\n');
  } catch (error) {
    console.error('❌ Translation validation failed');
    process.exit(1);
  }
}

/** @type {import('next').NextConfig} */
export default bundleAnalyzer(
  withPWAConfig(
    withNextIntlConfig({
      poweredByHeader: false,
      reactStrictMode: true,
      serverExternalPackages: ['@electric-sql/pglite', '@supabase/supabase-js'],
      eslint: {
        // TEMPORARY: Disable ESLint during builds due to config issues
        // TODO: Fix ESLint configuration (obsolete plugin options)
        ignoreDuringBuilds: true,
        dirs: ['src', 'components', 'lib', 'utils', 'hooks'],
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
        return config;
      },
      async headers() {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-Content-Type-Options',
                value: 'nosniff',
              },
              {
                key: 'X-Frame-Options',
                value: 'DENY',
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
                key: 'Permissions-Policy',
                value: 'camera=(), microphone=(), geolocation=()',
              },
            ],
          },
        ];
      },
    }),
  ),
);
