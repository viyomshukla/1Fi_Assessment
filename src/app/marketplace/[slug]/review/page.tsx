import { OrderReview } from "@/components/marketplace/OrderReview";

/**
 * The chosen variant and plan travel in the URL, so the review screen is
 * refresh-safe and shareable rather than depending on in-memory state.
 */
export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string; plan?: string }>;
}) {
  const [{ slug }, { variant, plan }] = await Promise.all([
    params,
    searchParams,
  ]);

  return (
    <OrderReview slug={slug} variantId={variant ?? null} planId={plan ?? null} />
  );
}
