import { cn } from "@/lib/cn";

/**
 * Loading placeholder. Skeletons mirror the shape of the content they replace,
 * so the layout does not jump when real data lands.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-lg bg-hairline", className)}
    />
  );
}
