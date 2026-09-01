import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CAMPAIGNS, getCampaign } from '@/content/campaigns';
import { getCalculator } from '@/lib/calculators';
import { CalculatorRunner } from '@/components/CalculatorRunner';
import { PILLARS } from '@/lib/check';
import { disclaimers } from '@/config/adviser';

export function generateStaticParams() {
  return CAMPAIGNS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCampaign(slug);
  if (!c) return { title: 'Not found' };
  return {
    title: c.headline,
    description: c.subhead,
    openGraph: { title: c.headline, description: c.subhead },
    // Campaign pages are ad destinations, not organic search targets.
    robots: { index: false, follow: true },
  };
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCampaign(slug);
  if (!c) notFound();

  const calc = getCalculator(c.calculatorId);

  return (
    <>
      <section className="border-b bg-[var(--color-mist)]">
        <div className="wrap py-16 sm:py-20">
          <p className="text-sm text-[var(--color-quill)]">{PILLARS[c.pillar].label}</p>
          <h1 className="mt-2">{c.headline}</h1>
          <p className="measure mt-5 text-lg text-[var(--color-bark)]">{c.subhead}</p>
          <ul className="measure mt-8 space-y-3">
            {c.points.map((p) => (
              <li key={p} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-band-3)]" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <p className="legal mt-8">For: {c.audience}</p>
        </div>
      </section>

      {calc && (
        <div className="wrap py-16">
          <h2>{calc.name}</h2>
          <p className="measure mt-3 text-[var(--color-bark)]">{calc.description}</p>
          <CalculatorRunner calcId={calc.id} campaign={c.slug} />
        </div>
      )}

      <section className="wrap pb-20">
        <p className="legal measure">{disclaimers.tool}</p>
        <Link href="/check" className="btn btn-secondary mt-8">Take the wider financial health check</Link>
      </section>
    </>
  );
}
