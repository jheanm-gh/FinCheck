/**
 * What the results page shows instead of routing straight to a contact form.
 *
 * Every line here explains a concept or names a consideration. Nothing recommends
 * an action, names a product or product category, quantifies a target, or implies
 * what the reader should do. The test applied to each sentence: would this be at
 * home in a general financial literacy article? If not, it is out.
 *
 * "Commonly asked" framing is deliberate — it describes what people tend to want to
 * understand, rather than instructing the reader.
 */

import type { PillarId } from '@/lib/check';

export interface PillarGuidance {
  /** What this area actually covers, in plain terms. */
  what: string;
  /** Why the area exists as a distinct thing to think about. */
  why: string;
  /** Concepts people often find they have not separated out. */
  distinctions: { term: string; meaning: string }[];
  /** Questions people commonly want answered about this area. */
  commonQuestions: string[];
}

export const PILLAR_GUIDANCE: Record<PillarId, PillarGuidance> = {
  protect: {
    what:
      'This area is about what happens to a household\'s income if the person earning ' +
      'it cannot work, temporarily or permanently.',
    why:
      'Most household budgets assume income continues. Where it stops, the commitments ' +
      'built on it — a bond, school fees, monthly debt repayments — generally do not ' +
      'stop with it. The gap between those two facts is what this area describes.',
    distinctions: [
      {
        term: 'Death cover and disability cover',
        meaning:
          'These address different events and are usually arranged separately. Holding ' +
          'one does not imply holding the other.',
      },
      {
        term: 'Lump sum and recurring income',
        meaning:
          'Some arrangements pay a single amount, others pay monthly. They behave very ' +
          'differently for a household that needs to replace a salary.',
      },
      {
        term: 'Employer benefits and personal arrangements',
        meaning:
          'Benefits attached to employment generally end when the employment does. ' +
          'Personal arrangements do not.',
      },
      {
        term: 'Beneficiary and estate',
        meaning:
          'Where a beneficiary is nominated, proceeds usually pass directly to that ' +
          'person. Where one is not, proceeds may fall into the estate and follow a ' +
          'different, slower path.',
      },
    ],
    commonQuestions: [
      'What would each existing arrangement pay, in what form, and to whom?',
      'What continues and what stops if employment ends?',
      'Which debts would need to be settled rather than continued?',
      'When was any of it last looked at, relative to when life last changed?',
    ],
  },

  prepare: {
    what:
      'This area is about how much financial shock a household can absorb before it ' +
      'has to borrow.',
    why:
      'Unexpected costs are not unusual events. A car, a geyser, a medical bill or a ' +
      'gap between jobs arrive for most households eventually. Whether they become a ' +
      'debt problem depends largely on what was already set aside.',
    distinctions: [
      {
        term: 'Accessible and invested',
        meaning:
          'Money reachable within days behaves differently from money that must be ' +
          'sold, or that carries a penalty for early access.',
      },
      {
        term: 'Essential and total spending',
        meaning:
          'Resilience is usually measured against what a household must spend, which ' +
          'is generally lower than what it does spend.',
      },
      {
        term: 'Income stability',
        meaning:
          'Salaried, commission-based and self-employed income carry different ' +
          'volatility, which changes how much buffer is being asked to do.',
      },
    ],
    commonQuestions: [
      'What does the household actually spend in a month on essentials alone?',
      'How much could be reached within a week without a penalty?',
      'How many months does that represent?',
      'What would currently be used if something unexpected arrived tomorrow?',
    ],
  },

  grow: {
    what:
      'This area is about money set aside for something further away than next year, ' +
      'and whether where it sits matches when it is needed.',
    why:
      'Money held for a long period and money held for a short period face different ' +
      'risks. Over long periods, inflation erodes purchasing power. Over short periods, ' +
      'volatility can mean the amount available is lower exactly when it is needed.',
    distinctions: [
      {
        term: 'Saving and investing',
        meaning:
          'Saving generally prioritises the amount staying intact. Investing accepts ' +
          'movement in exchange for the possibility of growth. Both are legitimate; ' +
          'they answer different questions.',
      },
      {
        term: 'Nominal and real returns',
        meaning:
          'A return figure before inflation and the same figure after inflation can ' +
          'describe very different outcomes over twenty years.',
      },
      {
        term: 'Time horizon',
        meaning:
          'How long until the money is needed is usually the single largest factor in ' +
          'what kind of home suits it.',
      },
      {
        term: 'Fees',
        meaning:
          'Costs compound in the same way returns do, in the opposite direction.',
      },
    ],
    commonQuestions: [
      'What is this money actually for, and when is it needed?',
      'What is it currently invested in?',
      'What is being paid in fees, expressed in rands rather than percentages?',
      'What happens to it if contributions stop for a year?',
    ],
  },

  plan: {
    what:
      'This area is about intentions that only take effect later, and whether they are ' +
      'written down anywhere that counts.',
    why:
      'Retirement, estates and beneficiary nominations share a characteristic: the ' +
      'consequences of not addressing them appear long after the moment they could ' +
      'have been addressed, and usually fall to someone else to deal with.',
    distinctions: [
      {
        term: 'A will and a beneficiary nomination',
        meaning:
          'These are separate instruments. A nomination on a policy or retirement fund ' +
          'commonly operates independently of what a will says.',
      },
      {
        term: 'Retirement capital and retirement income',
        meaning:
          'An accumulated amount and the monthly income it can sustain are different ' +
          'figures, and the relationship between them depends on assumptions.',
      },
      {
        term: 'Estate costs',
        meaning:
          'An estate typically carries administration costs and may carry duties, ' +
          'which reduce what ultimately passes on.',
      },
    ],
    commonQuestions: [
      'Does a current, valid will exist, and does anyone know where it is kept?',
      'Do beneficiary nominations still reflect what is intended?',
      'What monthly income is retirement expected to need, in today\'s money?',
      'What has been accumulated toward it, and under what assumptions?',
    ],
  },
};
