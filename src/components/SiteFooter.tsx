import Link from 'next/link';
import { adviser, compliance, site } from '@/config/adviser';
import { complianceText, outstandingComplianceItems } from '@/lib/compliance';
import { SocialLinks } from './SocialLinks';

export function SiteFooter() {
  const outstanding = outstandingComplianceItems();

  return (
    <footer className="mt-24 border-t bg-[var(--color-mist)]">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg">{adviser.name}</p>
          <p className="text-sm text-[var(--color-quill)]">{adviser.role}</p>
          <p className="text-sm text-[var(--color-quill)]">{adviser.practice}</p>
          <p className="mt-3 text-sm">
            <a href={`tel:${adviser.phoneE164}`} className="hover:underline">{adviser.phoneDisplay}</a>
            <br />
            <a href={`mailto:${adviser.email}`} className="hover:underline">{adviser.email}</a>
          </p>
        </div>

        <nav aria-label="Site">
          <h2 className="mb-3 text-sm font-semibold">On this site</h2>
          <ul className="space-y-2 text-sm text-[var(--color-quill)]">
            <li><Link href="/check" className="hover:underline">Financial health check</Link></li>
            <li><Link href="/calculators" className="hover:underline">Calculators</Link></li>
            <li><Link href="/learn" className="hover:underline">Learn</Link></li>
            <li><Link href="/about" className="hover:underline">About Harika</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </nav>

        <nav aria-label="Official profiles">
          <h2 className="mb-3 text-sm font-semibold">Official profiles</h2>
          <ul className="space-y-2 text-sm text-[var(--color-quill)]">
            <li><a href={adviser.links.sanlamProfile} className="hover:underline" rel="noopener">Harika on Sanlam</a></li>
            <li><a href={adviser.links.conceptWealth} className="hover:underline" rel="noopener">Concept Wealth Hennopspark</a></li>
          </ul>
          <SocialLinks className="mt-5" />
        </nav>

        <nav aria-label="Legal">
          <h2 className="mb-3 text-sm font-semibold">Legal</h2>
          <ul className="space-y-2 text-sm text-[var(--color-quill)]">
            <li><Link href="/privacy" className="hover:underline">Privacy &amp; POPIA</Link></li>
            <li><Link href="/disclaimer" className="hover:underline">Disclaimer</Link></li>
          </ul>
        </nav>
      </div>

      <div className="wrap border-t py-8">
        <p className="legal measure">
          {site.name} is the personal website of {adviser.name}, {adviser.role} at{' '}
          {adviser.practice}. It is not operated by Sanlam and is not Sanlam&rsquo;s
          corporate website.
        </p>
        <p className="legal measure mt-3">
          {complianceText(compliance.licensedEntity, 'LICENSED ENTITY')} · FSP{' '}
          {complianceText(compliance.fspNumber, 'FSP NUMBER')}
        </p>
        <p className="legal measure mt-3">{compliance.sanlamEntityLine}</p>
        <p className="legal mt-6">© {new Date().getFullYear()} {adviser.name}</p>

        {outstanding.length > 0 && (
          <div className="mt-8 rounded border-2 border-dashed border-[var(--color-clay)] p-4">
            <p className="text-sm font-semibold text-[var(--color-clay)]">
              Not cleared for launch — {outstanding.length} compliance items outstanding
            </p>
            <ul className="mt-2 list-disc pl-5 text-sm text-[var(--color-clay)]">
              {outstanding.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
