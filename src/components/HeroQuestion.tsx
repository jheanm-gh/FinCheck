'use client';

import { useRouter } from 'next/navigation';
import { QUESTIONS, type Answer } from '@/lib/check';

const OPTIONS: { value: Answer; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'partly', label: 'Partly' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'Not sure' },
];

/** The first question, answerable from the homepage. Answering carries into the check. */
export function HeroQuestion() {
  const router = useRouter();
  const q = QUESTIONS[0];

  return (
    <fieldset className="mt-3">
      <legend className="font-[family-name:var(--font-display)] text-xl leading-snug sm:text-2xl">
        {q.text}
      </legend>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            onClick={() => router.push(`/check?a=${o.value}`)}
            className="min-h-12 rounded border bg-[var(--color-paper)] px-4 font-medium transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-mist)]"
          >
            {o.label}
          </button>
        ))}
      </div>
      <p className="legal mt-5">Nothing is saved until you choose to share it.</p>
    </fieldset>
  );
}
