import type { EmiPlanConfig } from "@/types";

/**
 * Lender-side EMI configuration. These are terms, not amounts — every rupee
 * figure the user sees is computed from the cart principal by `src/lib/emi.ts`.
 *
 * Shorter tenures are brand-subsidised (no-cost) and only unlock above a
 * minimum principal, which is why a ₹25k pair of earbuds offers fewer plans
 * than a ₹1.7L laptop.
 */
export const EMI_PLAN_CONFIGS: EmiPlanConfig[] = [
  {
    id: "tenure-3",
    tenureMonths: 3,
    annualInterestRate: 0.12,
    processingFeePct: 0,
    processingFeeCap: 0,
    minPrincipal: 5_000,
    isNoCost: true,
    badge: "No cost",
  },
  {
    id: "tenure-6",
    tenureMonths: 6,
    annualInterestRate: 0.125,
    processingFeePct: 0,
    processingFeeCap: 0,
    minPrincipal: 10_000,
    isNoCost: true,
    badge: "No cost",
  },
  {
    id: "tenure-9",
    tenureMonths: 9,
    annualInterestRate: 0.129,
    processingFeePct: 0.004,
    processingFeeCap: 499,
    minPrincipal: 25_000,
    isNoCost: false,
  },
  {
    id: "tenure-12",
    tenureMonths: 12,
    annualInterestRate: 0.132,
    processingFeePct: 0.005,
    processingFeeCap: 749,
    minPrincipal: 30_000,
    isNoCost: false,
  },
  {
    id: "tenure-18",
    tenureMonths: 18,
    annualInterestRate: 0.138,
    processingFeePct: 0.005,
    processingFeeCap: 999,
    minPrincipal: 50_000,
    isNoCost: false,
  },
  {
    id: "tenure-24",
    tenureMonths: 24,
    annualInterestRate: 0.142,
    processingFeePct: 0.006,
    processingFeeCap: 1_499,
    minPrincipal: 75_000,
    isNoCost: false,
  },
];
