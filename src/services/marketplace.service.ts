import { apiGet } from "@/lib/api-client";
import type {
  CategoryId,
  EmiQuote,
  Paginated,
  Product,
  ProductSummary,
} from "@/types";

export interface ListProductsParams {
  search?: string;
  category?: CategoryId;
  cursor?: string | null;
  limit?: number;
}

/**
 * One function per endpoint. Components and hooks call these instead of
 * `fetch`, so a change of transport never reaches the UI.
 */
export const marketplaceService = {
  listProducts(
    { search, category, cursor, limit }: ListProductsParams,
    signal?: AbortSignal,
  ) {
    return apiGet<Paginated<ProductSummary>>(
      "/api/products",
      { search, category, cursor, limit },
      signal,
    );
  },

  getProduct(id: string, signal?: AbortSignal) {
    return apiGet<Product>(`/api/products/${encodeURIComponent(id)}`, {}, signal);
  },

  getEmiPlans(productId: string, variantId: string, signal?: AbortSignal) {
    return apiGet<EmiQuote>(
      `/api/products/${encodeURIComponent(productId)}/emi-plans`,
      { variantId },
      signal,
    );
  },
};
