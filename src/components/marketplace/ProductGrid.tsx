"use client";

import { PackageSearch, SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ProductSummary } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ProductSummary[];
  isLoading: boolean;
  error: unknown;
  onRetry: () => void;
  /** True while a search or filter change is refetching an existing list. */
  isRefreshing?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  /** Set when the empty result is caused by filters the user can clear. */
  onClearFilters?: () => void;
}

/** Mirrors a real card so the layout does not shift when data arrives. */
function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card bg-surface shadow-card">
      <Skeleton className="aspect-square rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-3/4 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Owns every render state for the listing: skeletons, failure, no results and
 * the loaded grid. The page above it only supplies data.
 */
export function ProductGrid({
  products,
  isLoading,
  error,
  onRetry,
  isRefreshing = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  onClearFilters,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load products"
        description="The catalog didn't respond. Check your connection and try again."
        onRetry={onRetry}
        retrying={isRefreshing}
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={onClearFilters ? SearchX : PackageSearch}
        title="No products found"
        description="Nothing matches what you're looking for. Try a different search or category."
        action={
          onClearFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              Clear filters
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        aria-busy={isRefreshing}
        className={isRefreshing ? "opacity-60 transition-opacity" : undefined}
      >
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {hasMore && (
        <Button
          variant="outline"
          size="md"
          fullWidth
          loading={isLoadingMore}
          onClick={onLoadMore}
        >
          Load more
        </Button>
      )}
    </div>
  );
}
