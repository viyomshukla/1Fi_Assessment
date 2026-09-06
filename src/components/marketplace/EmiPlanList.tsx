"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { formatCurrency, formatPercent } from "@/lib/format";
import type { EmiPlan } from "@/types";

interface EmiPlanListProps {
  plans: EmiPlan[];
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
}

function PlanRowSkeleton() {
  return (
    <div className="flex items-center justify-between border-t border-hairline px-4 py-3.5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

/**
 * The EMI ladder, following the app's existing pattern: a collapsed summary
 * showing the cheapest instalment, expanding to one row per tenure.
 *
 * The live app's list is read-only; here each row is also a radio, because the
 * flow needs a chosen plan to carry into checkout.
 */
export function EmiPlanList({
  plans,
  selectedPlanId,
  onSelect,
  isLoading,
  error,
  onRetry,
}: EmiPlanListProps) {
  const [expanded, setExpanded] = useState(true);

  const startsAt =
    plans.length > 0
      ? Math.min(...plans.map((plan) => plan.monthlyInstalment))
      : null;

  return (
    <section className="overflow-hidden rounded-card bg-surface shadow-card">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 bg-canvas px-4 py-3.5"
      >
        <span className="text-[15px] font-medium text-ink-muted">
          {startsAt === null ? (
            "EMI plans"
          ) : (
            <>
              Starts at{" "}
              <span className="font-extrabold text-ink">
                {formatCurrency(startsAt)}/mo
              </span>
            </>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-[15px] font-bold text-brand">
          {expanded ? "Hide plans" : "Show plans"}
          <ChevronDown
            size={18}
            strokeWidth={2.6}
            className={cn("transition-transform", expanded && "rotate-180")}
          />
        </span>
      </button>

      {expanded && (
        <div role="radiogroup" aria-label="EMI plans">
          {isLoading &&
            Array.from({ length: 5 }, (_, index) => (
              <PlanRowSkeleton key={index} />
            ))}

          {!isLoading && Boolean(error) && (
            <ErrorState
              title="Couldn't load EMI plans"
              description="We couldn't price this item right now."
              onRetry={onRetry}
            />
          )}

          {!isLoading &&
            !error &&
            plans.map((plan) => {
              const selected = plan.id === selectedPlanId;

              return (
                <button
                  key={plan.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => onSelect(plan.id)}
                  className={cn(
                    "flex w-full items-center gap-3 border-t border-hairline px-4 py-3.5 text-left transition-colors",
                    selected && "bg-brand-tint",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "grid size-[18px] shrink-0 place-items-center rounded-full border-2",
                      selected ? "border-brand" : "border-hairline",
                    )}
                  >
                    {selected && (
                      <span className="size-2.5 rounded-full bg-brand" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-ink">
                    {plan.tenureMonths} months ·{" "}
                    {formatPercent(plan.annualInterestRate)} p.a.
                  </span>

                  <span className="shrink-0 text-[15px] font-extrabold text-ink">
                    {formatCurrency(plan.monthlyInstalment)}
                    <span className="font-medium text-ink-subtle"> /mo</span>
                  </span>
                </button>
              );
            })}
        </div>
      )}
    </section>
  );
}
