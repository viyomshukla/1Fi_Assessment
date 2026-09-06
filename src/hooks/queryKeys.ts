import type { ListProductsParams } from "@/services/marketplace.service";

/**
 * Single source of truth for cache keys. Centralising them keeps invalidation
 * predictable and stops two hooks from disagreeing about a key's shape.
 */
export const queryKeys = {
  products: ["products"] as const,
  productList: (params: Pick<ListProductsParams, "search" | "category">) =>
    [...queryKeys.products, "list", params] as const,
  product: (id: string) => [...queryKeys.products, "detail", id] as const,
  emiPlans: (productId: string, variantId: string) =>
    [...queryKeys.products, "emi-plans", productId, variantId] as const,
};
