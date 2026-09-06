import type { EmiPlanConfig } from "@/types";

/**
 * Lender-side EMI configuration, mirroring the tenure and rate ladder the 1Fi
 * app offers today: 0% p.a. up to 18 months, then a rate that steps up with
 * tenure, out to 60 months.
 *
 * These are terms, not amounts. Every rupee figure the user sees is computed
 * from the selected variant's price by `src/lib/emi.ts` at request time.
 *
 * Two assumptions, since the live app does not surface them:
 *  - `minPrincipal` gates long tenures on cheap items, so a pair of earbuds is
 *    not offered a 60-month plan.
 *  - Processing fees apply only to interest-bearing tenures, keeping the
 *    "no charges" promise on the 0% plans intact.
 */
export const EMI_PLAN_CONFIGS: EmiPlanConfig[] = [
  {
    id: "tenure-3",
    tenureMonths: 3,
    annualInterestRate: 0,
    processingFeePct: 0,
    processingFeeCap: 0,
    minPrincipal: 2_000,
    isNoCost: true,
    badge: "No cost",
  },
  {
    id: "tenure-6",
    tenureMonths: 6,
    annualInterestRate: 0,
    processingFeePct: 0,
    processingFeeCap: 0,
    minPrincipal: 2_000,
    isNoCost: true,
    badge: "No cost",
  },
  {
    id: "tenure-9",
    tenureMonths: 9,
    annualInterestRate: 0,
    processingFeePct: 0,
    processingFeeCap: 0,
    minPrincipal: 5_000,
    isNoCost: true,
    badge: "No cost",
  },
  {
    id: "tenure-12",
    tenureMonths: 12,
    annualInterestRate: 0,
    processingFeePct: 0,
    processingFeeCap: 0,
    minPrincipal: 5_000,
    isNoCost: true,
    badge: "No cost",
  },
  {
    id: "tenure-18",
    tenureMonths: 18,
    annualInterestRate: 0,
    processingFeePct: 0,
    processingFeeCap: 0,
    minPrincipal: 10_000,
    isNoCost: true,
    badge: "No cost",
  },
  {
    id: "tenure-24",
    tenureMonths: 24,
    annualInterestRate: 0.0449,
    processingFeePct: 0.005,
    processingFeeCap: 999,
    minPrincipal: 15_000,
    isNoCost: false,
  },
  {
    id: "tenure-36",
    tenureMonths: 36,
    annualInterestRate: 0.0649,
    processingFeePct: 0.005,
    processingFeeCap: 1_499,
    minPrincipal: 25_000,
    isNoCost: false,
  },
  {
    id: "tenure-48",
    tenureMonths: 48,
    annualInterestRate: 0.0749,
    processingFeePct: 0.006,
    processingFeeCap: 1_999,
    minPrincipal: 40_000,
    isNoCost: false,
  },
  {
    id: "tenure-60",
    tenureMonths: 60,
    annualInterestRate: 0.0799,
    processingFeePct: 0.006,
    processingFeeCap: 2_499,
    minPrincipal: 50_000,
    isNoCost: false,
  },
];
