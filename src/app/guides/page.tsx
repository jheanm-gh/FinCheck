import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '@/content/guides';

export const metadata: Metadata = {
  title: 'Checklists',
  description: 'Question checklists to bring to a financial review.',
};

export default function GuidesPage() {
  return (
    <div className="wrap py-16 sm:py-20">
      <h1>Checklists</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">
        Each one is a list of questions, not instructions. Take them to whoever advises
        you, including Harika.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="surface block p-6 transition-colors hover:border-[var(--color-ink)]">
            <h2 className="text-xl">{g.title}</h2>
            <p className="mt-2 text-sm text-[var(--color-bark)]">{g.blurb}</p>
            <p className="legal mt-4">{g.contains}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
