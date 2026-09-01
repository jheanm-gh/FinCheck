import type { Metadata } from 'next';
import { Newsreader, Public_Sans } from 'next/font/google';
import { adviser, site } from '@/config/adviser';
import { isLaunchReady } from '@/lib/compliance';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'], display: 'swap', variable: '--font-newsreader', weight: ['400', '500', '600'],
});
const publicSans = Public_Sans({
  subsets: ['latin'], display: 'swap', variable: '--font-public-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: `${site.name} — Financial health check | ${adviser.name}, ${adviser.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    'financial adviser Pretoria', 'financial planning Pretoria',
    'financial health check South Africa', 'retirement planning South Africa',
    'life cover advice South Africa', 'financial adviser Centurion',
  ],
  openGraph: {
    type: 'website', locale: 'en_ZA', url: site.domain, siteName: site.name,
    title: `${site.name} — Know where you stand`, description: site.description,
  },
  twitter: { card: 'summary_large_image', title: `${site.name} — Know where you stand`, description: site.description },
  alternates: { canonical: site.domain },
  // Mirrors robots.ts. Not indexable until compliance sign-off exists.
  robots: isLaunchReady()
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

/**
 * Person schema only. No Organization schema and no aggregateRating:
 * the site is not a company and there are no verified reviews to describe.
 */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: adviser.name,
  jobTitle: adviser.role,
  worksFor: { '@type': 'Organization', name: adviser.practice },
  address: {
    '@type': 'PostalAddress',
    addressLocality: adviser.city,
    addressRegion: adviser.province,
    addressCountry: 'ZA',
  },
  telephone: adviser.phoneE164,
  email: adviser.email,
  url: site.domain,
  sameAs: [adviser.links.sanlamProfile, adviser.links.linkedin],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${newsreader.variable} ${publicSans.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded focus:bg-[var(--color-ink)] focus:px-4 focus:py-2 focus:text-[var(--color-paper)]">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
