"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartNoAxesCombined,
  House,
  ReceiptIndianRupee,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Sub-routes that should keep this tab lit, e.g. a product page under Shop. */
  matches?: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Home", icon: House },
  { href: "/shop", label: "Shop", icon: Store, matches: ["/marketplace"] },
  { href: "/emi-dues", label: "EMI Dues", icon: ReceiptIndianRupee },
  { href: "/limit", label: "Limit", icon: ChartNoAxesCombined },
  { href: "/profile", label: "Profile", icon: User },
];

function isActive(pathname: string, item: NavItem): boolean {
  const roots = [item.href, ...(item.matches ?? [])];
  return roots.some(
    (root) => pathname === root || pathname.startsWith(`${root}/`),
  );
}

/** Floating pill navigation, fixed to the bottom of the device column. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[440px] -translate-x-1/2 px-3 pb-3"
    >
      <ul className="flex items-stretch rounded-full bg-surface shadow-nav">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item);
          const Icon = item.icon;

          return (
            <li key={item.href} className="relative flex-1">
              {active && (
                <span
                  aria-hidden
                  className="absolute top-0 left-1/2 h-[5px] w-10 -translate-x-1/2 rounded-full bg-brand"
                />
              )}
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 px-1 pt-3 pb-2.5"
              >
                <span
                  className={cn(
                    "grid size-9 place-items-center rounded-[0.85rem] transition-colors",
                    active && "bg-brand-soft",
                  )}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.2 : 1.8}
                    className={active ? "text-brand" : "text-ink-subtle"}
                  />
                </span>
                <span
                  className={cn(
                    "text-[11.5px] leading-none font-semibold",
                    active ? "text-brand" : "text-ink-muted",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
