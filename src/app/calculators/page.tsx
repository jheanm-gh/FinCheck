import type { Metadata } from 'next';
import Link from 'next/link';
import { CALCULATORS } from '@/lib/calculators';
import { disclaimers } from '@/config/adviser';

export const metadata: Metadata = {
  title: 'Calculators',
  description: 'Indicative financial calculators with their assumptions shown in full.',
};

export default function CalculatorsPage() {
  return (
    <div className="wrap py-16 sm:py-20">
      <h1>Calculators</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">
        Each one shows exactly what it assumes. They give you a rough figure to think
        with, not a quote.
      </p>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CALCULATORS.map((c) => (
          <Link key={c.id} href={`/calculators/${c.id}`} className="surface block p-6 transition-colors hover:border-[var(--color-ink)]">
            <h2 className="text-xl">{c.name}</h2>
            <p className="mt-2 text-sm text-[var(--color-bark)]">{c.description}</p>
          </Link>
        ))}
      </div>
      <p className="legal measure mt-14">{disclaimers.tool}</p>
    </div>
  );
}
