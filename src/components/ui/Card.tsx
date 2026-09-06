import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Adds the press feedback used by tappable list rows. */
  interactive?: boolean;
}

/** White rounded surface with the app's soft shadow. */
export function Card({ children, className, interactive }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface shadow-card",
        interactive && "transition-transform active:scale-[0.985]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The square logo/product tile that leads every list row in the 1Fi app.
 * `bleed` lets a brand fill the tile edge to edge instead of sitting inside it.
 */
export function Tile({
  children,
  className,
  bleed = false,
}: {
  children: ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid size-[72px] shrink-0 place-items-center overflow-hidden rounded-tile",
        bleed ? "bg-canvas" : "border border-hairline bg-surface p-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
