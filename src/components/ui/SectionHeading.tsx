import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeadingProps {
  children: ReactNode;
  /**
   * "label" is the violet bar + uppercase eyebrow used on the home feed.
   * "title" is the large near-black heading used above list sections.
   */
  variant?: "label" | "title";
  /** Rendered on the right, e.g. the "Gurugram" city selector pill. */
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  children,
  variant = "title",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      {variant === "label" ? (
        <h2 className="flex items-center gap-2.5">
          <span aria-hidden className="h-5 w-1 rounded-full bg-brand" />
          <span className="section-label">{children}</span>
        </h2>
      ) : (
        <h2 className="text-[22px] leading-tight font-extrabold text-ink">
          {children}
        </h2>
      )}
      {action}
    </div>
  );
}
