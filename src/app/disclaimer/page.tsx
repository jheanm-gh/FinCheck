import type { Metadata } from 'next';
import { adviser, compliance, disclaimers, site } from '@/config/adviser';
import { complianceText } from '@/lib/compliance';

export const metadata: Metadata = { title: 'Disclaimer' };

export default function DisclaimerPage() {
  return (
    <div className="wrap max-w-3xl py-16 sm:py-20">
      <h1>Disclaimer</h1>

      <h2 className="mt-12">What this site is</h2>
      <p className="mt-4">
        {site.name} is the personal website of {adviser.name}, {adviser.role} at{' '}
        {adviser.practice}. It is not operated by, owned by, or endorsed by Sanlam, and it
        is not Sanlam&rsquo;s corporate website.
      </p>

      <h2 className="mt-12">The tools are not advice</h2>
      <p className="mt-4">{disclaimers.check}</p>
      <p className="mt-4">{disclaimers.tool}</p>
      <p className="mt-4">{disclaimers.noProduct}</p>

      <h2 className="mt-12">Licensing</h2>
      <p className="mt-4">
        Financial advice is provided by {adviser.name} through{' '}
        {complianceText(compliance.licensedEntity, 'LICENSED ENTITY')}, FSP{' '}
        {complianceText(compliance.fspNumber, 'FSP NUMBER')}.
      </p>
      <p className="mt-4">{compliance.sanlamEntityLine}</p>

      <h2 className="mt-12">No guarantees</h2>
      <p className="mt-4">
        Nothing here guarantees any outcome or return. Projections are arithmetic applied
        to figures you entered, and real results differ.
      </p>
    </div>
  );
}
