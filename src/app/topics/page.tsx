import type { Metadata } from 'next';
import Link from 'next/link';
import { TOPICS } from '@/content/topics';
import { PILLARS } from '@/lib/check';

export const metadata: Metadata = {
  title: 'Topics',
  description: 'Plain-language background on the areas people most often want to understand.',
};

export default function TopicsPage() {
  return (
    <div className="wrap py-16 sm:py-20">
      <h1>Topics</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">
        Start wherever your question is. Each page explains the area, then lets you put
        your own figures against it.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <Link key={t.slug} href={`/topics/${t.slug}`} className="surface block p-6 transition-colors hover:border-[var(--color-ink)]">
            <p className="text-sm text-[var(--color-quill)]">{PILLARS[t.pillar].label}</p>
            <h2 className="mt-1 text-xl">{t.headline}</h2>
            <p className="mt-2 text-sm text-[var(--color-bark)]">{t.intro}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
