import { MarketplaceListing } from "@/components/marketplace/MarketplaceListing";
import { CATEGORIES } from "@/server/data/categories";

/**
 * Categories are a small, stable list, so they are handed down from the server
 * component rather than costing the client an extra request on first paint.
 */
export default function MarketplacePage() {
  return <MarketplaceListing categories={CATEGORIES} />;
}
