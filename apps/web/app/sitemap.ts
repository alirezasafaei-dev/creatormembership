import type { MetadataRoute } from 'next';
import { getApiBaseUrl, getWebBaseUrl } from '@/lib/site';

async function fetchCreatorSlugs() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/v1/creators?limit=300`, { cache: 'no-store' });
    if (!res.ok) return [] as string[];
    const data = await res.json();
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.map((x: any) => String(x.slug || '')).filter(Boolean);
  } catch {
    return [] as string[];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getWebBaseUrl();
  const now = new Date();
  const staticRoutes = ['/', '/creators', '/pricing', '/how-it-works', '/about', '/privacy'];
  const slugs = await fetchCreatorSlugs();

  const staticEntries = staticRoutes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === '/' ? ('daily' as const) : ('weekly' as const),
    priority: route === '/' ? 1 : 0.8,
  }));

  const creatorEntries = slugs.map((slug: string) => ({
    url: `${base}/creators/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...creatorEntries];
}
