import { NextResponse, type NextRequest } from "next/server";
import { ApiError, errorResponse, simulateNetwork } from "@/server/http";
import { quoteEmiPlans } from "@/server/repository";

/**
 * GET /api/products/:id/emi-plans?variantId=
 *
 * Instalments are computed server-side from the variant price, so the client
 * never re-implements the lending maths.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await simulateNetwork(request);

    const { id } = await params;
    const variantId = request.nextUrl.searchParams.get("variantId");

    if (!variantId) {
      throw new ApiError(400, "VARIANT_REQUIRED", "variantId is required.");
    }

    const quote = quoteEmiPlans(id, variantId);

    if (!quote) {
      throw new ApiError(
        404,
        "VARIANT_NOT_FOUND",
        `No variant "${variantId}" on product "${id}".`,
      );
    }

    return NextResponse.json(quote);
  } catch (error) {
    return errorResponse(error);
  }
}
