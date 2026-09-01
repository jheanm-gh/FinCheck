import type { Metadata } from 'next';
import Link from 'next/link';
import { SHOW, EPISODES, episodeUrl, CALCULATOR_FOR_PILLAR } from '@/content/podcast';
import { PILLARS } from '@/lib/check';
import { getCalculator } from '@/lib/calculators';
import { adviser } from '@/config/adviser';

export const metadata: Metadata = {
  title: 'Learn',
  description: `${SHOW.title} — ${SHOW.description} Hosted by ${adviser.name}.`,
};

const LANG_LABEL = { en: 'English', af: 'Afrikaans' } as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function LearnPage() {
  return (
    <div className="wrap py-16 sm:py-20">
      <p className="text-sm text-[var(--color-quill)]">Podcast</p>
      <h1 className="mt-2">{SHOW.title}</h1>
      <p className="measure mt-5 text-lg text-[var(--color-bark)]">{SHOW.description}</p>
      <p className="mt-4 text-sm text-[var(--color-quill)]">
        Hosted by {SHOW.host} · {SHOW.category} · {EPISODES.length} episodes shown
      </p>

      <a href={SHOW.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-8">
        Listen on Spotify
      </a>

      <ul className="mt-16 divide-y border-t">
        {EPISODES.map((ep) => {
          const calcId = ep.pillar ? CALCULATOR_FOR_PILLAR[ep.pillar] : null;
          const calc = calcId ? getCalculator(calcId) : null;
          return (
            <li key={ep.spotifyId} className="py-7">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-quill)]">
                  {ep.number}
                </span>
                <h2 className="text-xl">
                  <a href={episodeUrl(ep.spotifyId)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {ep.title}
                  </a>
                </h2>
              </div>
              <p className="mt-2 text-sm text-[var(--color-quill)]">
                {formatDate(ep.published)} · {ep.minutes} min · {LANG_LABEL[ep.language]}
                {ep.pillar && ` · ${PILLARS[ep.pillar].label}`}
              </p>
              {calc && (
                <p className="mt-3 text-sm">
                  Related tool:{' '}
                  <Link href={`/calculators/${calc.id}`} className="underline hover:text-[var(--color-clay)]">
                    {calc.name}
                  </Link>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <p className="legal measure mt-12">
        Episode titles, dates and durations come from the published Spotify feed. The
        podcast is general conversation, not financial advice.
      </p>

      <div className="mt-16 border-t pt-12">
        <h2>Where do you actually stand?</h2>
        <p className="measure mt-3 text-[var(--color-bark)]">
          Twelve questions, about ninety seconds, no figures required.
        </p>
        <Link href="/check" className="btn btn-primary mt-7">Take the financial health check</Link>
      </div>
    </div>
  );
}
