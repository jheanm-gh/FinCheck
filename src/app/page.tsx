import Link from 'next/link';
import { adviser, disclaimers } from '@/config/adviser';
import { PILLARS, QUESTIONS } from '@/lib/check';
import { CALCULATORS } from '@/lib/calculators';
import { HeroQuestion } from '@/components/HeroQuestion';

const CONCERNS = [
  { label: 'Protect my family', href: '/check' },
  { label: 'Protect my income', href: '/calculators/income-resilience' },
  { label: 'Pay off my bond or debt', href: '/check' },
  { label: 'Start investing', href: '/check' },
  { label: 'Save more', href: '/calculators/emergency-fund' },
  { label: 'Prepare for retirement', href: '/check' },
  { label: 'Plan for my children', href: '/check' },
  { label: 'Review cover I already have', href: '/calculators/life-cover-needs' },
  { label: 'Plan my estate', href: '/check' },
  { label: 'I am not sure where to start', href: '/check' },
];

const STEPS = [
  { t: 'Check where you are', d: 'Twelve questions, about ninety seconds, no figures required.' },
  { t: 'See what stands out', d: 'A plain-language picture of which areas look thin.' },
  { t: 'Talk it through', d: 'Bring the questions to Harika when you want a real answer.' },
];

export default function Home() {
  return (
    <>
      {/* Signature element: the page opens by asking, not describing. */}
      <section className="border-b bg-[var(--color-mist)]">
        <div className="wrap py-16 sm:py-24">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <h1>Your financial future deserves a plan.</h1>
              <p className="measure mt-6 text-lg text-[var(--color-bark)]">
                Understand where you stand, identify what needs attention, and take your
                next step with confidence.
              </p>
              <p className="measure mt-5">
                Climeo is a simple place to check your financial health and connect with{' '}
                {adviser.name} when you want personalised advice.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/check" className="btn btn-primary">Take the financial health check</Link>
                <Link href="/contact" className="btn btn-secondary">Talk to Harika</Link>
              </div>
            </div>

            <div className="surface p-6 sm:p-8">
              <p className="text-sm text-[var(--color-quill)]">
                Question 1 of {QUESTIONS.length} · start here
              </p>
              <HeroQuestion />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap py-20">
        <h2>How healthy are your finances?</h2>
        <p className="measure mt-4 text-lg text-[var(--color-bark)]">
          The check looks at four areas. It asks what you recognise about your own
          situation, not what you have saved.
        </p>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {(Object.keys(PILLARS) as (keyof typeof PILLARS)[]).map((k) => (
            <div key={k} className="border-t pt-5">
              <h3>{PILLARS[k].label}</h3>
              <p className="mt-2 text-[var(--color-bark)]">{PILLARS[k].blurb}</p>
            </div>
          ))}
        </div>
        <Link href="/check" className="btn btn-primary mt-10">Start my check-up</Link>
      </section>

      <section className="border-y bg-[var(--color-mist)]">
        <div className="wrap py-20">
          <h2>What matters to you?</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {CONCERNS.map((c) => (
              <li key={c.label}>
                <Link
                  href={c.href}
                  className="inline-flex rounded-full border px-5 py-2.5 text-sm transition-colors hover:border-[var(--color-ink)] hover:bg-[var(--color-paper)]"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap py-20">
        <h2>Tools worth using</h2>
        <p className="measure mt-4 text-[var(--color-bark)]">
          Each one shows its assumptions and gives an indicative figure, not a quote.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {CALCULATORS.map((c) => (
            <Link key={c.id} href={`/calculators/${c.id}`} className="surface block p-6 transition-colors hover:border-[var(--color-ink)]">
              <h3>{c.name}</h3>
              <p className="mt-2 text-sm text-[var(--color-bark)]">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Numbered because this genuinely is a sequence. */}
      <section className="border-y bg-[var(--color-mist)]">
        <div className="wrap py-20">
          <h2>How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.t}>
                <span className="font-[family-name:var(--font-display)] text-4xl text-[var(--color-band-2)]">
                  {i + 1}
                </span>
                <h3 className="mt-3">{s.t}</h3>
                <p className="mt-2 text-[var(--color-bark)]">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2>Why Harika</h2>
            <p className="measure mt-5 text-lg">
              {adviser.name} is a {adviser.role} at {adviser.practice} in {adviser.city}.
            </p>
            <p className="measure mt-4 text-[var(--color-bark)]">
              Advice on this site comes through her, under the licensing and oversight of
              her practice. Climeo itself is a place to get oriented before that
              conversation, not a substitute for it.
            </p>
            <Link href="/about" className="btn btn-secondary mt-7">More about Harika</Link>
          </div>

          <div className="surface p-7">
            <h3>Official profiles</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a href={adviser.links.sanlamProfile} className="font-medium underline" rel="noopener">
                  Harika on Sanlam
                </a>
                <p className="mt-1 text-[var(--color-quill)]">Her verified adviser profile.</p>
              </li>
              <li>
                <a href={adviser.links.conceptWealth} className="font-medium underline" rel="noopener">
                  Concept Wealth Hennopspark
                </a>
                <p className="mt-1 text-[var(--color-quill)]">The practice she works through.</p>
              </li>
              <li>
                <a href={adviser.links.linkedin} className="font-medium underline" rel="noopener">
                  Harika on LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="wrap py-20">
          <h2 className="text-[var(--color-paper)]">Know where you stand.</h2>
          <p className="measure mt-4 text-lg opacity-90">
            Twelve questions. No figures, no signup, no obligation.
          </p>
          <Link href="/check" className="btn btn-primary mt-8">Take the financial health check</Link>
          <p className="legal mt-10 max-w-2xl opacity-70">{disclaimers.check}</p>
        </div>
      </section>
    </>
  );
}
