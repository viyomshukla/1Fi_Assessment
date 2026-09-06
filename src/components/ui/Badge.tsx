import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone = "neutral" | "brand" | "success" | "accent" | "danger";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-canvas text-ink-muted",
  brand: "bg-brand-soft text-brand",
  success: "bg-success-soft text-success",
  accent: "bg-accent-soft text-[#92400e]",
  danger: "bg-danger-soft text-danger",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  /** Small caps with wide tracking, matching the "2.1 KM" distance pills. */
  caps?: boolean;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  caps = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
        caps && "tracking-[0.08em] uppercase",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
