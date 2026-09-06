import type { Product, ProductVariant } from "@/types";

/** Exact variant for a full set of axis choices, if one exists. */
export function findVariant(
  product: Product,
  selections: Record<string, string>,
): ProductVariant | undefined {
  return product.variants.find((variant) =>
    product.variantAxes.every(
      (axis) => variant.selections[axis.id] === selections[axis.id],
    ),
  );
}

/**
 * Opening choice for a product page: the cheapest variant a user can actually
 * buy, falling back to the cheapest overall when everything is sold out.
 */
export function defaultSelections(product: Product): Record<string, string> {
  const buyable = product.variants.filter((variant) => variant.inStock);
  const pool = buyable.length > 0 ? buyable : product.variants;

  const cheapest = pool.reduce((low, variant) =>
    variant.price < low.price ? variant : low,
  );

  return { ...cheapest.selections };
}

/**
 * Option ids that cannot be bought given the user's other choices — for
 * example a colour that only exists in a sold-out storage tier. Used to grey
 * options out rather than letting the user reach a dead end.
 */
export function unavailableOptions(
  product: Product,
  selections: Record<string, string>,
): Set<string> {
  const unavailable = new Set<string>();

  for (const axis of product.variantAxes) {
    for (const option of axis.options) {
      const candidate = { ...selections, [axis.id]: option.id };
      const variant = findVariant(product, candidate);
      if (!variant?.inStock) unavailable.add(option.id);
    }
  }

  return unavailable;
}

/** Human-readable summary of a selection, e.g. "256 GB · Deep Blue". */
export function describeSelections(
  product: Product,
  selections: Record<string, string>,
): string {
  return product.variantAxes
    .map(
      (axis) =>
        axis.options.find((option) => option.id === selections[axis.id])?.label,
    )
    .filter(Boolean)
    .join(" · ");
}
