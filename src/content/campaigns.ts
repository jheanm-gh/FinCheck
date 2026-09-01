/**
 * Campaign landing pages (§25). One definition per campaign, one route.
 * Adding a campaign is an entry in this array — never a new hard-coded page.
 *
 * Headlines describe a situation and offer a tool. None of them promise an outcome,
 * name a product, or imply a recommendation (§37).
 */

import type { PillarId } from '@/lib/check';

export interface Campaign {
  slug: string;
  headline: string;
  subhead: string;
  /** Who this is for, in their words rather than a segment name. */
  audience: string;
  calculatorId: string;
  leadIntent: string;
  pillar: PillarId;
  /** Questions this campaign helps someone answer. Not claims. */
  points: string[];
}

export const CAMPAIGNS: Campaign[] = [
  {
    slug: 'life-cover',
    headline: 'Would your family be alright?',
    subhead: 'Work out the gap between what your household would need and what is already covered.',
    audience: 'People with a bond, dependants, or cover they arranged years ago and have not looked at since.',
    calculatorId: 'protection-gap',
    leadIntent: 'family_protection',
    pillar: 'protect',
    points: [
      'What your household would actually need if your income stopped permanently',
      'Whether employer cover is doing as much work as you assume',
      'What debt would have to be settled first',
    ],
  },
  {
    slug: 'income-protection',
    headline: 'The day the paycheck stops',
    subhead: 'How long your household could keep going if you could not work.',
    audience: 'Anyone whose household runs on one income, or on income that varies.',
    calculatorId: 'income-resilience',
    leadIntent: 'income_replacement',
    pillar: 'prepare',
    points: [
      'How many months your savings would actually cover',
      'What your real monthly shortfall would be',
      'Which commitments would not pause just because your income did',
    ],
  },
  {
    slug: 'retirement',
    headline: 'Are your contributions going where you think?',
    subhead: 'See your current retirement saving projected in today\'s money.',
    audience: 'People contributing steadily who have never checked where it lands.',
    calculatorId: 'retirement-contribution',
    leadIntent: 'retirement',
    pillar: 'plan',
    points: [
      'What your current contributions project to, after inflation',
      'What capital that income level actually requires',
      'What closing the gap would cost per month',
    ],
  },
  {
    slug: 'new-parents',
    headline: 'What changes when they arrive',
    subhead: 'A new dependant changes the arithmetic of everything you arranged before.',
    audience: 'New and expecting parents.',
    calculatorId: 'education-planning',
    leadIntent: 'providing_for_children',
    pillar: 'plan',
    points: [
      'What education is likely to cost by the time it starts',
      'Why beneficiary nominations matter more than a will here',
      'What cover arranged before children no longer covers',
    ],
  },
  {
    slug: 'financial-health',
    headline: 'Know where you stand',
    subhead: 'Twelve questions, ninety seconds, no figures required.',
    audience: 'Anyone who suspects they should have a plan and does not have one.',
    calculatorId: 'net-worth',
    leadIntent: 'not_sure',
    pillar: 'prepare',
    points: [
      'Which of the four areas looks thinnest',
      'What is already in reasonable shape',
      'The three things most worth asking about',
    ],
  },
  {
    slug: 'financial-security',
    headline: 'One unexpected expense away?',
    subhead: 'Find out how much cushion you actually have.',
    audience: 'People who cover the month but have nothing behind them.',
    calculatorId: 'emergency-fund',
    leadIntent: 'financial_resilience',
    pillar: 'prepare',
    points: [
      'How many months of essentials your savings cover',
      'What a sensible target looks like for your income stability',
      'What the gap is in rands',
    ],
  },
];

export const getCampaign = (slug: string) => CAMPAIGNS.find((c) => c.slug === slug);
