import { cn } from "@/lib/cn";
import { discountPercent, formatCurrency } from "@/lib/format";

interface PriceBlockProps {
  price: number;
  mrp: number;
  size?: "sm" | "lg";
  className?: string;
}

/** Selling price with struck-through MRP and the saving, when there is one. */
export function PriceBlock({
  price,
  mrp,
  size = "sm",
  className,
}: PriceBlockProps) {
  const discount = discountPercent(price, mrp);

  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-extrabold text-ink",
          size === "lg" ? "text-[26px] leading-tight" : "text-[15px]",
        )}
      >
        {formatCurrency(price)}
      </span>

      {discount > 0 && (
        <>
          <span
            className={cn(
              "font-medium text-ink-subtle line-through",
              size === "lg" ? "text-[15px]" : "text-[12px]",
            )}
          >
            {formatCurrency(mrp)}
          </span>
          <span
            className={cn(
              "font-extrabold text-success",
              size === "lg" ? "text-[15px]" : "text-[12px]",
            )}
          >
            {discount}% off
          </span>
        </>
      )}
    </div>
  );
}
