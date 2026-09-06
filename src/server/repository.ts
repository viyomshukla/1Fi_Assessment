import { buildEmiPlans } from "@/lib/emi";
import type {
  CategoryId,
  EmiQuote,
  Paginated,
  Product,
  ProductSummary,
} from "@/types";
import { EMI_PLAN_CONFIGS } from "./data/emi-plans";
import { PRODUCTS } from "./data/products";

const DEFAULT_PAGE_SIZE = 6;

export interface ProductQuery {
  search?: string;
  category?: CategoryId;
  cursor?: string | null;
  limit?: number;
}

/**
 * Listing shape. Price comes from the cheapest variant, so a card can show
 * "from ₹99,900" without the client knowing anything about variants.
 */
function toSummary(product: Product): ProductSummary {
  const cheapest = product.variants.reduce((low, variant) =>
    variant.price < low.price ? variant : low,
  );

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    image: product.images[cheapest.imageIndex] ?? product.images[0],
    rating: product.rating,
    ratingCount: product.ratingCount,
    price: cheapest.price,
    mrp: cheapest.mrp,
    inStock: product.variants.some((variant) => variant.inStock),
  };
}

function matchesSearch(product: Product, search: string): boolean {
  const haystack =
    `${product.name} ${product.brand} ${product.category}`.toLowerCase();
  return search
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/** Cursor is just an encoded offset — enough to prove out pagination. */
function decodeCursor(cursor: string | null | undefined): number {
  if (!cursor) return 0;
  const offset = Number.parseInt(cursor, 10);
  return Number.isFinite(offset) && offset > 0 ? offset : 0;
}

export function findProducts({
  search,
  category,
  cursor,
  limit = DEFAULT_PAGE_SIZE,
}: ProductQuery): Paginated<ProductSummary> {
  const filtered = PRODUCTS.filter((product) => {
    if (category && category !== "all" && product.category !== category) {
      return false;
    }
    if (search && !matchesSearch(product, search)) return false;
    return true;
  });

  const offset = decodeCursor(cursor);
  const page = filtered.slice(offset, offset + limit);
  const nextOffset = offset + page.length;

  return {
    items: page.map(toSummary),
    nextCursor: nextOffset < filtered.length ? String(nextOffset) : null,
    total: filtered.length,
  };
}

export function findProductById(id: string): Product | null {
  return PRODUCTS.find((product) => product.id === id || product.slug === id) ?? null;
}

/**
 * Prices the EMI ladder for one variant. Plans are derived from the variant
 * price at request time rather than stored, so a price change cannot leave
 * stale instalment figures behind.
 */
export function quoteEmiPlans(
  productId: string,
  variantId: string,
): EmiQuote | null {
  const product = findProductById(productId);
  if (!product) return null;

  const variant = product.variants.find((entry) => entry.id === variantId);
  if (!variant) return null;

  return {
    productId: product.id,
    variantId: variant.id,
    principal: variant.price,
    plans: buildEmiPlans(EMI_PLAN_CONFIGS, variant.price),
  };
}
