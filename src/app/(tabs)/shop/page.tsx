import { redirect } from "next/navigation";

/**
 * The live app opens on Top Brands, but that tab is out of scope here and
 * renders empty. Landing on the Marketplace shows the section this assignment
 * actually builds.
 */
export default function ShopPage() {
  redirect("/shop/marketplace");
}
