import { describe, it, expect } from 'vitest';
import { scoreCheck, bandFor, QUESTIONS, type Answer } from '../src/lib/check';
import { emergencyFund, lifeCoverNeeds, incomeResilience } from '../src/lib/calculators';
import { leadSchema, buildStoredLead, CONSENT_WORDING } from '../src/lib/leads';

const all = (a: Answer): Record<string, Answer> =>
  Object.fromEntries(QUESTIONS.map((q) => [q.id, a]));

describe('bands', () => {
  it('maps ratios to bands at the documented thresholds', () => {
    expect(bandFor(0)).toBe('attention');
    expect(bandFor(0.34)).toBe('attention');
    expect(bandFor(0.35)).toBe('developing');
    expect(bandFor(0.59)).toBe('developing');
    expect(bandFor(0.6)).toBe('ontrack');
    expect(bandFor(0.84)).toBe('ontrack');
    expect(bandFor(0.85)).toBe('strong');
    expect(bandFor(1)).toBe('strong');
  });
});

describe('scoreCheck', () => {
  it('scores an all-yes profile as a strong foundation with no review areas', () => {
    const r = scoreCheck(all('yes'));
    expect(r.overall).toBe('strong');
    expect(r.overallRatio).toBe(1);
    expect(r.reviewAreas).toHaveLength(0);
    expect(r.strengths).toHaveLength(4);
  });

  it('scores an all-no profile as needing attention', () => {
    const r = scoreCheck(all('no'));
    expect(r.overall).toBe('attention');
    expect(r.overallRatio).toBe(0);
    expect(r.reviewAreas).toHaveLength(3);
  });

  it('treats "unsure" as a gap, not as a neutral answer', () => {
    expect(scoreCheck(all('unsure')).overallRatio).toBe(scoreCheck(all('no')).overallRatio);
  });

  it('puts "partly" squarely between yes and no', () => {
    expect(scoreCheck(all('partly')).overallRatio).toBe(0.5);
  });

  it('surfaces the weakest pillar first in review areas', () => {
    const answers = { ...all('yes') };
    QUESTIONS.filter((q) => q.pillar === 'plan').forEach((q) => { answers[q.id] = 'no'; });
    const r = scoreCheck(answers);
    const plan = r.pillars.find((p) => p.pillar === 'plan')!;
    expect(plan.band).toBe('attention');
    expect(r.reviewAreas[0]).toBe(plan.followUps[0]);
  });

  it('ignores unanswered questions rather than counting them as zero', () => {
    const r = scoreCheck({ p1: 'yes' });
    expect(r.answered).toBe(1);
    expect(r.pillars.find((p) => p.pillar === 'protect')!.ratio).toBe(1);
  });
});

describe('emergency fund', () => {
  it('divides accessible savings by monthly essentials', () => {
    const r = emergencyFund.compute({ expenses: 20000, savings: 60000, stability: 'steady', dependants: 0 });
    expect(r.months).toBe(3);
    expect(r.targetMonths).toBe(3);
    expect(r.gap).toBe(0);
  });

  it('raises the target for irregular income and dependants', () => {
    const r = emergencyFund.compute({ expenses: 20000, savings: 0, stability: 'irregular', dependants: 4 });
    expect(r.targetMonths).toBe(8);
    expect(r.gap).toBe(160000);
  });

  it('caps the target at twelve months', () => {
    const r = emergencyFund.compute({ expenses: 1000, savings: 0, stability: 'irregular', dependants: 15 });
    expect(r.targetMonths).toBeLessThanOrEqual(12);
  });

  it('does not divide by zero when expenses are blank', () => {
    const r = emergencyFund.compute({ expenses: 0, savings: 5000, stability: 'steady', dependants: 0 });
    expect(r.months).toBe(0);
  });
});

describe('life cover needs', () => {
  it('nets existing cover and liquid assets off the total need', () => {
    const r = lifeCoverNeeds.compute({
      income: 500000, years: 10, bond: 1000000, otherDebt: 0,
      education: 0, existingCover: 2000000, liquidAssets: 0,
    });
    expect(r.need).toBe(6000000);
    expect(r.gap).toBe(4000000);
  });

  it('never reports a negative gap when cover exceeds need', () => {
    const r = lifeCoverNeeds.compute({
      income: 100000, years: 1, bond: 0, otherDebt: 0,
      education: 0, existingCover: 5000000, liquidAssets: 0,
    });
    expect(r.gap).toBe(0);
  });
});

describe('income resilience', () => {
  it('measures savings against the shortfall, not against total expenses', () => {
    const r = incomeResilience.compute({ expenses: 20000, savings: 60000, otherIncome: 10000 });
    expect(r.shortfall).toBe(10000);
    expect(r.months).toBe(6);
  });

  it('signals open-ended resilience when other income covers essentials', () => {
    const r = incomeResilience.compute({ expenses: 10000, savings: 5000, otherIncome: 12000 });
    expect(r.shortfall).toBe(0);
    expect(r.months).toBe(-1);
  });
});

describe('lead consent', () => {
  const base = { firstName: 'Thandi', email: 'thandi@example.com', contactConsent: true as const };

  it('rejects a submission without contact consent', () => {
    expect(leadSchema.safeParse({ ...base, contactConsent: false }).success).toBe(false);
  });

  it('defaults marketing consent to false when untouched', () => {
    const parsed = leadSchema.parse(base);
    expect(parsed.marketingConsent).toBe(false);
  });

  it('records marketing wording only when marketing consent was actually given', () => {
    const without = buildStoredLead(leadSchema.parse(base), 'a');
    expect(without.consent.marketingWording).toBeNull();
    expect(without.consent.marketingAgreedAt).toBeNull();

    const withIt = buildStoredLead(leadSchema.parse({ ...base, marketingConsent: true }), 'b');
    expect(withIt.consent.marketingWording).toBe(CONSENT_WORDING.marketing);
  });

  it('never persists the honeypot field', () => {
    const stored = buildStoredLead(leadSchema.parse({ ...base, website: '' }), 'c');
    expect('website' in stored).toBe(false);
  });

  it('rejects a bot that filled the honeypot', () => {
    expect(leadSchema.safeParse({ ...base, website: 'spam' }).success).toBe(false);
  });
});
