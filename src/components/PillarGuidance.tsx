import Link from 'next/link';
import { PILLARS, type PillarId } from '@/lib/check';
import { PILLAR_GUIDANCE } from '@/content/pillar-guidance';
import { CALCULATOR_FOR_PILLAR, episodesForPillar, episodeUrl } from '@/content/podcast';
import { getCalculator } from '@/lib/calculators';

/**
 * Per-pillar explanation, shown for the areas that came up thin.
 *
 * This is the substance of the results page. Someone who reads it should leave
 * understanding the area better, whether or not they ever contact anyone.
 */
export function PillarGuidance({ pillar }: { pillar: PillarId }) {
  const g = PILLAR_GUIDANCE[pillar];
  const calc = getCalculator(CALCULATOR_FOR_PILLAR[pillar]);
  const episodes = episodesForPillar(pillar);

  return (
    <section className="border-t pt-10">
      <h3 className="text-2xl">{PILLARS[pillar].label}</h3>
      <p className="measure mt-4 text-lg">{g.what}</p>
      <p className="measure mt-4 text-[var(--color-bark)]">{g.why}</p>

      <h4 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--color-quill)]">
        Worth separating
      </h4>
      <dl className="measure mt-4 space-y-4">
        {g.distinctions.map((d) => (
          <div key={d.term}>
            <dt className="font-medium">{d.term}</dt>
            <dd className="mt-1 text-[var(--color-bark)]">{d.meaning}</dd>
          </div>
        ))}
      </dl>

      <h4 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--color-quill)]">
        Questions people commonly want answered
      </h4>
      <ul className="measure mt-4 space-y-2.5">
        {g.commonQuestions.map((q) => (
          <li key={q} className="flex gap-3">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-band-2)]" />
            <span>{q}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {calc && (
          <Link href={`/calculators/${calc.id}`} className="underline hover:text-[var(--color-clay)]">
            Work through the numbers: {calc.name}
          </Link>
        )}
        {episodes.slice(0, 1).map((ep) => (
          <a
            key={ep.spotifyId}
            href={episodeUrl(ep.spotifyId)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[var(--color-clay)]"
          >
            Listen: {ep.title} ({ep.minutes} min)
          </a>
        ))}
      </div>
    </section>
  );
}

