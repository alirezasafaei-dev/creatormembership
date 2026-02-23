import type { MetadataRoute } from 'next';
import { getWebBaseUrl } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  const base = getWebBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
