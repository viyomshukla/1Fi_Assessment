"use client";

import { Check, CircleCheckBig, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonStyles } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEmiPlans } from "@/hooks/useEmiPlans";
import { useProduct } from "@/hooks/useProduct";
import { formatCurrency, formatPercent } from "@/lib/format";
import { describeSelections } from "@/lib/variants";
import type { EmiPlan } from "@/types";

interface OrderReviewProps {
  slug: string;
  variantId: string | null;
  planId: string | null;
}

function SummaryRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <span
        className={
          emphasis
            ? "text-[15px] font-extrabold text-ink"
            : "text-[13.5px] font-medium text-ink-muted"
        }
      >
        {label}
      </span>
      <span
        className={
          emphasis
            ? "text-[17px] font-extrabold text-ink"
            : "text-[13.5px] font-semibold text-ink"
        }
      >
        {value}
      </span>
    </div>
  );
}

/** Repayment breakdown for the plan the user picked. */
function PlanBreakdown({ plan }: { plan: EmiPlan }) {
  const evenSchedule = plan.finalInstalment === plan.monthlyInstalment;

  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-extrabold text-ink">
          {plan.tenureMonths}-month plan
        </h2>
        {plan.isNoCost && <Badge tone="success">No cost EMI</Badge>}
      </div>

      <div className="mt-2 divide-y divide-hairline">
        <SummaryRow label="Item price" value={formatCurrency(plan.principal)} />
        <SummaryRow
          label="Interest rate"
          value={`${formatPercent(plan.annualInterestRate)} p.a.`}
        />
        <SummaryRow
          label="Monthly instalment"
          value={`${formatCurrency(plan.monthlyInstalment)} x ${plan.tenureMonths}`}
        />
        {!evenSchedule && (
          <SummaryRow
            label="Final instalment"
            value={formatCurrency(plan.finalInstalment)}
          />
        )}
        <SummaryRow
          label="Total interest"
          value={
            plan.totalInterest === 0
              ? "No interest"
              : formatCurrency(plan.totalInterest)
          }
        />
        <SummaryRow
          label="Processing fee"
          value={
            plan.processingFee === 0
              ? "No charges"
              : formatCurrency(plan.processingFee)
          }
        />
        <SummaryRow
          label="Total payable"
          value={formatCurrency(plan.totalPayable)}
          emphasis
        />
      </div>

      {!evenSchedule && (
        <p className="mt-3 text-[12px] leading-relaxed text-ink-subtle">
          The last instalment is adjusted so the schedule totals exactly{" "}
          {formatCurrency(plan.totalPayable)}.
        </p>
      )}
    </section>
  );
}

/**
 * Final step before purchase. Both the variant and the plan arrive from the
 * URL and are re-validated against the API, so a stale or hand-edited link
 * fails gracefully instead of rendering wrong numbers.
 */
export function OrderReview({ slug, variantId, planId }: OrderReviewProps) {
  const [placed, setPlaced] = useState(false);
  const [placing, setPlacing] = useState(false);

  const productQuery = useProduct(slug);
  const emiQuery = useEmiPlans(slug, variantId);

  const product = productQuery.data;
  const variant = product?.variants.find((entry) => entry.id === variantId);
  const plan = emiQuery.data?.plans.find((entry) => entry.id === planId);

  const isLoading = productQuery.isLoading || emiQuery.isLoading;
  const error = productQuery.error ?? emiQuery.error;

  if (isLoading) {
    return (
      <>
        <ScreenHeader title="Review your plan" />
        <div className="flex flex-col gap-4 p-5">
          <Skeleton className="h-28 w-full rounded-card" />
          <Skeleton className="h-72 w-full rounded-card" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <ScreenHeader title="Review your plan" />
        <ErrorState
          onRetry={() => {
            void productQuery.refetch();
            void emiQuery.refetch();
          }}
        />
      </>
    );
  }

  if (!product || !variant || !plan) {
    return (
      <>
        <ScreenHeader title="Review your plan" />
        <EmptyState
          icon={PackageSearch}
          title="This plan is no longer available"
          description="The item or EMI plan you selected could not be found. Please choose it again."
          action={
            <Link
              href={`/marketplace/${slug}`}
              className={buttonStyles({ variant: "outline", size: "sm" })}
            >
              Back to product
            </Link>
          }
        />
      </>
    );
  }

  if (placed) {
    return (
      <>
        <ScreenHeader title="Order confirmed" />
        <div className="flex flex-col items-center px-8 py-16 text-center">
          <span className="grid size-16 place-items-center rounded-full bg-success-soft">
            <CircleCheckBig
              size={30}
              strokeWidth={2.2}
              className="text-success"
            />
          </span>
          <h1 className="mt-5 text-[22px] font-extrabold text-ink">
            Order placed
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {product.name} is on its way. Your first instalment of{" "}
            {formatCurrency(plan.monthlyInstalment)} is due next month.
          </p>
          <Link
            href="/shop/marketplace"
            className={buttonStyles({ size: "lg", className: "mt-7" })}
          >
            Back to Marketplace
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Review your plan" />

      <div className="flex flex-col gap-4 px-5 pt-4 pb-32">
        <section className="flex gap-4 rounded-card bg-surface p-4 shadow-card">
          <div className="relative size-[72px] shrink-0 overflow-hidden rounded-tile bg-canvas">
            <Image
              src={product.images[variant.imageIndex] ?? product.images[0]}
              alt={product.name}
              fill
              sizes="72px"
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] leading-snug font-extrabold text-ink">
              {product.name}
            </p>
            <p className="mt-0.5 text-[12.5px] font-medium text-ink-muted">
              {describeSelections(product, variant.selections)}
            </p>
            <p className="mt-1.5 text-[15px] font-extrabold text-ink">
              {formatCurrency(variant.price)}
            </p>
          </div>
        </section>

        <PlanBreakdown plan={plan} />

        <p className="flex gap-2 px-1 text-[12px] leading-relaxed text-ink-subtle">
          <Check
            size={14}
            strokeWidth={2.8}
            className="mt-0.5 shrink-0 text-success"
          />
          Backed by your mutual funds. No credit score check, and your
          investments stay invested.
        </p>
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-hairline bg-surface px-5 pt-3 pb-5">
        <Button
          size="lg"
          fullWidth
          loading={placing}
          onClick={() => {
            setPlacing(true);
            // Stands in for a create-order request.
            setTimeout(() => {
              setPlacing(false);
              setPlaced(true);
            }, 700);
          }}
        >
          Confirm and pay {formatCurrency(plan.monthlyInstalment)}/mo
        </Button>
      </div>
    </>
  );
}
