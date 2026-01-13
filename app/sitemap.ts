import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tradelia.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // 4 Learning Paths
  const learningPaths = ['investment', 'emergency', 'passive', 'speculation'];
  const pathPages: MetadataRoute.Sitemap = learningPaths.map(path => ({
    url: `${BASE_URL}/dashboard/${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Auth pages (lower priority)
  const authPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Locale variants
  const locales = ['it', 'en'];
  const localizedPages: MetadataRoute.Sitemap = locales.map(locale => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...pathPages, ...authPages, ...localizedPages];
}
