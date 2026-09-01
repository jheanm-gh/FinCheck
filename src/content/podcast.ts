/**
 * Education centre content.
 *
 * §21 asked for ten written articles. Harika already publishes a podcast, so
 * commissioning AI-written finance articles under her name would duplicate both her
 * own content and Sanlam's blog (§48), and would put unreviewed financial content
 * on a site advertising a licensed representative.
 *
 * So this section surfaces her real episodes instead.
 *
 * Titles, dates and durations are taken verbatim from the Spotify show page.
 * There are NO episode summaries here: writing descriptions of episodes nobody on
 * this project has listened to would be fabrication (§4).
 *
 * The `pillar` field is editorial categorisation inferred from titles, so it is
 * genuinely a guess and marked as such. Harika should correct these.
 */

import type { PillarId } from '@/lib/check';

export const SHOW = {
  title: 'Meer as net geld / More than just money.',
  host: 'Harika van der Merwe',
  /** Verbatim from the show page. */
  description:
    'Real conversations about money, motherhood, relationships, careers and building the life you want.',
  category: 'Business',
  rating: 5,
  ratingCount: 6,
  url: 'https://open.spotify.com/show/033OI8ClChie4avziJnMMY',
  artwork: 'https://i.scdn.co/image/ab6765630000ba8a84f32d526c24c6ac3e39a311',
} as const;

export interface Episode {
  number: number;
  title: string;
  spotifyId: string;
  published: string;
  minutes: number;
  language: 'en' | 'af';
  /** Editorial guess from the title alone. Needs Harika's confirmation. */
  pillar?: PillarId;
}

export const EPISODES: Episode[] = [
  { number: 21, title: 'We are back!!', spotifyId: '6CW8vMQMoDb1SV7fNvtB3u', published: '2026-08-25', minutes: 15, language: 'en' },
  { number: 20, title: 'Financial Friday', spotifyId: '0K9XQ6Nz4EUqHCBWovZo8T', published: '2026-08-07', minutes: 5, language: 'en', pillar: 'prepare' },
  { number: 19, title: 'The day the paycheck stops', spotifyId: '3ILE3X7K2FDQY1FOzXbx2y', published: '2026-08-06', minutes: 7, language: 'en', pillar: 'protect' },
  { number: 18, title: 'Ek het gedink ek het nog tyd', spotifyId: '3kT0r6wii6HkqqW3SMUJkK', published: '2026-08-06', minutes: 3, language: 'af', pillar: 'plan' },
  { number: 17, title: 'Belasting', spotifyId: '35txDWaZdfKE4CXtDifGyG', published: '2026-08-05', minutes: 4, language: 'af', pillar: 'plan' },
  { number: 16, title: 'The greatest gift you will ever leave', spotifyId: '5C01IPITiXOjzvBocIAeCU', published: '2026-08-05', minutes: 2, language: 'en', pillar: 'plan' },
  { number: 15, title: 'Slow down, live a little', spotifyId: '1CkVCqX1AZRRFpUOzuydkH', published: '2026-07-28', minutes: 8, language: 'en' },
  { number: 14, title: 'Ons almal figure dit nog uit', spotifyId: '0p0SBnSiIozK6kBHzah00K', published: '2026-07-28', minutes: 6, language: 'af' },
  { number: 13, title: 'A episode from the heart', spotifyId: '5vyp3MzRaRC3dEiQhlZehq', published: '2026-07-27', minutes: 12, language: 'en' },
  { number: 12, title: "Let's talk retirement", spotifyId: '0S17LIgxWqqxqeZCpSlpu4', published: '2026-07-21', minutes: 21, language: 'en', pillar: 'plan' },
  { number: 11, title: 'When tomorrow arrives before you are ready', spotifyId: '569pZ8z15tCD43ID4CAaFk', published: '2026-07-20', minutes: 23, language: 'en', pillar: 'protect' },
  { number: 10, title: 'My lewe te koop op Facebook Marketplace', spotifyId: '5P0VDXE8ue79aIAxhXPMG0', published: '2026-07-16', minutes: 20, language: 'af', pillar: 'prepare' },
];

export const episodeUrl = (id: string) => `https://open.spotify.com/episode/${id}`;

export const episodesForPillar = (p: PillarId) => EPISODES.filter((e) => e.pillar === p);

/** Calculator most relevant to an episode's pillar, for cross-linking (§21). */
export const CALCULATOR_FOR_PILLAR: Record<PillarId, string> = {
  protect: 'protection-gap',
  prepare: 'emergency-fund',
  grow: 'investment-growth',
  plan: 'retirement-contribution',
};
