/**
 * Remaining calculators (§15.3–§15.10), built on the framework in calculators.ts.
 *
 * Financial maths is centralised in the helpers below rather than repeated per
 * calculator (§14). Every projection works in REAL terms — inflation is discounted
 * out — so a figure thirty years away is expressed in today's money. Nominal
 * projections make people feel far richer than they will be.
 */

import type { Calculator } from './calculators';

const n = (v: Record<string, number | string>, k: string): number => {
  const raw = v[k];
  const parsed = typeof raw === 'number' ? raw : parseFloat(String(raw ?? '0'));
  return Number.isFinite(parsed) ? parsed : 0;
};

/** Convert an annual rate to a monthly compounding rate. */
export const monthlyRate = (annualPct: number): number =>
  Math.pow(1 + annualPct / 100, 1 / 12) - 1;

/** Real (after-inflation) annual rate. Fisher, not naive subtraction. */
export const realRate = (nominalPct: number, inflationPct: number): number =>
  ((1 + nominalPct / 100) / (1 + inflationPct / 100) - 1) * 100;

/** Future value of a lump sum plus a recurring monthly contribution. */
export function futureValue(pv: number, pmt: number, r: number, months: number): number {
  if (months <= 0) return pv;
  if (Math.abs(r) < 1e-12) return pv + pmt * months;
  const growth = Math.pow(1 + r, months);
  return pv * growth + pmt * ((growth - 1) / r);
}

/** Monthly contribution needed to reach a target. */
export function requiredPayment(fv: number, pv: number, r: number, months: number): number {
  if (months <= 0) return 0;
  if (Math.abs(r) < 1e-12) return Math.max(0, (fv - pv) / months);
  const growth = Math.pow(1 + r, months);
  return Math.max(0, ((fv - pv * growth) * r) / (growth - 1));
}

/**
 * Months to clear a debt. Returns -1 when the payment never clears it, which
 * happens whenever the payment does not exceed the first month's interest.
 */
export function monthsToClear(balance: number, r: number, payment: number): number {
  if (balance <= 0) return 0;
  if (payment <= balance * r) return -1;
  if (Math.abs(r) < 1e-12) return Math.ceil(balance / payment);
  return Math.ceil(-Math.log(1 - (balance * r) / payment) / Math.log(1 + r));
}

export const retirementContribution: Calculator = {
  id: 'retirement-contribution',
  name: 'Retirement contributions',
  category: 'plan',
  description: 'Where your current contributions are heading, in today\'s money.',
  fields: [
    { id: 'age', label: 'Your age now', kind: 'number', min: 18, max: 80, default: 38 },
    { id: 'retireAge', label: 'Age you would like to retire', kind: 'number', min: 45, max: 85, default: 65 },
    { id: 'current', label: 'Retirement savings so far', kind: 'currency', min: 0, default: 750000 },
    { id: 'monthly', label: 'Your monthly contribution', kind: 'currency', min: 0, default: 4500 },
    { id: 'employer', label: 'Employer monthly contribution', kind: 'currency', min: 0, default: 3000 },
    { id: 'targetIncome', label: 'Monthly income you want in retirement', kind: 'currency', hint: 'In today\'s money.', min: 0, default: 25000 },
    { id: 'returnPct', label: 'Assumed return before inflation (%)', kind: 'number', min: 0, max: 20, step: 0.5, default: 10 },
    { id: 'inflationPct', label: 'Assumed inflation (%)', kind: 'number', min: 0, max: 15, step: 0.5, default: 5 },
  ],
  outputs: [
    { id: 'projected', label: 'Projected capital at retirement (today\'s money)', format: 'currency', emphasis: true },
    { id: 'needed', label: 'Capital needed for that income', format: 'currency' },
    { id: 'gap', label: 'Shortfall', format: 'currency' },
    { id: 'extraNeeded', label: 'Extra per month to close it', format: 'currency' },
  ],
  assumptions: [
    'Everything is shown in today\'s money, so figures stay comparable to what you earn now.',
    'Capital needed uses a 4% first-year drawdown, a common planning convention rather than a guarantee.',
    'Assumes contributions continue uninterrupted and are never withdrawn early.',
    'Ignores tax, fees, and Regulation 28 constraints, all of which change the answer.',
  ],
  leadIntent: 'retirement',
  compute: (v) => {
    const months = Math.max(0, (n(v, 'retireAge') - n(v, 'age')) * 12);
    const r = monthlyRate(realRate(n(v, 'returnPct'), n(v, 'inflationPct')));
    const projected = futureValue(n(v, 'current'), n(v, 'monthly') + n(v, 'employer'), r, months);
    const needed = (n(v, 'targetIncome') * 12) / 0.04;
    const gap = Math.max(0, needed - projected);
    return {
      projected: Math.round(projected),
      needed: Math.round(needed),
      gap: Math.round(gap),
      extraNeeded: Math.round(gap > 0 ? requiredPayment(gap, 0, r, months) : 0),
    };
  },
};

export const debtPayoff: Calculator = {
  id: 'debt-payoff',
  name: 'Debt payoff',
  category: 'prepare',
  description: 'How long a debt takes to clear, and what paying extra changes.',
  fields: [
    { id: 'balance', label: 'Outstanding balance', kind: 'currency', min: 0, default: 85000 },
    { id: 'ratePct', label: 'Interest rate (%)', kind: 'number', min: 0, max: 60, step: 0.25, default: 18 },
    { id: 'payment', label: 'Your monthly repayment', kind: 'currency', min: 0, default: 2500 },
    { id: 'extra', label: 'Extra you could add each month', kind: 'currency', min: 0, default: 500 },
  ],
  outputs: [
    { id: 'months', label: 'Time to clear at current repayment', format: 'months', emphasis: true },
    { id: 'interest', label: 'Interest paid over that time', format: 'currency' },
    { id: 'monthsWithExtra', label: 'Time to clear with the extra', format: 'months' },
    { id: 'interestSaved', label: 'Interest saved by paying extra', format: 'currency' },
  ],
  assumptions: [
    'Assumes a fixed rate and no further borrowing on the account.',
    'Assumes every repayment is made in full and on time.',
    'If your repayment is smaller than the monthly interest, the balance grows and the debt never clears.',
  ],
  leadIntent: 'covering_debts',
  compute: (v) => {
    const balance = n(v, 'balance');
    const r = monthlyRate(n(v, 'ratePct'));
    const pay = n(v, 'payment');
    const payPlus = pay + n(v, 'extra');

    const m1 = monthsToClear(balance, r, pay);
    const m2 = monthsToClear(balance, r, payPlus);
    const int1 = m1 > 0 ? m1 * pay - balance : -1;
    const int2 = m2 > 0 ? m2 * payPlus - balance : -1;

    return {
      months: m1,
      interest: int1 < 0 ? 0 : Math.round(int1),
      monthsWithExtra: m2,
      interestSaved: int1 > 0 && int2 > 0 ? Math.round(int1 - int2) : 0,
    };
  },
};

export const savingsGoal: Calculator = {
  id: 'savings-goal',
  name: 'Savings goal',
  category: 'grow',
  description: 'What it takes each month to reach a specific amount by a specific date.',
  fields: [
    { id: 'target', label: 'Amount you want', kind: 'currency', min: 0, default: 300000 },
    { id: 'current', label: 'Saved so far', kind: 'currency', min: 0, default: 40000 },
    { id: 'years', label: 'Years to get there', kind: 'number', min: 0, max: 50, step: 0.5, default: 5 },
    { id: 'monthly', label: 'What you are putting away now', kind: 'currency', min: 0, default: 2500 },
    { id: 'returnPct', label: 'Assumed return (%)', kind: 'number', min: 0, max: 20, step: 0.5, default: 8 },
  ],
  outputs: [
    { id: 'required', label: 'Needed each month to reach it', format: 'currency', emphasis: true },
    { id: 'projected', label: 'Where your current amount gets you', format: 'currency' },
    { id: 'shortfall', label: 'Shortfall at that rate', format: 'currency' },
  ],
  assumptions: [
    'Assumes a steady return, which no real investment delivers month to month.',
    'Shown before tax and fees.',
    'Shorter horizons should generally assume lower returns, because there is less time to recover from a bad year.',
  ],
  leadIntent: 'investments',
  compute: (v) => {
    const months = Math.round(n(v, 'years') * 12);
    const r = monthlyRate(n(v, 'returnPct'));
    const projected = futureValue(n(v, 'current'), n(v, 'monthly'), r, months);
    return {
      required: Math.round(requiredPayment(n(v, 'target'), n(v, 'current'), r, months)),
      projected: Math.round(projected),
      shortfall: Math.round(Math.max(0, n(v, 'target') - projected)),
    };
  },
};

export const educationPlanning: Calculator = {
  id: 'education-planning',
  name: 'Education planning',
  category: 'plan',
  description: 'What a education will likely cost by the time it starts, and the gap.',
  fields: [
    { id: 'childAge', label: 'Child\'s age now', kind: 'number', min: 0, max: 25, default: 4 },
    { id: 'startAge', label: 'Age the education starts', kind: 'number', min: 1, max: 30, default: 18 },
    { id: 'yearsOfStudy', label: 'Years of study', kind: 'number', min: 1, max: 10, default: 4 },
    { id: 'costToday', label: 'Cost per year today', kind: 'currency', min: 0, default: 85000 },
    { id: 'eduInflationPct', label: 'Education inflation (%)', kind: 'number', hint: 'Education has historically risen faster than general inflation.', min: 0, max: 20, step: 0.5, default: 9 },
    { id: 'saved', label: 'Saved for this already', kind: 'currency', min: 0, default: 60000 },
    { id: 'monthly', label: 'Saving each month toward it', kind: 'currency', min: 0, default: 1500 },
    { id: 'returnPct', label: 'Assumed return (%)', kind: 'number', min: 0, max: 20, step: 0.5, default: 9 },
  ],
  outputs: [
    { id: 'futureCost', label: 'Estimated total cost when it starts', format: 'currency', emphasis: true },
    { id: 'projected', label: 'What your saving will have grown to', format: 'currency' },
    { id: 'gap', label: 'Funding gap', format: 'currency' },
    { id: 'extraNeeded', label: 'Extra per month to close it', format: 'currency' },
  ],
  assumptions: [
    'Each year of study is inflated to the year it is actually paid, not all to the start date.',
    'Assumes fees only. Accommodation, books and transport are frequently a third again on top.',
    'Education inflation running ahead of general inflation is the single biggest driver here.',
  ],
  leadIntent: 'education_planning',
  compute: (v) => {
    const yearsToStart = Math.max(0, n(v, 'startAge') - n(v, 'childAge'));
    const g = n(v, 'eduInflationPct') / 100;
    const costToday = n(v, 'costToday');

    let futureCost = 0;
    for (let i = 0; i < Math.max(1, n(v, 'yearsOfStudy')); i++) {
      futureCost += costToday * Math.pow(1 + g, yearsToStart + i);
    }

    const months = Math.round(yearsToStart * 12);
    const r = monthlyRate(n(v, 'returnPct'));
    const projected = futureValue(n(v, 'saved'), n(v, 'monthly'), r, months);
    const gap = Math.max(0, futureCost - projected);

    return {
      futureCost: Math.round(futureCost),
      projected: Math.round(projected),
      gap: Math.round(gap),
      extraNeeded: Math.round(gap > 0 ? requiredPayment(gap, 0, r, months) : 0),
    };
  },
};

export const investmentGrowth: Calculator = {
  id: 'investment-growth',
  name: 'Investment growth',
  category: 'grow',
  description: 'How much of a final amount is your own money, and how much is growth.',
  fields: [
    { id: 'initial', label: 'Starting amount', kind: 'currency', min: 0, default: 50000 },
    { id: 'monthly', label: 'Added each month', kind: 'currency', min: 0, default: 2000 },
    { id: 'years', label: 'Years invested', kind: 'number', min: 0, max: 50, step: 0.5, default: 15 },
    { id: 'returnPct', label: 'Assumed return (%)', kind: 'number', min: 0, max: 20, step: 0.5, default: 10 },
    { id: 'inflationPct', label: 'Inflation (%)', kind: 'number', min: 0, max: 15, step: 0.5, default: 5 },
  ],
  outputs: [
    { id: 'nominal', label: 'Projected value', format: 'currency', emphasis: true },
    { id: 'real', label: 'What that is worth in today\'s money', format: 'currency', emphasis: true },
    { id: 'contributed', label: 'Your own money in', format: 'currency' },
    { id: 'growth', label: 'Growth on top', format: 'currency' },
  ],
  assumptions: [
    'Shows both the headline number and its real purchasing power, because the gap between them is the point.',
    'Assumes a constant return. Real markets are nothing like constant.',
    'Before tax and fees. Fees compound against you exactly as returns compound for you.',
  ],
  leadIntent: 'investments',
  compute: (v) => {
    const months = Math.round(n(v, 'years') * 12);
    const rNom = monthlyRate(n(v, 'returnPct'));
    const rReal = monthlyRate(realRate(n(v, 'returnPct'), n(v, 'inflationPct')));
    const nominal = futureValue(n(v, 'initial'), n(v, 'monthly'), rNom, months);
    const contributed = n(v, 'initial') + n(v, 'monthly') * months;
    return {
      nominal: Math.round(nominal),
      real: Math.round(futureValue(n(v, 'initial'), n(v, 'monthly'), rReal, months)),
      contributed: Math.round(contributed),
      growth: Math.round(Math.max(0, nominal - contributed)),
    };
  },
};

export const netWorth: Calculator = {
  id: 'net-worth',
  name: 'Net worth',
  category: 'prepare',
  description: 'What you own less what you owe, and how much of it you could actually reach.',
  fields: [
    { id: 'property', label: 'Property value', kind: 'currency', min: 0, default: 1800000 },
    { id: 'cash', label: 'Cash and savings', kind: 'currency', min: 0, default: 120000 },
    { id: 'investments', label: 'Investments', kind: 'currency', min: 0, default: 350000 },
    { id: 'retirement', label: 'Retirement savings', kind: 'currency', min: 0, default: 750000 },
    { id: 'otherAssets', label: 'Vehicles and other assets', kind: 'currency', min: 0, default: 280000 },
    { id: 'bond', label: 'Bond outstanding', kind: 'currency', min: 0, default: 1100000 },
    { id: 'vehicleDebt', label: 'Vehicle finance', kind: 'currency', min: 0, default: 190000 },
    { id: 'cards', label: 'Credit cards and store accounts', kind: 'currency', min: 0, default: 35000 },
    { id: 'loans', label: 'Personal loans', kind: 'currency', min: 0, default: 0 },
  ],
  outputs: [
    { id: 'assets', label: 'Total assets', format: 'currency' },
    { id: 'liabilities', label: 'Total liabilities', format: 'currency' },
    { id: 'net', label: 'Net worth', format: 'currency', emphasis: true },
    { id: 'liquid', label: 'Reachable within a month', format: 'currency', emphasis: true },
  ],
  assumptions: [
    'Liquid net worth excludes property and retirement savings, because neither is money you can reach this month.',
    'Retirement savings are counted at face value, before the tax due when you eventually draw them.',
    'Vehicles are usually worth less than owners think, and depreciate while the finance does not.',
  ],
  leadIntent: 'financial_resilience',
  compute: (v) => {
    const assets = n(v, 'property') + n(v, 'cash') + n(v, 'investments') + n(v, 'retirement') + n(v, 'otherAssets');
    const liabilities = n(v, 'bond') + n(v, 'vehicleDebt') + n(v, 'cards') + n(v, 'loans');
    const shortTermDebt = n(v, 'cards') + n(v, 'loans');
    return {
      assets: Math.round(assets),
      liabilities: Math.round(liabilities),
      net: Math.round(assets - liabilities),
      liquid: Math.round(n(v, 'cash') + n(v, 'investments') - shortTermDebt),
    };
  },
};

export const protectionGap: Calculator = {
  id: 'protection-gap',
  name: 'Protection gap',
  category: 'protect',
  description: 'Income replacement, debt and dependants set against what is already covered.',
  fields: [
    { id: 'income', label: 'Your monthly income after tax', kind: 'currency', min: 0, default: 42000 },
    { id: 'replacePct', label: 'Share of it the household still needs (%)', kind: 'number', hint: 'Rarely 100% — some costs go with you.', min: 0, max: 100, step: 5, default: 75 },
    { id: 'years', label: 'Years it would be needed', kind: 'number', min: 0, max: 40, default: 15 },
    { id: 'debts', label: 'All debt to be settled', kind: 'currency', min: 0, default: 1290000 },
    { id: 'finalCosts', label: 'Estate and funeral costs', kind: 'currency', min: 0, default: 120000 },
    { id: 'existingCover', label: 'Life cover in place', kind: 'currency', min: 0, default: 1500000 },
    { id: 'employerCover', label: 'Cover through your employer', kind: 'currency', min: 0, default: 900000 },
    { id: 'liquidAssets', label: 'Assets that could be used', kind: 'currency', min: 0, default: 200000 },
    { id: 'returnPct', label: 'Return on the payout (%)', kind: 'number', min: 0, max: 15, step: 0.5, default: 8 },
    { id: 'inflationPct', label: 'Inflation (%)', kind: 'number', min: 0, max: 15, step: 0.5, default: 5 },
  ],
  outputs: [
    { id: 'incomeCapital', label: 'Capital needed to produce that income', format: 'currency' },
    { id: 'totalNeed', label: 'Total need', format: 'currency' },
    { id: 'covered', label: 'Already covered', format: 'currency' },
    { id: 'gap', label: 'Protection gap', format: 'currency', emphasis: true },
  ],
  assumptions: [
    'Income need is discounted at a real rate, so it reflects a payout invested and drawn down, not cash under a mattress.',
    'Employer cover usually ends when the job does, so counting on it is a risk in itself.',
    'Ignores estate duty, executor fees and capital gains, all of which reduce what actually reaches your family.',
    'This estimates a shortfall. It does not recommend a product, an amount, or a provider.',
  ],
  leadIntent: 'family_protection',
  compute: (v) => {
    const monthlyNeed = n(v, 'income') * (n(v, 'replacePct') / 100);
    const months = Math.max(0, n(v, 'years') * 12);
    const r = monthlyRate(realRate(n(v, 'returnPct'), n(v, 'inflationPct')));

    // Present value of an annuity in real terms.
    const incomeCapital = Math.abs(r) < 1e-12
      ? monthlyNeed * months
      : monthlyNeed * ((1 - Math.pow(1 + r, -months)) / r);

    const totalNeed = incomeCapital + n(v, 'debts') + n(v, 'finalCosts');
    const covered = n(v, 'existingCover') + n(v, 'employerCover') + n(v, 'liquidAssets');

    return {
      incomeCapital: Math.round(incomeCapital),
      totalNeed: Math.round(totalNeed),
      covered: Math.round(covered),
      gap: Math.round(Math.max(0, totalNeed - covered)),
    };
  },
};

export const ADDITIONAL_CALCULATORS: Calculator[] = [
  retirementContribution, debtPayoff, savingsGoal, educationPlanning,
  investmentGrowth, netWorth, protectionGap,
];
