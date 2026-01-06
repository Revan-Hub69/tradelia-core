import { MetadataRoute } from 'next';

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
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Locale variants (when i18n is implemented)
  const locales = ['it', 'en'];
  const localizedPages: MetadataRoute.Sitemap = [];
  
  // Add localized versions of main pages
  for (const locale of locales) {
    localizedPages.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  return [...staticPages, ...localizedPages];
}
