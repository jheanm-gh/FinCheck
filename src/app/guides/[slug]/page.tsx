import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GUIDES, getGuide } from '@/content/guides';
import { GuideGate } from '@/components/GuideGate';

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  return g ? { title: g.title, description: g.blurb } : { title: 'Not found' };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  return (
    <div className="wrap max-w-2xl py-16 sm:py-20">
      <h1>{g.title}</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">{g.blurb}</p>
      <GuideGate guide={g} />
    </div>
  );
}
