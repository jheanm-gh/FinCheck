import type { Metadata } from 'next';
import { CheckFlow } from '@/components/CheckFlow';
import type { Answer } from '@/lib/check';

export const metadata: Metadata = {
  title: 'Financial health check',
  description:
    'Twelve plain-language questions about where your finances stand. No figures, no signup, about ninety seconds.',
};

const VALID: Answer[] = ['yes', 'partly', 'no', 'unsure'];

export default async function CheckPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string }>;
}) {
  const { a } = await searchParams;
  const initial = VALID.includes(a as Answer) ? (a as Answer) : undefined;

  return (
    <div className="wrap max-w-3xl py-16 sm:py-20">
      <CheckFlow initialAnswer={initial} />
    </div>
  );
}
