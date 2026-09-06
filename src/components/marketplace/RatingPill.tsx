import { Star } from "lucide-react";
import { formatNumber } from "@/lib/format";

interface RatingPillProps {
  rating: number;
  count: number;
  /** Hides the review count where space is tight, such as product cards. */
  compact?: boolean;
}

export function RatingPill({ rating, count, compact = false }: RatingPillProps) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-ink-muted">
      <Star size={12} strokeWidth={0} className="fill-accent text-accent" />
      {rating.toFixed(1)}
      {!compact && (
        <span className="font-medium text-ink-subtle">
          ({formatNumber(count)})
        </span>
      )}
    </span>
  );
}
