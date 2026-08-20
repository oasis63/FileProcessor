import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { INDEXABLE_PATHS } from '@/lib/tools-catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return INDEXABLE_PATHS.map((route) => {
    const isHome = route === '';
    const isLegal = route === '/about' || route === '/privacy' || route === '/terms';
    return {
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: isHome ? 'weekly' : isLegal ? 'yearly' : 'monthly',
      priority: isHome ? 1 : isLegal ? 0.3 : 0.8,
    };
  });
}
