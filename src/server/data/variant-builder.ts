import type { ProductVariant, VariantAxis } from "@/types";

interface VariantPricing {
  price: number;
  mrp: number;
  inStock?: boolean;
  imageIndex?: number;
}

/**
 * Expands the cartesian product of every axis and prices each combination via
 * `price`. Catalog entries stay declarative: a product with three storage tiers
 * and three colours describes nine variants without listing them by hand.
 */
export function buildVariants(
  axes: VariantAxis[],
  price: (selections: Record<string, string>) => VariantPricing,
): ProductVariant[] {
  const combinations = axes.reduce<Record<string, string>[]>(
    (acc, axis) =>
      acc.flatMap((partial) =>
        axis.options.map((option) => ({ ...partial, [axis.id]: option.id })),
      ),
    [{}],
  );

  return combinations.map((selections) => {
    const pricing = price(selections);
    return {
      id: axes.map((axis) => selections[axis.id]).join("-"),
      selections,
      price: pricing.price,
      mrp: pricing.mrp,
      inStock: pricing.inStock ?? true,
      imageIndex: pricing.imageIndex ?? 0,
    };
  });
}

/** Convenience for axes whose options are plain labels. */
export function axis(
  id: string,
  label: string,
  options: Array<{ id: string; label: string; swatch?: string }>,
): VariantAxis {
  return { id, label, options };
}
