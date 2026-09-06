/** EMI domain models. Amounts are whole rupees. */

/** Lender-side configuration. Never contains amounts derived from a cart. */
export interface EmiPlanConfig {
  id: string;
  tenureMonths: number;
  /** Nominal annual rate as a fraction, e.g. 0.14 for 14% p.a. */
  annualInterestRate: number;
  processingFeePct: number;
  processingFeeCap: number;
  /** Plan is only offered when principal is at least this much. */
  minPrincipal: number;
  /** Interest is subsidised by the brand; borrower pays principal only. */
  isNoCost: boolean;
  badge?: string;
}

/** A config priced against a specific principal. This is what the UI renders. */
export interface EmiPlan extends EmiPlanConfig {
  principal: number;
  monthlyInstalment: number;
  totalInterest: number;
  processingFee: number;
  totalPayable: number;
  /** True for the plan we surface as the default selection. */
  recommended: boolean;
}

export interface EmiQuote {
  productId: string;
  variantId: string;
  principal: number;
  plans: EmiPlan[];
}
