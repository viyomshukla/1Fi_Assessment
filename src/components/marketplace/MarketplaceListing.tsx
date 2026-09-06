"use client";

import { useMemo, useState } from "react";
import { SearchField } from "@/components/ui/SearchField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProducts } from "@/hooks/useProducts";
import type { Category, CategoryId } from "@/types";
import { CategoryChips } from "./CategoryChips";
import { ProductGrid } from "./ProductGrid";

/**
 * The 1Fi Marketplace tab. Search and category live here as local state and
 * flow into `useProducts`, which owns fetching, caching and pagination.
 */
export function MarketplaceListing({ categories }: { categories: Category[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");

  // Debounced so typing does not fire a request per keystroke.
  const debouncedSearch = useDebouncedValue(search, 300);

  const {
    products,
    total,
    isLoading,
    isFetching,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useProducts({
    search: debouncedSearch || undefined,
    category,
  });

  const hasFilters = search.trim().length > 0 || category !== "all";

  const heading = useMemo(() => {
    if (isLoading || error) return "All products";
    return total === 1 ? "1 product" : `${total} products`;
  }, [isLoading, error, total]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
  };

  return (
    <div className="flex flex-col gap-4 px-5 pt-5">
      <SearchField
        value={search}
        onChange={setSearch}
        label="Search the marketplace"
        placeholder="Search products..."
      />

      <CategoryChips
        categories={categories}
        value={category}
        onChange={setCategory}
      />

      <SectionHeading className="pt-1">{heading}</SectionHeading>

      <ProductGrid
        products={products}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        isRefreshing={isFetching && !isLoading && !isFetchingNextPage}
        hasMore={Boolean(hasNextPage)}
        isLoadingMore={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        onClearFilters={hasFilters ? clearFilters : undefined}
      />
    </div>
  );
}
