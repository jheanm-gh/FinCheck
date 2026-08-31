/**
 * The Financial Health Check.
 *
 * Design decisions worth knowing before editing:
 *
 * 1. QUALITATIVE, NOT NUMERIC. Sanlam's own Financial Check already asks for figures.
 *    Duplicating that would be worse and would collect household financial data we'd
 *    then have to secure and justify under POPIA. This asks 12 recognition questions
 *    instead — no rands, no ID numbers, no balances. Data minimisation by design.
 *
 * 2. NO FALSE PRECISION. Output is a band, not a score out of 100 (§11). Bands come
 *    from simple sufficiency counting, and the methodology is shown to the user.
 *
 * 3. NO PRODUCT MAPPING. Answers never map to a product recommendation (§37).
 *    They map to areas worth reviewing, phrased as questions to bring to an adviser.
 */

export type PillarId = 'protect' | 'prepare' | 'grow' | 'plan';

export const PILLARS: Record<PillarId, { label: string; blurb: string }> = {
  protect: { label: 'Protect', blurb: 'What happens to the people who depend on you if your income stops.' },
  prepare: { label: 'Prepare', blurb: 'How well you can absorb a shock without borrowing.' },
  grow:    { label: 'Grow',    blurb: 'Whether money you set aside is working toward something.' },
  plan:    { label: 'Plan',    blurb: 'Whether your longer-term intentions are written down anywhere.' },
};

export type Answer = 'yes' | 'partly' | 'no' | 'unsure';

export interface Question {
  id: string;
  pillar: PillarId;
  text: string;
  /** Shown under the question when the honest answer is "it depends". */
  help?: string;
  /** Plain-language prompt if this area looks thin. Never a product pitch. */
  followUp: string;
}

export const QUESTIONS: Question[] = [
  // Protect
  { id: 'p1', pillar: 'protect',
    text: 'If your income stopped tomorrow, would the people who depend on you be financially okay?',
    help: 'Think about who relies on your income, not just whether you have a policy somewhere.',
    followUp: 'What would actually happen to your household income if you could not work.' },
  { id: 'p2', pillar: 'protect',
    text: 'Do you know what your existing cover would actually pay out, and to whom?',
    followUp: 'What your current cover pays, when it pays, and who receives it.' },
  { id: 'p3', pillar: 'protect',
    text: 'Has your cover been reviewed since your last major life change?',
    help: 'A new child, a bond, a marriage, a divorce, a new job, a business.',
    followUp: 'Whether cover arranged years ago still matches your life now.' },

  // Prepare
  { id: 'r1', pillar: 'prepare',
    text: 'Could you cover an unexpected R20 000 expense without going into debt?',
    followUp: 'How you would handle an unexpected cost without borrowing.' },
  { id: 'r2', pillar: 'prepare',
    text: 'If your income stopped, could your household keep paying essentials for three months?',
    followUp: 'How many months your household could keep going on savings alone.' },
  { id: 'r3', pillar: 'prepare',
    text: 'Do you know roughly what your household spends in a month?',
    followUp: 'What your actual monthly essentials come to.' },

  // Grow
  { id: 'g1', pillar: 'grow',
    text: 'Are you putting money away each month toward something beyond next year?',
    followUp: 'Whether anything is being set aside regularly, and toward what.' },
  { id: 'g2', pillar: 'grow',
    text: 'Do you know what your savings and investments are actually invested in?',
    help: 'Cash in a bank account and a unit trust behave very differently over time.',
    followUp: 'What your money is invested in and whether that suits your timeframe.' },
  { id: 'g3', pillar: 'grow',
    text: 'Do you have a clear goal that your saving is for?',
    followUp: 'What you are saving toward, so the timeframe can be matched to it.' },

  // Plan
  { id: 'l1', pillar: 'plan',
    text: 'Do you have a valid, current will?',
    followUp: 'Whether you have a valid will and where it is kept.' },
  { id: 'l2', pillar: 'plan',
    text: 'Are the beneficiaries on your policies and retirement funds up to date?',
    help: 'Beneficiary nominations often override what a will says.',
    followUp: 'Whether your beneficiary nominations still say what you intend.' },
  { id: 'l3', pillar: 'plan',
    text: 'Do you have a rough sense of what you will need to retire on?',
    followUp: 'What retirement might realistically cost, and where you currently stand.' },
];

/** Sufficiency weight per answer. "Unsure" scores as low as "no": not knowing IS the gap. */
const WEIGHT: Record<Answer, number> = { yes: 1, partly: 0.5, no: 0, unsure: 0 };

export type BandId = 'attention' | 'developing' | 'ontrack' | 'strong';

export const BANDS: Record<BandId, { label: string; meaning: string }> = {
  attention:  { label: 'Needs attention',  meaning: 'Several basics are not in place yet. That is a common starting point, and it is fixable.' },
  developing: { label: 'Developing',       meaning: 'Some foundations are there and some gaps are open.' },
  ontrack:    { label: 'On track',         meaning: 'Most of the basics are covered. The value now is in reviewing detail.' },
  strong:     { label: 'Strong foundation',meaning: 'The fundamentals look well established. Worth a periodic review rather than a rebuild.' },
};

export function bandFor(ratio: number): BandId {
  if (ratio < 0.35) return 'attention';
  if (ratio < 0.6) return 'developing';
  if (ratio < 0.85) return 'ontrack';
  return 'strong';
}

export interface PillarResult {
  pillar: PillarId;
  ratio: number;
  band: BandId;
  followUps: string[];
}

export interface CheckResult {
  overall: BandId;
  overallRatio: number;
  pillars: PillarResult[];
  strengths: string[];
  reviewAreas: string[];
  answered: number;
  total: number;
}

export function scoreCheck(answers: Record<string, Answer>): CheckResult {
  const pillars = (Object.keys(PILLARS) as PillarId[]).map<PillarResult>((pid) => {
    const qs = QUESTIONS.filter((q) => q.pillar === pid);
    const scored = qs.filter((q) => answers[q.id] !== undefined);
    const sum = scored.reduce((acc, q) => acc + WEIGHT[answers[q.id]], 0);
    const ratio = scored.length ? sum / scored.length : 0;
    return {
      pillar: pid,
      ratio,
      band: bandFor(ratio),
      followUps: qs
        .filter((q) => {
          const a = answers[q.id];
          return a === 'no' || a === 'partly' || a === 'unsure';
        })
        .map((q) => q.followUp),
    };
  });

  const answered = QUESTIONS.filter((q) => answers[q.id] !== undefined).length;
  const overallRatio = pillars.length
    ? pillars.reduce((a, p) => a + p.ratio, 0) / pillars.length
    : 0;

  const strengths = pillars
    .filter((p) => p.ratio >= 0.85)
    .map((p) => `${PILLARS[p.pillar].label.toLowerCase()} looks well covered`);

  // Weakest pillars first — that is where a conversation is most useful.
  const reviewAreas = pillars
    .filter((p) => p.ratio < 0.85)
    .sort((a, b) => a.ratio - b.ratio)
    .flatMap((p) => p.followUps)
    .slice(0, 3);

  return {
    overall: bandFor(overallRatio),
    overallRatio,
    pillars,
    strengths,
    reviewAreas,
    answered,
    total: QUESTIONS.length,
  };
}
