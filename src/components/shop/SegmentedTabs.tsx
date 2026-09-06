"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export interface SegmentedTab {
  href: string;
  label: string;
}

/**
 * The Shop page's tab switcher: a lavender track holding a white pill for the
 * active tab, with a short violet rule under its label.
 *
 * The underline is always rendered and only changes colour, so switching tabs
 * never shifts the row's height.
 */
export function SegmentedTabs({ tabs }: { tabs: SegmentedTab[] }) {
  const pathname = usePathname();

  return (
    <div
      role="tablist"
      aria-label="Shop sections"
      className="flex rounded-full bg-brand-soft p-1"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            role="tab"
            aria-selected={active}
            className={cn(
              "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-full px-1 py-3 transition-colors",
              active && "bg-surface shadow-card",
            )}
          >
            <span
              className={cn(
                "truncate text-[13px] leading-tight font-bold",
                active ? "text-brand" : "text-ink/70",
              )}
            >
              {tab.label}
            </span>
            <span
              aria-hidden
              className={cn(
                "h-[3px] w-7 rounded-full",
                active ? "bg-brand" : "bg-transparent",
              )}
            />
          </Link>
        );
      })}
    </div>
  );
}
