"use client";

import { ArrowRight, PackageSearch } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { useEmiPlans } from "@/hooks/useEmiPlans";
import { useProduct } from "@/hooks/useProduct";
import { ApiClientError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";
import {
  defaultSelections,
  findVariant,
  unavailableOptions,
} from "@/lib/variants";
import { EmiPlanList } from "./EmiPlanList";
import { HighlightsCard, SpecsCard } from "./ProductDetailsCard";
import { PriceBlock } from "./PriceBlock";
import { RatingPill } from "./RatingPill";
import { VariantSelector } from "./VariantSelector";

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <Skeleton className="aspect-square w-full rounded-card" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-8 w-2/5" />
      <Skeleton className="h-24 w-full rounded-card" />
      <Skeleton className="h-48 w-full rounded-card" />
    </div>
  );
}

export function ProductDetail({ slug }: { slug: string }) {
  const router = useRouter();
  const productQuery = useProduct(slug);
  const product = productQuery.data;

  /**
   * Both selections are derived, not synchronised. State holds only what the
   * user actively chose; the fallback is computed each render. That way a
   * variant change cannot leave a plan selected that is no longer offered, and
   * no effect is needed to repair state after the fact.
   */
  const [chosenOptions, setChosenOptions] = useState<Record<
    string,
    string
  > | null>(null);
  const [chosenPlanId, setChosenPlanId] = useState<string | null>(null);

  const selections = useMemo(
    () => chosenOptions ?? (product ? defaultSelections(product) : null),
    [chosenOptions, product],
  );

  const variant = useMemo(
    () => (product && selections ? findVariant(product, selections) : undefined),
    [product, selections],
  );

  const emiQuery = useEmiPlans(slug, variant?.id ?? null);
  const plans = useMemo(() => emiQuery.data?.plans ?? [], [emiQuery.data]);

  const selectedPlan =
    plans.find((plan) => plan.id === chosenPlanId) ??
    plans.find((plan) => plan.recommended) ??
    plans[0] ??
    null;

  if (productQuery.isLoading) return <DetailSkeleton />;

  if (productQuery.error instanceof ApiClientError && productQuery.error.status === 404) {
    return (
      <>
        <ScreenHeader title="Product" />
        <EmptyState
          icon={PackageSearch}
          title="Product not found"
          description="This item is no longer listed on the 1Fi Marketplace."
          action={
            <Button variant="outline" size="sm" onClick={() => router.push("/shop/marketplace")}>
              Back to Marketplace
            </Button>
          }
        />
      </>
    );
  }

  if (productQuery.error || !product || !selections) {
    return (
      <>
        <ScreenHeader title="Product" />
        <ErrorState
          onRetry={productQuery.refetch}
          retrying={productQuery.isFetching}
        />
      </>
    );
  }


  const image = product.images[variant?.imageIndex ?? 0] ?? product.images[0];
  const soldOut = !variant?.inStock;

  const proceed = () => {
    if (!variant || !selectedPlan) return;
    router.push(
      `/marketplace/${product.slug}/review?variant=${encodeURIComponent(variant.id)}&plan=${encodeURIComponent(selectedPlan.id)}`,
    );
  };

  return (
    <>
      <ScreenHeader title={product.name} />

      <div className="flex flex-col gap-4 px-5 pt-4 pb-44">
        <div className="relative aspect-square overflow-hidden rounded-card bg-surface shadow-card">
          <Image
            src={image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 440px) 100vw, 400px"
            className="object-contain p-6"
          />
          {soldOut && (
            <span className="absolute top-4 left-4">
              <Badge tone="danger">Out of stock</Badge>
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-bold tracking-[0.05em] text-ink-subtle uppercase">
              {product.brand}
            </span>
            <RatingPill rating={product.rating} count={product.ratingCount} />
          </div>
          <h1 className="mt-1 text-[22px] leading-tight font-extrabold text-ink">
            {product.name}
          </h1>
          {variant && (
            <PriceBlock
              price={variant.price}
              mrp={variant.mrp}
              size="lg"
              className="mt-2"
            />
          )}
        </div>

        <VariantSelector
          axes={product.variantAxes}
          selections={selections}
          unavailable={unavailableOptions(product, selections)}
          onChange={(axisId, optionId) =>
            setChosenOptions({ ...selections, [axisId]: optionId })
          }
        />

        <EmiPlanList
          plans={plans}
          selectedPlanId={selectedPlan?.id ?? null}
          onSelect={setChosenPlanId}
          isLoading={emiQuery.isLoading}
          error={emiQuery.error}
          onRetry={emiQuery.refetch}
        />

        <HighlightsCard highlights={product.highlights} />
        <SpecsCard specs={product.specs} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[440px] -translate-x-1/2 border-t border-hairline bg-surface px-5 pt-3 pb-5">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            {selectedPlan ? (
              <>
                <p className="truncate text-[12px] font-semibold text-ink-muted">
                  {selectedPlan.tenureMonths} months
                  {selectedPlan.isNoCost ? " · No cost EMI" : ""}
                </p>
                <p className="text-[19px] leading-tight font-extrabold text-ink">
                  {formatCurrency(selectedPlan.monthlyInstalment)}
                  <span className="text-[13px] font-medium text-ink-subtle">
                    {" "}
                    /mo
                  </span>
                </p>
              </>
            ) : (
              <p className="text-[13px] font-semibold text-ink-muted">
                {soldOut ? "Currently unavailable" : "Choose an EMI plan"}
              </p>
            )}
          </div>

          <Button
            size="lg"
            onClick={proceed}
            disabled={soldOut || !selectedPlan}
            className="shrink-0"
          >
            Continue
            <ArrowRight size={17} strokeWidth={2.6} />
          </Button>
        </div>
      </div>
    </>
  );
}
