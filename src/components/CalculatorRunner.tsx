'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Calculator } from '@/lib/calculators';
import { formatZAR, getCalculator } from '@/lib/calculators';
import { disclaimers } from '@/config/adviser';
import { LeadForm } from './LeadForm';

function initialValues(calc: Calculator): Record<string, number | string> {
  return Object.fromEntries(calc.fields.map((f) => [f.id, f.default ?? (f.kind === 'select' ? '' : 0)]));
}

function renderOutput(format: string, value: number | string): string {
  if (format === 'currency') return formatZAR(Number(value));
  if (format === 'months') {
    const n = Number(value);
    if (n < 0) return 'Not time-limited';
    return `${n} ${n === 1 ? 'month' : 'months'}`;
  }
  return String(value);
}

/**
 * Takes an id, not the Calculator object: `compute` is a function and functions
 * cannot cross the server/client boundary. The registry is plain data, so the
 * client resolves it locally.
 */
export function CalculatorRunner({ calcId, campaign }: { calcId: string; campaign?: string }) {
  const calc = getCalculator(calcId)!;
  const [values, setValues] = useState(() => initialValues(calc));
  const results = useMemo(() => calc.compute(values), [calc, values]);

  const set = (id: string, v: string) =>
    setValues((prev) => ({ ...prev, [id]: v === '' ? '' : (isNaN(Number(v)) ? v : Number(v)) }));

  const field = 'mt-1.5 w-full rounded border bg-[var(--color-mist)] px-4 py-3 text-base';

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        {calc.fields.map((f) => (
          <div key={f.id}>
            <label htmlFor={f.id} className="text-sm font-medium">{f.label}</label>
            {f.kind === 'select' ? (
              <select id={f.id} className={field} value={String(values[f.id] ?? '')} onChange={(e) => set(f.id, e.target.value)}>
                {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input
                id={f.id}
                type="number"
                inputMode={f.kind === 'currency' ? 'decimal' : 'numeric'}
                min={f.min}
                max={f.max}
                step={f.step ?? 1}
                className={field}
                value={String(values[f.id] ?? '')}
                onChange={(e) => set(f.id, e.target.value)}
              />
            )}
            {f.hint && <p className="legal mt-1.5">{f.hint}</p>}
          </div>
        ))}
        <button type="button" onClick={() => setValues(initialValues(calc))} className="text-sm underline text-[var(--color-quill)] hover:text-[var(--color-ink)]">
          Reset to example figures
        </button>
      </form>

      <div>
        <div className="surface p-7" aria-live="polite">
          <h2 className="text-xl">Your result</h2>
          <dl className="mt-6 space-y-5">
            {calc.outputs.map((o) => (
              <div key={o.id} className={o.emphasis ? 'border-t pt-5 first:border-t-0 first:pt-0' : ''}>
                <dt className="text-sm text-[var(--color-quill)]">{o.label}</dt>
                <dd className={o.emphasis
                  ? 'font-[family-name:var(--font-display)] text-3xl sm:text-4xl'
                  : 'text-lg'}>
                  {renderOutput(o.format, results[o.id])}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <details className="surface mt-6 p-6">
          <summary className="cursor-pointer font-semibold">What this assumes</summary>
          <ul className="legal mt-4 list-disc space-y-2 pl-5">
            {calc.assumptions.map((a) => <li key={a}>{a}</li>)}
          </ul>
        </details>

        <p className="legal mt-6">{disclaimers.tool}</p>
        <p className="legal mt-3">{disclaimers.noProduct}</p>
      </div>

      <div className="lg:col-span-2">
        <div className="border-t pt-12">
          <h2>What this number does not know</h2>
          <p className="measure mt-3 text-[var(--color-bark)]">
            It has not seen your tax position, your existing policies, your employer
            benefits or anything about your health. Those change the answer materially.
            If the figure surprised you, that is worth a conversation.
          </p>
          <div className="mt-8"><LeadForm source={`calculator:${calc.id}`} campaign={campaign} intent={calc.leadIntent} /></div>
          <Link href="/check" className="btn btn-secondary mt-8">Take the wider financial health check</Link>
        </div>
      </div>
    </div>
  );
}
