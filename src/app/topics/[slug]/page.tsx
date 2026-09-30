import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TOPICS, getTopic } from '@/content/topics';
import { getCalculator } from '@/lib/calculators';
import { CalculatorRunner } from '@/components/CalculatorRunner';
import { PillarGuidance } from '@/components/PillarGuidance';
import { PILLARS } from '@/lib/check';
import { disclaimers } from '@/config/adviser';

export function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTopic(slug);
  if (!t) return { title: 'Not found' };
  return {
    title: t.headline,
    description: t.intro,
    openGraph: { title: t.headline, description: t.intro },
    // Indexable. These are information pages, not ad destinations.
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = getTopic(slug);
  if (!t) notFound();

  const calc = getCalculator(t.calculatorId);

  return (
    <>
      <section className="border-b bg-[var(--color-mist)]">
        <div className="wrap py-16 sm:py-20">
          <p className="text-sm text-[var(--color-quill)]">{PILLARS[t.pillar].label}</p>
          <h1 className="mt-2">{t.headline}</h1>
          <p className="measure mt-5 text-lg text-[var(--color-bark)]">{t.intro}</p>
          <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[var(--color-quill)]">
            What this page covers
          </h2>
          <ul className="measure mt-4 space-y-3">
            {t.answers.map((a) => (
              <li key={a} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-band-3)]" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="wrap max-w-3xl py-16">
        <PillarGuidance pillar={t.pillar} />
      </div>

      {calc && (
        <div className="wrap border-t py-16">
          <h2>Put your own figures against it</h2>
          <p className="measure mt-3 text-[var(--color-bark)]">{calc.description}</p>
          <CalculatorRunner calcId={calc.id} />
        </div>
      )}

      <section className="wrap border-t py-16">
        <h2>Keep reading</h2>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/check" className="btn btn-secondary">Financial health check</Link>
          <Link href="/learn" className="btn btn-secondary">Podcast</Link>
          <Link href="/guides" className="btn btn-secondary">Checklists</Link>
          <Link href="/topics" className="btn btn-secondary">All topics</Link>
        </div>
        <p className="legal measure mt-10">{disclaimers.tool}</p>
        <p className="legal measure mt-3">{disclaimers.noProduct}</p>
      </section>
    </>
  );
}
