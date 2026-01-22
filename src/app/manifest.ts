import type { MetadataRoute } from 'next';

/**
 * PWA Manifest 2026 - Dashboard Focused
 * 
 * Modern PWA implementation following 2026 best practices:
 * - Dashboard-first start_url
 * - Simplified icon set (PNG only for reliability)
 * - Professional shortcuts for business users
 * - Optimized for desktop and mobile dashboard usage
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tradelia Dashboard',
    short_name: 'Tradelia',
    description: 'Professional crypto trading dashboard with real-time analytics and portfolio management',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['education', 'finance', 'productivity'],
    icons: [
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192x192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Portfolio',
        short_name: 'Portfolio',
        description: 'View your crypto portfolio',
        url: '/dashboard/profile',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Learn',
        short_name: 'Learn',
        description: 'Access learning materials',
        url: '/dashboard/learn',
        icons: [
          {
            src: '/favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}