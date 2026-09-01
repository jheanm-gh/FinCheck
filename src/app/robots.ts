import type { MetadataRoute } from 'next';
import { site } from '@/config/adviser';
import { isLaunchReady } from '@/lib/compliance';

/**
 * While ANY compliance item is outstanding, this blocks all crawlers.
 *
 * The site can be deployed and shared privately for review, but it cannot be found.
 * Tying this to isLaunchReady() rather than an env var means nobody can accidentally
 * publish it by flipping a setting in a dashboard — the block lifts only when the
 * FSP details and advertising approval are actually filled in.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isLaunchReady()) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/adviser/', '/campaign/'] },
    sitemap: `${site.domain}/sitemap.xml`,
  };
}
