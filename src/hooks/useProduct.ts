"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiClientError } from "@/lib/api-client";
import { marketplaceService } from "@/services/marketplace.service";
import { queryKeys } from "./queryKeys";

/** Full detail for one product. A 404 is final, so it is never retried. */
export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: ({ signal }) => marketplaceService.getProduct(id, signal),
    retry: (failureCount, error) =>
      error instanceof ApiClientError && error.status === 404
        ? false
        : failureCount < 1,
  });
}
