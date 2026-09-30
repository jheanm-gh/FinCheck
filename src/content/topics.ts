/**
 * Topic pages.
 *
 * Formerly /campaign/* — rebuilt as information routes rather than ad destinations.
 *
 * What changed and why:
 *   - `audience` removed. Naming who to target is what made these read as marketing.
 *     People self-select by clicking the topic; the page does not profile them.
 *   - `leadIntent` removed. Pre-tagging a submission by product need before the person
 *     has typed anything is qualification, whatever the copy says.
 *   - No contact form on the page. The gate opens onto information.
 *   - No longer noindex. Ad destinations are hidden from search; information pages are
 *     not. Making these indexable is both better reach and evidence of what they are.
 *
 * `points` are now the questions the page helps answer, not selling points.
 */

import type { PillarId } from '@/lib/check';

export interface Topic {
  slug: string;
  /** The question someone arrives with, in their words. */
  headline: string;
  intro: string;
  /** What reading this page will help them understand. */
  answers: string[];
  calculatorId: string;
  pillar: PillarId;
}

export const TOPICS: Topic[] = [
  {
    slug: 'life-cover',
    headline: 'Would your family be alright?',
    intro:
      'Work out the gap between what your household would need and what is already covered.',
    answers: [
      'What your household would actually need if your income stopped permanently',
      'Whether employer cover is doing as much work as you assume',
      'What debt would have to be settled first',
    ],
    calculatorId: 'protection-gap',
    pillar: 'protect',
  },
  {
    slug: 'income-protection',
    headline: 'The day the paycheck stops',
    intro:
      'How long your household could keep going if you could not work.',
    answers: [
      'How many months your savings would actually cover',
      'What your real monthly shortfall would be',
      'Which commitments would not pause just because your income did',
    ],
    calculatorId: 'income-resilience',
    pillar: 'prepare',
  },
  {
    slug: 'retirement',
    headline: 'Are your contributions going where you think?',
    intro:
      'See your current retirement saving projected in today\'s money.',
    answers: [
      'What your current contributions project to, after inflation',
      'What capital that income level actually requires',
      'What closing the gap would cost per month',
    ],
    calculatorId: 'retirement-contribution',
    pillar: 'plan',
  },
  {
    slug: 'new-parents',
    headline: 'What changes when they arrive',
    intro:
      'A new dependant changes the arithmetic of everything you arranged before.',
    answers: [
      'What education is likely to cost by the time it starts',
      'Why beneficiary nominations matter more than a will here',
      'What cover arranged before children no longer covers',
    ],
    calculatorId: 'education-planning',
    pillar: 'plan',
  },
  {
    slug: 'financial-health',
    headline: 'Know where you stand',
    intro:
      'Twelve questions, ninety seconds, no figures required.',
    answers: [
      'Which of the four areas looks thinnest',
      'What is already in reasonable shape',
      'The three things most worth asking about',
    ],
    calculatorId: 'net-worth',
    pillar: 'prepare',
  },
  {
    slug: 'financial-security',
    headline: 'One unexpected expense away?',
    intro:
      'Find out how much cushion you actually have.',
    answers: [
      'How many months of essentials your savings cover',
      'What a sensible target looks like for your income stability',
      'What the gap is in rands',
    ],
    calculatorId: 'emergency-fund',
    pillar: 'prepare',
  },
];

export const getTopic = (slug: string) => TOPICS.find((t) => t.slug === slug);
