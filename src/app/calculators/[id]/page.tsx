import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CALCULATORS, getCalculator } from '@/lib/calculators';
import { CalculatorRunner } from '@/components/CalculatorRunner';

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const calc = getCalculator(id);
  if (!calc) return { title: 'Calculator not found' };
  return { title: calc.name, description: calc.description };
}

export default async function CalculatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const calc = getCalculator(id);
  if (!calc) notFound();

  return (
    <div className="wrap py-16 sm:py-20">
      <h1>{calc.name}</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">{calc.description}</p>
      <CalculatorRunner calcId={calc.id} />
    </div>
  );
}
