import type { ReactNode } from "react";
import {
  SegmentedTabs,
  type SegmentedTab,
} from "@/components/shop/SegmentedTabs";
import { ShopHeroBanner } from "@/components/shop/ShopHeroBanner";

const SHOP_TABS: SegmentedTab[] = [
  { href: "/shop/top-brands", label: "Top Brands" },
  { href: "/shop/nearby-stores", label: "Nearby Stores" },
  { href: "/shop/marketplace", label: "1Fi Marketplace" },
];

/**
 * Banner and tabs live in the layout rather than each page, so switching tabs
 * re-renders only the section below them.
 */
export default function ShopLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <ShopHeroBanner />
      <div className="relative z-10 -mt-9 px-5">
        <SegmentedTabs tabs={SHOP_TABS} />
      </div>
      {children}
    </div>
  );
}
