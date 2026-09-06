"use client";

import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/services/marketplace.service";
import { queryKeys } from "./queryKeys";

/**
 * EMI ladder for a specific variant. Stays idle until a variant is chosen,
 * and each variant's quote is cached separately so switching back is instant.
 */
export function useEmiPlans(productId: string, variantId: string | null) {
  return useQuery({
    queryKey: queryKeys.emiPlans(productId, variantId ?? ""),
    queryFn: ({ signal }) =>
      marketplaceService.getEmiPlans(productId, variantId!, signal),
    enabled: Boolean(productId && variantId),
  });
}
