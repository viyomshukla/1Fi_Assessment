import { ProductDetail } from "@/components/marketplace/ProductDetail";

/**
 * Product detail sits outside the (tabs) group: it is pushed on top of the
 * Shop tab, so it gets a back header and a sticky CTA instead of the bottom
 * navigation.
 */
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
