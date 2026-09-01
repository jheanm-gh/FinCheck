import { describe, it, expect } from 'vitest';
import {
  monthlyRate, realRate, futureValue, requiredPayment, monthsToClear,
  retirementContribution, debtPayoff, savingsGoal, educationPlanning,
  investmentGrowth, netWorth, protectionGap,
} from '../src/lib/calculators-extra';
import { CALCULATORS } from '../src/lib/calculators';

describe('maths helpers', () => {
  it('compounds an annual rate monthly rather than dividing by twelve', () => {
    const r = monthlyRate(12);
    expect(Math.pow(1 + r, 12) - 1).toBeCloseTo(0.12, 10);
    expect(r).toBeLessThan(0.01); // naive 12/12 would be exactly 0.01
  });

  it('uses Fisher for real rates, not naive subtraction', () => {
    expect(realRate(10, 5)).toBeCloseTo(4.7619, 3);
    expect(realRate(10, 5)).not.toBeCloseTo(5, 3);
  });

  it('handles a zero rate without dividing by zero', () => {
    expect(futureValue(1000, 100, 0, 12)).toBe(2200);
    expect(requiredPayment(2200, 1000, 0, 12)).toBe(100);
  });

  it('round-trips future value and required payment', () => {
    const r = monthlyRate(9);
    const pmt = requiredPayment(500000, 50000, r, 120);
    expect(futureValue(50000, pmt, r, 120)).toBeCloseTo(500000, 2);
  });

  it('reports -1 when a repayment never clears the debt', () => {
    const r = monthlyRate(24);
    expect(monthsToClear(100000, r, 100)).toBe(-1);
    expect(monthsToClear(100000, r, 5000)).toBeGreaterThan(0);
  });

  it('clears a zero-interest debt by simple division', () => {
    expect(monthsToClear(12000, 0, 1000)).toBe(12);
  });
});

describe('retirement contributions', () => {
  it('uses a 4% drawdown to size the capital needed', () => {
    const r = retirementContribution.compute({
      age: 40, retireAge: 65, current: 0, monthly: 0, employer: 0,
      targetIncome: 20000, returnPct: 10, inflationPct: 5,
    });
    expect(r.needed).toBe(6000000); // 20000*12/0.04
    expect(r.projected).toBe(0);
    expect(r.gap).toBe(6000000);
  });

  it('needs no extra contribution once projection covers the need', () => {
    const r = retirementContribution.compute({
      age: 30, retireAge: 65, current: 5000000, monthly: 20000, employer: 20000,
      targetIncome: 5000, returnPct: 10, inflationPct: 5,
    });
    expect(r.gap).toBe(0);
    expect(r.extraNeeded).toBe(0);
  });

  it('does not project growth when already at retirement age', () => {
    const r = retirementContribution.compute({
      age: 65, retireAge: 65, current: 1000000, monthly: 5000, employer: 0,
      targetIncome: 10000, returnPct: 10, inflationPct: 5,
    });
    expect(r.projected).toBe(1000000);
  });
});

describe('debt payoff', () => {
  it('shows extra payments shortening the term and saving interest', () => {
    const r = debtPayoff.compute({ balance: 100000, ratePct: 18, payment: 3000, extra: 1000 });
    expect(r.monthsWithExtra).toBeLessThan(r.months as number);
    expect(r.interestSaved).toBeGreaterThan(0);
  });

  it('flags a repayment that never clears', () => {
    const r = debtPayoff.compute({ balance: 100000, ratePct: 20, payment: 500, extra: 0 });
    expect(r.months).toBe(-1);
    expect(r.interest).toBe(0);
  });
});

describe('education planning', () => {
  it('inflates each year of study to the year it is paid', () => {
    const one = educationPlanning.compute({
      childAge: 17, startAge: 18, yearsOfStudy: 1, costToday: 100000,
      eduInflationPct: 10, saved: 0, monthly: 0, returnPct: 0,
    });
    expect(one.futureCost).toBe(110000);

    const two = educationPlanning.compute({
      childAge: 17, startAge: 18, yearsOfStudy: 2, costToday: 100000,
      eduInflationPct: 10, saved: 0, monthly: 0, returnPct: 0,
    });
    expect(two.futureCost).toBe(231000); // 110000 + 121000, not 220000
  });
});

describe('investment growth', () => {
  it('separates contributions from growth', () => {
    const r = investmentGrowth.compute({
      initial: 10000, monthly: 1000, years: 10, returnPct: 10, inflationPct: 5,
    });
    expect(r.contributed).toBe(130000);
    expect(Number(r.growth)).toBe(Number(r.nominal) - 130000);
  });

  it('shows real value below nominal whenever inflation is positive', () => {
    const r = investmentGrowth.compute({
      initial: 100000, monthly: 0, years: 20, returnPct: 10, inflationPct: 5,
    });
    expect(Number(r.real)).toBeLessThan(Number(r.nominal));
  });

  it('leaves real equal to nominal when inflation is zero', () => {
    const r = investmentGrowth.compute({
      initial: 100000, monthly: 500, years: 10, returnPct: 8, inflationPct: 0,
    });
    expect(Number(r.real)).toBe(Number(r.nominal));
  });
});

describe('net worth', () => {
  it('excludes property and retirement from the liquid figure', () => {
    const r = netWorth.compute({
      property: 2000000, cash: 100000, investments: 200000, retirement: 500000,
      otherAssets: 100000, bond: 1200000, vehicleDebt: 100000, cards: 50000, loans: 0,
    });
    expect(r.assets).toBe(2900000);
    expect(r.liabilities).toBe(1350000);
    expect(r.net).toBe(1550000);
    expect(r.liquid).toBe(250000); // 100k + 200k - 50k
  });

  it('can report negative net worth rather than clamping at zero', () => {
    const r = netWorth.compute({
      property: 0, cash: 0, investments: 0, retirement: 0, otherAssets: 0,
      bond: 0, vehicleDebt: 0, cards: 80000, loans: 20000,
    });
    expect(r.net).toBe(-100000);
  });
});

describe('protection gap', () => {
  it('discounts future income need rather than multiplying it flat', () => {
    const r = protectionGap.compute({
      income: 40000, replacePct: 100, years: 20, debts: 0, finalCosts: 0,
      existingCover: 0, employerCover: 0, liquidAssets: 0, returnPct: 8, inflationPct: 5,
    });
    expect(Number(r.incomeCapital)).toBeLessThan(40000 * 12 * 20);
    expect(Number(r.incomeCapital)).toBeGreaterThan(0);
  });

  it('nets all cover sources off the need and never goes negative', () => {
    const r = protectionGap.compute({
      income: 10000, replacePct: 50, years: 1, debts: 0, finalCosts: 0,
      existingCover: 5000000, employerCover: 1000000, liquidAssets: 0,
      returnPct: 8, inflationPct: 5,
    });
    expect(r.gap).toBe(0);
  });
});

describe('calculator registry', () => {
  it('exposes all ten calculators with unique ids', () => {
    expect(CALCULATORS).toHaveLength(10);
    expect(new Set(CALCULATORS.map((c) => c.id)).size).toBe(10);
  });

  it('gives every calculator assumptions, outputs and a disclaimer-worthy shape', () => {
    for (const c of CALCULATORS) {
      expect(c.fields.length).toBeGreaterThan(0);
      expect(c.outputs.length).toBeGreaterThan(0);
      expect(c.assumptions.length).toBeGreaterThan(0);
      expect(c.leadIntent).toBeTruthy();
    }
  });

  it('produces finite numbers for every calculator at its defaults', () => {
    for (const c of CALCULATORS) {
      const defaults = Object.fromEntries(c.fields.map((f) => [f.id, f.default ?? 0]));
      const out = c.compute(defaults);
      for (const o of c.outputs) {
        const val = out[o.id];
        expect(Number.isFinite(Number(val)), `${c.id}.${o.id} was ${val}`).toBe(true);
      }
    }
  });
});
