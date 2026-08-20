import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/compress-pdf',
    '/merge-pdf',
    '/split-pdf',
    '/pdf-to-jpg',
    '/jpg-to-pdf',
    '/protect-pdf',
    '/compress-image',
    '/resize-image',
    '/crop-image',
    '/jpg-to-webp',
    '/heic-to-jpg',
    '/video-to-audio',
  ];

  const now = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
