import type { MetadataRoute } from 'next';
import { site } from '@/config/adviser';
import { CALCULATORS } from '@/lib/calculators';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/check', '/calculators', '/learn', '/guides', '/about', '/contact', '/privacy', '/disclaimer'];
  return [
    ...routes.map((r) => ({
      url: `${site.domain}${r}`,
      lastModified: now,
      priority: r === '' ? 1 : r === '/check' ? 0.9 : 0.6,
    })),
    ...CALCULATORS.map((c) => ({
      url: `${site.domain}/calculators/${c.id}`,
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
