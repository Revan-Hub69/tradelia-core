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
        // Ensure proper MIME type for SVG icons
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
        // Service Worker files
        {
          source: '/sw.js',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/javascript',
            },
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
            {
              key: 'Service-Worker-Allowed',
              value: '/',
            },
          ],
        },
        {
          source: '/sw-2026.js',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/javascript',
            },
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
            {
              key: 'Service-Worker-Allowed',
              value: '/',
            },
          ],
        },
        {
          source: '/sw-custom.js',
          headers: [
            {
              key: 'Content-Type',
              value: 'application/javascript',
            },
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
            {
              key: 'Service-Worker-Allowed',
              value: '/',
            },
          ],
        },
      ];
    },
  }),
);
