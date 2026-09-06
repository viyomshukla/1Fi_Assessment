import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { ProductSummary } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { PriceBlock } from "./PriceBlock";
import { RatingPill } from "./RatingPill";

/** Grid tile linking through to the product detail screen. */
export function ProductCard({ product }: { product: ProductSummary }) {
  return (
    <Link
      href={`/marketplace/${product.slug}`}
      className="flex flex-col overflow-hidden rounded-card bg-surface shadow-card transition-transform active:scale-[0.98]"
    >
      <div className="relative aspect-square bg-canvas">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 440px) 45vw, 200px"
          className="object-contain p-2"
        />
        {!product.inStock && (
          <span className="absolute inset-0 grid place-items-center bg-surface/70 text-[12px] font-extrabold text-ink-muted">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[11px] font-bold tracking-[0.04em] text-ink-subtle uppercase">
            {product.brand}
          </span>
          <RatingPill rating={product.rating} count={product.ratingCount} compact />
        </div>

        <p className="line-clamp-2 text-[13.5px] leading-snug font-bold text-ink">
          {product.name}
        </p>

        <PriceBlock price={product.price} mrp={product.mrp} className="mt-auto" />

        {product.emiFrom !== null && (
          <Badge tone="brand" className="self-start">
            EMI from {formatCurrency(product.emiFrom)}/mo
          </Badge>
        )}
      </div>
    </Link>
  );
}
