'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  QUESTIONS, PILLARS, BANDS, scoreCheck, type Answer, type CheckResult,
} from '@/lib/check';
import { adviser, disclaimers } from '@/config/adviser';
import { LeadForm } from './LeadForm';

const OPTIONS: { value: Answer; label: string }[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'partly', label: 'Partly' },
  { value: 'no', label: 'No' },
  { value: 'unsure', label: 'Not sure' },
];

const BAND_FILL: Record<string, string> = {
  attention: 'var(--color-band-1)',
  developing: 'var(--color-band-2)',
  ontrack: 'var(--color-band-3)',
  strong: 'var(--color-band-4)',
};

function PillarBand({ label, ratio, band }: { label: string; ratio: number; band: string }) {
  return (
    <div className="py-4">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h3 className="text-lg">{label}</h3>
        <span className="text-sm text-[var(--color-quill)]">{BANDS[band as keyof typeof BANDS].label}</span>
      </div>
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-line)]"
        role="img"
        aria-label={`${label}: ${BANDS[band as keyof typeof BANDS].label}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${Math.max(ratio * 100, 4)}%`, background: BAND_FILL[band] }}
        />
      </div>
    </div>
  );
}

function Results({ result, onRestart }: { result: CheckResult; onRestart: () => void }) {
  return (
    <div>
      <p className="text-sm text-[var(--color-quill)]">Your financial health snapshot</p>
      <h1 className="mt-2">{BANDS[result.overall].label}</h1>
      <p className="measure mt-4 text-lg">{BANDS[result.overall].meaning}</p>

      <section className="surface mt-10 divide-y px-6 py-2">
        {result.pillars.map((p) => (
          <PillarBand key={p.pillar} label={PILLARS[p.pillar].label} ratio={p.ratio} band={p.band} />
        ))}
      </section>

      {result.strengths.length > 0 && (
        <section className="mt-12">
          <h2>What&rsquo;s going well</h2>
          <ul className="measure mt-4 list-disc space-y-2 pl-5">
            {result.strengths.map((s) => <li key={s}>Your {s}.</li>)}
          </ul>
        </section>
      )}

      {result.reviewAreas.length > 0 && (
        <section className="mt-12">
          <h2>Worth looking at next</h2>
          <p className="measure mt-3 text-[var(--color-bark)]">
            These are questions to bring to a conversation, not instructions.
          </p>
          <ol className="measure mt-5 space-y-4">
            {result.reviewAreas.map((a, i) => (
              <li key={a} className="flex gap-4">
                <span className="shrink-0 font-[family-name:var(--font-display)] text-2xl text-[var(--color-quill)]">
                  {i + 1}
                </span>
                <span className="pt-1">{a}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <details className="surface mt-12 p-6">
        <summary className="cursor-pointer font-semibold">How this was worked out</summary>
        <p className="measure legal mt-4">
          Each of the {result.total} questions counts as covered, half covered, or not
          covered. &ldquo;Not sure&rdquo; counts the same as &ldquo;no&rdquo;, because not
          knowing is itself the thing worth addressing. Each pillar is the average of its
          questions, and the overall band is the average of the four pillars. There is no
          weighting and no industry benchmark behind it.
        </p>
        <p className="measure legal mt-3">{disclaimers.check}</p>
      </details>

      <section className="mt-16 border-t pt-12">
        <h2>Want to talk through this?</h2>
        <p className="measure mt-3">
          {adviser.name} can look at your situation properly. Send your details and she
          will get back to you.
        </p>
        <div className="mt-8"><LeadForm checkBand={result.overall} source="check-result" /></div>
      </section>

      <div className="mt-12 flex flex-wrap gap-4">
        <button onClick={onRestart} className="btn btn-secondary">Start the check again</button>
        <Link href="/calculators" className="btn btn-secondary">Try a calculator</Link>
      </div>
    </div>
  );
}

export function CheckFlow({ initialAnswer }: { initialAnswer?: Answer }) {
  const [answers, setAnswers] = useState<Record<string, Answer>>(
    initialAnswer ? { [QUESTIONS[0].id]: initialAnswer } : {},
  );
  const [index, setIndex] = useState(initialAnswer ? 1 : 0);
  const [done, setDone] = useState(false);

  const result = useMemo(() => scoreCheck(answers), [answers]);
  const question = QUESTIONS[index];
  const progress = Math.round((index / QUESTIONS.length) * 100);

  function answer(value: Answer) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (index + 1 >= QUESTIONS.length) setDone(true);
    else setIndex(index + 1);
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setDone(false);
  }

  if (done) return <Results result={result} onRestart={restart} />;

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-line)]">
          <div
            className="h-full rounded-full bg-[var(--color-band-3)] transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="shrink-0 text-sm text-[var(--color-quill)]" aria-live="polite">
          {index + 1} of {QUESTIONS.length}
        </p>
      </div>

      <p className="mt-10 text-sm text-[var(--color-quill)]">
        {PILLARS[question.pillar].label}
      </p>

      <fieldset className="mt-3">
        <legend className="font-[family-name:var(--font-display)] text-2xl leading-tight sm:text-3xl">
          {question.text}
        </legend>
        {question.help && (
          <p className="measure mt-4 text-[var(--color-bark)]">{question.help}</p>
        )}

        <div className="mt-8 grid gap-3 sm:max-w-md">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => answer(o.value)}
              className="surface flex min-h-14 items-center px-5 text-left font-medium transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-paper)]"
            >
              {o.label}
            </button>
          ))}
        </div>
      </fieldset>

      {index > 0 && (
        <button
          onClick={() => setIndex(index - 1)}
          className="mt-8 text-sm text-[var(--color-quill)] underline hover:text-[var(--color-ink)]"
        >
          Back
        </button>
      )}

      <p className="legal measure mt-12">
        No figures, no ID number, nothing about your accounts. Your answers stay in your
        browser and are not sent anywhere unless you choose to share your results.
      </p>
    </div>
  );
}
