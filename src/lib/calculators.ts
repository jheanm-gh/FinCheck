/**
 * Reusable calculator framework (§14). One shape, one place for the maths.
 * Adding a calculator means adding a definition here — never a bespoke page.
 *
 * Deliberately NOT rebuilding Sanlam's retirement calculator (§48). These three
 * cover ground her existing Sanlam tools do not.
 */

export type FieldKind = 'currency' | 'number' | 'select';

export interface Field {
  id: string;
  label: string;
  kind: FieldKind;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  default?: number | string;
}

export interface Output {
  id: string;
  label: string;
  format: 'currency' | 'months' | 'text';
  emphasis?: boolean;
}

export interface Calculator {
  id: string;
  name: string;
  category: 'protect' | 'prepare' | 'grow' | 'plan';
  description: string;
  fields: Field[];
  outputs: Output[];
  assumptions: string[];
  leadIntent: string;
  compute: (v: Record<string, number | string>) => Record<string, number | string>;
}

const num = (v: Record<string, number | string>, k: string): number => {
  const raw = v[k];
  const n = typeof raw === 'number' ? raw : parseFloat(String(raw ?? '0'));
  return Number.isFinite(n) ? n : 0;
};

export const emergencyFund: Calculator = {
  id: 'emergency-fund',
  name: 'Emergency fund',
  category: 'prepare',
  description: 'How many months your household could keep going if income stopped.',
  fields: [
    { id: 'expenses', label: 'Monthly essential expenses', kind: 'currency', hint: 'Bond or rent, food, transport, school fees, debt repayments, insurance.', min: 0, default: 18000 },
    { id: 'savings', label: 'Money you could access within a week', kind: 'currency', hint: 'Cash and accessible savings. Exclude retirement savings.', min: 0, default: 25000 },
    { id: 'stability', label: 'How steady is your income?', kind: 'select', options: [
      { value: 'steady', label: 'Steady salary' },
      { value: 'variable', label: 'Varies month to month' },
      { value: 'irregular', label: 'Commission, contract or self-employed' },
    ], default: 'steady' },
    { id: 'dependants', label: 'People who depend on your income', kind: 'number', min: 0, max: 15, default: 2 },
  ],
  outputs: [
    { id: 'months', label: 'Months of cover you have now', format: 'months', emphasis: true },
    { id: 'targetMonths', label: 'Indicative target for your situation', format: 'months' },
    { id: 'gap', label: 'Gap to that target', format: 'currency' },
  ],
  assumptions: [
    'Assumes expenses stay flat and no new income arrives.',
    'Target rises with income variability and with dependants, because both make a shock harder to absorb.',
    'A widely used general guide is three to six months. This is a rule of thumb, not a rule.',
  ],
  leadIntent: 'financial_resilience',
  compute: (v) => {
    const expenses = num(v, 'expenses');
    const savings = num(v, 'savings');
    const dependants = num(v, 'dependants');
    const stability = String(v.stability ?? 'steady');

    const base = stability === 'irregular' ? 6 : stability === 'variable' ? 4.5 : 3;
    const targetMonths = Math.min(12, base + Math.min(dependants, 4) * 0.5);
    const months = expenses > 0 ? savings / expenses : 0;
    const gap = Math.max(0, targetMonths * expenses - savings);

    return {
      months: Math.round(months * 10) / 10,
      targetMonths: Math.round(targetMonths * 10) / 10,
      gap: Math.round(gap),
    };
  },
};

export const lifeCoverNeeds: Calculator = {
  id: 'life-cover-needs',
  name: 'Life cover needs',
  category: 'protect',
  description: 'A rough sense of the gap between what your household would need and what is already covered.',
  fields: [
    { id: 'income', label: 'Your annual income before tax', kind: 'currency', min: 0, default: 480000 },
    { id: 'years', label: 'Years of income to replace', kind: 'number', hint: 'Often until the youngest child is independent.', min: 0, max: 40, default: 10 },
    { id: 'bond', label: 'Outstanding bond', kind: 'currency', min: 0, default: 900000 },
    { id: 'otherDebt', label: 'Other debt', kind: 'currency', min: 0, default: 150000 },
    { id: 'education', label: 'Education still to fund', kind: 'currency', min: 0, default: 400000 },
    { id: 'existingCover', label: 'Existing life cover', kind: 'currency', min: 0, default: 1000000 },
    { id: 'liquidAssets', label: 'Assets that could be sold or accessed', kind: 'currency', hint: 'Exclude the home you live in.', min: 0, default: 200000 },
  ],
  outputs: [
    { id: 'need', label: 'Indicative total need', format: 'currency' },
    { id: 'covered', label: 'Already covered', format: 'currency' },
    { id: 'gap', label: 'Indicative gap', format: 'currency', emphasis: true },
  ],
  assumptions: [
    'Income replacement is counted in today\'s money and not adjusted for inflation or investment growth.',
    'Ignores tax, estate duty, executor fees and any employer benefits.',
    'A real needs analysis is considerably more detailed than this.',
  ],
  leadIntent: 'income_replacement',
  compute: (v) => {
    const need = num(v, 'income') * num(v, 'years')
      + num(v, 'bond') + num(v, 'otherDebt') + num(v, 'education');
    const covered = num(v, 'existingCover') + num(v, 'liquidAssets');
    return {
      need: Math.round(need),
      covered: Math.round(covered),
      gap: Math.round(Math.max(0, need - covered)),
    };
  },
};

export const incomeResilience: Calculator = {
  id: 'income-resilience',
  name: 'Income resilience',
  category: 'prepare',
  description: 'How long your household could meet its commitments if your income stopped.',
  fields: [
    { id: 'expenses', label: 'Monthly essential expenses', kind: 'currency', min: 0, default: 18000 },
    { id: 'savings', label: 'Accessible savings', kind: 'currency', min: 0, default: 25000 },
    { id: 'otherIncome', label: 'Other monthly income that would continue', kind: 'currency', hint: 'A partner\'s salary, rental income, a payout you already receive.', min: 0, default: 8000 },
  ],
  outputs: [
    { id: 'months', label: 'Indicative months of resilience', format: 'months', emphasis: true },
    { id: 'shortfall', label: 'Monthly shortfall to cover', format: 'currency' },
  ],
  assumptions: [
    'Assumes essential spending continues unchanged.',
    'Assumes no new borrowing and no income protection payout.',
    'Where other income already covers essentials, resilience is not time-limited in the same way.',
  ],
  leadIntent: 'income_replacement',
  compute: (v) => {
    const expenses = num(v, 'expenses');
    const savings = num(v, 'savings');
    const other = num(v, 'otherIncome');
    const shortfall = Math.max(0, expenses - other);
    const months = shortfall > 0 ? savings / shortfall : Infinity;
    return {
      months: Number.isFinite(months) ? Math.round(months * 10) / 10 : -1,
      shortfall: Math.round(shortfall),
    };
  },
};

import { ADDITIONAL_CALCULATORS } from './calculators-extra';

export const CALCULATORS: Calculator[] = [
  emergencyFund, lifeCoverNeeds, incomeResilience, ...ADDITIONAL_CALCULATORS,
];

export const getCalculator = (id: string): Calculator | undefined =>
  CALCULATORS.find((c) => c.id === id);

export function formatZAR(n: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency', currency: 'ZAR', maximumFractionDigits: 0,
  }).format(n);
}
