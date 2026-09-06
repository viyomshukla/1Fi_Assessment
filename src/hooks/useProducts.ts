"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplace.service";
import type { CategoryId } from "@/types";
import { queryKeys } from "./queryKeys";

interface UseProductsOptions {
  search?: string;
  category?: CategoryId;
}

/**
 * Paginated product listing. Returns a flattened `products` array so the grid
 * does not have to know pages exist.
 */
export function useProducts({ search, category }: UseProductsOptions) {
  const query = useInfiniteQuery({
    queryKey: queryKeys.productList({ search, category }),
    queryFn: ({ pageParam, signal }) =>
      marketplaceService.listProducts(
        { search, category, cursor: pageParam },
        signal,
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return {
    ...query,
    products: query.data?.pages.flatMap((page) => page.items) ?? [],
    total: query.data?.pages[0]?.total ?? 0,
  };
}
