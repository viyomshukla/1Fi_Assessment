import type { EmiPlan, EmiPlanConfig } from "@/types";

/**
 * Standard reducing-balance instalment:
 *
 *   EMI = P · r · (1 + r)^n / ((1 + r)^n − 1)
 *
 * where `r` is the monthly rate and `n` the tenure in months. A zero rate
 * degenerates to a straight-line split, which is also the no-cost case.
 */
export function calculateInstalment(
  principal: number,
  annualInterestRate: number,
  tenureMonths: number,
): number {
  if (principal <= 0) throw new RangeError("principal must be positive");
  if (tenureMonths <= 0) throw new RangeError("tenure must be positive");
  if (annualInterestRate < 0) throw new RangeError("rate must not be negative");

  if (annualInterestRate === 0) return principal / tenureMonths;

  const r = annualInterestRate / 12;
  const growth = Math.pow(1 + r, tenureMonths);
  return (principal * r * growth) / (growth - 1);
}

export function calculateProcessingFee(
  principal: number,
  config: Pick<EmiPlanConfig, "processingFeePct" | "processingFeeCap">,
): number {
  return Math.round(
    Math.min(principal * config.processingFeePct, config.processingFeeCap),
  );
}

export function isPlanEligible(
  config: EmiPlanConfig,
  principal: number,
): boolean {
  return principal >= config.minPrincipal;
}

/**
 * Prices a lender config against a principal. The borrower-facing instalment
 * is rounded to the rupee, so totals are derived from the rounded figure —
 * otherwise the summary would not add up to what the user was shown.
 */
export function priceEmiPlan(
  config: EmiPlanConfig,
  principal: number,
): EmiPlan {
  const effectiveRate = config.isNoCost ? 0 : config.annualInterestRate;
  const monthlyInstalment = Math.round(
    calculateInstalment(principal, effectiveRate, config.tenureMonths),
  );
  const processingFee = calculateProcessingFee(principal, config);
  const repaid = monthlyInstalment * config.tenureMonths;

  return {
    ...config,
    principal,
    monthlyInstalment,
    totalInterest: Math.max(0, repaid - principal),
    processingFee,
    totalPayable: repaid + processingFee,
    recommended: false,
  };
}

/**
 * Picks the plan to pre-select. A no-cost plan always wins because it is
 * strictly cheaper; among equals we take the longest tenure, which gives the
 * smallest monthly outgo. Otherwise we fall back to the cheapest overall.
 */
function pickRecommended(plans: EmiPlan[]): EmiPlan | undefined {
  const noCost = plans.filter((plan) => plan.isNoCost);
  const pool = noCost.length > 0 ? noCost : plans;

  return pool.reduce<EmiPlan | undefined>((best, plan) => {
    if (!best) return plan;
    if (plan.totalPayable !== best.totalPayable) {
      return plan.totalPayable < best.totalPayable ? plan : best;
    }
    return plan.tenureMonths > best.tenureMonths ? plan : best;
  }, undefined);
}

/** Prices every eligible config and flags one as recommended. */
export function buildEmiPlans(
  configs: EmiPlanConfig[],
  principal: number,
): EmiPlan[] {
  const plans = configs
    .filter((config) => isPlanEligible(config, principal))
    .map((config) => priceEmiPlan(config, principal))
    .sort((a, b) => a.tenureMonths - b.tenureMonths);

  const recommended = pickRecommended(plans);
  return plans.map((plan) =>
    plan.id === recommended?.id ? { ...plan, recommended: true } : plan,
  );
}

/** Lowest monthly instalment on offer, for the "EMI from ₹x/mo" label. */
export function lowestInstalment(plans: EmiPlan[]): number | null {
  if (plans.length === 0) return null;
  return Math.min(...plans.map((plan) => plan.monthlyInstalment));
}
