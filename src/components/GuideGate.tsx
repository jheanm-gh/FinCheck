'use client';

import { useState } from 'react';
import type { Guide } from '@/content/guides';
import { LeadForm } from './LeadForm';

/**
 * Progressive profiling (§13): the guide is shown in full after the form, in the
 * browser, with a print option. No PDF pipeline and no file to email.
 *
 * The gate states plainly what is behind it before asking for anything.
 */
export function GuideGate({ guide }: { guide: Guide }) {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return (
      <div className="mt-10">
        <div className="surface p-6 sm:p-8">
          <h2 className="text-xl">What you get</h2>
          <p className="mt-3">{guide.contains}, covering:</p>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[var(--color-bark)]">
            {guide.sections.map((s) => <li key={s.heading}>{s.heading}</li>)}
          </ul>
          <p className="legal mt-5">
            Questions to bring to a review. Nothing here tells you what to do with your
            money.
          </p>
        </div>

        <div className="mt-8">
          <LeadForm source={`guide:${guide.slug}`} intent={guide.leadIntent} onSuccess={() => setUnlocked(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <p className="text-sm text-[var(--color-quill)]">{guide.contains}</p>
        <button onClick={() => window.print()} className="btn btn-secondary">Print or save as PDF</button>
      </div>

      {guide.sections.map((s) => (
        <section key={s.heading} className="mt-10">
          <h2 className="text-xl">{s.heading}</h2>
          <ul className="mt-4 space-y-3">
            {s.questions.map((q) => (
              <li key={q} className="flex gap-3">
                <span aria-hidden className="mt-1.5 h-4 w-4 shrink-0 rounded-sm border" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
