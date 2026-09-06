/** Domain models for the 1Fi Marketplace. All money values are in whole rupees. */

export type CategoryId =
  | "all"
  | "mobiles"
  | "laptops"
  | "audio"
  | "wearables"
  | "appliances";

export interface Category {
  id: CategoryId;
  label: string;
}

/**
 * A dimension a product can vary along, e.g. Storage or Colour.
 * Variants reference option ids, so the UI can render any number of axes
 * without knowing what they mean.
 */
export interface VariantAxis {
  id: string;
  label: string;
  /** Rendered as colour dots when every option carries a `swatch`. */
  options: VariantOption[];
}

export interface VariantOption {
  id: string;
  label: string;
  /** Hex colour, present only on colour-like axes. */
  swatch?: string;
}

export interface ProductVariant {
  id: string;
  /** axisId -> optionId */
  selections: Record<string, string>;
  price: number;
  mrp: number;
  inStock: boolean;
  /** Index into `Product.images`, so a colour change swaps the hero image. */
  imageIndex: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Exclude<CategoryId, "all">;
  images: string[];
  rating: number;
  ratingCount: number;
  highlights: string[];
  specs: ProductSpec[];
  variantAxes: VariantAxis[];
  variants: ProductVariant[];
}

/** Trimmed shape returned by the listing endpoint. */
export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: Exclude<CategoryId, "all">;
  image: string;
  rating: number;
  ratingCount: number;
  /** Lowest variant price, used for the "from" label. */
  price: number;
  mrp: number;
  inStock: boolean;
  /**
   * Smallest monthly instalment available on the cheapest variant, computed
   * server-side so the client never reimplements the lending maths.
   * Null when no plan is eligible at this price.
   */
  emiFrom: number | null;
}
